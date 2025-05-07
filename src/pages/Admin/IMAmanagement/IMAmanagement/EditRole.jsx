import React, { useState } from 'react';
import './EditRole.css'; // Importing CSS file for styling
import axios from 'axios';
// Dummy data to simulate user roles for different user IDs


// List of available roles
const roles = ['User admin', 'Community admin', 'Interest admin', 'Editor', 'Publisher admin','Corporate admin'];

// EditRole component - Allows editing roles assigned to a user
function EditRole() {
  // State variables
  const [userId, setUserId] = useState(''); // User ID input field value
  const [assignedRoles, setAssignedRoles] = useState([]); // Currently assigned roles for the user
  const [roleStates, setRoleStates] = useState({}); // State for checkboxes representing role selection
  const [message, setMessage] = useState('');

  const handleVarify = () => {
    axios.post('http://localhost:3002/Idvarify', { id: userId })
    .then((response) => {
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.data.error) {
        setMessage('Incorrect ID');
      } else {
        const roles = response.data.role_needed;
        setAssignedRoles(roles);
        setMessage('ID Verified');
        setAssignedRoles(roles); 
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('User ID not found');
    });
  }


  // Function to handle checkbox state change for a role
  const handleRoleChange = (role) => {
    setRoleStates({
      ...roleStates,
      [role]: !roleStates[role] // Toggle checkbox state for the selected role
    });
  };

  // Function to handle saving the edited roles
  const handleSave = () => {
    const selectedRoles = Object.keys(roleStates).filter(role => roleStates[role]);
    axios.post('http://localhost:3002/updateRoles', { id: userId, roles: selectedRoles })
      .then(response => {
        console.log('Roles updated successfully:', response.data);
        setMessage('Roles updated successfully');
        setTimeout(() => {
          setMessage('');
        }, 3000);
      })
      .catch(error => {
        console.error('Error saving roles:', error);
        setMessage('Error saving roles. Please try again.');
      });
    // const updatedRoles = Object.keys(roleStates).filter((role) => roleStates[role]);
    // setAssignedRoles(updatedRoles); 
  };

  // JSX rendering
  return (
    <div className="edit-role-unique-container">
      <h2>Edit Roles</h2>
      {/* User ID input block */}
      <div className="edit-role-unique-block">
        <label htmlFor="edit-role-unique-user-id">Enter the user ID:</label>
        <input
          type="text"
          id="edit-role-unique-user-id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)} // Update userId state on input change
        />
      </div>
      {/* Button to varify register no */}
      <button className="edit-role-unique-button" style={{marginBottom:'3%'}} onClick={handleVarify} >Verify</button>
      
      {/* Currently assigned roles display block */}
      <div className="edit-role-unique-block">
        <label>Currently assigned Roles:</label>
        {/* <p>{assignedRoles.length > 0 ? assignedRoles.join(', ') : 'No roles assigned'}</p> */}
        <p>{assignedRoles.length > 0 ? assignedRoles: 'No roles assigned'}</p>
      </div>
      {/* Assign roles checkbox group block */}
      <div className="edit-role-unique-block">
        <label>Assign Roles:</label>
        <div className="edit-role-unique-checkbox-group">
          {/* Map over roles and render checkbox for each role */}
          {roles.map((role) => (
            <label style={{fontWeight:'unset'}}key={role}>
              <input
                type="checkbox"
                checked={roleStates[role] || false} // Set checkbox state from roleStates
                onChange={() => handleRoleChange(role)} // Handle checkbox state change
              />
             {role}
             </label >
          ))}
        </div>
      </div>
      {/* Button to save edited roles */}
      <button className="edit-role-unique-button" onClick={handleSave}>Edit Role</button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default EditRole; // Export the EditRole component
