
import React, { useState,useEffect } from 'react';
import './Admin.css';
import axios from 'axios';

function UpdateCommunity() {
  const [communityName, setCommunityName] = useState('');
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const [error, setError] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [key, setKey] = useState(0); // Key for resetting input field
  const [message, setMessage] = useState('');
  const [newcommunityName, setnewCommunityName] = useState('');
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
    setFile(null);
    setError('');
    setKey(prevKey => prevKey + 1); // Increment key to reset input field
    setnewCommunityName(''); // Reset editable community name
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('newcommunityName', newcommunityName);
      formData.append('communityName', communityName); // Assuming communityName is defined somewhere
      formData.append('communityPath', file); // Assuming file is defined somewhere
  
      const response = await axios.post('http://localhost:3002/Admin/update-community', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        alert('Updated successful');
        setTimeout(() => {
            setMessage('');
        }, 1000);
      } else {
        throw new Error('Data failed to save');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while updating the community.');
    }
  };
  

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid image file (JPEG, JPG, or PNG).');
    }
  };

  const handleMessageBoxOK = () => {
    setShowMessageBox(false); // Close the message box
    setError(''); // Clear the error message
  };
  const handleSelectChange = (e) => {
    setCommunityName(e.target.value); // Set the selected community (unchangeable)
    setnewCommunityName(e.target.value); // Initially set the editable name to the selected value
  };

  return (
    <div className="update-community-container">
      <div className="update-block">
        <h2>Update Community</h2>
        
        <select
          style={{ height: '30px', marginTop: '3%',width: '80%' }}
          className='adminInput'
          value={communityName}
          onChange={handleSelectChange}
        >
          <option value="">Select Community</option>
          {communities.map((community, index) => (
             <option key={index} value={community.Communityname}>
             {community.Communityname}
         </option>
            
          ))}
        </select>
        <input
          className='adminInput'
          type="text"
          placeholder="Community Name"
          value={newcommunityName}
          onChange={(e) => setnewCommunityName(e.target.value)}
        />
        <input
          className='adminInput'
          key={key} // Key to reset input field
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileChange}
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
      {showMessageBox && (
        <div className="admin-message-box">
          <p className="message">{error}</p>
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )}
    </div>
  );
}

export default UpdateCommunity;