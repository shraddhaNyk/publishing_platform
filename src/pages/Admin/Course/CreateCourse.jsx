

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from 'antd';
import { useNavigate, useParams  } from 'react-router-dom';


const CourseUploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [finalPrice, setFinalPrice] = useState(0); // Initialize finalPrice to 0
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState('idle'); // idle, uploading, uploaded
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [isPaidCourse, setIsPaidCourse] = useState(false); // New state for paid course toggle
  const [error, setError] = useState('');
  const [learningPoints, setLearningPoints] = useState([]); // New state for learning points
const[courseId, setCourseId]=useState(null);


  const navigate = useNavigate();


  useEffect(() => {
    // Fetch logged-in user ID from server
    axios.get('http://localhost:3002/getLoggedInUserId', { withCredentials: true })
      .then(response => {
        setLoggedInUserId(response.data.userid);
      })
      .catch(err => {
        console.error("Failed to fetch logged-in user ID", err);
      });
  }, []);

  useEffect(() => {
    const calculateFinalPrice = () => {
      if (isPaidCourse && price && discount) {
        const calculatedFinalPrice = price - discount;
        setFinalPrice(calculatedFinalPrice);
        if (Number(discount) >= Number(price)) {
          setError('Discount price should be less than the actual price.');
        } else {
          setError('');
        }
      } else {
        setFinalPrice(0); // Set finalPrice to 0 if course is not paid
      }
    };
    calculateFinalPrice();
  }, [isPaidCourse, price, discount]);

  const handleImageChange = (e) => {
    // Get the first selected file (the uploaded image)
    const selectedImage = e.target.files[0];
  
    if (selectedImage) {
      // Define the allowed image types
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
      // Check if the selected file is of a valid image type
      if (!allowedTypes.includes(selectedImage.type)) {
        setError('Only JPG, JPEG, and PNG images are allowed.'); // Set error message for invalid file type
        setImage(null); // Clear any previously selected image
        document.getElementById('imageInput').value = ''; // Reset the file input field
        return; // Exit the function early since the file type is invalid
      }
  
      // Create an image object to check dimensions
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage); // Set the source of the image to the selected file
  
      // On image load, check its dimensions
      img.onload = () => {
        const { width, height } = img;
  
        // Check if the image has exactly 1920px width and 1080px height
        if (width !== 1920 || height !== 746) {
          setError('Image must be exactly 1920px * 746px.'); // Set error message for invalid dimensions
          setImage(null); // Clear the image if dimensions are incorrect
          document.getElementById('imageInput').value = ''; // Reset the file input field
        } else {
          setError(''); // Clear any previous errors
          setImage(selectedImage); // Set the valid image
        }
      };
    }
  };
  

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };





  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleSubmit = async () => {
    if (error) {
      // If there's an error (discount price >= actual price), do not proceed
      return;
    }
    setUploading('uploading');
    setShowConfirm(false);

    // Check required fields based on isPaidCourse state
  if (isPaidCourse) {
    if (!title || !description || !loggedInUserId || !price || !discount || !duration || !image || !video) {
      alert('Please fill in all required fields.');
      setUploading('idle');
      return;
    }
  } else {
    // If it's not a paid course, ensure title, description, duration, image, and video are filled
    if (!title || !description || !loggedInUserId || !duration || !image || !video) {
      alert('Please fill in all required fields.');
      setUploading('idle');
      return;
    }
  }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('instructor_id', loggedInUserId); // Use loggedInUserId as instructor_id
      formData.append('price', finalPrice); // Store final price
      formData.append('discount', discount);
      formData.append('duration', duration);
      formData.append('image', image);
      formData.append('video', video);
      formData.append('learningPoints', JSON.stringify(learningPoints)); // Store array as JSON
      const res = await axios.post('http://localhost:3001/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Course uploaded successfully:', res.data);
      setUploading('uploaded');
      const courseId=res.data.courseId;
      setCourseId(courseId);
      // Clear form fields after successful upload
      setTitle('');
      setDescription('');
      setPrice('');
      setDiscount('');
      setDuration('');
      setImage(null);
      setVideo(null);
      setLearningPoints([]); // Clear learning points
      // Reset file inputs
      document.getElementById('imageInput').value = '';
      document.getElementById('videoInput').value = '';

      // Reset uploading state after 3 seconds
      setTimeout(() => {
        setUploading('idle');
        navigate('/CreateChapter',{state:{courseId}});
      }, 3000);
    } catch (error) {
      console.error('Error uploading course:', error);
      setUploading('idle');
    }
  };


 // Update state handling to handle array
 const handleLearningPointsChange = (e) => {
  const value = e.target.value;
  const pointsArray = value.split('\n').filter(point => point.trim() !== '');
  setLearningPoints(pointsArray);
};



  return (
    <div className="min-h-auto flex items-center justify-center bg-transparent p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl transition-transform transform hover:scale-105">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg onClick={() => setError('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a.5.5 0 1 1-.707.707L10 10.707l-3.646 3.646a.5.5 0 1 1-.707-.707L9.293 10 5.646 6.354a.5.5 0 1 1 .707-.707L10 9.293l3.646-3.646a.5.5 0 0 1 .708.707L10.707 10l3.647 3.646z"/></svg>
            </span>
          </div>
        )}
        <div className="flex flex-col ">
          <label className="text-sm text-right font-medium text-gray-400">IJST ID: {loggedInUserId}</label>
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Create Course</h2>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="space-y-6">
          <div className="flex flex-col">
            {/* <label className="block text-sm font-medium text-gray-700">Title *</label> */}
            <input 
              type="text" 
              value={title}
              placeholder='Please Enter Title of the Course *' 
              onChange={(e) => setTitle(e.target.value)} 
              className="mt-0 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
              required 
            />
          </div>
          <div className="flex flex-col">
            {/* <label className="block text-sm font-medium text-gray-700">Description *</label> */}
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder='Please Enter Course Description *' 
              className="mt-0 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
            />
          </div>
          <div className="flex flex-col md:flex-1">
                  <textarea 
                     value={learningPoints.join('\n')} // Display as newline-separated text
                     onChange={handleLearningPointsChange} 
                    placeholder='Enter the bullet points which can be highlight for your course. students will buy your course based on how creative you are in explaining the containt of your course.please enter 1-5 words in one line. *' 
                    className="mt-0 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-5"
                    required 
                  />
            </div>
          
          <div className="flex items-center">
            <Switch
              checked={isPaidCourse} 
              onChange={checked => setIsPaidCourse(checked)} 
              size="small" 
            />
            <label className="block text-sm font-medium text-gray-700 ml-4"> This is a Paid Course</label>
          </div>
          {isPaidCourse && (
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex flex-col md:flex-1">
                <label className="block text-sm font-medium text-gray-700">Price *</label>
                <div className="flex items-center">
                  <div className="px-3">₹</div>
                  <input 
                    type="number" 
                    value={price} 
                    placeholder='Enter price' 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                    required 
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-1">
                <label className="block text-sm font-medium text-gray-700">Discount *</label>
                <div className="flex items-center">
                  <div className="px-3">₹</div>
                  <input 
                    type="number" 
                    value={discount}
                    placeholder='Enter discount' 
                    onChange={(e) => setDiscount(e.target.value)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                    required 
                  />
                </div>
              </div>
            </div>
          )}
            <div className=" flex items-start gap-2 bg-slateLight">
                <p className="text-darkSlate01 text-body font-normal">If you have added discounts, Final payable price by learners is : ₹{finalPrice}</p>
           </div>
          <div className="flex flex-col md:flex-1">
            <label className="block text-sm font-medium text-gray-700">Duration *</label>
            <input 
              type="time" 
              value={duration}
              placeholder='e.g. hrs' 
              onChange={(e) => setDuration(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
              required 
            />
          </div>
          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Thumbnail Image must be of Size(1920px*746px)*</label>
              <input 
                type="file" 
                id="imageInput" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Video *</label>
              <input 
                type="file" 
                id="videoInput" 
                accept="video/*" 
                onChange={handleVideoChange} 
                className="mt-6 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                required 
              />
            </div>
          </div>
          <div>
            <button 
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${uploading === 'uploading' ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-green-500 focus:border-green-500'}`}
              disabled={uploading === 'uploading'}
            >
              {uploading === 'uploading' ? 'Creating...' :'Create Course'}
            </button>
            {uploading === 'uploaded' && (
                <p className="text-green-500 text-center mt-4">Course Created successfully!</p>
              )}
          </div>
          {showConfirm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">Are you sure you want to upload this course?</p>
                <div className="flex justify-end">
                  <button 
                    onClick={handleCancel} 
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CourseUploadForm;
