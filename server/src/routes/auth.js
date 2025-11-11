import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import mongoose from 'mongoose';

const router = express.Router();
const SALT_ROUNDS = 10;

// 🔹 Fixed ObjectId for the demo admin (must match demo.js)
const DEMO_ADMIN_ID = new mongoose.Types.ObjectId('64b5d5e6f0c2f1b2a3c4d5e6');

// 🔹 Demo admin credentials (not stored in DB)
const DEMO_ADMIN = {
  _id: DEMO_ADMIN_ID,
  email: 'admin@missionconnect.com',
  password: 'admin123',
  name: 'Admin User',
  isDemo: true
};

// --- JWT Helpers ---
const signAccessToken = (user) => {
  const userId = user._id ? user._id.toString() : user.id?.toString();
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

const signRefreshToken = (user) => {
  const userId = user._id ? user._id.toString() : user.id?.toString();
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Missing required fields' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, password: hashed });
    await user.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Missing email or password' });

    // 🔹 Demo admin login
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const accessToken = signAccessToken(DEMO_ADMIN);
      const refreshToken = signRefreshToken(DEMO_ADMIN);

      return res.json({
        accessToken,
        refreshToken,
        user: {
          _id: DEMO_ADMIN._id,
          name: DEMO_ADMIN.name,
          email: DEMO_ADMIN.email,
          isDemo: true,
        },
      });
    }

    // 🔹 Regular user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    return res.json({
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// --- REFRESH TOKEN ---
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: 'No refresh token provided' });

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 🔹 Handle demo admin refresh
    if (payload.id === DEMO_ADMIN_ID.toString()) {
      const accessToken = signAccessToken(DEMO_ADMIN);
      return res.json({ accessToken });
    }

    // 🔹 Regular user refresh
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

    const found = user.refreshTokens.find((rt) => rt.token === refreshToken);
    if (!found) return res.status(401).json({ error: 'Invalid refresh token' });

    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// --- LOGOUT ---
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: 'No refresh token provided' });

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 🔹 Handle demo admin logout
    if (payload.id === DEMO_ADMIN_ID.toString()) {
      return res.json({ message: 'Demo admin logged out successfully' });
    }

    // 🔹 Regular user logout
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== refreshToken
      );
      await user.save();
    }

    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.json({ message: 'Logged out' });
  }
});

export default router;
