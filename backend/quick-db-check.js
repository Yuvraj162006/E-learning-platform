import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import Enrollment from './src/models/Enrollment.js';
import LiveClass from './src/models/LiveClass.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    console.log('🔍 Connecting to database...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check Collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📦 DATABASE COLLECTIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   ${col.name.padEnd(20)} : ${count} documents`);
    }
    console.log('\n');

    // Check Users
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const students = await User.countDocuments({ role: 'student' });
    
    console.log('👥 USERS SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total Users    : ${totalUsers}`);
    console.log(`   Admin Users    : ${adminUsers}`);
    console.log(`   Students       : ${students}`);
    console.log('\n');

    // Check Admin Details
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('👑 ADMIN USER DETAILS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Name           : ${admin.name}`);
      console.log(`   Email          : ${admin.email}`);
      console.log(`   Phone          : ${admin.phone}`);
      console.log(`   Role           : ${admin.role}`);
      console.log(`   Active         : ${admin.isActive ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created        : ${admin.createdAt?.toLocaleDateString() || 'N/A'}`);
      console.log('\n');
    } else {
      console.log('❌ No admin user found!\n');
    }

    // Check Courses
    const totalCourses = await Course.countDocuments();
    console.log('📚 COURSES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total Courses  : ${totalCourses}`);
    
    if (totalCourses > 0) {
      const courses = await Course.find().limit(5).select('title category');
      console.log('\n   Recent Courses:');
      courses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title} (${course.category})`);
      });
    }
    console.log('\n');

    // Check Enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    console.log('📝 ENROLLMENTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total          : ${totalEnrollments}`);
    console.log('\n');

    // Check Live Classes
    const totalLiveClasses = await LiveClass.countDocuments();
    const upcomingClasses = await LiveClass.countDocuments({ status: 'scheduled' });
    console.log('🎥 LIVE CLASSES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total          : ${totalLiveClasses}`);
    console.log(`   Upcoming       : ${upcomingClasses}`);
    console.log('\n');

    // List All Students
    if (students > 0) {
      console.log('👨‍🎓 STUDENTS LIST:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      const studentsList = await User.find({ role: 'student' })
        .select('name email phone createdAt')
        .limit(10);
      
      studentsList.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.name}`);
        console.log(`      Email: ${student.email}`);
        console.log(`      Phone: ${student.phone || 'N/A'}`);
        console.log(`      Joined: ${student.createdAt?.toLocaleDateString() || 'N/A'}`);
        console.log('');
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database check complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDatabase();
