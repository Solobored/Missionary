// server/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/index.js';

// Debe ser el mismo ObjectId que usas en auth.js y demo.js
const DEMO_ADMIN_ID = new mongoose.Types.ObjectId('64b5d5e6f0c2f1b2a3c4d5e6');

const DEMO_ADMIN = {
  _id: DEMO_ADMIN_ID,
  id: DEMO_ADMIN_ID.toString(),
  email: 'admin@missionconnect.com',
  name: 'Admin User',
  isDemo: true
};

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Si el token pertenece al demo admin (comparamos como string)
    if (payload.id === DEMO_ADMIN.id) {
      // entregamos un objeto req.user con _id tipo ObjectId (no string)
      req.user = {
        ...DEMO_ADMIN,
        _id: DEMO_ADMIN_ID
      };
      return next();
    }

    // Usuario real de DB
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err?.message || err);
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};

export default auth;
