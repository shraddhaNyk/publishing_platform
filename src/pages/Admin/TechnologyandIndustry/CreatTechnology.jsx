import React, { useState } from 'react';
import axios from 'axios';

function CreateTechnology() {
  const [technologyName, setTechnologyName] = useState('');
  const [error, setError] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [key, setKey] = useState(0);
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setTechnologyName('');
    setError('');
    setKey(prevKey => prevKey + 1); // Increment key to reset input field
  };

  const handleSave = () => {
    console.log('Form Data:', technologyName);

    axios.post('http://localhost:3002/technology', { technologyName }, { withCredentials: true })
      .then(response => {
        console.log('Success:', response.data);
        if (response.status === 200) {
          alert('Upload successful'); // Show success message
          resetForm(); // Reset the form after successful save
        } else {
          setMessage('Data failed to save'); // Set message if save fails
          setShowMessageBox(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('An error occurred: ' + (error.response?.data || error.message)); // Show error message
        setShowMessageBox(true);
      });
  };

  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close message box
    setError(''); // Clear error message
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="create-technology-container">
      <div className="create-block">
        <h2>Create Technology</h2>
        {/* Input field for entering Technology name */}
        <input
          className='adminInput'
          type="text"
          placeholder="Technology Name"
          value={technologyName}
          onChange={(e) => setTechnologyName(e.target.value)} // Update TechnologyName state on change
        />
        {/* Buttons to Save and Cancel */}
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={handleSave}>Save</button>
          </div>
          <div className="cancel-btn">
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
      {/* Message box to display errors or success messages */}
      {showMessageBox && (
        <div className="admin-message-box">
          <p className="message">{message}</p>
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )}
    </div>
  );
}

export default CreateTechnology;
