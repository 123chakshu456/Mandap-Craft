import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { OAuth2Client } from 'google-auth-library';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    // Set HTTP-only auth cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/signin or /api/auth/login
 * @desc    Authenticate user & get token / set cookie
 * @access  Public
 */
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const token = generateToken(user.id);

    // Set HTTP-only auth cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Sign in successful.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = signIn;

/**
 * @route   POST /api/auth/signout or /api/auth/logout
 * @desc    Sign out user & clear cookie
 * @access  Public
 */
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Signed out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const logout = signOut;

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/google-login
 * @desc    Verify Google ID Token and register/login user
 * @access  Public
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'No Google credential token provided.',
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your_google_client_id_here') {
      return res.status(400).json({
        success: false,
        message: 'Google Sign-In is not configured on the server. Please set GOOGLE_CLIENT_ID in the environment.',
      });
    }

    // Real validation using google-auth-library
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google ID token payload.',
      });
    }

    const email = payload.email;
    const name = payload.name;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google login token does not contain an email address.',
      });
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If new user: create record with random password
    if (!user) {
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email,
          password: hashedPassword,
        },
      });
    }

    const token = generateToken(user.id);

    // Set HTTP-only cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Authenticated with Google successfully.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/google-client-id
 * @desc    Get configured Google Client ID for frontend
 * @access  Public
 */
export const getGoogleClientId = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
      },
    });
  } catch (error) {
    next(error);
  }
};


