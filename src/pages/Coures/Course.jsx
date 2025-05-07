
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-dark-blue-900 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#282f59]">Courses</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {courses.map((course) => (
          <div 
            key={course.course_id} 
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => handleCourseClick(course.course_id)}
          >
            <img 
              src={`http://localhost:3001${course.image_url}`} 
              alt={course.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-2">Duration: {course.duration} hours</p>
              {/* <p className="text-sm text-gray-500 mb-2">Price: ₹{course.price}</p> */}
              <p className="text-sm text-gray-500 mb-2">Created on: {new Date(course.created_at).toLocaleDateString()}</p>
              <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded mt-2 flex items-center justify-between transition-transform transform hover:scale-105">
                View Course <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
