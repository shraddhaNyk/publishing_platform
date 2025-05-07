import React, { useState } from 'react';
 import './Admin.css';
import axios from 'axios';


function Createcommunity({}) {
  const [communityName, setCommunityName] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [key, setKey] = useState(0); // Key for resetting input field
  const[message,setMessage]=useState();
  const resetForm = () => {
    setCommunityName('');
    setFile(null);
    setError('');
    setKey(prevKey => prevKey + 1); // Increment key to reset input field
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('communityName', communityName);
    formData.append('Communitypath', file);

    console.log('Form Data:', formData.get('communityName'), formData.get('Communitypath'));

    axios.post('http://localhost:3002/Admin', formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log('Success:', response.data);
        if (response.status === 200) {
            alert('Upload successful');
            setTimeout(() => {
                setMessage('');
            }, 1000);
        } else {
            setMessage('Data failed to save');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        setMessage('Data failed to save');
    });
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

  const handleMessageBoxOK = () => { // Current_user ==="Admin"?
    setShowMessageBox(false); // Close the message box
    setError(''); // Clear the error message
  };

  return (
   
    <div className="create-community-container">
      <div className="create-block">
        <h2>Create Community</h2>
        <input
        required
          className='adminInput'
          type="text"
          placeholder="Community Name"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
        />
        <input
        required
          className='adminInput'
          key={key} // Key to reset input field
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileChange}
        />
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={handleSave}>Save</button>
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
    // :<div> you are not authorized</div>
  );
}

export default Createcommunity;
