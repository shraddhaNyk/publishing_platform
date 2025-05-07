import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateIndustry() {
  const [industryName, setIndustryName] = useState(''); // State to hold selected industry name
  const [error, setError] = useState(''); // State to manage error messages
  const [showMessageBox, setShowMessageBox] = useState(false); // State to control message box visibility
  const [industries, setIndustries] = useState([]); // State to store fetched industries from backend
  const [newIndustryName, setNewIndustryName] = useState(''); // State to hold the new industry name
  const [successMessage, setSuccessMessage] = useState(''); // State to manage success message

  useEffect(() => {
    // Fetch industry names from the backend upon component mount
    axios.get('http://localhost:3002/api/industry')
      .then(response => {
        setIndustries(response.data); // Set industries state with fetched data
      })
      .catch(error => {
        console.error('Error fetching industries:', error);
        setError('Failed to fetch industries. Please try again later.');
      });
  }, []);

  const resetForm = () => {
    setIndustryName(''); // Reset selected industry name
    setError(''); // Clear any error messages
    setNewIndustryName(''); // Reset new industry name
  };

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      // Prepare data to send to the backend
      const data = {
        NewIndustryName: newIndustryName,
        industryName: industryName
      };

      // Send POST request to update industry
      const response = await axios.post('http://localhost:3002/industry/update-industry', data, {
        withCredentials: true, // Send credentials with the request if needed
        headers: {
          'Content-Type': 'application/json' // Set content type for JSON data
        }
      });

      // Handle response based on HTTP status
      if (response.status === 200) {
        setSuccessMessage('Industry updated successfully'); // Set success message
        resetForm(); // Reset the form after successful update
      } else {
        throw new Error('Data failed to save'); // Throw error if update fails
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors that occur
      setError('An error occurred while updating the industry.'); // Set error message for UI
      setShowMessageBox(true); // Show the message box
    }
  };

  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close the message box
    setError(''); // Clear the error message
  };

  const handleSelectChange = (e) => {
    const selectedIndustry = e.target.value; // Get selected industry name from dropdown
    setIndustryName(selectedIndustry); // Set the selected industry name
    setNewIndustryName(selectedIndustry); // Set the editable industry name to the selected value initially
  };

  return (
    <div className="update-industry-container">
      <div className="update-block">
        <h2>Update Industry</h2>
        <select
          style={{ height: '40px', marginTop: '3%', width: '95%' }}
          className='adminInput'
          value={industryName}
          onChange={handleSelectChange}
        >
          <option value="">Select Industry</option>
          {industries.map((industry, index) => (
            <option key={index} value={industry.industryName}>
              {industry.industryName}
            </option>
          ))}
        </select>
        <input
          className='adminInput'
          type="text"
          placeholder="New Industry Name"
          value={newIndustryName}
          onChange={(e) => setNewIndustryName(e.target.value)}
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

export default UpdateIndustry;
