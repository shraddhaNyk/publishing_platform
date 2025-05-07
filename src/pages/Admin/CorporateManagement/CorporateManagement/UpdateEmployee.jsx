import React, { useState } from 'react';
// import './EditRole.css'; // Importing CSS file for styling
import axios from 'axios';
// Dummy data to simulate user roles for different user IDs


// List of available roles
// const roles = ['Corporate admin'];

// EditRole component - Allows editing roles assigned to a user
function EditRole() {
  // State variables
  const [userId, setUserId] = useState(''); // User ID sinput field value
  const [roleStates, setRoleStates] = useState({}); // State for checkboxes representing role selection
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [isChecked, setIsChecked] = useState(false);

  // Function to handle checkbox state change for a role
  const handleRoleChange = (role) => {
    setRoleStates({
      ...roleStates,
      [role]: !roleStates[role] // Toggle checkbox state for the selected role
    });
  };

  // Function to handle saving the edited roles
  const handleSave = () => {
    axios.post('http://localhost:3002/UpdateEmpRole', { IJSTID: userId , role:'Corporate admin' })
      .then(response => {
        console.log('Roles updated successfully:', response.data);
        setMessage('Roles updated successfully');
      })
      .catch(error => {
        console.error('Error saving roles:', error);
        setError('Error saving roles. Please try again.');
      });
  };

  // JSX rendering
  return (
    <div className="edit-role-unique-container">
      <h2>Edit Employee Roles</h2>
      {/* User ID input block */}
      <div className="edit-role-unique-block">
        <label htmlFor="edit-role-unique-user-id">Enter the IJST ID:</label>
        <input
          type="text"
          id="edit-role-unique-user-id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)} // Update userId state on input change
        />
      </div>
      {/* Button to varify register no */}
      {/* <button className="edit-role-unique-button" style={{marginBottom:'3%'}} onClick={handleVarify} >Verify</button> */}
      
      {/* Currently assigned roles display block */}
      {/* <div className="edit-role-unique-block">
        <label>Currently assigned Roles:</label>
        <p>{assignedRoles.length > 0 ? assignedRoles: 'No roles assigned'}</p>
      </div> */}
      {/* Assign roles checkbox group block */}
      <div className="edit-role-unique-block">
        <label>Assign Roles:</label>
        <div className="edit-role-unique-checkbox-group">
          {/* {roles.map((role) => (
            <label style={{fontWeight:'unset'}}key={role}>
              <input
                type="checkbox"
                checked={roleStates[role] || false} // Set checkbox state from roleStates
                onChange={() => handleRoleChange(role)} // Handle checkbox state change
              />
             {role}
             </label >
          ))} */}
          <input 
          type="checkbox" 
          id="role" 
          name="role"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          style={{marginRight:'2%'}}
        />
        Corporate admin
        </div>
      </div>
      {/* Button to save edited roles */}
      <button className="edit-role-unique-button" onClick={handleSave}>Edit Role</button>
      {error && <div style={{color:'Red'}}>{error}</div>}
      {message && <div>{message}</div>}
    </div>
  );
}

export default EditRole; // Export the EditRole component
