import express from 'express';
import { Contact, Note, Visit } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Demo data for admin account
const DEMO_CONTACTS = [
  {
    firstName: 'John',
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
  { contactIndex: 0, text: 'First visit went well. Very interested in learning more about the gospel. Agreed to read Book of Mormon.' },
  { contactIndex: 0, text: 'Second visit - discussed the Plan of Salvation. Asked great questions about eternal families.' },
  { contactIndex: 1, text: 'Teaching the family in Spanish. All members are progressing well. Children are excited about baptism.' },
  { contactIndex: 1, text: 'Attended church for the first time. Met with the bishop and ward members. Very positive experience.' },
  { contactIndex: 2, text: 'Met at local coffee shop. Discussed the Restoration. Gave him a Book of Mormon and pamphlet.' },
  { contactIndex: 4, text: 'Family is preparing for baptism next month. Working through final lessons and answering questions.' }
];

const DEMO_VISITS = [
  { contactIndex: 0, datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), notes: 'Lesson 3: The Gospel of Jesus Christ' },
  { contactIndex: 1, datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), notes: 'Lesson 4: The Commandments. Bring Spanish materials.' },
  { contactIndex: 2, datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), notes: 'Follow-up visit. See if he read the Book of Mormon.' },
  { contactIndex: 4, datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), notes: 'Pre-baptism interview preparation' }
];

// Initialize demo data for admin account
router.post('/init', auth, async (req, res) => {
  try {
    // Only allow demo admin to initialize
    if (!req.user.isDemo) {
      return res.status(403).json({ error: 'Only demo admin can initialize demo data' });
    }

    // Check if demo data already exists
    const existingContacts = await Contact.find({ owner: req.user._id });
    if (existingContacts.length > 0) {
      return res.json({ 
        message: 'Demo data already exists', 
        contactCount: existingContacts.length 
      });
    }

    // Create demo contacts
    const createdContacts = [];
    for (const contactData of DEMO_CONTACTS) {
      const contact = new Contact({
        ...contactData,
        owner: req.user._id
      });
      await contact.save();
      createdContacts.push(contact);
    }

    // Create demo notes
    for (const noteData of DEMO_NOTES) {
      const contact = createdContacts[noteData.contactIndex];
      const note = new Note({
        contact: contact._id,
        author: req.user._id,
        text: noteData.text
      });
      await note.save();
    }

    // Create demo visits
    for (const visitData of DEMO_VISITS) {
      const contact = createdContacts[visitData.contactIndex];
      const visit = new Visit({
        contact: contact._id,
        user: req.user._id,
        datetime: visitData.datetime,
        notes: visitData.notes
      });
      await visit.save();
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
    // Only allow demo admin to clear
    if (!req.user.isDemo) {
      return res.status(403).json({ error: 'Only demo admin can clear demo data' });
    }

    await Contact.deleteMany({ owner: req.user._id });
    await Note.deleteMany({ author: req.user._id });
    await Visit.deleteMany({ user: req.user._id });

    return res.json({ message: 'Demo data cleared successfully' });
  } catch (err) {
    console.error('Demo clear error:', err);
    return res.status(500).json({ error: 'Failed to clear demo data' });
  }
});

export default router;