import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiUserCheck, FiVideo, FiSettings, FiBarChart2 } from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiBarChart2 />, label: 'Dashboard' },
    { path: '/admin/courses', icon: <FiBook />, label: 'Courses' },
    { path: '/admin/enrollments', icon: <FiUserCheck />, label: 'Enrollments' },
    { path: '/admin/students', icon: <FiUsers />, label: 'Students' },
    { path: '/admin/live-classes', icon: <FiVideo />, label: 'Live Classes' },
    { path: '/admin/hero-section', icon: <FiSettings />, label: 'Hero Section' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Panel
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your platform
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <strong>Quick Stats</strong>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          View detailed analytics in Dashboard
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
