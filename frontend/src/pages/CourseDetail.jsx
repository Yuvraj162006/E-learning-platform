import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiBook, FiCheckCircle, FiPlay } from 'react-icons/fi';
import { courseAPI, studentAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import { displayRazorpay } from '../utils/razorpay';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [id, isAuthenticated]);

  const fetchCourseDetails = async () => {
    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data.data.course);
      setModules(response.data.data.modules);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await studentAPI.checkEnrollment(id);
      setIsEnrolled(response.data.data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }

    setEnrolling(true);

    try {
      // Create Razorpay order
      const orderResponse = await paymentAPI.createOrder(id);
      const orderData = orderResponse.data.data;

      // Display Razorpay checkout
      await displayRazorpay(
        {
          ...orderData,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone
        },
        async (paymentData) => {
          // Verify payment
          try {
            await paymentAPI.verifyPayment(paymentData);
            toast.success('Enrollment successful!');
            navigate('/student/my-courses');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        (error) => {
          toast.error(error || 'Payment cancelled');
        }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Loading />;
  if (!course) return <div>Course not found</div>;

  const finalPrice = course.price - (course.price * course.discount / 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                {course.category}
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <FiUsers />
                  <span>{course.enrolledStudents} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock />
                  <span>{course.duration}</span>
                </div>
                {course.rating > 0 && (
                  <div className="flex items-center space-x-2">
                    <FiStar className="fill-yellow-400" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {course.discount > 0 ? (
                  <>
                    <span className="text-4xl font-bold">{formatCurrency(finalPrice)}</span>
                    <span className="text-xl line-through opacity-75">{formatCurrency(course.price)}</span>
                    <span className="bg-red-500 px-3 py-1 rounded-full text-sm">
                      {course.discount}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold">{formatCurrency(course.price)}</span>
                )}
              </div>
            </div>

            <div className="hidden md:block">
              <img
                src={course.thumbnail?.url}
                alt={course.title}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {course.features && course.features.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What You'll Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Course Content
              </h2>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div key={module._id} className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {module.videos.length} videos
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="mb-6">
                <img
                  src={course.thumbnail?.url}
                  alt={course.title}
                  className="w-full rounded-lg mb-4"
                />
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/student/course/${course._id}`)}
                  className="w-full btn-primary mb-4"
                >
                  Go to Course
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full btn-primary mb-4"
                >
                  {enrolling ? 'Processing...' : 'Enroll Now'}
                </button>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Instructor</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.instructor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Level</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Language</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.language}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
