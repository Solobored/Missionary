import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contacts.js';
import demoRoutes from './routes/demo.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/demo', demoRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'MissionConnect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      contacts: '/api/contacts',
      demo: '/api/demo'
    },
    demoAdmin: {
      email: 'admin@missionconnect.com',
      password: 'admin123',
      note: 'Use these credentials to login as demo admin and test all features'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 MissionConnect API running on port ${PORT}`);
  console.log(`📍 Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}`);
  console.log(`\n👤 Demo Admin Credentials:`);
  console.log(`   Email: admin@missionconnect.com`);
  console.log(`   Password: admin123`);
});