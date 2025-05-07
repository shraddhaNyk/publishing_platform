
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState('');

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
      axios.get(`http://localhost:3001/enrolled-courses/${loggedInUserId}`)
        .then(response => {
          setCourses(response.data);
        })
        .catch(error => {
          console.error('Error fetching enrolled courses:', error);
        });
    }
  }, [loggedInUserId]);

  return (
    <div className="min-h-screen bg-dark-blue-900 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#282f59]">My Courses</h1>
      <div className=" mx-auto px-4">
        {courses.length > 0 ? (
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex min-h-48 transition-transform transform hover:scale-105"
              >
                <img
                  src={`http://localhost:3001${course.image_url}`}
                  alt={course.title}
                  className="w-2/4 h-auto object-cover"
                />
                <div className="w-2/3 p-4 flex flex-col justify-around">
                  <div>
                    <h2 className="text-2xl font-bold mb-7 text-gray-800">{course.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">Duration: {course.duration} hours</p>
                    <p className="text-sm text-gray-500 mb-0">Created on: {new Date(course.created_at).toLocaleDateString()}</p>
                  </div>
                  {/* <Link to={`/watch-course/`} className="text-blue-500 hover:text-blue-700 text-sm font-semibold">
                    Watch Course
                  </Link> */}
                  <Link to={`/watch-course/${course.course_id}`} className="text-blue-500 hover:text-blue-700 text-sm font-semibold">
                    Watch Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-base text-gray-500 mt-36">
              You have not enrolled in any courses. Please <Link to="/Course" className="text-blue-400 hover:text-blue-600">enroll in a course</Link>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
