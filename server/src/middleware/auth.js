import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Demo admin for testing
const DEMO_ADMIN = {
  _id: 'demo-admin-id',
  id: 'demo-admin-id',
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
    
    // Handle demo admin
    if (payload.id === DEMO_ADMIN.id) {
      req.user = DEMO_ADMIN;
      return next();
    }

    // Regular user
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};

export default auth;