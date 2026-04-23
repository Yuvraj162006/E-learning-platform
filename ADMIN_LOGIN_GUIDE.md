# 🔐 Admin Login Guide - Step by Step

## ✅ Admin User Verified

Admin user database mein successfully create ho gaya hai:
- **Email**: admin@caelearning.com
- **Password**: Admin@123
- **Role**: admin
- **Status**: Active ✓

---

## 🚀 Login Kaise Karein

### Method 1: Direct Login (Recommended)

1. **Open Browser**
   ```
   http://localhost:5173/login
   ```

2. **Enter Credentials**
   - Email: `admin@caelearning.com`
   - Password: `Admin@123`
   - (Exactly as shown, case-sensitive)

3. **Click "Sign In"**

4. **Automatic Redirect**
   - Admin → `/admin/dashboard`
   - Student → `/student/dashboard`

---

### Method 2: Test Login Page

Agar normal login kaam nahi kar raha, to test page use karein:

1. **Open Test Page**
   ```
   http://localhost:5173/test-login
   ```

2. **Click "Test Admin Login"**
   - Ye automatically credentials use karega
   - Response dikhayega
   - Error details dikhayega (agar koi ho)

3. **Check Console**
   - Browser console open karein (F12)
   - Network tab check karein
   - Error messages dekhein

---

## 🔍 Troubleshooting

### Issue 1: "Invalid Credentials" Error

**Possible Causes:**
1. Typing mistake in email/password
2. Extra spaces
3. Wrong case (capital/small letters)

**Solution:**
```
Email (exact):    admin@caelearning.com
Password (exact): Admin@123
```

**Copy-Paste Karein:**
- Email field mein: admin@caelearning.com
- Password field mein: Admin@123

---

### Issue 2: Network Error

**Check:**
1. Backend running hai?
   ```
   http://localhost:5000/api/health
   ```
   Should show: `{"status":"success"}`

2. Frontend running hai?
   ```
   http://localhost:5173
   ```

**Fix:**
```bash
# Backend restart
cd backend
npm run dev

# Frontend restart
cd frontend
npm run dev
```

---

### Issue 3: CORS Error

**Symptoms:**
- Console mein "CORS" error
- Network tab mein failed requests

**Fix:**
Backend `.env` file check karein:
```env
FRONTEND_URL=http://localhost:5173
```

---

### Issue 4: Token Error

**Symptoms:**
- Login successful but redirect fails
- "Token invalid" error

**Fix:**
1. Clear browser cache
2. Clear localStorage:
   ```javascript
   // Browser console mein run karein
   localStorage.clear()
   ```
3. Refresh page
4. Try login again

---

## 🧪 Manual Testing

### Test 1: Check Backend API

**Open in browser:**
```
http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

---

### Test 2: Check Admin User in Database

**Run this command:**
```bash
cd backend
node check-admin.js
```

**Expected Output:**
```
✅ Admin user found!
Email: admin@caelearning.com
Role: admin
Password "Admin@123" matches: ✅ YES
```

---

### Test 3: Direct API Call

**Using Browser Console:**
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@caelearning.com',
    password: 'Admin@123'
  })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin",
      "email": "admin@caelearning.com",
      "role": "admin"
    },
    "token": "eyJhbGc..."
  }
}
```

---

## 📝 Common Mistakes

### ❌ Wrong Email Format
```
admin@caelearning.com  ✅ Correct
admin@ca-elearning.com ❌ Wrong
admin@caelearning     ❌ Wrong
```

### ❌ Wrong Password
```
Admin@123  ✅ Correct (capital A)
admin@123  ❌ Wrong (small a)
Admin@1234 ❌ Wrong (extra 4)
Admin123   ❌ Wrong (no @)
```

### ❌ Extra Spaces
```
"admin@caelearning.com"  ✅ Correct
" admin@caelearning.com" ❌ Wrong (space before)
"admin@caelearning.com " ❌ Wrong (space after)
```

---

## 🎯 Quick Fix Steps

### If Login Not Working:

**Step 1: Verify Servers**
```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend
# Open http://localhost:5173 in browser
```

**Step 2: Clear Browser Data**
1. Press F12 (Developer Tools)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh page

**Step 3: Use Test Page**
```
http://localhost:5173/test-login
```

**Step 4: Check Console**
1. Press F12
2. Go to Console tab
3. Look for errors
4. Copy error message

**Step 5: Try Different Browser**
- Chrome
- Firefox
- Edge

---

## 🔄 Reset Admin Password

Agar password bhool gaye:

**Method 1: Delete and Recreate**
```bash
# MongoDB mein jaake delete karein
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ca-elearning')
  .then(() => mongoose.connection.db.collection('users').deleteOne({email: 'admin@caelearning.com'}))
  .then(() => console.log('Deleted'))
  .then(() => process.exit());
"

# Phir dobara create karein
npm run seed
```

**Method 2: Update Password Directly**
```bash
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost:27017/ca-elearning')
  .then(async () => {
    const hash = await bcrypt.hash('Admin@123', 10);
    await mongoose.connection.db.collection('users').updateOne(
      {email: 'admin@caelearning.com'},
      {\$set: {password: hash}}
    );
    console.log('Password updated');
    process.exit();
  });
"
```

---

## 📞 Still Not Working?

### Check These:

1. **Backend Logs**
   - Terminal jahan backend chal raha hai
   - Koi error dikha?

2. **Frontend Console**
   - Browser console (F12)
   - Network tab
   - Console tab

3. **MongoDB**
   - MongoDB running hai?
   - Connection string sahi hai?

4. **Environment Variables**
   - `backend/.env` exists?
   - `frontend/.env` exists?
   - Values correct hain?

---

## ✅ Success Checklist

After successful login, you should see:

- ✅ Redirect to `/admin/dashboard`
- ✅ Admin sidebar visible
- ✅ Dashboard with statistics
- ✅ Name "Admin" in navbar
- ✅ No errors in console

---

## 🎉 Next Steps After Login

1. **Change Password**
   - Go to Profile
   - Update password

2. **Explore Admin Panel**
   - Dashboard
   - Courses
   - Live Classes
   - Students
   - Enrollments
   - Hero Section

3. **Create First Course**
   - Go to Courses
   - Click "Add Course"
   - Fill details
   - Save

---

**Need Help?**
- Check browser console (F12)
- Check backend terminal logs
- Use test page: http://localhost:5173/test-login

**Happy Managing! 🚀**
