import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateTechnology() {
  const [technologyName, setTechnologyName] = useState(''); // State to hold selected technology name
  const [error, setError] = useState(''); // State to manage error messages
  const [showMessageBox, setShowMessageBox] = useState(false); // State to control message box visibility
  const [technologies, setTechnologies] = useState([]); // State to store fetched technologies from backend
  const [newTechnologyName, setNewTechnologyName] = useState(''); // State to hold the new technology name
  const [successMessage, setSuccessMessage] = useState(''); // State to manage success message

  useEffect(() => {
    // Fetch technology names from the backend upon component mount
    axios.get('http://localhost:3002/api/technology')
      .then(response => {
        setTechnologies(response.data); // Set technologies state with fetched data
      })
      .catch(error => {
        console.error('Error fetching technologies:', error);
        setError('Failed to fetch technologies. Please try again later.');
      });
  }, []);

  const resetForm = () => {
    setTechnologyName(''); // Reset selected technology name
    setError(''); // Clear any error messages
    setNewTechnologyName(''); // Reset new technology name
  };

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      // Prepare data to send to the backend
      const data = {
        NewTechnologyName: newTechnologyName,
        technologyName: technologyName // Corrected field name
      };

      // Send POST request to update technology
      const response = await axios.post('http://localhost:3002/technology/update-technology', data, {
        withCredentials: true, // Send credentials with the request if needed
        headers: {
          'Content-Type': 'application/json' // Set content type for JSON data
        }
      });

      // Handle response based on HTTP status
      if (response.status === 200) {
        setSuccessMessage('Technology updated successfully'); // Set success message
        resetForm(); // Reset the form after successful update
      } else {
        throw new Error('Data failed to save'); // Throw error if update fails
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors that occur
      setError('An error occurred while updating the technology.'); // Set error message for UI
      setShowMessageBox(true); // Show the message box
    }
  };

  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close the message box
    setError(''); // Clear the error message
  };

  const handleSelectChange = (e) => {
    const selectedTechnology = e.target.value; // Get selected technology name from dropdown
    setTechnologyName(selectedTechnology); // Set the selected technology name
    setNewTechnologyName(selectedTechnology); // Set the editable technology name to the selected value initially
  };

  return (
    <div className="update-technology-container">
      <div className="update-block">
        <h2>Update Technology</h2>
        <select
          style={{ height: '40px', marginTop: '3%', width: '95%' }}
          className='adminInput'
          value={technologyName}
          onChange={handleSelectChange}
        >
          <option value="">Select Technology</option>
          {technologies.map((technology, index) => (
            <option key={index} value={technology.technologyName}>
              {technology.technologyName}
            </option>
          ))}
        </select>
        <input
          className='adminInput'
          type="text"
          placeholder="New Technology Name"
          value={newTechnologyName}
          onChange={(e) => setNewTechnologyName(e.target.value)}
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

export default UpdateTechnology;
