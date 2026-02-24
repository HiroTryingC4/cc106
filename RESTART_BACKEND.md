# 🔄 Quick Fix: Restart Backend Server

## The Issue
You're seeing "Error saving expenses" because the backend server needs to be restarted to load the new expense routes.

## The Solution (30 seconds)

### Step 1: Stop Backend
Go to the terminal where backend is running and press:
```
Ctrl + C
```

### Step 2: Start Backend Again
```bash
cd backend
npm start
```

### Step 3: Wait for Confirmation
You should see:
```
🚀 Server running on http://localhost:5000
```

### Step 4: Test Expenses
1. Refresh your browser: http://localhost:3000/host/expenses
2. Click "Add Expense"
3. Fill the form and submit
4. ✅ Should work now!

---

## Why This Happens

When we added the new expense routes, the backend server was already running with the old code. Node.js doesn't automatically reload code changes, so we need to restart the server manually.

---

## Alternative: Use nodemon (Auto-restart)

To avoid this in the future, you can use nodemon which auto-restarts on code changes:

```bash
# Install nodemon globally
npm install -g nodemon

# Or install in backend
cd backend
npm install --save-dev nodemon

# Run with nodemon instead of node
nodemon server.js
```

Then update `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Use `npm run dev` for development (auto-restart).

---

## That's It!

Just restart the backend and the expense tracking will work perfectly! 🎉

