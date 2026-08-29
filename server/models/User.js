/**
 * User.js — Mongoose Model for System Users
 * Physical Design Schema (Chapter 3.3.2.2 Table 1: Users)
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'user_id is required'],
      unique: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: [true, 'full_name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      enum: ['DATA_ENTRY', 'AUDITOR', 'ADMIN'],
      default: 'DATA_ENTRY',
    },
    password_hash: {
      type: String,
      required: [true, 'password_hash is required'],
      select: false, // Never return password in queries by default
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  if (!this.password_hash.startsWith('$2')) {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
  }
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      user_id: this.user_id,
      name: this.full_name,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET || 'cfass_default_secret_key_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export const User = mongoose.model('User', userSchema);
export default User;
