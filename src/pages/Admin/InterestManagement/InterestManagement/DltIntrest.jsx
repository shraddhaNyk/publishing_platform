import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';

function DeleteInterest() {
  const [interestName, setInterestName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = () => {
    axios.get('http://localhost:3002/api/interest')
      .then(response => {
        setInterests(response.data);
      })
      .catch(error => {
        console.error('Error fetching interests:', error);
        setError('Failed to fetch interests. Please try again later.');
      });
  };

  const resetForm = () => {
    setInterestName('');
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async () => {
    try {
      if (!interestName) {
        setError('Please select a community to delete.');
        setShowMessageBox(true);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/interest/delete-interest',
        { Insertname: interestName },
        { headers: {uthorization:` Bearer ${authToken}`} }
      );

      setSuccessMessage('Interest deleted successfully.');
      setShowMessageBox(true);
      fetchInterests(); // Refresh interest list after deletion
      resetForm();
    } catch (error) {
      console.error('Error deleting interest:', error);
      if (error.response && error.response.status === 404) {
        setError('Interest not found.');
      } else {
        setError('An error occurred while deleting the interest.');
      }
      setShowMessageBox(true);
    }
  };

  const handleDeactivate = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/api/deactivate-interest',
        { interestName, status: 'deactivated' },
        { headers: { Authorization:` Bearer ${authToken}`} }
      );

      setSuccessMessage('Community deactivated successfully.');
      setShowMessageBox(true);
      resetForm();
    } catch (error) {
      console.error('Error deactivating community:', error);
      setError('An error occurred while deactivating the community.');
      setShowMessageBox(true);
    }
  };

  const handleActivate = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/api/deactivate-interest',
        { interestName, status: 'activated' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setSuccessMessage('Interest activated successfully');
      setShowMessageBox(true);
      resetForm();
    } catch (error) {
      console.error('Error activating interest:', error);
      setError('An error occurred while activating the interest.');
      setShowMessageBox(true);
    }
  };

  const handleMessageBoxOK = () => {
    setShowMessageBox(false);
    setError('');
    setSuccessMessage('');
  };

  const handleConfirmationOK = () => {
    if (confirmationAction === 'delete') {
      handleDelete();
    } else if (confirmationAction === 'deactivate') {
      handleDeactivate();
    } else if (confirmationAction === 'activate') {
      handleActivate();
    }
    setShowConfirmationBox(false);
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationBox(false);
  };

  const confirmAction = (action) => {
    if (!interestName) {
      setError(`Please select a community to ${action}`);
      setShowMessageBox(true);
      return;
    }

    setConfirmationAction(action);
    setShowConfirmationBox(true);
  };

  return (
    <div className="delete-interest-container">
      <div className="delete-block" style={{ width: '50%', marginLeft: '25%' }}>
        <h2>Major Interest</h2>
        <select
          className='adminInput'
          style={{ height: '30px', marginTop: '3%', marginBottom: '3%', width: '95%' }}
          value={interestName}
          onChange={(e) => setInterestName(e.target.value)}
        >
          <option value="">Select Interest</option>
          {interests.map((interest, index) => (
            <option key={index} value={interest.Insertname}>
              {interest.Insertname}
            </option>
          ))}
        </select>
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={() => confirmAction('delete')}>Permanently Delete</button>
            <button onClick={() => confirmAction('deactivate')}>Deactivate Interest</button>
            <button onClick={() => confirmAction('activate')}>Activate Interest</button>
          </div>
        </div>
      </div>
      {/* {showMessageBox && (
        <div className="admin-message-box">
          <p className="message" style={{ backgroundColor: error ? 'red' : 'green' }}>{error || successMessage}</p>
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )} */}

      {showConfirmationBox && (
        <>
          <div
            style={{
              position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999
            }}
          />
          <div
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white',
              border: '2px solid #ccc', padding: '20px', zIndex: 1000, width: '300px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p style={{ marginBottom: '20px', fontSize: '16px', textAlign: 'center' }}>
              {`Are you sure you want to ${confirmationAction} the interest "${interestName}"?`}
            </p>
            <button
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', margin: '0 10px' }}
              onClick={handleConfirmationOK}
            >
              OK
            </button>
            <button
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4caf50', color: 'white', border: 'none', margin: '0 10px' }}
              onClick={handleConfirmationCancel}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DeleteInterest;