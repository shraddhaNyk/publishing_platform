


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false); // State for confirmation dialog
  const [deleting, setDeleting] = useState('idle'); // idle, deleting, deleted

  useEffect(() => {
    // Fetch logged-in user ID from server
    axios.get('http://localhost:3002/getLoggedInUserId', { withCredentials: true })
      .then(response => {
        setLoggedInUserId(response.data.userid);
        // Fetch courses by logged-in user ID
        axios.get(`http://localhost:3001/courses/${response.data.userid}`)
          .then(res => setCourses(res.data))
          .catch(err => console.error("Failed to fetch courses", err));
      })
      .catch(err => {
        console.error("Failed to fetch logged-in user ID", err);
      });
  }, []);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const course = courses.find(c => c.course_id === parseInt(courseId));
    setSelectedCourse(course);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setShowConfirm(true); // Show confirmation dialog before deleting
  };

  const handleConfirmYes = async () => {
    setShowConfirm(false); // Close confirmation dialog
    setDeleting('deleting');

    if (!selectedCourse) {
      alert('Please select a course to delete.');
      setDeleting('idle');
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:3001/courses/${selectedCourse.course_id}/${loggedInUserId}`);

      console.log('Course deleted successfully:', res.data);
      setDeleting('deleted');

      // Reset deleting state after 3 seconds
      setTimeout(() => {
        setDeleting('idle');
        setCourses(courses.filter(course => course.course_id !== selectedCourse.course_id));
        setSelectedCourse(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting course:', error);
      setDeleting('idle');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false); // Close confirmation dialog
  };

  return (
    <div className="min-h-60 flex items-center justify-center bg-transparent p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Delete Course</h2>
        <form onSubmit={handleDelete} className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700">Select Course:</label>
            <select value={selectedCourse ? selectedCourse.course_id : ''} onChange={handleCourseChange} className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2" required>
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.course_id} value={course.course_id}>{course.title}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mt-6 shadow-md hover:bg-blue-700 focus:ring-green-500 focus:border-green-500 transition-colors"
            disabled={deleting === 'deleting'}
          >
            {deleting === 'deleting' ? 'Deleting...' : 'Delete Course'}
          </button>
          {deleting === 'deleted' && (
            <p className="text-green-500 text-center mt-4">Course deleted successfully!</p>
          )}
        </form>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete this course?</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleConfirmYes} 
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none hover:bg-gray-400 transition-colors"
              >
                Yes
              </button>
              <button 
                onClick={handleCancel} 
                className=" bg-red-500  text-white py-2 px-4 rounded-md focus:outline-none   hover:bg-red-600 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteCourse;
