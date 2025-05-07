import React, { useState } from 'react';
 import './Admin.css';
import axios from 'axios';

function CreateInterest() {
  // State variables to manage form data, errors, message display, and key for resetting input fields
  const [interestName, setInterestName] = useState('');
  const [error, setError] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [key, setKey] = useState(0);
  const [message, setMessage] = useState('');

  // Function to reset form fields
  const resetForm = () => {
    setInterestName('');
    setError('');
    setKey(prevKey => prevKey + 1); // Increment key to reset input field
  };

  // Function to handle saving data to the backend
  const handleSave = () => {
    console.log('Form Data:', interestName);

    // Send POST request to backend to save interestName
    axios.post('http://localhost:3002/interst', { interestName }, { withCredentials: true })
      .then(response => {
        console.log('Success:', response.data);
        if (response.status === 200) {
          alert('Upload successful'); // Show success message
          setTimeout(() => {
            setMessage('');
          }, 1000); // Clear message after 1 second
        } else {
          setMessage('Data failed to save'); // Set message if save fails
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('An error occurred: ' + (error.response?.data || error.message)); // Show error message
      });
  };

  // Function to handle OK button click on message box
  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close message box
    setError(''); // Clear error message
  };

  // Function to handle Cancel button click, resetting form fields
  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="create-interest-container">
      <div className="create-block">
        <h2>Create Interest</h2>
        {/* Input field for entering interest name */}
        <input
          className='adminInput'
          type="text"
          placeholder="Interest Name"
          value={interestName}
          onChange={(e) => setInterestName(e.target.value)} // Update interestName state on change
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
          <p className="message">{error}</p>
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )}
    </div>
  );
}

export default CreateInterest;