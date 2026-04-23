import express from 'express';
import {
  getAdminDashboard,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  updateModule,
  deleteModule,
  addVideo,
  addNote,
  getAllEnrollments,
  getAllStudents,
  updateHeroSection,
  getHeroSection
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes and authorize only admin
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getAdminDashboard);

// Course management
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Module management
router.post('/courses/:id/modules', addModule);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);

// Video and notes
router.post('/modules/:id/videos', addVideo);
router.post('/modules/:id/notes', addNote);

// Enrollments and students
router.get('/enrollments', getAllEnrollments);
router.get('/students', getAllStudents);

// Hero section
router.put('/hero-section', updateHeroSection);

// Public route for hero section
router.get('/hero-section', getHeroSection);

export default router;
