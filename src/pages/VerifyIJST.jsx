import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const VerifyIJST = () => {
  const [IJST_ID, setIJST_ID] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook from react-router-dom for navigation

  const handleChange = (e) => {
    setIJST_ID(e.target.value);
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:3002/api/verifyIjst', { IJST_ID });
      if (response.data.success) {
        setMessage('IJST ID is valid!');
        navigate('/ForgotPassword');
      } else {
        setMessage('IJST ID is invalid.');
      }
    } catch (error) {
      console.error('Error verifying IJST ID:', error); // Log error details for debugging
      setMessage('Error verifying IJST ID.');
    }
  };
  
  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>Verify IJST ID</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter IJST ID"
            value={IJST_ID}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1rem',
              marginBottom: '10px',
              width: '80%',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleVerify}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              marginTop: '10px',
            }}
          >
            Verify
          </button>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyIJST;
