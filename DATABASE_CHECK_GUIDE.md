# 🗄️ Database Kaise Check Karein - Complete Guide

## 3 Tarike Hain Database Check Karne Ke

---

## 1️⃣ MongoDB Compass (Sabse Easy - GUI)

### Download & Install:
1. Download: https://www.mongodb.com/try/download/compass
2. Install karo
3. Open karo

### Connect Karo:
1. MongoDB Compass open karo
2. Connection string enter karo:
   ```
   mongodb://localhost:27017
   ```
3. Click: **Connect**

### Database Dekho:
1. Left side mein databases list dikhegi
2. **`ca-elearning`** database pe click karo
3. Collections dikhenge:
   - `users` - All users (students + admin)
   - `courses` - All courses
   - `enrollments` - Student enrollments
   - `payments` - Payment records
   - `liveclasses` - Live classes
   - `modules` - Course modules
   - `herosections` - Homepage content

### Admin User Check Karo:
1. `users` collection pe click karo
2. Filter box mein type karo:
   ```json
   {"role": "admin"}
   ```
3. Admin user dikhai dega:
   ```json
   {
     "_id": "...",
     "name": "Admin User",
     "email": "admin@ca.com",
     "role": "admin",
     "phone": "9999999999"
   }
   ```

---

## 2️⃣ MongoDB Shell (mongosh - Command Line)

### Open MongoDB Shell:
```bash
mongosh
```

### Database Select Karo:
```javascript
use ca-elearning
```

### Collections Dekho:
```javascript
show collections
```

Output:
```
courses
enrollments
herosections
liveclasses
modules
payments
users
```

### Admin User Check Karo:
```javascript
db.users.find({ role: "admin" })
```

Output:
```json
{
  _id: ObjectId('...'),
  name: 'Admin User',
  email: 'admin@ca.com',
  phone: '9999999999',
  role: 'admin',
  isActive: true,
  createdAt: ISODate('...')
}
```

### All Users Count:
```javascript
db.users.countDocuments()
```

### Students Count:
```javascript
db.users.countDocuments({ role: "student" })
```

### All Courses Dekho:
```javascript
db.courses.find()
```

### Specific User Find Karo:
```javascript
db.users.findOne({ email: "admin@ca.com" })
```

### Exit MongoDB Shell:
```javascript
exit
```

---

## 3️⃣ Node.js Script (Backend Se)

### Script Banao:

**File:** `backend/check-database.js`

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import Enrollment from './src/models/Enrollment.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check Users
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const students = await User.countDocuments({ role: 'student' });
    
    console.log('👥 USERS:');
    console.log(`   Total: ${totalUsers}`);
    console.log(`   Admins: ${adminUsers}`);
    console.log(`   Students: ${students}\n`);

    // Check Admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('👑 ADMIN USER:');
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Phone: ${admin.phone}`);
      console.log(`   Active: ${admin.isActive}\n`);
    }

    // Check Courses
    const totalCourses = await Course.countDocuments();
    console.log('📚 COURSES:');
    console.log(`   Total: ${totalCourses}\n`);

    // Check Enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    console.log('📝 ENROLLMENTS:');
    console.log(`   Total: ${totalEnrollments}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkDatabase();
```

### Run Karo:
```bash
cd backend
node check-database.js
```

---

## 🎯 Quick Commands Reference

### MongoDB Shell Commands:

```javascript
// Database select karo
use ca-elearning

// Collections list
show collections

// Admin user dekho
db.users.find({ role: "admin" }).pretty()

// All users dekho
db.users.find().pretty()

// Students dekho
db.users.find({ role: "student" }).pretty()

// Courses dekho
db.courses.find().pretty()

// Enrollments dekho
db.enrollments.find().pretty()

// Count documents
db.users.countDocuments()
db.courses.countDocuments()

// Specific email se find karo
db.users.findOne({ email: "admin@ca.com" })

// Delete user (careful!)
db.users.deleteOne({ email: "old@email.com" })

// Update user
db.users.updateOne(
  { email: "admin@ca.com" },
  { $set: { name: "New Name" } }
)
```

---

## 🔍 Common Checks

### 1. Admin User Exists?
```javascript
db.users.findOne({ email: "admin@ca.com" })
```

### 2. How Many Students?
```javascript
db.users.countDocuments({ role: "student" })
```

### 3. How Many Courses?
```javascript
db.courses.countDocuments()
```

### 4. Recent Enrollments?
```javascript
db.enrollments.find().sort({ createdAt: -1 }).limit(5)
```

### 5. All Collections?
```javascript
show collections
```

---

## 🛠️ Useful Database Operations

### Create New Admin (If Needed):
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@ca.com",
  phone: "9999999999",
  password: "$2a$10$...", // Hashed password
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

### Delete All Students (Careful!):
```javascript
db.users.deleteMany({ role: "student" })
```

### Delete All Courses:
```javascript
db.courses.deleteMany({})
```

### Reset Database (Delete Everything):
```javascript
db.dropDatabase()
```

---

## 📊 Database Structure

```
ca-elearning (Database)
├── users
│   ├── Admin users (role: "admin")
│   └── Students (role: "student")
├── courses
│   └── All courses with details
├── modules
│   └── Course modules with videos
├── enrollments
│   └── Student course enrollments
├── payments
│   └── Payment transactions
├── liveclasses
│   └── Scheduled live classes
└── herosections
    └── Homepage hero content
```

---

## 🎓 Step-by-Step: MongoDB Compass

### Installation:
1. Go to: https://www.mongodb.com/try/download/compass
2. Download for Windows
3. Install (Next, Next, Finish)
4. Open MongoDB Compass

### Connection:
1. You'll see "New Connection" screen
2. In "URI" field, paste:
   ```
   mongodb://localhost:27017
   ```
3. Click "Connect" button

### Navigate:
1. Left sidebar shows databases
2. Click on `ca-elearning`
3. You'll see all collections
4. Click on `users` to see all users
5. Click on any document to view details

### Filter Data:
1. Click on collection (e.g., `users`)
2. In "Filter" box, type:
   ```json
   { "role": "admin" }
   ```
3. Press Enter
4. Only admin users will show

---

## 💡 Pro Tips

### 1. Always Backup Before Deleting:
```bash
mongodump --db ca-elearning --out ./backup
```

### 2. Restore Backup:
```bash
mongorestore --db ca-elearning ./backup/ca-elearning
```

### 3. Export Collection to JSON:
```bash
mongoexport --db ca-elearning --collection users --out users.json
```

### 4. Import JSON to Collection:
```bash
mongoimport --db ca-elearning --collection users --file users.json
```

---

## 🚨 Common Issues

### Issue: "mongosh: command not found"
**Solution:** MongoDB Shell install karo
```bash
# Download from: https://www.mongodb.com/try/download/shell
```

### Issue: "Connection refused"
**Solution:** MongoDB service start karo
```bash
# Windows:
net start MongoDB

# Or check if running:
mongod --version
```

### Issue: "Database not found"
**Solution:** Database automatically create hoga jab pehli baar data insert hoga

---

## ✅ Quick Check Script

Main aapke liye ek simple script bana deta hoon:

**File:** `backend/quick-db-check.js`

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected!\n');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📦 Collections:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} documents`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
```

**Run:**
```bash
cd backend
node quick-db-check.js
```

---

## 🎯 Summary

**Sabse Easy:** MongoDB Compass (GUI)
**Sabse Fast:** MongoDB Shell (mongosh)
**Sabse Flexible:** Node.js Script

Choose karo jo aapko comfortable lage! 🚀
