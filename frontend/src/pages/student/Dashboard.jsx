import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const stats = [
    {
      icon: <FiBook className="w-8 h-8" />,
      label: 'Total Enrolled',
      value: dashboardData?.stats.totalEnrolled || 0,
      color: 'bg-blue-500'
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      label: 'In Progress',
      value: dashboardData?.stats.inProgress || 0,
      color: 'bg-yellow-500'
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      label: 'Completed',
      value: dashboardData?.stats.completed || 0,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Courses
            </h2>
            <Link to="/student/my-courses" className="text-primary-600 hover:text-primary-500">
              View All
            </Link>
          </div>

          {dashboardData?.recentCourses && dashboardData.recentCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {dashboardData.recentCourses.map((enrollment) => (
                <Link
                  key={enrollment._id}
                  to={`/student/course/${enrollment.courseId._id}`}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex space-x-4">
                    <img
                      src={enrollment.courseId.thumbnail?.url}
                      alt={enrollment.courseId.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {enrollment.courseId.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {enrollment.courseId.category}
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {enrollment.progress}% Complete
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't enrolled in any courses yet
              </p>
              <Link to="/courses" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
