# 🎯 Admin Panel Guide - CA E-Learning Platform

## 🔐 Admin Login

**URL**: http://localhost:5173/login

**Credentials**:
- Email: `admin@ca.com`
- Password: `admin123`

⚠️ **Important**: Change password after first login!

---

## 📊 Admin Panel Features

### 1. Dashboard (`/admin/dashboard`)
**Analytics Overview**
- Total Students Count
- Total Courses Count
- Total Enrollments
- Total Revenue
- Recent Enrollments Table
- Monthly Revenue Chart

**Quick Actions**:
- View real-time statistics
- Monitor recent activities
- Track revenue trends

---

### 2. Courses Management (`/admin/courses`)
**Full CRUD Operations**

#### ✅ Create New Course
1. Click "Add Course" button
2. Fill in course details:
   - Title (e.g., "CA Foundation Complete Course")
   - Description
   - Category (Foundation/Intermediate/Final)
   - Instructor Name
   - Price (₹)
   - Discount (%)
   - Duration (e.g., "6 months")
   - Level (Beginner/Intermediate/Advanced)
   - Language
   - Features (one per line)
   - Requirements (one per line)
   - Thumbnail Image (optional)
3. Click "Create Course"

#### ✏️ Edit Course
1. Click Edit icon on any course
2. Modify details
3. Click "Update Course"

#### 🗑️ Delete Course
1. Click Delete icon
2. Confirm deletion

**Features**:
- Upload course thumbnails
- Set pricing and discounts
- Add course features
- Define requirements
- Categorize courses

---

### 3. Live Classes (`/admin/live-classes`)
**Schedule & Manage Live Sessions**

#### 📅 Schedule New Class
1. Click "Schedule Class"
2. Fill in details:
   - Select Course
   - Class Title
   - Description
   - Instructor Name
   - Date & Time
   - Duration (minutes)
   - Meeting Link (optional)
3. Click "Schedule Class"

#### ▶️ Start Live Class
1. Find scheduled class
2. Click "Start Class"
3. Enter meeting link (Zoom/Google Meet)
4. Students will be notified

#### ✏️ Edit/Delete Class
- Edit: Modify class details
- Delete: Remove scheduled class

**Status Types**:
- 🔵 Scheduled - Upcoming class
- 🔴 Live - Currently running
- ⚪ Completed - Finished class

---

### 4. Students Management (`/admin/students`)
**View All Registered Students**

**Information Displayed**:
- Student Name
- Email Address
- Phone Number
- Enrolled Courses Count
- Registration Date

**Use Cases**:
- Monitor student registrations
- Track enrollment patterns
- View student details

---

### 5. Enrollments (`/admin/enrollments`)
**Track Course Enrollments**

**Information Displayed**:
- Student Details (Name, Email)
- Course Name
- Enrollment Date
- Progress (%)
- Status (Active/Completed)

**Features**:
- Visual progress bars
- Status indicators
- Sortable table
- Filter options

---

### 6. Hero Section (`/admin/hero-section`)
**Customize Landing Page**

#### 🎨 Editable Elements
1. **Main Title**
   - Hero headline text
   
2. **Subtitle**
   - Supporting text
   
3. **Description**
   - Detailed information
   
4. **Primary CTA**
   - Button text
   - Button link
   
5. **Secondary CTA**
   - Button text
   - Button link
   
6. **Offer Banner**
   - Offer text
   - Show/Hide toggle

**How to Update**:
1. Edit any field
2. Click "Save Changes"
3. Changes reflect immediately on homepage

---

## 🎓 Expert Faculty Management

### Adding Faculty Information
**In Course Creation**:
1. Go to Courses → Add Course
2. Fill "Instructor Name" field
3. Add instructor details in description
4. Upload professional photo as thumbnail

**Best Practices**:
- Use full name with designation (e.g., "CA Rajesh Kumar")
- Add qualifications in course description
- Include teaching experience
- Mention specializations

---

## 📹 Recorded Lectures Management

### Adding Video Lectures
**Current Setup**: Videos are added via modules

**To Add Videos**:
1. Create a course first
2. Use backend API to add modules
3. Upload videos to Cloudinary
4. Add video URLs to modules

**Video Structure**:
```
Course
  └── Module 1
      ├── Video 1
      ├── Video 2
      └── PDF Notes
  └── Module 2
      ├── Video 1
      └── Video 2
```

**API Endpoint**:
```
POST /api/admin/courses/:courseId/modules
POST /api/admin/modules/:moduleId/videos
```

---

## 📚 Study Material Management

### Adding PDF Notes
**Via API**:
```
POST /api/admin/modules/:moduleId/notes
```

**Structure**:
- Title: "Chapter 1 Notes"
- File: PDF upload
- Module: Associated module

**Best Practices**:
- Organize by chapters
- Clear naming convention
- Compress PDFs for faster download
- Include table of contents

---

## 🎯 Quick Actions Guide

### Daily Tasks
1. ✅ Check Dashboard for new enrollments
2. ✅ Review scheduled live classes
3. ✅ Monitor student progress
4. ✅ Respond to queries

### Weekly Tasks
1. ✅ Add new courses/content
2. ✅ Schedule live classes
3. ✅ Update hero section offers
4. ✅ Review analytics

### Monthly Tasks
1. ✅ Analyze revenue trends
2. ✅ Review course performance
3. ✅ Update pricing/discounts
4. ✅ Plan new content

---

## 🔧 Admin Panel Navigation

### Sidebar Menu
- **Dashboard** - Analytics & Overview
- **Courses** - Manage all courses
- **Enrollments** - Track student enrollments
- **Students** - View all students
- **Live Classes** - Schedule & manage
- **Hero Section** - Customize homepage

### Mobile Navigation
- Tap hamburger menu (☰)
- Access all features
- Responsive design

---

## 💡 Pro Tips

### Course Management
1. **Use High-Quality Thumbnails**
   - Recommended size: 800x450px
   - Format: JPG/PNG
   - Max size: 5MB

2. **Pricing Strategy**
   - Set competitive prices
   - Use discounts strategically
   - Bundle courses for better value

3. **Course Features**
   - List clear benefits
   - Highlight unique selling points
   - Include what students will learn

### Live Classes
1. **Schedule in Advance**
   - Give students 2-3 days notice
   - Send reminders
   - Prepare materials beforehand

2. **Meeting Links**
   - Test links before class
   - Use reliable platforms (Zoom/Google Meet)
   - Have backup plan

3. **Engagement**
   - Interactive sessions
   - Q&A time
   - Record for later viewing

### Student Management
1. **Monitor Progress**
   - Check completion rates
   - Identify struggling students
   - Offer additional support

2. **Communication**
   - Regular updates
   - Course announcements
   - Feedback collection

---

## 🚀 Getting Started Checklist

### Initial Setup
- [x] Login to admin panel
- [ ] Change default password
- [ ] Update hero section
- [ ] Create first course
- [ ] Schedule first live class
- [ ] Test student enrollment flow

### Content Creation
- [ ] Add 3-5 courses
- [ ] Upload course thumbnails
- [ ] Set pricing and discounts
- [ ] Add course features
- [ ] Schedule live classes

### Ongoing Management
- [ ] Monitor dashboard daily
- [ ] Review enrollments
- [ ] Update content regularly
- [ ] Engage with students
- [ ] Analyze performance

---

## 📞 Support & Help

### Common Issues

**Can't login?**
- Check credentials
- Clear browser cache
- Try incognito mode

**Course not saving?**
- Check all required fields
- Verify image size
- Check internet connection

**Live class not showing?**
- Verify course selection
- Check date/time format
- Refresh page

---

## 🎉 Success Tips

1. **Content Quality**
   - Professional thumbnails
   - Clear descriptions
   - Accurate pricing

2. **Regular Updates**
   - Add new courses monthly
   - Update existing content
   - Fresh hero section offers

3. **Student Engagement**
   - Regular live classes
   - Timely responses
   - Quality study materials

4. **Analytics**
   - Monitor trends
   - Track popular courses
   - Adjust strategy accordingly

---

**Admin Panel URL**: http://localhost:5173/admin/dashboard

**Happy Managing! 🚀**
