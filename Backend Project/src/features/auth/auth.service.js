import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { authRepository } from './auth.repository.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const authService = {
  async register({ name, email, password }) {
    if (!email || !password) {
      const err = new Error('Please provide both email and password.');
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      const err = new Error('Email is already registered.');
      err.statusCode = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await authRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user.id);
    return { user, token };
  },

  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error('Please provide both email and password.');
      err.statusCode = 400;
      throw err;
    }

    const user = await authRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid credentials.');
      err.statusCode = 401;
      throw err;
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

    const { email, name } = payload;
    let user = await authRepository.findByEmail(email);

    if (!user) {
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const salt = await bcrypt.genSalt(10);
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
    };

    return { user: userPayload, token };
  },

  async getProfile(userId) {
    return authRepository.findById(userId);
  },
};
