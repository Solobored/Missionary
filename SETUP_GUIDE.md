# MissionConnect - Complete Setup Guide

## 🚀 Quick Start Guide

This guide will help you get MissionConnect running on your local machine in just a few minutes.

### Prerequisites

Before you begin, make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **pnpm** package manager ([Install with](https://pnpm.io/installation): `npm install -g pnpm`)
- **MongoDB** - Choose one option:
  - Local MongoDB installation, OR
  - Free MongoDB Atlas cloud account

---

## 📦 Part 1: Backend Setup (5 minutes)

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `server/.env` with your settings:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/missionconnect
JWT_SECRET=change_this_to_a_random_secret_string_min_32_chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- **For MongoDB Atlas**: Replace `MONGODB_URI` with your Atlas connection string
- **For JWT_SECRET**: Use a long random string (at least 32 characters)

### Step 3: Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 MissionConnect API running on port 4000
```

**Keep this terminal window open!**

---

## 🎨 Part 2: Frontend Setup (3 minutes)

Open a **new terminal window** and navigate to the project root.

### Step 1: Install Frontend Dependencies

```bash
pnpm install
```

### Step 2: Configure Frontend Environment

The `.env` file is already created with the correct settings:

```env
VITE_API_URL=http://localhost:4000/api
```

### Step 3: Start the Frontend Development Server

```bash
pnpm run dev
```

The app will open at: **http://localhost:5173**

---

## 🎯 Part 3: Using the Application

### First Time Setup

1. **Open your browser** to http://localhost:5173
2. You'll see the login page
3. Click **"Register here"**
4. Create your account:
   - Full Name: Your name
   - Email: your@email.com
   - Password: (minimum 6 characters)
5. Click **"Create Account"**
6. You'll be redirected to login - sign in with your credentials

### Creating Your First Contact

1. After login, you'll see the Dashboard
2. Click **"Add Contact"** button
3. Fill in the required information:
   - First Name (required)
   - Last Name (optional)
   - Phone (required)
   - Address (optional)
   - Status (select from dropdown)
4. Click **"Create Contact"**

### Adding Notes to a Contact

1. Click on any contact card to open details
2. Go to the **"Notes"** tab
3. Type your note in the text area
4. Click **"Add Note"**
5. Your note will appear with timestamp

### Scheduling Visits

1. Open a contact's detail page
2. Go to the **"Visits"** tab
3. Click **"Schedule Visit"**
4. Select date and time
5. Add optional notes about the visit
6. Click **"Schedule"**

### Setting Location on Map

1. Open a contact's detail page
2. Go to the **"Details"** tab
3. Click **"Set Location on Map"**
4. Click anywhere on the map to pin the location
5. The coordinates are saved automatically

---

## 🗄️ MongoDB Setup Options

### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Edition**
   - macOS: `brew install mongodb-community`
   - Windows: [Download installer](https://www.mongodb.com/try/download/community)
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB service**
   - macOS: `brew services start mongodb-community`
   - Windows: MongoDB runs as a service automatically
   - Linux: `sudo systemctl start mongod`

3. **Verify it's running**
   ```bash
   mongosh
   # You should see MongoDB shell
   ```

4. **Use in .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/missionconnect
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create a Cluster**
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Set privileges to "Read and write to any database"

4. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Use in .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/missionconnect?retryWrites=true&w=majority
   ```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: "MongoDB connection error"**
- Solution: Make sure MongoDB is running
- Check your connection string in `.env`
- For Atlas: Verify IP whitelist and credentials

**Problem: "Port 4000 already in use"**
- Solution: Change `PORT=4001` in `server/.env`
- Update `VITE_API_URL` in frontend `.env` to match

**Problem: "JWT token errors"**
- Solution: Make sure `JWT_SECRET` is set in `server/.env`
- Use a long random string (32+ characters)

### Frontend Issues

**Problem: "Failed to load contacts"**
- Solution: Make sure backend is running on port 4000
- Check browser console for specific errors
- Verify `VITE_API_URL` in `.env` is correct

**Problem: "Map not displaying"**
- Solution: This is normal - the map loads from OpenStreetMap
- Check your internet connection
- The map should appear when you click "Set Location on Map"

**Problem: "Login/Register not working"**
- Solution: Check backend terminal for errors
- Verify MongoDB is connected
- Try clearing browser localStorage and cookies

### General Tips

1. **Check both terminal windows** - backend and frontend should both be running
2. **Clear browser cache** if you see old data
3. **Check browser console** (F12) for JavaScript errors
4. **Restart both servers** if something seems stuck

---

## 📱 Mobile Testing

The app is fully responsive and works great on mobile devices:

1. **Find your local IP address**
   - macOS/Linux: `ifconfig | grep inet`
   - Windows: `ipconfig`

2. **Update backend CORS**
   - Add your IP to `FRONTEND_URL` in `server/.env`
   - Example: `FRONTEND_URL=http://192.168.1.100:5173`

3. **Access from mobile**
   - Open `http://YOUR_IP:5173` on your phone
   - Make sure phone is on same WiFi network

---

## 🚀 Production Deployment

### Frontend Deployment (Vercel - Recommended)

1. **Build the frontend**
   ```bash
   pnpm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set environment variable**
   - In Vercel dashboard, add `VITE_API_URL` pointing to your backend

### Backend Deployment (Railway - Recommended)

1. **Push code to GitHub**

2. **Deploy to Railway**
   - Go to https://railway.app
   - Connect your GitHub repo
   - Add environment variables from `.env`
   - Deploy!

3. **Update frontend**
   - Change `VITE_API_URL` to your Railway backend URL
   - Redeploy frontend

### Database (MongoDB Atlas)

- Already cloud-based if using Atlas
- Update connection string in production `.env`
- Set proper IP whitelist for production

---

## 📚 Additional Resources

- **API Documentation**: See `README.md` for all endpoints
- **MongoDB Docs**: https://docs.mongodb.com
- **React Leaflet**: https://react-leaflet.js.org
- **shadcn/ui**: https://ui.shadcn.com

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the terminal output for error messages
3. Check browser console (F12) for frontend errors
4. Verify all environment variables are set correctly

---

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed (`npm install` in server/)
- [ ] Backend `.env` configured
- [ ] Backend running (`npm run dev` in server/)
- [ ] Frontend dependencies installed (`pnpm install`)
- [ ] Frontend `.env` configured
- [ ] Frontend running (`pnpm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Can register a new account
- [ ] Can create a contact
- [ ] Can add notes
- [ ] Can schedule visits
- [ ] Can set location on map

**Congratulations! 🎉 MissionConnect is now running!**