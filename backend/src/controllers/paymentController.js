import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private (Student)
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already enrolled in this course'
      });
    }

    // Calculate final amount
    const amount = course.finalPrice * 100; // Convert to paise

    // Create Razorpay order
    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: course._id.toString(),
        studentId: req.user.id.toString()
      }
    };

    const order = await razorpayInstance.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      studentId: req.user.id,
      courseId,
      razorpayOrderId: order.id,
      amount: amount / 100,
      status: 'pending'
    });

    res.status(200).json({
      status: 'success',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment._id
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private (Student)
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentId
    } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    if (!isAuthentic) {
      // Update payment status to failed
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'failed'
      });

      return res.status(400).json({
        status: 'error',
        message: 'Payment verification failed'
      });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'success',
        paymentDate: Date.now()
      },
      { new: true }
    );

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: payment.studentId,
      courseId: payment.courseId,
      paymentId: payment._id,
      status: 'active'
    });

    // Update course enrolled students count
    await Course.findByIdAndUpdate(payment.courseId, {
      $inc: { enrolledStudents: 1 }
    });

    // Update user's enrolled courses
    await User.findByIdAndUpdate(payment.studentId, {
      $push: { enrolledCourses: payment.courseId }
    });

    // Get course and user details for email
    const course = await Course.findById(payment.courseId);
    const user = await User.findById(payment.studentId);

    // Send enrollment confirmation email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Enrollment Successful! 🎉</h2>
        <p>Dear ${user.name},</p>
        <p>Congratulations! You have successfully enrolled in:</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${course.title}</h3>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${course.category}</p>
          <p style="margin: 5px 0;"><strong>Instructor:</strong> ${course.instructor}</p>
          <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${payment.amount}</p>
        </div>
        <p>You can now access the course content from your dashboard.</p>
        <a href="${process.env.FRONTEND_URL}/student/my-courses" 
           style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Go to My Courses
        </a>
        <p>Happy Learning!</p>
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
          If you have any questions, feel free to contact our support team.
        </p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Course Enrollment Successful',
      html: emailHtml
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment verified and enrollment completed',
      data: {
        payment,
        enrollment
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payment/history
// @access  Private (Student)
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.user.id })
      .populate('courseId', 'title thumbnail')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: payments.length,
      data: { payments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
