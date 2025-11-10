import express from 'express';
import { Contact, Note, Visit } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ============ CONTACTS ============

// Create contact
router.post('/', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, status, lat, lng, tags } = req.body;
    if (!firstName || !phone) {
      return res.status(400).json({ error: 'firstName and phone are required' });
    }

    const contact = new Contact({
      owner: req.user._id,
      firstName, lastName, phone, address, status, lat, lng, tags
    });

    await contact.save();
    return res.status(201).json(contact);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Contact with this phone number already exists' });
    }
    console.error('Create contact error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// List contacts with search
router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { owner: req.user._id };
    
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ];
    }
    
    const contacts = await Contact.find(filter).sort({ firstName: 1 });
    return res.json(contacts);
  } catch (err) {
    console.error('List contacts error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get contact detail
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    return res.json(contact);
  } catch (err) {
    console.error('Get contact error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update contact
router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    return res.json(contact);
  } catch (err) {
    console.error('Update contact error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete contact
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    // Delete associated notes and visits
    await Note.deleteMany({ contact: req.params.id });
    await Visit.deleteMany({ contact: req.params.id });
    await Contact.deleteOne({ _id: req.params.id });
    
    return res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Delete contact error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ============ NOTES ============

// Get notes for a contact
router.get('/:id/notes', auth, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const notes = await Note.find({ contact: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    return res.json(notes);
  } catch (err) {
    console.error('Get notes error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create note for a contact
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Note text is required' });
    }
    
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const note = new Note({
      contact: req.params.id,
      author: req.user._id,
      text
    });
    
    await note.save();
    await note.populate('author', 'name');
    return res.status(201).json(note);
  } catch (err) {
    console.error('Create note error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete note
router.delete('/:contactId/notes/:noteId', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, author: req.user._id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    await Note.deleteOne({ _id: req.params.noteId });
    return res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete note error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ============ VISITS ============

// Get visits for a contact
router.get('/:id/visits', auth, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const visits = await Visit.find({ contact: req.params.id })
      .sort({ datetime: -1 });
    return res.json(visits);
  } catch (err) {
    console.error('Get visits error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Create visit for a contact
router.post('/:id/visits', auth, async (req, res) => {
  try {
    const { datetime, notes } = req.body;
    if (!datetime) {
      return res.status(400).json({ error: 'Visit datetime is required' });
    }
    
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const visit = new Visit({
      contact: req.params.id,
      user: req.user._id,
      datetime: new Date(datetime),
      notes
    });
    
    await visit.save();
    return res.status(201).json(visit);
  } catch (err) {
    console.error('Create visit error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete visit
router.delete('/:contactId/visits/:visitId', auth, async (req, res) => {
  try {
    const visit = await Visit.findOne({ _id: req.params.visitId, user: req.user._id });
    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }
    
    await Visit.deleteOne({ _id: req.params.visitId });
    return res.json({ message: 'Visit deleted successfully' });
  } catch (err) {
    console.error('Delete visit error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get all upcoming visits for user
router.get('/visits/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    const visits = await Visit.find({ 
      user: req.user._id,
      datetime: { $gte: now }
    })
    .populate('contact', 'firstName lastName phone address')
    .sort({ datetime: 1 })
    .limit(50);
    
    return res.json(visits);
  } catch (err) {
    console.error('Get upcoming visits error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;