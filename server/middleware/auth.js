/**
 * auth.js — JWT Authentication and RBAC Middleware
 * Security Controls (Chapter 3.3.2.3)
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cfass_default_secret_key_change_in_production');
    
    // Attach user information to request
    req.user = {
      id: decoded.id,
      user_id: decoded.user_id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
    });
  }
};

/**
 * requireRole — Restricts route access to specified roles
 * @param  {...string} roles - e.g. 'AUDITOR', 'ADMIN'
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'Guest'}' lacks permission for this operation. Required: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};
