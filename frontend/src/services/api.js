import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Course APIs
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getCategories: () => api.get('/courses/categories')
};

// Student APIs
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getMyCourses: () => api.get('/student/my-courses'),
  getCourseContent: (id) => api.get(`/student/course/${id}/content`),
  markVideoComplete: (videoId, courseId) => api.post(`/student/video/${videoId}/complete`, { courseId }),
  checkEnrollment: (courseId) => api.get(`/student/enrollment-status/${courseId}`)
};

// Payment APIs
export const paymentAPI = {
  createOrder: (courseId) => api.post('/payment/create-order', { courseId }),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getHistory: () => api.get('/payment/history')
};

// Live Class APIs
export const liveClassAPI = {
  getUpcoming: () => api.get('/live/upcoming'),
  join: (id) => api.post(`/live/${id}/join`)
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Courses
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  
  // Modules
  addModule: (courseId, data) => api.post(`/admin/courses/${courseId}/modules`, data),
  updateModule: (id, data) => api.put(`/admin/modules/${id}`, data),
  deleteModule: (id) => api.delete(`/admin/modules/${id}`),
  
  // Videos and Notes
  addVideo: (moduleId, data) => api.post(`/admin/modules/${moduleId}/videos`, data),
  addNote: (moduleId, data) => api.post(`/admin/modules/${moduleId}/notes`, data),
  
  // Enrollments and Students
  getEnrollments: () => api.get('/admin/enrollments'),
  getStudents: () => api.get('/admin/students'),
  
  // Hero Section
  getHeroSection: () => api.get('/admin/hero-section'),
  updateHeroSection: (data) => api.put('/admin/hero-section', data),
  
  // Live Classes
  getAllLiveClasses: () => api.get('/live/all'),
  scheduleLiveClass: (data) => api.post('/live/schedule', data),
  startLiveClass: (id, data) => api.post(`/live/${id}/start`, data),
  endLiveClass: (id, data) => api.post(`/live/${id}/end`, data),
  updateLiveClass: (id, data) => api.put(`/live/${id}`, data),
  deleteLiveClass: (id) => api.delete(`/live/${id}`)
};

export default api;
