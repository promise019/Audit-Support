/**
 * authController.js — User Authentication & Session Management
 */

import User from '../models/User.js';
import { createAuditEntry } from '../middleware/auditLogger.js';

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password_hash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid institutional credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid institutional credentials' });
    }

    const token = user.generateAuthToken();
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    // Log authentication event
    await createAuditEntry({
      user_id: user.user_id,
      role: user.role,
      action_type: 'AUTH',
      module: 'Authentication',
      details: `User ${user.full_name} (${user.role}) logged in successfully`,
      ip_address: clientIp,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        ipAddress: clientIp,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user (Admin only or Initial setup)
// @route   POST /api/v1/auth/register
// @access  Public/Admin
export const register = async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;

    const count = await User.countDocuments();
    const user_id = `USR-${String(count + 1).padStart(3, '0')}`;

    const user = await User.create({
      user_id,
      full_name,
      email,
      role: role || 'DATA_ENTRY',
      password_hash: password,
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user.user_id });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user & record audit event
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await createAuditEntry({
        user_id: req.user.user_id,
        role: req.user.role,
        action_type: 'AUTH',
        module: 'Authentication',
        details: `User ${req.user.name} (${req.user.role}) logged out`,
        ip_address: req.user.ipAddress,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};
