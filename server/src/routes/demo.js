import express from 'express';
import mongoose from 'mongoose';
import { Contact, Note, Visit } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Use a consistent ObjectId for the demo admin user
const DEMO_ADMIN_ID = new mongoose.Types.ObjectId('64b5d5e6f0c2f1b2a3c4d5e6');

const DEMO_CONTACTS = [
  {
    firstName: 'Joseph',
    lastName: 'Smith',
    phone: '(555) 123-4567',
    address: '123 Main Street, Salt Lake City, UT 84101',
    status: 'interested',
    tags: ['first-contact', 'english-speaker'],
    lat: 40.7608,
    lng: -111.8910
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    phone: '(555) 234-5678',
    address: '456 Oak Avenue, Provo, UT 84601',
    status: 'teaching',
    tags: ['spanish-speaker', 'family'],
    lat: 40.2338,
    lng: -111.6585
  },
  {
    firstName: 'David',
    lastName: 'Johnson',
    phone: '(555) 345-6789',
    address: '789 Pine Road, Orem, UT 84057',
    status: 'interested',
    tags: ['young-adult'],
    lat: 40.2969,
    lng: -111.6946
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    phone: '(555) 456-7890',
    address: '321 Elm Street, Sandy, UT 84070',
    status: 'not_interested',
    tags: ['previous-contact'],
    lat: 40.5649,
    lng: -111.8389
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    phone: '(555) 567-8901',
    address: '654 Maple Drive, Lehi, UT 84043',
    status: 'teaching',
    tags: ['baptism-date-set', 'family'],
    lat: 40.3916,
    lng: -111.8507
  }
];

const DEMO_NOTES = [
  { contactIndex: 0, text: 'First visit went well. Very interested in learning more about the gospel.' },
  { contactIndex: 0, text: 'Second visit - discussed the Plan of Salvation. Asked great questions.' },
  { contactIndex: 1, text: 'Teaching the family in Spanish. All members are progressing well.' },
  { contactIndex: 1, text: 'Attended church for the first time. Very positive experience.' },
  { contactIndex: 2, text: 'Met at local coffee shop. Discussed the Restoration.' },
  { contactIndex: 4, text: 'Family is preparing for baptism next month.' }
];

const DEMO_VISITS = [
  { contactIndex: 0, datetime: new Date(Date.now() + 2 * 86400000), notes: 'Lesson 3: The Gospel of Jesus Christ' },
  { contactIndex: 1, datetime: new Date(Date.now() + 3 * 86400000), notes: 'Lesson 4: The Commandments (Spanish materials)' },
  { contactIndex: 2, datetime: new Date(Date.now() + 5 * 86400000), notes: 'Follow-up visit: Book of Mormon reading' },
  { contactIndex: 4, datetime: new Date(Date.now() + 7 * 86400000), notes: 'Pre-baptism interview prep' }
];

// Initialize demo data
router.post('/init', auth, async (req, res) => {
  try {
    // Allow only demo admin
    if (!req.user?.isDemo) {
      return res.status(403).json({ error: 'Only demo admin can initialize demo data' });
    }

    const ownerId = req.user._id || DEMO_ADMIN_ID;

    // Check if demo data already exists
    const existing = await Contact.find({ owner: ownerId });
    if (existing.length > 0) {
      return res.json({
        message: 'Demo data already exists',
        contactCount: existing.length
      });
    }

    // Create demo contacts
    const createdContacts = [];
    for (const c of DEMO_CONTACTS) {
      const newContact = await Contact.create({ ...c, owner: ownerId });
      createdContacts.push(newContact);
    }

    // Create notes
    for (const noteData of DEMO_NOTES) {
      const contact = createdContacts[noteData.contactIndex];
      await Note.create({
        contact: contact._id,
        author: ownerId,
        text: noteData.text
      });
    }

    // Create visits
    for (const visitData of DEMO_VISITS) {
      const contact = createdContacts[visitData.contactIndex];
      await Visit.create({
        contact: contact._id,
        user: ownerId,
        datetime: visitData.datetime,
        notes: visitData.notes
      });
    }

    return res.json({
      message: 'Demo data initialized successfully',
      contactCount: createdContacts.length,
      noteCount: DEMO_NOTES.length,
      visitCount: DEMO_VISITS.length
    });
  } catch (err) {
    console.error('Demo init error:', err);
    return res.status(500).json({ error: 'Failed to initialize demo data' });
  }
});

// Clear demo data
router.delete('/clear', auth, async (req, res) => {
  try {
    if (!req.user?.isDemo) {
      return res.status(403).json({ error: 'Only demo admin can clear demo data' });
    }

    const ownerId = req.user._id || DEMO_ADMIN_ID;

    await Contact.deleteMany({ owner: ownerId });
    await Note.deleteMany({ author: ownerId });
    await Visit.deleteMany({ user: ownerId });

    return res.json({ message: 'Demo data cleared successfully' });
  } catch (err) {
    console.error('Demo clear error:', err);
    return res.status(500).json({ error: 'Failed to clear demo data' });
  }
});

export default router;
