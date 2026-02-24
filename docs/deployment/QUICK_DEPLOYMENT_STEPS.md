# Quick Deployment Steps for Your Group 🚀

## Simplest Option: Use Render (All-in-One)

This is the easiest way to deploy everything in one place!

### Step 1: Push to GitHub (5 minutes)

1. Create a new repository on GitHub
2. In your project folder, run:
```bash
git init
git add .
git commit -m "Initial commit - SmartStay application"
git remote add origin https://github.com/yourusername/smartstay.git
git push -u origin main
```

### Step 2: Set Up MongoDB Atlas (10 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a new cluster (choose FREE M0 tier)
4. Wait 3-5 minutes for cluster creation
5. Click "Database Access" → Add user (save username & password!)
6. Click "Network Access" → Add IP → "Allow Access from Anywhere"
7. Click "Connect" → "Connect your application" → Copy connection string
8. Replace `<password>` with your password and `<dbname>` with `smartstay`

Example: `mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/smartstay`

### Step 3: Migrate Data to MongoDB (5 minutes)

1. Install mongoose:
```bash
cd backend
npm install mongoose
```

2. Edit `backend/migrate-to-mongodb.js` and replace the MONGODB_URI with your connection string

3. Run migration:
```bash
node migrate-to-mongodb.js
```

You should see: ✅ Migration completed!

### Step 4: Deploy Backend to Render (10 minutes)

1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: smartstay-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. Add Environment Variables (click "Advanced"):
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your-random-secret-key-123456789`
   - `MONGODB_URI` = `your-mongodb-connection-string`
   - `FRONTEND_URL` = `https://smartstay-frontend.onrender.com` (we'll update this)

6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (e.g., `https://smartstay-backend.onrender.com`)

### Step 5: Deploy Frontend to Render (10 minutes)

1. Click "New +" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - **Name**: smartstay-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://smartstay-backend.onrender.com` (your backend URL)

5. Click "Create Static Site"
6. Wait 5-10 minutes for deployment
7. Copy your frontend URL (e.g., `https://smartstay-frontend.onrender.com`)

### Step 6: Update Backend CORS (2 minutes)

1. Go back to your backend service on Render
2. Click "Environment"
3. Update `FRONTEND_URL` to your actual frontend URL
4. Click "Save Changes" (it will redeploy automatically)

### Step 7: Test & Share! 🎉

1. Open your frontend URL
2. Test login with test accounts:
   - Guest: guest1@example.com / password123
   - Host: TRIAL5@gmail.com / password123
   - Admin: admin@smartstay.com / password123

3. Share the URL with your group!

---

## Alternative: Vercel + Railway (Faster Frontend)

If you want faster frontend performance:

### Frontend on Vercel:
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Set Root Directory: `frontend`
5. Add environment variable: `REACT_APP_API_URL` = your backend URL
6. Deploy!

### Backend on Railway:
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select `backend` folder
5. Add same environment variables as Render
6. Deploy!

---

## Important Notes

### Free Tier Limitations:
- **Render Free**: Services sleep after 15 minutes of inactivity (first request takes ~30 seconds to wake up)
- **MongoDB Atlas Free**: 512MB storage (plenty for your project)
- **Vercel Free**: 100GB bandwidth/month

### Image Uploads:
- Images uploaded locally won't persist on free hosting
- For production, consider using Cloudinary (free tier: 25GB storage)
- Or use base64 encoding for small images

### Custom Domain (Optional):
- You can add a custom domain in Render/Vercel settings
- Example: smartstay.yourdomain.com

---

## Troubleshooting

### "Cannot connect to backend"
- Check backend URL in frontend environment variables
- Make sure backend is deployed and running
- Test backend URL directly: `https://your-backend.onrender.com/api/health`

### "Database connection failed"
- Verify MongoDB connection string is correct
- Check MongoDB Atlas allows all IPs (0.0.0.0/0)
- Make sure password doesn't have special characters

### "CORS error"
- Update `FRONTEND_URL` in backend environment variables
- Make sure it matches your frontend URL exactly (no trailing slash)

---

## Total Time: ~45 minutes

That's it! Your group can now access SmartStay from anywhere! 🌍

**Questions?** Let me know which step you're stuck on!
