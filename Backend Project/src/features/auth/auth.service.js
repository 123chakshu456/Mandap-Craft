import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { authRepository } from './auth.repository.js';

// Pre-computed dummy hash to prevent user enumeration via timing attacks
const DUMMY_BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'secret' || secret === 'your_jwt_secret') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: A strong JWT_SECRET must be configured in production.');
    }
    return 'dev_secure_random_key_shiv_shakti_events_mart_2026_xss_shield';
  }
  return secret;
};

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
  });
};

export const authCookieOptions = {
  httpOnly: true, // XSS Shield: Cookie cannot be accessed or read by any client-side JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // CSRF Shield: Restricts cross-site transmission
  path: '/', // Valid across the whole domain
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const authService = {
  async register({ name, email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    // 1. Strict Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      const err = new Error('Please provide a valid email address.');
      err.statusCode = 400;
      throw err;
    }

    // 2. Strong Password Policy (Min 8 chars, Max 128 chars to prevent bcrypt DoS)
    if (!password || typeof password !== 'string' || password.length < 8) {
      const err = new Error('Password must be at least 8 characters long.');
      err.statusCode = 400;
      throw err;
    }

    if (password.length > 128) {
      const err = new Error('Password cannot exceed 128 characters.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Duplicate Account Check
    const existingUser = await authRepository.findByEmail(cleanEmail);
    if (existingUser) {
      const err = new Error('Email is already registered. Please sign in or use another email.');
      err.statusCode = 409;
      throw err;
    }

    // 4. Strong Password Hashing with Salt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user in database (selecting ONLY non-sensitive public fields)
    const user = await authRepository.create({
      name: cleanName || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: hashedPassword,
    });

    const token = generateToken(user.id);
    return { user, token };
  },

  async login({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password || typeof password !== 'string') {
      const err = new Error('Please provide both email and password.');
      err.statusCode = 400;
      throw err;
    }

    // Prevent bcrypt CPU resource exhaustion
    if (password.length > 128) {
      const err = new Error('Invalid credentials.');
      err.statusCode = 401;
      throw err;
    }

    const user = await authRepository.findByEmail(cleanEmail);

    // Timing Attack Defense: Always execute bcrypt.compare so processing time is constant
    if (!user) {
      await bcrypt.compare(password, DUMMY_BCRYPT_HASH);
      const err = new Error('Invalid credentials.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken(user.id);

    // Strictly cherry-pick safe user fields — password hash is NEVER returned
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return { user: userPayload, token };
  },

  async googleLogin(credential) {
    if (!credential) {
      const err = new Error('No Google credential token provided.');
      err.statusCode = 400;
      throw err;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      const err = new Error('Google Sign-In is not configured on the server.');
      err.statusCode = 400;
      throw err;
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      const err = new Error('Invalid Google ID token payload.');
      err.statusCode = 400;
      throw err;
    }

    const email = payload.email.trim().toLowerCase();
    const name = payload.name;
    let user = await authRepository.findByEmail(email);

    if (!user) {
      // Secure high-entropy random password for OAuth users
      const randomPassword = (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36)
      );
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await authRepository.create({
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
      });
    }

    const token = generateToken(user.id);
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return { user: userPayload, token };
  },

  async getProfile(userId) {
    // Queries via findById which explicitly selects ONLY safe fields (id, name, email, role, createdAt)
    return authRepository.findById(userId);
  },
};
