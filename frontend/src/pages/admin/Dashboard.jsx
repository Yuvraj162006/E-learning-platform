import { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Loading from '../../components/Loading';
import AdminLayout from '../../components/AdminLayout';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  const stats = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      label: 'Total Students',
      value: dashboardData?.stats.totalStudents || 0,
      color: 'bg-blue-500'
    },
    {
      icon: <FiBook className="w-8 h-8" />,
      label: 'Total Courses',
      value: dashboardData?.stats.totalCourses || 0,
      color: 'bg-green-500'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      label: 'Total Enrollments',
      value: dashboardData?.stats.totalEnrollments || 0,
      color: 'bg-purple-500'
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      label: 'Total Revenue',
      value: formatCurrency(dashboardData?.stats.totalRevenue || 0),
      color: 'bg-yellow-500'
    }
  ];

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Recent Enrollments */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Enrollments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Student</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Course</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentEnrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="border-b dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {enrollment.studentId.name}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {enrollment.courseId.title}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {formatDate(enrollment.enrollmentDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default Dashboard;
