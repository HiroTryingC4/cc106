# Manual Vercel Setup - Step by Step 🔧

The automatic configuration isn't working, so let's do it manually in the Vercel UI.

---

## Option 1: Delete and Re-Import (Cleanest Solution)

### Step 1: Delete Current Project
1. Go to https://vercel.com/dashboard
2. Find your `cc106` project
3. Click on it
4. Click **Settings** (top menu)
5. Scroll to bottom → **Delete Project**
6. Type the project name to confirm
7. Click **Delete**

### Step 2: Re-Import with Correct Settings
1. Click **"Add New..."** → **"Project"**
2. Find `cc106` repository
3. Click **"Import"**
4. **IMPORTANT**: Before clicking Deploy, configure these:

#### Configuration Settings:
```
Project Name: cc106 (or smartstay)
Framework Preset: Create React App
Root Directory: frontend  ← CLICK EDIT AND SELECT THIS!
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

5. Click **"Deploy"**
6. Wait 3-5 minutes
7. Should work! ✅

---

## Option 2: Fix Current Deployment (If You Don't Want to Delete)

### Step 1: Go to Project Settings
1. Open your project on Vercel
2. Click **"Settings"** at the top

### Step 2: Configure Root Directory
1. In left sidebar, click **"General"**
2. Scroll down to **"Root Directory"**
3. You'll see it's probably set to `./` or empty
4. Click **"Edit"** button
5. In the dropdown or text field, select/type: `frontend`
6. Click **"Save"**

### Step 3: Configure Build Settings
1. In left sidebar, click **"Build & Development Settings"**
2. Make sure these are set:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (or leave as override)
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
3. Click **"Save"** if you made changes

### Step 4: Redeploy
1. Click **"Deployments"** at the top
2. Find the latest deployment
3. Click the **three dots "..."** on the right
4. Click **"Redeploy"**
5. Confirm the redeploy
6. Wait 3-5 minutes

### Step 5: Check Build Logs
1. While it's deploying, click on the deployment
2. Watch the build logs
3. Look for:
   - ✅ "Installing dependencies..."
   - ✅ "Building..."
   - ✅ "Build completed"
   - ❌ Any errors (share them with me if you see any)

---

## What to Look For in Build Logs

### ✅ Good Signs:
```
> Installing dependencies...
> Running "npm install" in /vercel/path0/frontend
> Building...
> Creating an optimized production build...
> Compiled successfully!
> Build completed
```

### ❌ Bad Signs:
```
Error: Cannot find module 'package.json'
Error: ENOENT: no such file or directory
Error: Build failed
```

If you see bad signs, the Root Directory is still wrong.

---

## Visual Guide

```
Vercel Dashboard
│
├─ Settings
│  │
│  ├─ General
│  │  └─ Root Directory: [Edit] → "frontend" → [Save]
│  │
│  └─ Build & Development Settings
│     ├─ Framework: Create React App
│     ├─ Build Command: npm run build
│     ├─ Output Directory: build
│     └─ Install Command: npm install
│
└─ Deployments
   └─ Latest → [...] → Redeploy
```

---

## Still Getting 404?

### Check These:

1. **Root Directory is EXACTLY**: `frontend` (lowercase, no slashes, no spaces)

2. **Build Command**: Should be `npm run build` or leave as default

3. **Output Directory**: Should be `build` (not `frontend/build`)

4. **Framework**: Should be "Create React App"

### Try This:
1. Take a screenshot of your Settings → General page
2. Take a screenshot of your Build & Development Settings page
3. Share them with me so I can see what's configured

---

## Alternative: Use Vercel CLI

If the UI isn't working, try the CLI:

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Deploy from Command Line:
```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (choose your account)
- Link to existing project? **N**
- Project name? **smartstay**
- Directory? **./frontend** (or just press Enter if already in frontend)
- Override settings? **N**

This will deploy just the frontend folder directly.

---

## Expected Result

After successful deployment, you should see:
- ✅ Your Vercel URL loads
- ✅ SmartStay landing page appears
- ✅ Navigation works
- ✅ No 404 error

Note: API calls will fail (no backend) - that's expected!

---

## Summary

**The Issue**: Vercel can't find your React app because it's in a subdirectory.

**The Fix**: Tell Vercel to look in the `frontend` folder by setting Root Directory.

**Time**: 5-10 minutes to reconfigure and redeploy.

---

**Try Option 1 (delete and re-import) first - it's the cleanest solution!**

Let me know which option you choose and if you need help with any step!
