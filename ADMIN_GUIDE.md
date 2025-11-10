# Admin Demo Account Guide

## Quick Access

**Demo Admin Credentials:**
- **Email:** `admin@missionconnect.com`
- **Password:** `admin123`

## What You Can Test

The demo admin account allows you to test all features of MissionConnect without setting up a real database or creating test data manually.

### 1. Login as Admin

1. Go to the login page
2. Click "Click to auto-fill credentials" or manually enter:
   - Email: `admin@missionconnect.com`
   - Password: `admin123`
3. Click "Sign In"

### 2. Initialize Demo Data

After logging in, you'll see a blue alert box with the option to "Load Demo Data". This will create:

- **5 Sample Contacts** with realistic information:
  - John Smith (Interested)
  - Maria Garcia (Teaching)
  - David Johnson (Interested)
  - Sarah Williams (Not Interested)
  - Michael Brown (Teaching - baptism date set)

- **6 Sample Notes** across different contacts showing:
  - Visit histories
  - Lesson progress
  - Personal observations
  - Follow-up plans

- **4 Scheduled Visits** with dates in the future:
  - Various lesson plans
  - Follow-up appointments
  - Pre-baptism preparation

### 3. Test All Features

#### Contact Management
- ✅ **View Contacts**: See the list of 5 demo contacts on the dashboard
- ✅ **Search Contacts**: Try searching for "Maria" or "Smith"
- ✅ **Filter by Status**: Notice different status badges (Interested, Teaching, etc.)
- ✅ **View Contact Details**: Click any contact card to see full details

#### Contact Details Page
- ✅ **Edit Contact Info**: Change name, phone, address, or status
- ✅ **Save Changes**: Click the "Save" button to update
- ✅ **Delete Contact**: Use the "Delete" button (with confirmation)

#### Notes Feature
- ✅ **View Existing Notes**: Switch to "Notes" tab to see sample notes
- ✅ **Add New Note**: Type in the text area and click "Add Note"
- ✅ **Delete Note**: Click the trash icon on any note
- ✅ **Timestamps**: Notice each note shows author and timestamp

#### Visit Scheduling
- ✅ **View Scheduled Visits**: Switch to "Visits" tab
- ✅ **Schedule New Visit**: Click "Schedule Visit" button
- ✅ **Set Date/Time**: Use the datetime picker
- ✅ **Add Visit Notes**: Include purpose or topics to discuss
- ✅ **Delete Visit**: Remove scheduled visits

#### Map Integration
- ✅ **View Location**: Demo contacts have pre-set coordinates
- ✅ **Open Map**: Click "Update Location" or "Set Location on Map"
- ✅ **Pin Location**: Click anywhere on the map to set new coordinates
- ✅ **Auto-Save**: Location updates automatically when you click the map

#### Search & Filter
- ✅ **Search by Name**: Try "John", "Maria", or "Garcia"
- ✅ **Partial Match**: Search works with partial names
- ✅ **Clear Search**: Remove search to see all contacts

### 4. Create Your Own Test Data

You can also create additional contacts manually:

1. Click "Add Contact" button
2. Fill in the form (First Name and Phone are required)
3. Set status and other optional fields
4. Click "Create Contact"

### 5. Clear Demo Data

When you're done testing:

1. Click the "Clear Demo" button in the top-right
2. This removes all demo contacts, notes, and visits
3. You can reload demo data anytime by clicking "Load Demo Data" again

## Testing Scenarios

### Scenario 1: New Contact Workflow
1. Add a new contact with full information
2. Set their location on the map
3. Add a note about your first visit
4. Schedule a follow-up visit
5. Update their status to "Interested"

### Scenario 2: Teaching Progress
1. Open Maria Garcia's contact
2. Review existing notes showing teaching progress
3. Add a new note about the latest lesson
4. Check scheduled visits
5. Update status if needed

### Scenario 3: Search & Organization
1. Search for contacts by name
2. Filter by viewing different status types
3. Open multiple contacts to compare progress
4. Use notes to track different teaching approaches

### Scenario 4: Visit Planning
1. View all scheduled visits across contacts
2. Add new visits with specific dates
3. Include planning notes for each visit
4. Use the map to plan efficient visit routes

## Technical Details

### How Demo Admin Works

The demo admin account:
- **Doesn't require MongoDB**: Works without database setup
- **Separate Data**: Demo data is isolated from real user data
- **Persistent Session**: Uses JWT tokens like regular accounts
- **Full Features**: Has access to all app functionality
- **Easy Reset**: Can clear and reload data anytime

### Demo Data Structure

**Contacts Include:**
- Full names and phone numbers
- Complete addresses in Utah
- Geographic coordinates (lat/lng)
- Various status levels
- Relevant tags

**Notes Include:**
- Realistic visit histories
- Teaching progression
- Personal observations
- Follow-up plans

**Visits Include:**
- Future dates (2-7 days ahead)
- Lesson plans
- Preparation notes
- Interview scheduling

## Troubleshooting

### Can't Login?
- Make sure you're using the exact credentials:
  - Email: `admin@missionconnect.com`
  - Password: `admin123`
- Check that the backend server is running

### Demo Data Not Loading?
- Click the "Load Demo Data" button on the dashboard
- Wait a few seconds for data to initialize
- Refresh the page if needed

### Features Not Working?
- Make sure backend is running on port 4000
- Check browser console for errors (F12)
- Verify MongoDB connection (if using real database)

### Want to Start Fresh?
1. Click "Clear Demo" to remove all data
2. Click "Load Demo Data" to reload
3. Or logout and login again

## API Endpoints for Demo

The demo admin has access to special endpoints:

- `POST /api/demo/init` - Initialize demo data
- `DELETE /api/demo/clear` - Clear demo data

Regular users cannot access these endpoints.

## Security Note

⚠️ **Important**: The demo admin account is for testing purposes only. In a production environment:

1. Remove or disable the demo admin account
2. Use proper user authentication
3. Don't share admin credentials publicly
4. Implement proper role-based access control

## Next Steps

After testing with the demo admin:

1. **Create a real account** using the Register page
2. **Set up MongoDB** for persistent data storage
3. **Deploy to production** when ready
4. **Customize features** based on your needs

---

**Happy Testing! 🚀**

If you encounter any issues or have questions, refer to the main README.md or SETUP_GUIDE.md for more information.