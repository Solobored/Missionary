# MissionConnect - Missionary Contact Management Web App

A fully functional web-based contact management system designed for LDS missionaries to organize their missionary work.

## Features

✅ **User Authentication**
- Secure registration and login with JWT tokens
- Refresh token support for extended sessions
- Protected routes and automatic token refresh

✅ **Contact Management**
- Create, edit, and delete contacts
- Search and filter contacts by name
- Track contact status (Interested, Teaching, Not Interested)
- Duplicate prevention

✅ **Notes System**
- Add timestamped notes for each contact
- Record visit details and interactions
- View complete interaction history
- Delete notes as needed

✅ **Visit Scheduling**
- Schedule visits with date and time
- Add notes for visit planning
- View all scheduled visits
- Delete or reschedule visits

✅ **Map Integration**
- Interactive map using Leaflet (OpenStreetMap)
- Pin contact locations on the map
- Click to set or update location coordinates
- Visual representation of contact addresses

✅ **Mobile-Friendly Design**
- Responsive layout for all screen sizes
- Touch-friendly interface
- Optimized for mobile browsers
- Progressive Web App ready

## Technology Stack

### Frontend
- **React** with TypeScript
- **shadcn-ui** component library
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Leaflet** for maps
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB (local or MongoDB Atlas)

### Frontend Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and set your API URL (default: http://localhost:4000/api)
```

3. Start the development server:
```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and configure:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - PORT: Backend port (default: 4000)
```

4. Start the backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:4000`

### MongoDB Setup Options

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally and start the service
# Connection string: mongodb://localhost:27017/missionconnect
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

## Project Structure

```
/workspace/shadcn-ui/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn-ui components
│   │   ├── ContactCard.tsx  # Contact list item
│   │   └── MapPicker.tsx    # Map component
│   ├── lib/
│   │   ├── api.ts           # API client with auth
│   │   └── auth-context.tsx # Authentication context
│   ├── pages/
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   ├── Dashboard.tsx    # Contact list
│   │   └── ContactDetail.tsx # Contact details with notes/visits
│   └── App.tsx              # Main app with routing
├── server/
│   └── src/
│       ├── config/
│       │   └── db.js        # MongoDB connection
│       ├── models/
│       │   └── index.js     # Mongoose models
│       ├── routes/
│       │   ├── auth.js      # Auth endpoints
│       │   └── contacts.js  # Contact/Notes/Visits endpoints
│       ├── middleware/
│       │   └── auth.js      # JWT middleware
│       └── index.js         # Express server
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Contacts
- `GET /api/contacts` - List all contacts (with search)
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/:id` - Get contact details
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Notes
- `GET /api/contacts/:id/notes` - Get contact notes
- `POST /api/contacts/:id/notes` - Add note
- `DELETE /api/contacts/:contactId/notes/:noteId` - Delete note

### Visits
- `GET /api/contacts/:id/visits` - Get contact visits
- `POST /api/contacts/:id/visits` - Schedule visit
- `DELETE /api/contacts/:contactId/visits/:visitId` - Delete visit
- `GET /api/contacts/visits/upcoming` - Get all upcoming visits

## Usage Guide

### Creating Your First Contact
1. Register an account or login
2. Click "Add Contact" on the dashboard
3. Fill in the contact information (First Name and Phone are required)
4. Set the status (Interested, Teaching, etc.)
5. Click "Create Contact"

### Adding Notes
1. Click on a contact to view details
2. Go to the "Notes" tab
3. Type your note in the text area
4. Click "Add Note"

### Scheduling Visits
1. Open a contact's detail page
2. Go to the "Visits" tab
3. Click "Schedule Visit"
4. Select date/time and add optional notes
5. Click "Schedule"

### Setting Location on Map
1. Open a contact's detail page
2. Go to the "Details" tab
3. Click "Set Location on Map"
4. Click anywhere on the map to set the location
5. The coordinates will be saved automatically

## Building for Production

### Frontend
```bash
pnpm run build
```

The built files will be in the `dist/` directory.

### Backend
```bash
cd server
npm start
```

For production deployment, consider using:
- PM2 for process management
- Environment-specific configuration
- HTTPS/SSL certificates
- Rate limiting and security headers

## Deployment Options

### Frontend
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Backend
- Railway
- Render
- Heroku
- DigitalOcean
- AWS EC2

### Database
- MongoDB Atlas (recommended)
- Self-hosted MongoDB

## Security Notes

⚠️ **Important for Production:**
1. Change the `JWT_SECRET` to a strong random string
2. Use HTTPS for all connections
3. Set up CORS properly for your domain
4. Use environment variables for all secrets
5. Implement rate limiting
6. Add input validation and sanitization
7. Keep dependencies updated

## Support

For issues or questions about the MGX platform, visit:
- Documentation: https://docs.mgx.dev
- Community: https://docs.mgx.dev/introduction/community

## License

This project was generated using MetaGPTX (MGX) platform.