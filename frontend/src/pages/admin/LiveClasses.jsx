import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash, FiX, FiVideo } from 'react-icons/fi';
import { adminAPI, courseAPI } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

const LiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    instructor: '',
    scheduledDate: '',
    duration: 60,
    meetingLink: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, coursesRes] = await Promise.all([
        adminAPI.getAllLiveClasses(),
        courseAPI.getAll()
      ]);
      setLiveClasses(classesRes.data.data.liveClasses);
      setCourses(coursesRes.data.data.courses);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (liveClass = null) => {
    if (liveClass) {
      setEditingClass(liveClass);
      const date = new Date(liveClass.scheduledDate);
      const formattedDate = date.toISOString().slice(0, 16);
      setFormData({
        courseId: liveClass.courseId._id,
        title: liveClass.title,
        description: liveClass.description,
        instructor: liveClass.instructor,
        scheduledDate: formattedDate,
        duration: liveClass.duration,
        meetingLink: liveClass.meetingLink || ''
      });
    } else {
      setEditingClass(null);
      setFormData({
        courseId: '',
        title: '',
        description: '',
        instructor: '',
        scheduledDate: '',
        duration: 60,
        meetingLink: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClass(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const classData = {
        ...formData,
        duration: Number(formData.duration)
      };

      if (editingClass) {
        await adminAPI.updateLiveClass(editingClass._id, classData);
        toast.success('Live class updated successfully');
      } else {
        await adminAPI.scheduleLiveClass(classData);
        toast.success('Live class scheduled successfully');
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving live class:', error);
      toast.error(error.response?.data?.message || 'Failed to save live class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this live class?')) return;

    try {
      await adminAPI.deleteLiveClass(id);
      toast.success('Live class deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete live class');
    }
  };

  const handleStartClass = async (id) => {
    try {
      const meetingLink = prompt('Enter meeting link (Zoom/Google Meet):');
      if (!meetingLink) return;

      await adminAPI.startLiveClass(id, { meetingLink });
      toast.success('Live class started');
      fetchData();
    } catch (error) {
      toast.error('Failed to start class');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
      </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Live Classes
          </h1>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus />
            <span>Schedule Class</span>
          </button>
        </div>

        {liveClasses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {liveClasses.map((liveClass) => (
              <div key={liveClass._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {liveClass.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {liveClass.courseId?.title || 'Course'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    liveClass.status === 'live'
                      ? 'bg-red-100 text-red-600'
                      : liveClass.status === 'completed'
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {liveClass.status}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {liveClass.description}
                </p>

                <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>Instructor: {liveClass.instructor}</p>
                  <p>Date: {formatDateTime(liveClass.scheduledDate)}</p>
                  <p>Duration: {liveClass.duration} minutes</p>
                  <p>Attendees: {liveClass.attendees?.length || 0}</p>
                </div>

                <div className="flex space-x-2">
                  {liveClass.status === 'scheduled' && (
                    <button 
                      onClick={() => handleStartClass(liveClass._id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      <FiVideo className="inline mr-1" />
                      Start Class
                    </button>
                  )}
                  <button 
                    onClick={() => handleOpenModal(liveClass)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    <FiEdit className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(liveClass._id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No live classes scheduled</p>
            <button 
              onClick={() => handleOpenModal()}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <FiPlus />
              <span>Schedule First Class</span>
            </button>
          </div>
        )}

        {/* Schedule/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingClass ? 'Edit Live Class' : 'Schedule Live Class'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Course *
                  </label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g., Accounting Fundamentals - Live Session"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="input-field"
                    placeholder="What will be covered in this session..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instructor Name *
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g., CA Rajesh Kumar"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Scheduled Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      min="15"
                      className="input-field"
                      placeholder="60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="meetingLink"
                    value={formData.meetingLink}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://zoom.us/j/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can add this later when starting the class
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? 'Saving...' : editingClass ? 'Update Class' : 'Schedule Class'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default LiveClasses;
