import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Delete existing admin if exists
    await User.deleteMany({ email: 'admin@ca.com' });
    await User.deleteMany({ email: 'admin@caelearning.com' });

    console.log('🗑️  Deleted old admin users');

    // Create new admin user with simple credentials
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ca.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@ca.com');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
