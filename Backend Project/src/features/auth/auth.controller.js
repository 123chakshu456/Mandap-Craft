import { authService, authCookieOptions } from './auth.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.cookie('token', token, authCookieOptions);
    successResponse(res, { user, token }, 'User registered successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.cookie('token', token, authCookieOptions);
    successResponse(res, { user, token }, 'Sign in successful.');
  } catch (error) {
    next(error);
  }
};

export const login = signIn;

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    successResponse(res, null, 'Signed out successfully.');
  } catch (error) {
    next(error);
  }
};

export const logout = signOut;

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { user, token } = await authService.googleLogin(req.body.credential);
    res.cookie('token', token, authCookieOptions);
    successResponse(res, { user, token }, 'Authenticated with Google successfully.');
  } catch (error) {
    next(error);
  }
};

export const getGoogleClientId = async (req, res, next) => {
  try {
    successResponse(res, {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
    });
  } catch (error) {
    next(error);
  }
};
