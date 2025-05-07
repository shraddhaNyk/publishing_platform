import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteTechnology() {
  const [technologyName, setTechnologyName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');
  const [technologys, setTechnologys] = useState([]);

  useEffect(() => {
    fetchTechnologys();
  }, []);

  const fetchTechnologys = () => {
    axios.get('http://localhost:3002/api/technology')
      .then(response => {
        setTechnologys(response.data);
      })
      .catch(error => {
        console.error('Error fetching technologies:', error);
        setError('Failed to fetch technologies. Please try again later.');
      });
  };

  const resetForm = () => {
    setTechnologyName('');
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async () => {
    try {
      if (!technologyName) {
        setError('Please select a technology to delete.');
        setShowMessageBox(true);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/technology/delete-technology',
        { technologyName }, // Use technologyName here
        { headers: { Authorization: `Bearer ${authToken}` } } // Corrected headers
      );

      setSuccessMessage('Technology deleted successfully.');
      setShowMessageBox(true);
      fetchTechnologys(); // Refresh technology list after deletion
      resetForm();
    } catch (error) {
      console.error('Error deleting technology:', error);
      if (error.response && error.response.status === 404) {
        setError('Technology not found.');
      } else {
        setError('An error occurred while deleting the technology.');
      }
      setShowMessageBox(true);
    }
  };

  const handleDeactivate = async () => {
    try {
      if (!technologyName) {
        setError('Please select a technology to deactivate.');
        setShowMessageBox(true);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/api/deactivate-technology',
        { technologyName, status: 'deactivated' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setSuccessMessage('Technology deactivated successfully.');
      setShowMessageBox(true);
      fetchTechnologys(); // Refresh technology list after deactivation
      resetForm();
    } catch (error) {
      console.error('Error deactivating technology:', error);
      setError('An error occurred while deactivating the technology.');
      setShowMessageBox(true);
    }
  };

  const handleActivate = async () => {
    try {
      if (!technologyName) {
        setError('Please select a technology to activate.');
        setShowMessageBox(true);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/api/deactivate-technology',
        { technologyName, status: 'activated' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setSuccessMessage('Technology activated successfully.');
      setShowMessageBox(true);
      fetchTechnologys(); // Refresh technology list after activation
      resetForm();
    } catch (error) {
      console.error('Error activating technology:', error);
      setError('An error occurred while activating the technology.');
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
    if (!technologyName) {
      setError(`Please select a technology to ${action}.`);
      setShowMessageBox(true);
      return;
    }

    setConfirmationAction(action);
    setShowConfirmationBox(true);
  };

  return (
    <div className="delete-technology-container">
      <div className="delete-block" style={{ width: '50%', marginLeft: '25%' }}>
        <h2>Manage Technology</h2>
        <select
          className='adminInput'
          style={{ height: '30px', marginTop: '3%', marginBottom: '3%', width: '95%' }}
          value={technologyName}
          onChange={(e) => setTechnologyName(e.target.value)}
        >
          <option value="">Select Technology</option>
          {technologys.map((technology, index) => (
            <option key={index} value={technology.technologyName}>
              {technology.technologyName}
            </option>
          ))}
        </select>
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={() => confirmAction('delete')}>Permanently Delete</button>
            {/* <button onClick={() => confirmAction('deactivate')}>Deactivate Technology</button>
            <button onClick={() => confirmAction('activate')}>Activate Technology</button> */}
          </div>
        </div>
      </div>
      {showMessageBox && (
        <div className="admin-message-box">
          <p className="message" style={{ backgroundColor: error ? 'red' : 'green' }}>{error || successMessage}</p>
          <button className="ok-btn" onClick={handleMessageBoxOK}>OK</button>
        </div>
      )}

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
              {`Are you sure you want to ${confirmationAction} the technology "${technologyName}"?`}
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

export default DeleteTechnology;
