# SmartStay Deployment Checklist ✅

Use this checklist to deploy SmartStay so your group can access it online!

---

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features working locally
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Test accounts working
- [ ] No console errors

### Files Created
- [ ] `backend/.env.example` ✅ (created)
- [ ] `backend/.gitignore` ✅ (created)
- [ ] `backend/migrate-to-mongodb.js` ✅ (created)
- [ ] `frontend/.env.example` ✅ (created)
- [ ] `frontend/.gitignore` ✅ (created)
- [ ] `frontend/src/config.js` ✅ (created)

---

## Deployment Steps

### 1. GitHub Setup (Required)
- [ ] Create GitHub account (if you don't have one)
- [ ] Create new repository
- [ ] Push code to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/yourusername/smartstay.git
  git push -u origin main
  ```

### 2. MongoDB Atlas Setup (Database)
- [ ] Sign up at https://www.mongodb.com/cloud/atlas
- [ ] Create free M0 cluster
- [ ] Create database user (save credentials!)
- [ ] Allow access from anywhere (0.0.0.0/0)
- [ ] Get connection string
- [ ] Replace `<password>` and `<dbname>` in connection string

### 3. Data Migration
- [ ] Install mongoose: `cd backend && npm install mongoose`
- [ ] Update MONGODB_URI in `migrate-to-mongodb.js`
- [ ] Run migration: `node migrate-to-mongodb.js`
- [ ] Verify success message: "Migration completed!"

### 4. Backend Deployment (Choose One)

#### Option A: Render (Recommended)
- [ ] Sign up at https://render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory: `backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `node server.js`
- [ ] Add environment variables:
  - [ ] `PORT` = `5000`
  - [ ] `NODE_ENV` = `production`
  - [ ] `JWT_SECRET` = (random string)
  - [ ] `MONGODB_URI` = (your connection string)
  - [ ] `FRONTEND_URL` = (will update later)
- [ ] Deploy and copy backend URL

#### Option B: Railway
- [ ] Sign up at https://railway.app
- [ ] Create new project from GitHub
- [ ] Select backend folder
- [ ] Add same environment variables as above
- [ ] Deploy and copy backend URL

### 5. Frontend Deployment (Choose One)

#### Option A: Render
- [ ] Create new Static Site
- [ ] Connect same GitHub repository
- [ ] Set root directory: `frontend`
- [ ] Set build command: `npm install && npm run build`
- [ ] Set publish directory: `build`
- [ ] Add environment variable:
  - [ ] `REACT_APP_API_URL` = (your backend URL)
- [ ] Deploy and copy frontend URL

#### Option B: Vercel (Faster)
- [ ] Sign up at https://vercel.com
- [ ] Import GitHub repository
- [ ] Set root directory: `frontend`
- [ ] Framework preset: Create React App
- [ ] Add environment variable:
  - [ ] `REACT_APP_API_URL` = (your backend URL)
- [ ] Deploy and copy frontend URL

### 6. Final Configuration
- [ ] Update backend `FRONTEND_URL` with actual frontend URL
- [ ] Redeploy backend (automatic on Render/Railway)
- [ ] Wait for both services to be live

---

## Testing Checklist

### Basic Functionality
- [ ] Frontend loads without errors
- [ ] Can view landing page
- [ ] Can view units list
- [ ] Can view unit details

### Authentication
- [ ] Can register new account
- [ ] Can login as guest (guest1@example.com / password123)
- [ ] Can login as host (TRIAL5@gmail.com / password123)
- [ ] Can login as admin (admin@smartstay.com / password123)
- [ ] Can logout

### Guest Features
- [ ] Can search/filter units
- [ ] Can view unit details
- [ ] Can create booking
- [ ] Can view bookings
- [ ] Can send messages

### Host Features
- [ ] Can view dashboard
- [ ] Can create unit (without images for now)
- [ ] Can edit unit
- [ ] Can view bookings
- [ ] Can manage guests
- [ ] Can view analytics

### Admin Features
- [ ] Can view admin dashboard
- [ ] Can manage users
- [ ] Can manage units
- [ ] Can view all bookings
- [ ] Can view reports

---

## Share with Your Group

### Information to Share:
1. **Frontend URL**: `https://your-app.onrender.com` or `https://your-app.vercel.app`

2. **Test Accounts**:
   ```
   Guest Account:
   Email: guest1@example.com
   Password: password123

   Host Account:
   Email: TRIAL5@gmail.com
   Password: password123

   Admin Account:
   Email: admin@smartstay.com
   Password: password123
   ```

3. **Important Notes**:
   - First load may take 30 seconds (free tier wakes up from sleep)
   - Image uploads won't persist on free hosting
   - Database has 512MB storage limit

---

## Known Limitations (Free Tier)

### Performance
- ⚠️ Backend sleeps after 15 minutes of inactivity
- ⚠️ First request takes ~30 seconds to wake up
- ⚠️ Subsequent requests are fast

### Storage
- ⚠️ Uploaded images won't persist (use Cloudinary for production)
- ⚠️ Database limited to 512MB (plenty for testing)

### Solutions
- For persistent images: Use Cloudinary (free tier: 25GB)
- For faster backend: Upgrade to paid tier ($7/month)
- For custom domain: Add in hosting settings

---

## Troubleshooting

### Issue: "Cannot connect to server"
**Solution**: 
- Check backend URL in frontend environment variables
- Test backend directly: `https://your-backend.onrender.com`
- Wait 30 seconds for backend to wake up

### Issue: "CORS error"
**Solution**:
- Update `FRONTEND_URL` in backend environment variables
- Make sure it matches frontend URL exactly
- Redeploy backend

### Issue: "Database connection failed"
**Solution**:
- Verify MongoDB connection string
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Ensure database user has read/write permissions

### Issue: "Images not loading"
**Solution**:
- Images stored locally won't work in cloud
- Use Cloudinary or AWS S3 for production
- Or disable image upload for now

---

## Cost Summary

### Free Tier (Perfect for Group Projects)
- **Render**: Free (with sleep after inactivity)
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: Free ($5 credit/month)
- **MongoDB Atlas**: Free (512MB storage)

**Total**: $0/month! 🎉

### Paid Tier (If Needed Later)
- **Render**: $7/month (no sleep, better performance)
- **MongoDB Atlas**: $9/month (2GB storage)
- **Cloudinary**: Free tier sufficient for images

---

## Next Steps After Deployment

1. [ ] Test all features with your group
2. [ ] Collect feedback
3. [ ] Fix any issues
4. [ ] Consider adding custom domain
5. [ ] Set up Cloudinary for images (if needed)
6. [ ] Monitor usage and performance

---

## Support

If you get stuck on any step:
1. Check the troubleshooting section
2. Review the detailed guides:
   - `VERCEL_DEPLOYMENT_GUIDE.md` (comprehensive)
   - `QUICK_DEPLOYMENT_STEPS.md` (simplified)
3. Ask for help with specific error messages

---

**Ready to deploy?** Start with Step 1! 🚀

Good luck with your group project! 🎓
