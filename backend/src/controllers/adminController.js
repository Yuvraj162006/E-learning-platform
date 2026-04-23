import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import HeroSection from '../models/HeroSection.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Calculate total revenue
    const payments = await Payment.find({ status: 'success' });
    const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .sort({ enrollmentDate: -1 })
      .limit(10);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'success',
          paymentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalStudents,
          totalCourses,
          totalEnrollments,
          totalRevenue
        },
        recentEnrollments,
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/admin/courses
// @access  Private (Admin)
export const createCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Handle thumbnail upload if provided
    if (req.body.thumbnailBase64) {
      const uploadResult = await uploadToCloudinary(req.body.thumbnailBase64, 'courses/thumbnails');
      courseData.thumbnail = uploadResult;
      delete courseData.thumbnailBase64;
    }

    const course = await Course.create(courseData);

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private (Admin)
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const updateData = req.body;

    // Handle thumbnail update
    if (req.body.thumbnailBase64) {
      // Delete old thumbnail
      if (course.thumbnail.publicId) {
        await deleteFromCloudinary(course.thumbnail.publicId);
      }
      // Upload new thumbnail
      const uploadResult = await uploadToCloudinary(req.body.thumbnailBase64, 'courses/thumbnails');
      updateData.thumbnail = uploadResult;
      delete updateData.thumbnailBase64;
    }

    course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private (Admin)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Delete thumbnail from cloudinary
    if (course.thumbnail.publicId) {
      await deleteFromCloudinary(course.thumbnail.publicId);
    }

    // Delete all modules and their videos
    const modules = await Module.find({ courseId: course._id });
    for (const module of modules) {
      // Delete videos from cloudinary
      for (const video of module.videos) {
        if (video.publicId) {
          await deleteFromCloudinary(video.publicId);
        }
      }
      // Delete notes from cloudinary
      for (const note of module.notes) {
        if (note.publicId) {
          await deleteFromCloudinary(note.publicId);
        }
      }
      await module.deleteOne();
    }

    await course.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Add module to course
// @route   POST /api/admin/courses/:id/modules
// @access  Private (Admin)
export const addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const moduleData = {
      ...req.body,
      courseId: req.params.id
    };

    const module = await Module.create(moduleData);

    res.status(201).json({
      status: 'success',
      message: 'Module added successfully',
      data: { module }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update module
// @route   PUT /api/admin/modules/:id
// @access  Private (Admin)
export const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!module) {
      return res.status(404).json({
        status: 'error',
        message: 'Module not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Module updated successfully',
      data: { module }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete module
// @route   DELETE /api/admin/modules/:id
// @access  Private (Admin)
export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: 'error',
        message: 'Module not found'
      });
    }

    // Delete videos from cloudinary
    for (const video of module.videos) {
      if (video.publicId) {
        await deleteFromCloudinary(video.publicId);
      }
    }

    // Delete notes from cloudinary
    for (const note of module.notes) {
      if (note.publicId) {
        await deleteFromCloudinary(note.publicId);
      }
    }

    await module.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Module deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Add video to module
// @route   POST /api/admin/modules/:id/videos
// @access  Private (Admin)
export const addVideo = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: 'error',
        message: 'Module not found'
      });
    }

    const videoData = req.body;

    // Handle video upload if base64 provided
    if (req.body.videoBase64) {
      const uploadResult = await uploadToCloudinary(req.body.videoBase64, 'courses/videos');
      videoData.url = uploadResult.url;
      videoData.publicId = uploadResult.publicId;
      delete videoData.videoBase64;
    }

    module.videos.push(videoData);
    await module.save();

    res.status(201).json({
      status: 'success',
      message: 'Video added successfully',
      data: { module }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Add note to module
// @route   POST /api/admin/modules/:id/notes
// @access  Private (Admin)
export const addNote = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: 'error',
        message: 'Module not found'
      });
    }

    const noteData = req.body;

    // Handle PDF upload if base64 provided
    if (req.body.pdfBase64) {
      const uploadResult = await uploadToCloudinary(req.body.pdfBase64, 'courses/notes');
      noteData.url = uploadResult.url;
      noteData.publicId = uploadResult.publicId;
      delete noteData.pdfBase64;
    }

    module.notes.push(noteData);
    await module.save();

    res.status(201).json({
      status: 'success',
      message: 'Note added successfully',
      data: { module }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all enrollments
// @route   GET /api/admin/enrollments
// @access  Private (Admin)
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'name email phone')
      .populate('courseId', 'title category price')
      .populate('paymentId')
      .sort({ enrollmentDate: -1 });

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: { enrollments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update hero section
// @route   PUT /api/admin/hero-section
// @access  Private (Admin)
export const updateHeroSection = async (req, res) => {
  try {
    let heroSection = await HeroSection.findOne();

    const updateData = req.body;

    // Handle banner image upload
    if (req.body.bannerImageBase64) {
      if (heroSection && heroSection.bannerImage.publicId) {
        await deleteFromCloudinary(heroSection.bannerImage.publicId);
      }
      const uploadResult = await uploadToCloudinary(req.body.bannerImageBase64, 'hero');
      updateData.bannerImage = uploadResult;
      delete updateData.bannerImageBase64;
    }

    if (heroSection) {
      heroSection = await HeroSection.findByIdAndUpdate(
        heroSection._id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      heroSection = await HeroSection.create(updateData);
    }

    res.status(200).json({
      status: 'success',
      message: 'Hero section updated successfully',
      data: { heroSection }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get hero section
// @route   GET /api/admin/hero-section
// @access  Public
export const getHeroSection = async (req, res) => {
  try {
    let heroSection = await HeroSection.findOne({ isActive: true });

    if (!heroSection) {
      // Create default hero section
      heroSection = await HeroSection.create({});
    }

    res.status(200).json({
      status: 'success',
      data: { heroSection }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
