# SmartStay Vercel Deployment Guide 🚀

## Overview
This guide will help you deploy SmartStay to Vercel with a cloud database so your group can access it online.

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- MongoDB Atlas account (free tier) OR Railway/Render account for backend

## Deployment Architecture
Since Vercel is primarily for frontend hosting, we'll use:
1. **Vercel** - Frontend (React app)
2. **Railway/Render** - Backend (Node.js API)
3. **MongoDB Atlas** - Database (cloud database)

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Create .gitignore files

Create `backend/.gitignore`:
```
node_modules/
.env
uploads/
*.log
```

Create `frontend/.gitignore`:
```
node_modules/
build/
.env
.env.local
```

### 1.2 Update Backend for Production

Create `backend/.env.example`:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
MONGODB_URI=your-mongodb-connection-string
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 1.3 Add CORS Configuration

The backend needs to accept requests from your Vercel frontend. Update `backend/server.js` to include:
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## Step 2: Set Up MongoDB Atlas (Cloud Database)

### 2.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free M0 tier)
4. Wait 3-5 minutes for cluster creation

### 2.2 Configure Database Access
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Set privileges to "Read and write to any database"

### 2.3 Configure Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### 2.4 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `smartstay`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smartstay?retryWrites=true&w=majority`

---

## Step 3: Convert JSON Files to MongoDB

You'll need to migrate your JSON data to MongoDB. Here's a migration script:

Create `backend/migrate-to-mongodb.js`:
```javascript
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const MONGODB_URI = 'your-mongodb-connection-string-here';

// Define schemas
const schemas = {
  users: new mongoose.Schema({}, { strict: false }),
  units: new mongoose.Schema({}, { strict: false }),
  bookings: new mongoose.Schema({}, { strict: false }),
  reviews: new mongoose.Schema({}, { strict: false }),
  messages: new mongoose.Schema({}, { strict: false }),
  // Add more as needed
};

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const dataFiles = [
      'users.json',
      'units.json',
      'bookings.json',
      'reviews.json',
      'messages.json',
      'expenses.json',
      'payroll.json',
      'employees.json',
      'disputes.json',
      'chatbot.json',
      'browsing_history.json',
      'host_verifications.json',
      'unit_conditions.json',
      'logs.json',
      'security_logs.json',
      'chatbot_logs.json',
      'chatbot_analytics.json',
      'settings.json'
    ];

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, 'data', file);
      if (fs.existsSync(filePath)) {
        const collectionName = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        const Model = mongoose.model(collectionName, schemas[collectionName] || new mongoose.Schema({}, { strict: false }));
        
        await Model.deleteMany({});
        if (data.length > 0) {
          await Model.insertMany(data);
          console.log(`✅ Migrated ${data.length} records to ${collectionName}`);
        }
      }
    }

    console.log('Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

Run migration:
```bash
cd backend
npm install mongoose
node migrate-to-mongodb.js
```

---

## Step 4: Deploy Backend to Railway

### 4.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"

### 4.2 Configure Railway
1. Select your repository
2. Choose the `backend` folder
3. Add environment variables:
   - `PORT`: 5000
   - `NODE_ENV`: production
   - `JWT_SECRET`: (generate a random string)
   - `MONGODB_URI`: (your MongoDB connection string)
   - `FRONTEND_URL`: (will add after Vercel deployment)

### 4.3 Deploy
1. Railway will auto-deploy
2. Copy your backend URL (e.g., `https://your-app.railway.app`)

---

## Step 5: Deploy Frontend to Vercel

### 5.1 Update Frontend API URL

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

Update all API calls in frontend to use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### 5.2 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository

### 5.3 Configure Vercel
1. Set Root Directory to `frontend`
2. Framework Preset: Create React App
3. Add environment variable:
   - `REACT_APP_API_URL`: (your Railway backend URL)
4. Click "Deploy"

### 5.4 Update Backend CORS
1. Go back to Railway
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend

---

## Step 6: Alternative - Deploy Both to Render

If you prefer a simpler setup, use Render for both:

### 6.1 Backend on Render
1. Go to https://render.com
2. Create "New Web Service"
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add environment variables (same as Railway)

### 6.2 Frontend on Render
1. Create "New Static Site"
2. Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `build`
5. Add environment variable: `REACT_APP_API_URL`

---

## Step 7: Test Your Deployment

### 7.1 Test Checklist
- [ ] Frontend loads at Vercel URL
- [ ] Can register new account
- [ ] Can login as guest/host/admin
- [ ] Can view units
- [ ] Can create bookings
- [ ] Images upload correctly
- [ ] All features work

### 7.2 Share with Your Group
Send them:
- Frontend URL: `https://your-app.vercel.app`
- Test accounts (from `docs/TEST_ACCOUNTS.md`)

---

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check backend CORS configuration includes credentials

### API Connection Failed
- Verify `REACT_APP_API_URL` in Vercel environment variables
- Check Railway/Render backend is running
- Test backend URL directly in browser

### Database Connection Failed
- Verify MongoDB connection string is correct
- Check MongoDB Atlas network access allows all IPs
- Ensure database user has correct permissions

### Images Not Loading
- Images stored locally won't work in production
- Consider using Cloudinary or AWS S3 for image storage
- Or use base64 encoding for small images

---

## Cost Breakdown (Free Tier)

- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: Free ($5 credit/month, ~500 hours)
- **Render**: Free (750 hours/month)
- **MongoDB Atlas**: Free (512MB storage)

**Total Cost**: $0/month for small projects! 🎉

---

## Next Steps

1. Push your code to GitHub
2. Set up MongoDB Atlas
3. Run migration script
4. Deploy backend to Railway/Render
5. Deploy frontend to Vercel
6. Test everything
7. Share with your group!

Need help with any step? Let me know!
