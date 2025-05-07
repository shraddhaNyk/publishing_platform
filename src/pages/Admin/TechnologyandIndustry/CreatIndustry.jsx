import React, { useState } from 'react';
import axios from 'axios';

function CreateIndustry() {
  const [industryName, setIndustryName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);

  const resetForm = () => {
    setIndustryName('');
    setError('');
    setMessage('');
  };

  const handleSave = () => {
    if (!industryName) {
      setError('Industry Name is required.');
      setMessage(''); // Clear any previous success message
      setShowMessageBox(true);
      return;
    }

    axios.post('http://localhost:3002/industry', { industryName }, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          alert('Upload successful'); // Show success message
          setError(''); // Clear any previous error
        } else {
          setMessage('Failed to add industry.');
          setError(''); // Clear any previous error
        }
        setShowMessageBox(true); // Show the message box
        resetForm(); // Reset form fields after saving
      })
      .catch(error => {
        setError('An error occurred: ' + (error.response?.data || error.message));
        setMessage(''); // Clear any previous success message
        setShowMessageBox(true); // Show the message box
      });
  };

  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close the message box
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="create-industry-container">
      <div className="create-block">
        <h2>Create Industry</h2>
        <input
          className='adminInput'
          type="text"
          placeholder="Industry Name"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
        />
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={handleSave}>Save</button>
          </div>
          <div className="cancel-btn">
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
      {/* {showMessageBox && (
        <div className="admin-message-box">
         
          <p className="message">{error || message}</p>
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )} */}
    </div>
  );
}

export default CreateIndustry;
