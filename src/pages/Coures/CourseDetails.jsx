
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxText, setMessageBoxText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3002/getLoggedInUserId', { withCredentials: true })
      .then(response => {
        setLoggedInUserId(response.data.userid);
      })
      .catch(err => {
        console.error("Failed to fetch logged-in user ID", err);
      });
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      axios.get(`http://localhost:3001/course-details/${courseId}`)
        .then(response => {
          setCourse(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching course details:', error);
          setError('Failed to load course details');
          setLoading(false);
        });

      axios.get(`http://localhost:3001/check-enrollment/${courseId}/${loggedInUserId}`)
        .then(response => {
          setIsEnrolled(response.data.isEnrolled);
        })
        .catch(err => {
          console.error('Error checking enrollment:', err);
        });
    }
  }, [courseId, loggedInUserId]);

  const enrollCourse = () => {
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    const user_id = loggedInUserId;
    axios.post('http://localhost:3001/enroll-course', { user_id, course_id: courseId })
      .then(response => {
        setIsEnrolled(true); // Update frontend state on successful enrollment
        setShowConfirm(false); // Close confirmation dialog
        setMessageBoxText('Enrollment successful!');
        setShowMessageBox(true);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setMessageBoxText('You are already enrolled in this course.');
        } else {
          console.error('Error enrolling in course:', error);
          setMessageBoxText('Failed to enroll in course');
        }
        setShowConfirm(false); // Close confirmation dialog
        setShowMessageBox(true);
      });
  };

  const handleConfirmNo = () => {
    setShowConfirm(false); // Close confirmation dialog
  };

  const handleMessageBoxClose = () => {
    setShowMessageBox(false); // Close message box
  };

  if (loading) {
    return <div className="text-center text-xl py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-white rounded-lg shadow-lg">
      <div className="relative">
        <img 
          src={`http://localhost:3001${course.image_url}`} 
          alt={course.title} 
          className="w-full h-64 object-cover rounded-t-lg shadow-md mb-6"
        />
        <div className="absolute top-4 left-4 bg-yellow-400 px-3 py-1 rounded-md shadow-md text-gray-800 font-semibold">
          Duration {course.duration}
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">{course.title}</h2>
      <p className="text-lg text-gray-700 mb-4">{course.description}</p>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Created on: {new Date(course.created_at).toLocaleDateString()}</p>
        <p className="text-lg text-green-600 font-semibold">Price: ₹ {course.price}</p>
      </div>
      <p className="text-lg text-gray-700 mb-6">Instructor ID: {course.instructor_id}</p>
      <div className="flex justify-between">
        <button 
          onClick={() => navigate('/Course')} 
          className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 flex items-center justify-between transition-transform transform hover:scale-105">
          <FaArrowLeft className='mr-2'/>Back 
        </button>
        <button 
          onClick={enrollCourse} 
          disabled={isEnrolled} // Disable the button if already enrolled
          className={`bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center justify-between transition-transform transform hover:scale-105 ${isEnrolled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'}`}>
          {isEnrolled ? 'Enrolled' : 'Enroll'} <FaArrowRight className="ml-2" />
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Confirm Enrollment</h2>
            <p className="text-sm text-gray-700 mb-4 text-center">Are you sure you want to enroll in this course?</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleConfirmYes} 
                className="bg-blue-500 text-white py-2 px-6 rounded-md focus:outline-none hover:bg-blue-600 transition-colors"
              >
                Yes
              </button>
              <button 
                onClick={handleConfirmNo} 
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md focus:outline-none hover:bg-gray-400 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Box */}
      {showMessageBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Message</h2>
            <p className="text-sm text-gray-700 mb-4 text-center">{messageBoxText}</p>
            <div className="flex justify-center">
              <button 
                onClick={handleMessageBoxClose} 
                className="bg-blue-500 text-white py-2 px-6 rounded-md focus:outline-none hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
