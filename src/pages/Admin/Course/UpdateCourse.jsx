
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UpdateCourse = () => {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [duration, setDuration] = useState('');
//   const [image, setImage] = useState(null);
//   const [video, setVideo] = useState(null);
//   const [uploading, setUploading] = useState('idle'); // idle, uploading, uploaded
//   const [loggedInUserId, setLoggedInUserId] = useState('');
//   const [showConfirm, setShowConfirm] = useState(false); // State for confirmation dialog

//   useEffect(() => {
//     // Fetch logged-in user ID from server
//     axios.get('http://localhost:3002/getLoggedInUserId', { withCredentials: true })
//       .then(response => {
//         setLoggedInUserId(response.data.userid);
//         // Fetch courses by logged-in user ID
//         axios.get(`http://localhost:3001/courses/${response.data.userid}`)
//           .then(res => setCourses(res.data))
//           .catch(err => console.error("Failed to fetch courses", err));
//       })
//       .catch(err => {
//         console.error("Failed to fetch logged-in user ID", err);
//       });
//   }, []);

//   const handleCourseChange = (e) => {
//     const courseId = e.target.value;
//     const course = courses.find(c => c.course_id === parseInt(courseId));
//     setSelectedCourse(course);
//     setTitle(course.title);
//     setDescription(course.description);
//     setPrice(course.price);
//     setDuration(course.duration);
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleVideoChange = (e) => {
//     setVideo(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setShowConfirm(true); // Show confirmation dialog before submitting
//   };

//   const handleConfirmYes = async () => {
//     setShowConfirm(false); // Close confirmation dialog
//     setUploading('uploading');

//     if (!title || !description || !price || !duration || !selectedCourse) {
//       alert('Please fill in all required fields.');
//       setUploading('idle');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('description', description);
//       formData.append('price', price);
//       formData.append('duration', duration);
//       if (image) formData.append('image', image);
//       if (video) formData.append('video', video);

//       const res = await axios.put(`http://localhost:3001/courses/${selectedCourse.course_id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       console.log('Course updated successfully:', res.data);
//       setUploading('uploaded');

//       // Reset uploading state after 3 seconds
//       setTimeout(() => {
//         setUploading('idle');
//       }, 3000);
//     } catch (error) {
//       console.error('Error updating course:', error);
//       setUploading('idle');
//     }
//   };

//   const handleCancel = () => {
//     setShowConfirm(false); // Close confirmation dialog
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4">
//         <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Update Course</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700">Select Course:</label>
//             <select value={selectedCourse ? selectedCourse.course_id : ''} onChange={handleCourseChange} className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2" required>
//               <option value="">Select a course</option>
//               {courses.map(course => (
//                 <option key={course.course_id} value={course.course_id}>{course.title}</option>
//               ))}
//             </select>
//           </div>
//           {selectedCourse && (
//             <>
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Title:</label>
//                 <input 
//                   type="text" 
//                   value={title} 
//                   onChange={(e) => setTitle(e.target.value)} 
//                   className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
//                   required 
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Description:</label>
//                 <textarea 
//                   value={description} 
//                   onChange={(e) => setDescription(e.target.value)} 
//                   className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row md:space-x-4">
//                 <div className="flex flex-col md:flex-1">
//                   <label className="block text-sm font-medium text-gray-700">Price:</label>
//                   <input 
//                     type="text" 
//                     value={price} 
//                     onChange={(e) => setPrice(e.target.value)} 
//                     className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
//                     required 
//                   />
//                 </div>
//                 <div className="flex flex-col md:flex-1 mt-4 md:mt-0">
//                   <label className="block text-sm font-medium text-gray-700">Duration:</label>
//                   <input 
//                     type="text" 
//                     value={duration} 
//                     onChange={(e) => setDuration(e.target.value)} 
//                     className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
//                     required 
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col md:flex-row md:space-x-4">
//                 <div className="flex flex-col md:flex-1">
//                   <label className="block text-sm font-medium text-gray-700">Upload New Image (1280 X 766):</label>
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleImageChange} 
//                     className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
//                   />
//                 </div>
//                 <div className="flex flex-col md:flex-1 mt-4 md:mt-0">
//                   <label className="block text-sm font-medium text-gray-700">Upload New Video:</label>
//                   <input 
//                     type="file" 
//                     accept="video/*" 
//                     onChange={handleVideoChange} 
//                     className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
//                   />
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-6 shadow-md hover:bg-blue-600 transition-colors"
//                 disabled={uploading === 'uploading'}
//               >
//                 {uploading === 'uploading' ? 'Updating...' : 'Update Course'}
//               </button>
//               {uploading === 'uploaded' && (
//                 <p className="text-green-500 text-center mt-4">Course updated successfully!</p>
//               )}
//             </>
//           )}
//         </form>
//       </div>
      
//       {/* Confirmation Dialog */}
//       {showConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
//             <h2 className="text-xl font-semibold mb-4 text-center">Confirm Update</h2>
//             <p className="text-sm text-gray-700 mb-4">Are you sure you want to update this course?</p>
//             <div className="flex justify-center space-x-4">
//               <button 
//                 onClick={handleConfirmYes} 
//                 className="bg-blue-500 text-white py-2 px-6 rounded-md focus:outline-none hover:bg-blue-600 transition-colors"
//               >
//                 Yes
//               </button>
//               <button 
//                 onClick={handleCancel} 
//                 className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md focus:outline-none hover:bg-gray-400 transition-colors"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateCourse;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from 'antd'; // Import Switch component from Ant Design

const UpdateCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState('idle'); // idle, uploading, uploaded
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false); // State for confirmation dialog
  const [isPriceFree, setIsPriceFree] = useState(false); // State for switch

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
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setDuration(course.duration);
    setIsPriceFree(course.price === 0); // Initialize switch state based on course price
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirm(true); // Show confirmation dialog before submitting
  };

  const handleConfirmYes = async () => {
    setShowConfirm(false); // Close confirmation dialog
    setUploading('uploading');

    if (!title || !description || (!price && price !== 0) || !duration || !selectedCourse) {
      alert('Please fill in all required fields.');
      setUploading('idle');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', isPriceFree ? 0 : price);
      formData.append('duration', duration);
      if (image) formData.append('image', image);
      if (video) formData.append('video', video);

      const res = await axios.put(`http://localhost:3001/courses/${selectedCourse.course_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Course updated successfully:', res.data);
      setUploading('uploaded');

      // Reset uploading state after 3 seconds
      setTimeout(() => {
        setUploading('idle');
      }, 3000);
    } catch (error) {
      console.error('Error updating course:', error);
      setUploading('idle');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false); // Close confirmation dialog
  };

  return (
    <div className="min-h-60 flex items-center justify-center bg-transparent p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Update Course</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700">Select Course:</label>
            <select value={selectedCourse ? selectedCourse.course_id : ''} onChange={handleCourseChange} className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2" required>
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.course_id} value={course.course_id}>{course.title}</option>
              ))}
            </select>
          </div>
          {selectedCourse && (
            <>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Title:</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  required 
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                />
              </div>
              <div className="flex items-center">
              <Switch 
                    checked={isPriceFree} 
                    onChange={(checked) => {
                      setIsPriceFree(checked);
                      setPrice(checked ? 0 : selectedCourse.price);
                    }} 
                    className="mt-2"
                  />
                <label className="block text-sm font-medium text-gray-700 ml-4"> This is a Paid Course</label>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex flex-col md:flex-1">
                  <label className="block text-sm font-medium text-gray-700">Price:</label>
                  
                  <input 
                    type="text" 
                    value={isPriceFree ? 0 : price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                    disabled={isPriceFree}
                    required={!isPriceFree}
                  />
                </div>
                <div className="flex flex-col md:flex-1 mt-4 md:mt-0">
                  <label className="block text-sm font-medium text-gray-700">Duration:</label>
                  <input 
                    type="text" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                    required 
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex flex-col md:flex-1">
                  <label className="block text-sm font-medium text-gray-700">Upload New Image (1280 X 766):</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div>
                <div className="flex flex-col md:flex-1 mt-4 md:mt-0">
                  <label className="block text-sm font-medium text-gray-700">Upload New Video:</label>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleVideoChange} 
                    className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-6 shadow-md hover:bg-blue-600 transition-colors"
                disabled={uploading === 'uploading'}
              >
                {uploading === 'uploading' ? 'Updating...' : 'Update Course'}
              </button>
              {uploading === 'uploaded' && (
                <p className="text-green-500 text-center mt-4">Course updated successfully!</p>
              )}
            </>
          )}
        </form>
      </div>
      
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p>Are you sure you want to update this course?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmYes}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCourse;
