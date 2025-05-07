
import React, { useState, useEffect,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Uploaditem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tagsRef = useRef(null);
  const durationRef = useRef(null);
  const descriptionRef = useRef(null);

  // Retrieve the topicName and topicFile from location state
  const {courseId,chapterName,title, topicName, topicFile } = location.state || {};

  const [fileType, setFileType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (topicFile) {
      setUploadedFile(topicFile);

      // Logic to determine the file type based on file extension
      const fileExtension = topicFile.name.split('.').pop();
      if (['mp4', 'mov'].includes(fileExtension)) setFileType('video');
      else if (fileExtension === 'pdf') setFileType('pdf');
      else if (['mp3', 'wav'].includes(fileExtension)) setFileType('audio');
      else setFileType('file');
    }
  }, [topicFile]);

  const handleSave = async () => {
    // Prepare the form data
    const formData = new FormData();
    formData.append('chapter_name', chapterName);
    formData.append('course_title', title);
    formData.append('topic_name', topicName);
    formData.append('tags', tagsRef.current.value);
    formData.append('duration', durationRef.current.value);
    formData.append('description', descriptionRef.current.value);
    
    try {
      // Post the form data to the backend
      await axios.post('http://localhost:3002/upload/topicdetails', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle success (e.g., redirect or show a success message)
      console.log('Upload successful');
      navigate('/CreateChapter', { state: { courseId } }); // Adjust the route as needed
    } catch (error) {
      // Handle error
      console.error('Error uploading file', error);
    }
  };

  const handleBack = () => {
    navigate('/CreateChapter', { state: { courseId } }); // Replace with the actual route to `CreateChapter.jsx`
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: 'auto' }}>
    <h2>Upload Item</h2>

    {topicName && (
      <div style={{ marginBottom: '1.5rem' }}>
        <strong>Topic Name:</strong> {topicName}
      </div>
    )}

    <div style={{ marginBottom: '1.5rem' }}>
      <label style={labelStyle}>Tags</label>
      <input type="text" placeholder="Tags comma separated" style={inputStyle} ref={tagsRef} />
    </div>
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={labelStyle}>Duration (in minutes)</label>
      <input type="number" placeholder="Duration" style={inputStyle} ref={durationRef} />
    </div>
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={labelStyle}>Description</label>
      <textarea placeholder="Enter description here..." rows="4" style={textareaStyle} ref={descriptionRef} />
    </div>
      {/* Display based on file type */}
      {uploadedFile && (
        <div style={{ marginTop: '2rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <strong>Uploaded File:</strong> {uploadedFile.name} {/* Display file name */}

          {fileType === 'video' && (
            <video controls style={{ width: '100%', borderRadius: '8px' }}>
              <source src={URL.createObjectURL(uploadedFile)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {fileType === 'pdf' && (
            <iframe
              src={URL.createObjectURL(uploadedFile)}
              width="100%"
              height="600px"
              style={{ border: 'none', borderRadius: '8px' }}
            />
          )}
          {fileType === 'audio' && (
            <audio controls style={{ width: '100%' }}>
              <source src={URL.createObjectURL(uploadedFile)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          {fileType === 'file' && (
            <div>
              {/* Display the file name without download link */}
              <p>No download option available for this file.</p>
            </div>
          )}
        </div>
      )}

      {/* Save and Back buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handleSave} style={buttonStyle}>Save</button>
        <button onClick={handleBack} style={buttonStyle}>Back</button>
      </div>
    </div>
  );
};

// Styles
const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const textareaStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
  resize: 'none'
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  color: '#fff',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Uploaditem;

