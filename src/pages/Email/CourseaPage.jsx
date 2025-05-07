

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseTitle } = useParams();
  const [course, setCourse] = useState({
    lectures: [], // Initialize as an empty array
    learning_points: "", // Initialize as an empty string
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { courseId } = useParams();

  const [title, setTitle] = useState(''); // To manage the course title
  const [coverImage, setCoverImage] = useState(''); // To manage the course cover image
  const [chapters, setChapters] = useState([]); // To manage the list of chapters
  const [error, setError] = useState(null);

  // Fetch course details
  useEffect(() => {
    axios.get(`http://localhost:3001/coursePage/${encodeURIComponent(courseTitle)}`)
      .then(response => {
        setCourse(response.data);
        setSelectedCourses([response.data]); // Initialize selectedCourses with the fetched course
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
        setLoading(false);
      });
  }, [courseTitle]);

  // Fetch related courses
  useEffect(() => {
    if (course && course.course_id) {
      axios.get(`http://localhost:3001/api/courses/related/${course.course_id}`)
        .then(response => {
          setRelatedCourses(Array.isArray(response.data) ? response.data : []);
        })
        .catch(error => {
          console.error('Error fetching related courses:', error);
          setRelatedCourses([]); // Set to empty array on error
        });
    }
  }, [course]);




  useEffect(() => {
    if (courseTitle) {
      fetchCourseData(courseTitle);
    }
  }, [courseTitle]);

  const fetchCourseData = async (courseTitle) => {
    try {
      const response = await axios.get(`http://localhost:3001/emailcourse-data/${courseTitle}`);
      const data = response.data;
  
      setTitle(data.title || '');
      setCoverImage(data.image_url || '');
  
      const formattedChapters = Object.keys(data.chapters || {}).map(chapterName => ({
        name: chapterName,
        topics: data.chapters[chapterName] || []
      }));
  
      setChapters(formattedChapters);
  
      console.log('Formatted Chapters:', formattedChapters);
    } catch (err) {
      setError('Error fetching course data');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

 
  const imageUrl = `http://localhost:3001${course.image_url}`;
  const videoUrl = `http://localhost:3001${course.video_url}`;

  const handleAddToCartClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGoToCartClick = () => {
    axios.post('http://localhost:3001/api/cart', selectedCourses)
      .then(response => {
        console.log('Courses added to cart:', response.data);
        setIsModalOpen(false);
        navigate('/ShoppingCart', { state: { cartItems: selectedCourses } });
      })
      .catch(error => {
        console.error('Error adding items to the cart:', error);
      });
  };

  const handleAddAllToCart = () => {
    const updatedCourses = [...selectedCourses];

    relatedCourses.forEach(course => {
      if (!selectedCourses.some(selected => selected.course_id === course.course_id)) {
        updatedCourses.push(course);
      }
    });

    setSelectedCourses(updatedCourses);
  };

  const handleClick = () => {
    setLiked(!liked);
  };

  const svgStyle = {
    transition: 'fill 0.3s',
    fill: liked ? 'red' : 'gray',
  };

  const handleRateCourse = (newRating) => {
    if (newRating !== rating) {
      setRating(newRating);
      axios.post(`http://localhost:3001/course/${courseId}/rate`, { rating: newRating })
        .catch(error => console.error('Error updating rating:', error));
    }
  };


  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '20vh', backgroundColor: '#f8f8f8', padding: '20px' }}>
      {/* Course Details and Pricing Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '1vh',
        backgroundColor: '#ffffff',
        maxWidth: '1500px',
        width: '100%',
        padding: '20px',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Course Details */}
        <div style={{ flex: 2, padding: '20px' }}>
          <h1 style={{ fontSize: '32px', margin: '10px 0', fontWeight: '700', color: '#f4f4f4' }}>{course.title}</h1>
          <p style={{ fontSize: '20px', color: '#f4f4f4' }}>{course.description}</p>
          <div style={{ margin: '15px 0', fontSize: '16px', color: '#f4f4f4' }}>
            {/* <span style={{ fontWeight: 'bold', color: '#ffb400' }}>{course.ratings}</span> ★ ★ ★ ★ ★ ({course.students}) */}
          </div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                onClick={() => handleRateCourse(index + 1)}
                onMouseEnter={() => setHover(index + 1)}
                onMouseLeave={() => setHover(0)}
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 ${index < (hover || rating) ? 'text-yellow-500' : 'text-gray-300'} cursor-pointer`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z"
                />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600">Rating: {rating} out of 5</p>
          <div style={{ fontSize: '14px', color: '#f4f4f4', marginBottom: '10px' }}>
            Created by <strong>{course.instructor_id}</strong>
          </div>
          <div style={{ fontSize: '14px', color: '#f4f4f4' }}>
            Last updated {new Date(course.created_at).toLocaleDateString()} · {course.language}
          </div>
        </div>

        {/* Course Pricing */}
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#2c2c2c', color: '#ffffff', height: '70vh' }}>
          {videoUrl && (
            <div style={{ marginTop: '10px' }}>
              <video width="100%" height="5vh" controlsList="nodownload" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div style={{ fontSize: '36px', marginBottom: '5px', marginTop: '1px' }}>₹{course.price}</div>
          <div style={{ fontSize: '16px', color: '#ff6347', marginTop: '5px', marginBottom: '5px' }}>
            ⏰Duration: {course.duration} hrs
          </div>
          {/* Buttons Container */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            {/* Add to Cart Button */}
            <button
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#6a0dad',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onClick={handleAddToCartClick}
            >
              Add to cart
            </button>

            {/* Heart Button */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                style={svgStyle}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', marginTop: '30px', maxWidth: '700px', width: '50%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '15px', color: '#333' }}>What you'll learn</h3>
        <ul style={{ paddingLeft: '20px', listStyleType: 'none', margin: 0 }}>
          {course.learning_points && typeof course.learning_points === 'string' && course.learning_points.split(',').map((point, index) => (
            <li key={index} style={{ position: 'relative', paddingLeft: '30px', fontSize: '18px', color: '#556', marginBottom: '10px' }}>
              <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '20px', color: '#CF55006' }}>
                ❖
              </span>
              {point.trim()}
            </li>
          ))}
        </ul>
      </div>

      {/* Course Content Section */}
      <div style={{ width: '25%', paddingRight: '16px', borderRight: '1px solid #ccc' }}>

 
</div>
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', marginTop: '30px', maxWidth: '900px', width: '80%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '15px', color: '#333' }}>Course content</h3>
        <ul style={{ listStyle: 'decimal', paddingLeft: '20px', lineHeight: '2' }}>
    {chapters.length > 0 ? (
      chapters.map((chapter, index) => (
        <li key={index}>
          <strong> {chapter.name}</strong> {/* Display chapter number */}
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}> {/* Bullet points for topics */}
            {chapter.topics.map((topic, i) => (
              <li key={i}>{topic.name}</li> 
            ))}
          </ul>
        </li>
      ))
    ) : (
      <li>No chapters available</li>
    )}
  </ul>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '600px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Added to Cart</h2>
              <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#555' }} onClick={closeModal}>
                ✖
              </button>
            </div>

            {/* Course Information */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <img src={imageUrl} alt="Course" style={{ width: '50px', borderRadius: '5px', marginRight: '15px' }} />
              <span style={{ fontSize: '18px', color: '#333' }}>{course.title}</span>
            </div>

            {/* Related Courses */}
            <h3 style={{ marginBottom: '15px', fontSize: '20px', fontWeight: '600' }}>Related Courses</h3>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              {Array.isArray(relatedCourses) && relatedCourses.map((item, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                  <img src={`http://localhost:3001${item.image_url}`} alt="Course" style={{ width: '50px', borderRadius: '5px', marginRight: '15px' }} />
                  <div>
                    <span style={{ fontSize: '16px', color: '#333' }}>{item.title}</span>
                    <div style={{ fontSize: '14px', color: '#555' }}>₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                Total: ₹{selectedCourses.reduce((total, item) => total + Number(item.price), 0)}
              </div>
              <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#ff6347', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleGoToCartClick}>
                Go to Cart
              </button>
              <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6a0dad', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleAddAllToCart}>
                Add All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
