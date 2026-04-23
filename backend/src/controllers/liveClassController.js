import LiveClass from '../models/LiveClass.js';
import Enrollment from '../models/Enrollment.js';
import { sendEmail } from '../utils/sendEmail.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// @desc    Schedule a live class
// @route   POST /api/live/schedule
// @access  Private (Admin)
export const scheduleLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.create(req.body);

    // Get all enrolled students for this course
    const enrollments = await Enrollment.find({ courseId: req.body.courseId })
      .populate('studentId', 'email name');

    const course = await Course.findById(req.body.courseId);

    // Send notification emails to all enrolled students
    const emailPromises = enrollments.map(enrollment => {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Live Class Scheduled! 📅</h2>
          <p>Dear ${enrollment.studentId.name},</p>
          <p>A new live class has been scheduled for your course:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${liveClass.title}</h3>
            <p style="margin: 5px 0;"><strong>Course:</strong> ${course.title}</p>
            <p style="margin: 5px 0;"><strong>Instructor:</strong> ${liveClass.instructor}</p>
            <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${new Date(liveClass.scheduledDate).toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${liveClass.duration} minutes</p>
          </div>
          <p>${liveClass.description}</p>
          <a href="${process.env.FRONTEND_URL}/student/live-classes" 
             style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin: 20px 0;">
            View Live Classes
          </a>
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Make sure to join on time. See you there!
          </p>
        </div>
      `;

      return sendEmail({
        to: enrollment.studentId.email,
        subject: `New Live Class: ${liveClass.title}`,
        html: emailHtml
      });
    });

    await Promise.all(emailPromises);

    res.status(201).json({
      status: 'success',
      message: 'Live class scheduled and notifications sent',
      data: { liveClass }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get upcoming live classes
// @route   GET /api/live/upcoming
// @access  Private (Student)
export const getUpcomingLiveClasses = async (req, res) => {
  try {
    // Get student's enrolled courses
    const enrollments = await Enrollment.find({ studentId: req.user.id });
    const courseIds = enrollments.map(e => e.courseId);

    // Get upcoming live classes for enrolled courses
    const liveClasses = await LiveClass.find({
      courseId: { $in: courseIds },
      scheduledDate: { $gte: new Date() },
      status: { $in: ['scheduled', 'live'] }
    })
      .populate('courseId', 'title thumbnail')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      status: 'success',
      results: liveClasses.length,
      data: { liveClasses }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all live classes (Admin)
// @route   GET /api/live/all
// @access  Private (Admin)
export const getAllLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find()
      .populate('courseId', 'title')
      .sort({ scheduledDate: -1 });

    res.status(200).json({
      status: 'success',
      results: liveClasses.length,
      data: { liveClasses }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Start live class
// @route   POST /api/live/:id/start
// @access  Private (Admin)
export const startLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      {
        status: 'live',
        meetingLink: req.body.meetingLink,
        agoraChannelName: req.body.agoraChannelName,
        agoraToken: req.body.agoraToken
      },
      { new: true }
    );

    if (!liveClass) {
      return res.status(404).json({
        status: 'error',
        message: 'Live class not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Live class started',
      data: { liveClass }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    End live class
// @route   POST /api/live/:id/end
// @access  Private (Admin)
export const endLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        recordingUrl: req.body.recordingUrl,
        isRecorded: !!req.body.recordingUrl
      },
      { new: true }
    );

    if (!liveClass) {
      return res.status(404).json({
        status: 'error',
        message: 'Live class not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Live class ended',
      data: { liveClass }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Join live class
// @route   POST /api/live/:id/join
// @access  Private (Student)
export const joinLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: 'error',
        message: 'Live class not found'
      });
    }

    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId: liveClass.courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not enrolled in this course'
      });
    }

    // Add student to attendees if not already there
    if (!liveClass.attendees.includes(req.user.id)) {
      liveClass.attendees.push(req.user.id);
      await liveClass.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        meetingLink: liveClass.meetingLink,
        agoraChannelName: liveClass.agoraChannelName,
        agoraToken: liveClass.agoraToken
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update live class
// @route   PUT /api/live/:id
// @access  Private (Admin)
export const updateLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!liveClass) {
      return res.status(404).json({
        status: 'error',
        message: 'Live class not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Live class updated',
      data: { liveClass }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete live class
// @route   DELETE /api/live/:id
// @access  Private (Admin)
export const deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndDelete(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        status: 'error',
        message: 'Live class not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Live class deleted'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
