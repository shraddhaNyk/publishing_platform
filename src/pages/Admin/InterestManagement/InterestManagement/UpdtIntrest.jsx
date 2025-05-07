import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';

function UpdateInterest() {
  const [interestName, setInterestName] = useState(''); // State to hold selected interest name
  const [error, setError] = useState(''); // State to manage error messages
  const [showMessageBox, setShowMessageBox] = useState(false); // State to control message box visibility
  const [interests, setInterests] = useState([]); // State to store fetched interests from backend
  const [newInterestName, setNewInterestName] = useState(''); // State to hold the new interest name
  const [successMessage, setSuccessMessage] = useState(''); // State to manage success message

  useEffect(() => {
    // Fetch interest names from the backend upon component mount
    axios.get('http://localhost:3002/api/interest')
      .then(response => {
        setInterests(response.data); // Set interests state with fetched data
      })
      .catch(error => {
        console.error('Error fetching interests:', error);
        setError('Failed to fetch interests. Please try again later.');
      });
  }, []);

  const resetForm = () => {
    setInterestName(''); // Reset selected interest name
    setError(''); // Clear any error messages
    setNewInterestName(''); // Reset new interest name
  };

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      // Prepare data to send to the backend
      const data = {
        NewInterestName: newInterestName,
        Insertname: interestName
      };

      // Send POST request to update interest
      const response = await axios.post('http://localhost:3002/interst/update-interst', data, {
        withCredentials: true, // Send credentials with the request if needed
        headers: {
          'Content-Type': 'application/json' // Set content type for JSON data
        }
      });

      // Handle response based on HTTP status
      if (response.status === 200) {
        setSuccessMessage('Interest updated successfully'); // Set success message
        resetForm(); // Reset the form after successful update
      } else {
        throw new Error('Data failed to save'); // Throw error if update fails
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors that occur
      setError('An error occurred while updating the interest.'); // Set error message for UI
      setShowMessageBox(true); // Show the message box
    }
  };

  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close the message box
    setError(''); // Clear the error message
  };

  const handleSelectChange = (e) => {
    const selectedInterest = e.target.value; // Get selected interest name from dropdown
    setInterestName(selectedInterest); // Set the selected interest name
    setNewInterestName(selectedInterest); // Set the editable interest name to the selected value initially
  };

  return (
    <div className="update-interest-container">
      <div className="update-block">
        <h2>Update Interest</h2>
        <select
          style={{ height: '40px', marginTop: '3%',width: '95%' }}
          className='adminInput'
          value={interestName}
          onChange={handleSelectChange}
        >
          <option value="">Select Interest</option>
          {interests.map((interest, index) => (
            <option key={index} value={interest.Insertname}>
              {interest.Insertname}
            </option>
          ))}
        </select>
        <input
          className='adminInput'
          type="text"
          placeholder="New Interest Name"
          value={newInterestName}
          onChange={(e) => setNewInterestName(e.target.value)}
        />
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={handleSave}>Update</button>
          </div>
          <div className="cancel-btn">
            <button onClick={resetForm}>Cancel</button>
          </div>
        </div>
      </div>
      {successMessage && (
        <div className="admin-message-box">
          <p className="message">{successMessage}</p>
          <button className="ok-btn" onClick={() => setSuccessMessage('')}>OK</button>
        </div>
      )}
       {showMessageBox && (
        <div className="admin-message-box">
          <p className="message">{error}</p>
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )}
    </div>
  );
}

export default UpdateInterest;