
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Assuming topic data is passed via location state
  const { chapterName, topicName, title, courseId} = location.state || {};
  // const topicName = topic?.name || 'Default Title';

  const [isQuizSettingsOpen, setQuizSettingsOpen] = useState(true);
  const [isQuestionsOpen, setQuestionsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input
  const [fileName, setFileName] = useState(''); // State to store file name


  const handleBackClick = () => {
    navigate('/CreateChapter', { state: { courseId } });
  };

  const handleSaveClick = async () => {
    // Collect form data
    const tags = document.querySelector('input[placeholder="Comma separated for multiple tags"]').value;
    const timeLimit = document.querySelector('input[placeholder="20"]').value;
    const reTakeAttempts = document.querySelector('input[placeholder="Unlimited attempts"]').value;

    // Prepare form data
    const formData = new FormData();
    formData.append('chapter_name', chapterName);
    formData.append('course_title', title);
    formData.append('topic_name', topicName);
    formData.append('tags', tags);
    formData.append('duration', timeLimit);
    formData.append('no_retake', reTakeAttempts);
    if (file) {
      formData.append('file', file);
    }

    try {
      // Post form data to the backend
      await axios.post('http://localhost:3002/upload/quiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful upload
      alert('Data saved successfully!');
      navigate('/CreateChapter', { state: { courseId } }); // Navigate back or to another page
    } catch (error) {
      // Handle errors
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Update the file name state
    } else {
      console.error('No file selected.');
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>{topicName}</div>
      <div style={sectionStyle}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setQuizSettingsOpen(!isQuizSettingsOpen)}
        >
          <span>Quiz Settings {isQuizSettingsOpen ? '▲' : '▼'}</span>
        </div>
        {isQuizSettingsOpen && (
          <div style={sectionBodyStyle}>
            <label style={labelStyle}>Tags</label>
            <input type="text" placeholder="Comma separated for multiple tags" style={inputStyle} />

            <label style={labelStyle}>Time Limit (in minutes)</label>
            <input type="number" placeholder="20" style={inputStyle} />

            <label style={labelStyle}>Number of Re-take Attempts</label>
            <input type="number" placeholder="Unlimited attempts" style={inputStyle} />
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setQuestionsOpen(!isQuestionsOpen)}
        >
          <span>Questions ({isQuestionsOpen ? '▲' : '▼'})</span>
        </div>
        {isQuestionsOpen && (
          <div style={sectionBodyStyle}>
            <div style={questionControlsStyle}>
              <input
                type="file"
                ref={fileInputRef} // Set ref to the file input
                onChange={handleFileChange}
                style={fileInputStyle}
              />
              <button style={actionButtonStyle} onClick={handleUploadClick}>
                Upload
              </button>
              {fileName && (
                <div style={fileNameStyle}>{fileName}</div> // Display file name
              )}
            </div>
          </div>
        )}
      </div>

      <div style={buttonContainerStyle}>
        <button style={actionButtonStyle} onClick={handleBackClick}>Back</button>
        <button style={actionButtonStyle} onClick={handleSaveClick}>Save</button>
      </div>
    </div>
  );
};

// Inline styles (unchanged)
const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  width: '600px',
  margin: '0 auto', // Center the container horizontally
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center', // Center the content
};

const headerStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const sectionStyle = {
  marginBottom: '30px',
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '15px',
  cursor: 'pointer',
};

const sectionBodyStyle = {
  padding: '15px 0',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  fontSize: '14px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
};

const questionControlsStyle = {
  display: 'flex',
  gap: '10px',
};

const fileInputStyle = {
  display: 'none', // Hide the file input button
};

const actionButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
};

const fileNameStyle = {
  marginLeft: '10px',
  fontSize: '14px',
  fontStyle: 'italic',
  color: '#555',
};

export default Test;
