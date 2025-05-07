import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteIndustry() {
  const [industryName, setIndustryName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = () => {
    axios.get('http://localhost:3002/api/industry')
      .then(response => {
        setIndustries(response.data);
      })
      .catch(error => {
        console.error('Error fetching industries:', error);
        setError('Failed to fetch industries. Please try again later.');
      });
  };

  const resetForm = () => {
    setIndustryName('');
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async () => {
    try {
      if (!industryName) {
        setError('Please select an industry to delete.');
        setShowMessageBox(true);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/industry/delete-industry',
        { industryName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setSuccessMessage('Industry deleted successfully.');
      setShowMessageBox(true);
      fetchIndustries(); // Refresh industry list after deletion
      resetForm();
    } catch (error) {
      console.error('Error deleting industry:', error);
      if (error.response && error.response.status === 404) {
        setError('Industry not found.');
      } else {
        setError('An error occurred while deleting the industry.');
      }
      setShowMessageBox(true);
    }
  };

  const handleDeactivate = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/api/deactivate-industry',
        { industryName, status: 'deactivated' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setSuccessMessage('Industry deactivated successfully.');
      setShowMessageBox(true);
      resetForm();
    } catch (error) {
      console.error('Error deactivating industry:', error);
      setError('An error occurred while deactivating the industry.');
      setShowMessageBox(true);
    }
  };

  const handleActivate = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3002/api/deactivate-industry',
        { industryName, status: 'activated' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setSuccessMessage('Industry activated successfully.');
      setShowMessageBox(true);
      resetForm();
    } catch (error) {
      console.error('Error activating industry:', error);
      setError('An error occurred while activating the industry.');
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
    if (!industryName) {
      setError(`Please select an industry to ${action}`);
      setShowMessageBox(true);
      return;
    }

    setConfirmationAction(action);
    setShowConfirmationBox(true);
  };

  return (
    <div className="delete-industry-container">
      <div className="delete-block" style={{ width: '50%', marginLeft: '25%' }}>
        <h2>Major Industry</h2>
        <select
          className='adminInput'
          style={{ height: '30px', marginTop: '3%', marginBottom: '3%', width: '95%' }}
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
        >
          <option value="">Select Industry</option>
          {industries.map((industry, index) => (
            <option key={index} value={industry.industryName}>
              {industry.industryName}
            </option>
          ))}
        </select>
        <div className="savecancel">
          <div className="save-btn">
            <button onClick={() => confirmAction('delete')}>Permanently Delete</button>
            {/* <button onClick={() => confirmAction('deactivate')}>Deactivate Industry</button>
            <button onClick={() => confirmAction('activate')}>Activate Industry</button> */}
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
              {`Are you sure you want to ${confirmationAction} the industry "${industryName}"?`}
            </p>
            <button
              style={{ padding: '10px', marginRight: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
              onClick={handleConfirmationOK}
            >
              Yes
            </button>
            <button
              style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
              onClick={handleConfirmationCancel}
            >
              No
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DeleteIndustry;
