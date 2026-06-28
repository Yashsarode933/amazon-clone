import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  RegisterInput,
  LoginInput,
  GoogleAuthInput
} from '../utils/validation';

const oauth2Client = new OAuth2Client();

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d'
  });
};

// Generate token response
const tokenResponse = (user: { id: string; email: string; name: string; role: UserRole }) => ({
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  },
  token: generateToken(user.id)
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { email, password, name }: RegisterInput = validation.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'CUSTOMER'
    }
  });

  // Create cart for user
  await prisma.cart.create({
    data: {
      userId: user.id
    }
  });

  // Create wishlist for user
  await prisma.wishlist.create({
    data: {
      userId: user.id
    }
  });

  return res.status(201).json({
    success: true,
    ...tokenResponse({ id: user.id, email: user.email, name: user.name, role: user.role })
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { email, password }: LoginInput = validation.data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  return res.json({
    success: true,
    ...tokenResponse({ id: user.id, email: user.email, name: user.name, role: user.role })
  });
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req: Request, res: Response) => {
  const validation = googleAuthSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { token }: GoogleAuthInput = validation.data;

  try {
    // Verify Google token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Google token'
      });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          googleId: payload.sub,
          role: 'CUSTOMER'
        }
      });

      // Create cart and wishlist
      await prisma.cart.create({ data: { userId: user.id } });
      await prisma.wishlist.create({ data: { userId: user.id } });
    }

    return res.json({
      success: true,
      ...tokenResponse({ id: user.id, email: user.email, name: user.name, role: user.role })
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Google authentication failed'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
};
