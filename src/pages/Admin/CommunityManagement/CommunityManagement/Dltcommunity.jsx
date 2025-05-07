import React, { useState,useEffect } from 'react';
import './Admin.css';
import axios from 'axios';

function DeleteCommunity() {
  const [communityName, setCommunityName] = useState('');
  const [error, setError] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);

  const [communities, setCommunities] = useState([]);

  useEffect(() => {
      // Fetch community names from the backend
      axios.get('http://localhost:3002/api/communities')
          .then(response => {
              setCommunities(response.data);
          })
          .catch(error => {
              console.error('There was an error fetching the communities!', error);
              setError('Failed to fetch communities. Please try again later.');
          });
  }, []);

  const resetForm = () => {
    setCommunityName('');
    setError('');
  };
  const handleDeactivate = async (event) => {
    event.preventDefault();
    if (!communityName) {
      setError('Please select a community to deactivate.');
      setShowMessageBox(true);
      return;
    }
  
    try {
      // Get authentication token from wherever it's stored (e.g., localStorage)
      const authToken = localStorage.getItem('authToken');
  
      const response = await axios.post(
        'http://localhost:3002/Admin/deactivate-community',
        { communityName, status: 'deactivated' }, // Send the communityName and status
        {
          headers: {
            Authorization: `Bearer ${authToken}` // Include the token in the request headers
          }
        }
      );
  
      alert('Community deactivated successfully.');
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while deactivating the community.');
      setShowMessageBox(true);
    }
  };


  const handleDelete = async (event) => {
    event.preventDefault();

    if (!communityName) {
      setError('Please select a community to delete.');
      setShowMessageBox(true);
      return;
    }

    try {
      // Get authentication token from wherever it's stored (e.g., localStorage)
      const authToken = localStorage.getItem('authToken');

      const response = await axios.post(
        'http://localhost:3002/Admin/delete-community',
        { communityName },
        {
          headers: {
            Authorization: `Bearer ${authToken}` // Include the token in the request headers
          }
        }
      );

      alert('Community deleted successfully.');
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while deleting the community.');
      setShowMessageBox(true);
    }
};


  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close the message box
    setError(''); // Clear the error message
  };

  return (
    <div className="delete-community-container">
      <div className="delete-block">
        <h2>Delete Community</h2>
        <select
        style={{ height: '35px',marginTop: '3%',marginBottom:'3%',width:'95%'}}
          className='adminInput'
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
        >
          <option value="">Select Community</option>
          {communities.map((community, index) => (
            <option key={index} value={community.Communityname}>
            {community.Communityname}
        </option>
            // <option key={index} value={community}>{community}</option>
          ))}
        </select>
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleDeactivate}>Deactivate User</button>
          </div>
          <div className="cancel-btn">
            <button onClick={resetForm}>Cancel</button>
          </div>
        </div>
      </div>
      {showMessageBox && (
        <div className="admin-message-box">
          <p className="message">{error}</p>
         
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )}
    </div>
  );
}

export default DeleteCommunity;
