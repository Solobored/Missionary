# MissionConnect Web App - Development Plan

## Overview
Building a fully functional web-based contact management system for LDS missionaries with authentication, contact management, notes, visit scheduling, and map integration.

## Tech Stack
- Frontend: React + TypeScript + shadcn-ui + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- Maps: Leaflet (open-source alternative to Google Maps)
- Authentication: JWT tokens with refresh token support

## File Structure

### Backend Files (8 files)
1. `server/package.json` - Backend dependencies
2. `server/.env.example` - Environment variables template
3. `server/src/index.js` - Main server entry point
4. `server/src/config/db.js` - MongoDB connection
5. `server/src/middleware/auth.js` - JWT authentication middleware
6. `server/src/routes/auth.js` - Authentication routes (register, login, refresh, logout)
7. `server/src/routes/contacts.js` - Contact CRUD + Notes + Visits endpoints
8. `server/src/models/index.js` - All Mongoose models (User, Contact, Note, Visit)

### Frontend Files (will be created in src/)
1. `src/lib/api.ts` - API client with token management
2. `src/lib/auth-context.tsx` - Authentication context provider
3. `src/pages/Login.tsx` - Login page
4. `src/pages/Register.tsx` - Registration page
5. `src/pages/Dashboard.tsx` - Main dashboard with contact list
6. `src/pages/ContactDetail.tsx` - Contact detail with notes and visits
7. `src/components/ContactCard.tsx` - Contact list item component
8. `src/components/MapPicker.tsx` - Map component for location selection
9. `src/App.tsx` - Updated routing with auth protection
10. `index.html` - Updated page title

## Implementation Order
1. ✅ Template initialized
2. ⏳ Create backend structure and models
3. ⏳ Create API client and auth context
4. ⏳ Build authentication pages (Login/Register)
5. ⏳ Build dashboard with contact list
6. ⏳ Build contact detail page with notes
7. ⏳ Add map integration for location pinning
8. ⏳ Add visit scheduling functionality
9. ⏳ Final testing and polish

## Features Checklist
- [ ] User registration and login
- [ ] JWT token management with refresh tokens
- [ ] Contact CRUD operations
- [ ] Search and filter contacts by name
- [ ] Notes per contact (create, view, delete)
- [ ] Visit scheduling with date/time
- [ ] Map integration for pinning contact locations
- [ ] Mobile-responsive design
- [ ] Duplicate contact prevention