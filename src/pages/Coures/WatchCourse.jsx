

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

const WatchCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [activeTab, setActiveTab] = useState('Discussions');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  const [title, setTitle] = useState(''); // To manage the course title
  const [coverImage, setCoverImage] = useState(''); // To manage the course cover image
  const [chapters, setChapters] = useState([]); // To manage the list of chapters
  const [currentFile, setCurrentFile] = useState('');
  const [currentFileType, setCurrentFileType] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
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
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      axios.get(`http://localhost:3001/course/${courseId}/comments`)
        .then(response => setComments(response.data))
        .catch(error => console.error('Error fetching comments:', error));
    }
  }, [courseId]);


  useEffect(() => {
    if (courseId) {
      fetchCourseData(courseId);
    }
  }, [courseId]);

  const fetchCourseData = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:3001/course-data/${courseId}`);
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
  
  


  const handleAddComment = () => {
    if (comment.trim()) {
      axios.post(`http://localhost:3001/course/${courseId}/comment`, { comment })
        .then(response => {
          setComments([...comments, response.data]);
          setComment('');
        })
        .catch(error => console.error('Error adding comment:', error));
    }
  };

  const handleDeleteComment = (id) => {
    axios.delete(`http://localhost:3001/course/${courseId}/comment/${id}`)
      .then(() => {
        setComments(comments.filter(comment => comment.id !== id));
      })
      .catch(error => console.error('Error deleting comment:', error));
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText({ ...replyText, [commentId]: text });
  };

  const handleAddReply = (commentId) => {
    if (replyText[commentId]?.trim()) {
      axios.post(`http://localhost:3001/course/${courseId}/comment/${commentId}/reply`, { reply: replyText[commentId] })
        .then(response => {
          const updatedComments = comments.map(comment =>
            comment.id === commentId
              ? { ...comment, replies: [...comment.replies, response.data] }
              : comment
          );
          setComments(updatedComments);
          setReplyText({ ...replyText, [commentId]: '' });
        })
        .catch(error => console.error('Error adding reply:', error));
    }
  };

  const handleRateCourse = (newRating) => {
    if (newRating !== rating) {
      setRating(newRating);
      axios.post(`http://localhost:3001/course/${courseId}/rate`, { rating: newRating })
        .catch(error => console.error('Error updating rating:', error));
    }
  };

  const handleLikeCourse = () => {
    axios.post(`http://localhost:3001/course/${courseId}/like`)
      .then(response => {
        // Optionally handle success (e.g., show a success message or update the UI)
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error liking course:', error);
      });
};


  const handleSendSupport = () => {
    if (supportSubject && supportMessage && course) {
      axios.post(`http://localhost:3001/course/${courseId}/support`, {
        subject: supportSubject,
        message: supportMessage,
        instructor_id: course.instructor_id,
        title: course.title
      })
        .then(() => {
          setSupportSubject('');
          setSupportMessage('');
        })
        .catch(error => console.error('Error sending support message:', error));
    } else {
      console.error('Support subject, message, or course details are missing.');
    }
  };

  if (loading) {
    return <div className="text-center text-xl py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl py-8 text-red-500">{error}</div>;
  }



  const handleTopicClick = (file, type) => {
    console.log("pdf",file);
    setCurrentFile(file);
    setCurrentFileType(type);
  };
  


  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
      <div className="flex justify-between mb-8">
        <button 
          onClick={() => navigate('/MyCourses')} 
          className="bg-gray-600 text-white px-5 py-1 rounded-lg shadow-md hover:bg-gray-700 flex items-center transition-transform transform hover:scale-105">
          <FaArrowLeft className='mr-2'/>Back 
        </button>
      </div>

      <div style={{ display: 'flex' }}>
     

<div style={{ width: '25%', paddingRight: '16px', borderRight: '1px solid #ccc' }}>
  <h3 className="text-xl font-semibold mb-4">Chapters</h3>
  <ul style={{ listStyle: 'decimal', paddingLeft: '20px', lineHeight: '2' }}>
    {chapters.length > 0 ? (
      chapters.map((chapter, index) => (
        <li key={index}>
          <strong> {chapter.name}</strong> {/* Display chapter number */}
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}> {/* Bullet points for topics */}
            {chapter.topics.map((topic, i) => (
              // <li key={i}>{topic.name}</li> 
              <li key={i} onClick={() => handleTopicClick(topic.file, topic.type)} style={{ cursor: 'pointer', color: 'blue' }}>
              {topic.name}
            </li>
            ))}
          </ul>
        </li>
      ))
    ) : (
      <li>No chapters available</li>
    )}
  </ul>
</div>

<div style={{ width: '75%', paddingLeft: '16px' }}>
<div className="relative mb-5">
{currentFile ? (
            <>
              {currentFileType === 'video' && (
                <video controls className="w-full h-80 rounded-t-lg shadow-md" controlsList="nodownload">
                  <source src={`http://localhost:3001${currentFile}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {currentFileType === 'audio' && (
                <audio controls className="w-full h-20 rounded-t-lg shadow-md" controlsList="nodownload">
                  <source src={`http://localhost:3001${currentFile}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {currentFileType === 'pdf' && (
                <object data={`http://localhost:3001${currentFile}`} type="application/pdf" className="w-full h-96 rounded-t-lg shadow-md">
                  <p>Your browser does not support PDFs. <a href={`http://localhost:3001${currentFile}`} target="_blank" rel="noopener noreferrer">Download the PDF</a>.</p>
                </object>
              )}
            </>
          ) : (
            <video controls className="w-full h-80 rounded-t-lg shadow-md" controlsList="nodownload">
              <source src={`http://localhost:3001${course.video_url}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="absolute top-4 left-4 bg-yellow-400 px-3 py-1 rounded-md shadow-md text-gray-800 font-semibold">
            Duration {course.duration}
          </div>
          </div> 

          <h2 className="text-2xl font-bold mb-2 text-gray-900">{course.title}</h2>
          <p className="text-lg text-gray-700 mb-2">{course.description}</p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Created on: {new Date(course.created_at).toLocaleDateString()}</p>
          </div>
          <p className="text-lg text-gray-700 mb-4">Instructor ID: {course.instructor_id}</p>
          <div className="mb-6">
            
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
</div>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #ddd' }}></div>

          <div style={{ display: 'flex', marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            {['Discussions', 'Q&A', 'Support'].map((tab) => (
              <div
                key={tab}
                style={{
                  padding: '16px', cursor: 'pointer',background: activeTab === tab ? 'linear-gradient(135deg, #007bff, #00d4ff)' : '#f5f5f5',
                  color: activeTab === tab ? '#ffffff' : '#555',fontWeight: activeTab === tab ? '700' : '500',flex: 1,textAlign: 'center',transition: 'all 0.4s ease',
                  borderBottom: activeTab === tab ? 'none' : '3px solid #ddd',
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)' }}>
            {activeTab === 'Discussions' && (
              <>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>Discussions</h3>
                <button
                onClick={handleLikeCourse} 
                 style={{
                  width: '100%',padding: '14px', borderRadius: '6px',backgroundColor: '#007bff',
                  color: 'white',border: 'none',cursor: 'pointer',marginBottom: '16px',
                  fontSize: '18px', fontWeight: '600',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',transition: 'background-color 0.3s ease',
                }}>
                  👍 Like
                </button>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <span style={{
                    position: 'absolute',left: '12px',top: '50%',transform: 'translateY(-50%)',fontSize: '20px',
                  }}>💬</span>
                  <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <button
                  onClick={handleAddComment}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                >
                  Add Comment
                </button>
              </div>
                <div style={{ marginTop: '16px' }}>
                  {comments.map((comment) => (
                    <div key={comment.id} style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{comment.text}</div>
                      <button onClick={() => handleDeleteComment(comment.id)} style={{ marginRight: '8px' }}>Delete</button>
                      <input
                        type="text"
                        placeholder="Reply"
                        value={replyText[comment.id] || ''}
                        onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                        style={{ marginRight: '8px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                      <button onClick={() => handleAddReply(comment.id)}>Reply</button>
                      {comment.replies && comment.replies.length > 0 && (
                        <div style={{ marginTop: '12px', paddingLeft: '20px' }}>
                          {comment.replies.map(reply => (
                            <div key={reply.id} style={{ padding: '8px', backgroundColor: '#e9e9e9', borderRadius: '6px', marginBottom: '8px' }}>
                              {reply.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            
    {activeTab === 'Q&A' && (
      <>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Q&A</h3>
        <input type="text" placeholder="Ask a question" style={{
          width: '100%',padding: '14px',borderRadius: '6px', border: '1px solid #ddd',fontSize: '16px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }} />
      </>
    )}

    {activeTab === 'Support' && (
      <>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Support</h3>
        <input
                  type="text"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
        <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Message"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
      <button
                  onClick={handleSendSupport}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                >
                  Send
                </button>
        </>
    )}
  </div>
           
          </div>
        </div>
      </div>
 
  );
};

export default WatchCourse;



