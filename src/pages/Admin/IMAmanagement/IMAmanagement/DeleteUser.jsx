import React, { useState } from 'react';
import './DeleteUser.css';
import axios from 'axios';

function DeleteUser() {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState('');

  // Function to fetch user details
  const fetchUserDetails = () => {
    axios.post('http://localhost:3002/Fetch_User', { id: userId })
    .then((response) => {
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      if (response.data.error) {
        setMessage('Incorrect ID');
      } else {
        const Data = response.data.Data;
          console.log('Fetched Data:', Data); // Log the data to see its structure
          setUserData(Array.isArray(Data) ? Data : []);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('User ID not found');
    });
  };

  // Function to handle radio button selection
  const handleSelectRow = (id) => {
    setSelectedRow(id);
  };

  // Function to deactivate user
  const deactivateUser = () => {
    if (selectedRow !== null) {
      if (window.confirm('Are you sure you want to deactivate user?')) {
        // Make a copy of the userData to update state only after the axios call succeeds
        const updatedUserData = [...userData];
        const userToUpdate = updatedUserData.find(user => user.id === selectedRow);
  
        if (userToUpdate) {
          axios.post('http://localhost:3002/update_role_Deactivat', {
            id: userToUpdate.id,
            newStatus: 'Deactivated'
          })
          .then(response => {
            console.log('Status updated:', response.data);
            // Update the user status only after the axios call succeeds
            userToUpdate.role_status = 'Deactivated';
            setUserData(updatedUserData);
          })
          .catch(error => {
            console.error('There was an error updating the status!', error);
          });
        }
      }
    }
  };

  // Function to delete user
  const deleteUser = () => {
    if (selectedRow !== null) {
      // Display warning message box
      if (window.confirm('Are you sure you want to delete user?')) {
        // Make an axios request to delete the user from the backend
        axios.post('http://localhost:3002/delete_user', { id: selectedRow })
          .then(response => {
            console.log('User deleted:', response.data);
            // Update the local state to remove the deleted user
            const updatedUserData = userData.filter(user => user.id !== selectedRow);
            setUserData(updatedUserData);
            setMessage('User Deleted');
          })
          .catch(error => {
            console.error('There was an error deleting the user!', error);
          });
      }
    }
  };

  return (
    <div className="delete-user-container">
      <h2>Deactivate or Delete User</h2>
      <input 
        type="text" 
        placeholder="Enter the user ID" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)} 
      />
      <button onClick={fetchUserDetails}>Fetch User Details</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
            <th>Select</th>
              <th>request ID</th>
              <th>Request type</th>
              <th>IJST ID</th>
              <th>Employee ID</th>
              <th>Role Needed</th>
              <th>Role Type</th>
              <th>Publisher Organization Name</th>
              <th>Publisher Register No</th>
              <th>Publisher GST/VAT No</th>
              <th>Publisher Reg Certificate</th>
              <th>Publisher Authorization Letter</th>
              <th>Publisher Digital Signature</th>
             <th>Student organisation</th>
              <th>Student ID</th>
              <th>Student Email</th>
              <th>Student ID File</th>
              <th>Corporate employee organisation</th>
              <th>Corporate employee ID</th>
              <th>Corporate employee Email</th>
              <th>Corporate employee ID File</th>
              <th>Editor High School File</th>
              <th>Editor PU College File</th>
              <th>Editor UG College File</th>
              <th>Editor PG College File</th>
              <th>Editor PhD/Doctoral File</th>
              <th>Corporate IJST number</th>
              <th>Corporate Institution Name</th>
              <th>Corporate Incorporation No</th>
              <th>Corporate GST/VAT No</th>
              <th>Corporate Reg Certificate</th>
              <th>Corporate Authorization Letter</th>
              <th>Corporate Digital Signature</th>
              <th>Corporate email domain</th>
              <th>Gocernment ID proof</th>
              <th>role Status</th>
              <th>Requested time</th>            </tr>
          </thead>
          <tbody>
          {userData && userData.length > 0 ? ( 
              userData.map(user => (
                <tr key={user.id}>
                  <td><input type="radio" checked={selectedRow === user.id} onChange={() => handleSelectRow(user.id)} /></td>
                  <td>{user.request_ID}</td>
                <td>{user.request_type}</td>
                <td>{user.IJST_ID}</td>
                <td>{user.employee_id}</td>
                <td>{user.role_needed}</td>
                <td>{user.role_type}</td>
                <td>{user.publication_organization_name}</td>
                <td>{user.publication_register_number}</td>
                <td>{user.publication_gst_number}</td>
                <td>{user.publication_certificate}</td>
                <td>{user.publication_authorization_letter}</td>
                <td>{user.publication_digital_signature}</td>
                <td>{user.student_organisation}</td>
                <td>{user.student_id}</td>
                <td>{user.student_email}</td>
                <td>{user.student_idcard}</td>
                <td>{user.corporate_employee_organisation}</td>
                <td>{user.corporate_employee_id}</td>
                <td>{user.corporate_employee_email}</td>
                <td>{user.corporate_employee_idcard}</td>
                <td>{user.high_school_certificate}</td>
                <td>{user.preuniversity_certificate}</td>
                <td>{user.under_graduate_certificate}</td>
                <td>{user.post_graduate_certificate}</td>
                <td>{user.phd_certificate}</td>
                <td>{user.corporate_IJST_identification_number}</td>
                <td>{user.corporate_organization_name}</td>
                <td>{user.corporate_incorporation_number}</td>
                <td>{user.corporate_gst_number}</td>
                <td>{user.corporate_incorporation_certificate}</td>
                <td>{user.corporate_authorization_letter}</td>
                <td>{user.corporate_digital_signature}</td>
                <td>{user.corporate_email_domain}</td>
                <td>{user.government_id_proof}</td>
                <td>{user.role_status}</td>
                <td>{user.request_timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="29">No user data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button onClick={deactivateUser}>Deactivate User</button>
      <button onClick={deleteUser}>Delete User</button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default DeleteUser;

