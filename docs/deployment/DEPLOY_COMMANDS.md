# Quick Deploy Commands 🚀

## Deploy Frontend Only to Vercel (10 minutes)

### Step 1: Push to GitHub
```bash
# In your project root folder
git init
git add .
git commit -m "SmartStay frontend demo"
git remote add origin https://github.com/YOUR-USERNAME/smartstay-demo.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your repository
5. Set **Root Directory** to `frontend`
6. Click "Deploy"
7. Wait 2-3 minutes
8. Copy your URL: `https://your-app.vercel.app`

### Step 3: Share
Send your group the URL!

---

## If You Get Errors

### "Not a git repository"
```bash
git init
```

### "Remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/smartstay-demo.git
```

### "Permission denied"
```bash
# Make sure you're logged into GitHub
# Or use HTTPS instead of SSH
```

### "Build failed on Vercel"
- Check that Root Directory is set to `frontend`
- Go to Project Settings → General → Root Directory
- Change to `frontend` and redeploy

---

## Update Your Demo

When you make changes:
```bash
git add .
git commit -m "Updated design"
git push
```

Vercel will automatically redeploy in 2-3 minutes!

---

## What Your Group Will See

✅ Beautiful landing page
✅ Unit listings page
✅ Navigation and menus
✅ All UI components
✅ Responsive design

❌ Login won't work (no backend)
❌ No real data (no database)
❌ Can't create bookings (no backend)

**This is perfect for showing the design and interface!**

---

## Need Full Functionality?

Follow `QUICK_DEPLOYMENT_STEPS.md` to add:
- Backend (Render/Railway)
- Database (MongoDB Atlas)
- Full features (login, bookings, etc.)

---

## Questions?

Just ask! This is the simplest way to show your group the UI.
