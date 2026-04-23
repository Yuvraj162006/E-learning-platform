import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiClock } from 'react-icons/fi';
import { studentAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import Loading from '../../components/Loading';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await studentAPI.getMyCourses();
      setEnrollments(response.data.data.enrollments);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter === 'active') return enrollment.status === 'active' && enrollment.progress < 100;
    if (filter === 'completed') return enrollment.progress === 100;
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Courses
          </h1>

          {/* Filter Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredEnrollments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <Link
                key={enrollment._id}
                to={`/student/course/${enrollment.courseId._id}`}
                className="card-hover"
              >
                <img
                  src={enrollment.courseId.thumbnail?.url}
                  alt={enrollment.courseId.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {enrollment.courseId.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {enrollment.courseId.category}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {enrollment.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Enrolled: {formatDate(enrollment.enrollmentDate)}</span>
                  {enrollment.progress === 100 && (
                    <span className="text-green-500 font-medium">✓ Completed</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all'
                ? "You haven't enrolled in any courses yet"
                : `No ${filter} courses found`}
            </p>
            <Link to="/courses" className="btn-primary inline-block">
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
