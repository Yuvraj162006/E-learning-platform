import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiVideo } from 'react-icons/fi';
import { liveClassAPI } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';

const LiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const response = await liveClassAPI.getUpcoming();
      setLiveClasses(response.data.data.liveClasses);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (classId) => {
    try {
      const response = await liveClassAPI.join(classId);
      const { meetingLink } = response.data.data;
      if (meetingLink) {
        window.open(meetingLink, '_blank');
      } else {
        toast.error('Meeting link not available yet');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join class');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Live Classes
        </h1>

        {liveClasses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {liveClasses.map((liveClass) => (
              <div key={liveClass._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {liveClass.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {liveClass.courseId.title}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    liveClass.status === 'live'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {liveClass.status === 'live' ? '🔴 Live' : 'Scheduled'}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {liveClass.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDateTime(liveClass.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <FiClock className="w-4 h-4" />
                    <span>{liveClass.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <FiVideo className="w-4 h-4" />
                    <span>Instructor: {liveClass.instructor}</span>
                  </div>
                </div>

                {liveClass.status === 'live' && (
                  <button
                    onClick={() => handleJoinClass(liveClass._id)}
                    className="w-full btn-primary"
                  >
                    Join Now
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No upcoming live classes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for scheduled live sessions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClasses;
