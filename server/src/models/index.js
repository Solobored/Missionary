import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  status: { type: String, enum: ['interested', 'teaching', 'not_interested', 'unknown'], default: 'unknown' },
  tags: [{ type: String }],
  photoUrl: { type: String },
  lat: { type: Number },
  lng: { type: Number }
}, { timestamps: true });

contactSchema.index({ owner: 1, phone: 1 }, { unique: true });

export const Contact = mongoose.model('Contact', contactSchema);

// Note Schema
const noteSchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);

// Visit Schema
const visitSchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

export const Visit = mongoose.model('Visit', visitSchema);