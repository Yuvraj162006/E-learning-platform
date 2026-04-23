import express from 'express';
import {
  scheduleLiveClass,
  getUpcomingLiveClasses,
  getAllLiveClasses,
  startLiveClass,
  endLiveClass,
  joinLiveClass,
  updateLiveClass,
  deleteLiveClass
} from '../controllers/liveClassController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.get('/upcoming', protect, authorize('student'), getUpcomingLiveClasses);
router.post('/:id/join', protect, authorize('student'), joinLiveClass);

// Admin routes
router.post('/schedule', protect, authorize('admin'), scheduleLiveClass);
router.get('/all', protect, authorize('admin'), getAllLiveClasses);
router.post('/:id/start', protect, authorize('admin'), startLiveClass);
router.post('/:id/end', protect, authorize('admin'), endLiveClass);
router.put('/:id', protect, authorize('admin'), updateLiveClass);
router.delete('/:id', protect, authorize('admin'), deleteLiveClass);

export default router;
