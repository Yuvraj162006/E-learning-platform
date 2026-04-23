import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TestLogin from './pages/TestLogin';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/MyCourses';
import CourseContent from './pages/student/CourseContent';
import LiveClasses from './pages/student/LiveClasses';
import Profile from './pages/student/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/Courses';
import AdminEnrollments from './pages/admin/Enrollments';
import AdminStudents from './pages/admin/Students';
import AdminLiveClasses from './pages/admin/LiveClasses';
import AdminHeroSection from './pages/admin/HeroSection';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test-login" element={<TestLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            } />
            <Route path="/student/my-courses" element={
              <PrivateRoute>
                <MyCourses />
              </PrivateRoute>
            } />
            <Route path="/student/course/:id" element={
              <PrivateRoute>
                <CourseContent />
              </PrivateRoute>
            } />
            <Route path="/student/live-classes" element={
              <PrivateRoute>
                <LiveClasses />
              </PrivateRoute>
            } />
            <Route path="/student/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/courses" element={
              <AdminRoute>
                <AdminCourses />
              </AdminRoute>
            } />
            <Route path="/admin/enrollments" element={
              <AdminRoute>
                <AdminEnrollments />
              </AdminRoute>
            } />
            <Route path="/admin/students" element={
              <AdminRoute>
                <AdminStudents />
              </AdminRoute>
            } />
            <Route path="/admin/live-classes" element={
              <AdminRoute>
                <AdminLiveClasses />
              </AdminRoute>
            } />
            <Route path="/admin/hero-section" element={
              <AdminRoute>
                <AdminHeroSection />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
