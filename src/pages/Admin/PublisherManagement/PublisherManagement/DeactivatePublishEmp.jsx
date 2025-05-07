import React, { useState,useEffect } from 'react';
import axios from 'axios';


function DeactivatePublishEmp() {
 const [message, setMessage] = useState('');

  const [userRequestsStatus, setUserRequestsStatus] = useState([]);

  useEffect(() => {
    fetch('/Display_Emp')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUserRequestsStatus(data);
      })
      .catch(error => {
        console.error('Error fetching user requests:', error);
      });
  }, []);

  const handleDeleteRequest = (IJST_ID) => { 
    console.log(IJST_ID);
    axios.post('http://localhost:3002/deactivate_Emp', {
      IJST_ID: IJST_ID,
      status:'Deactivated' 
    }, {
      withCredentials: true,
    })
      .then(response => {
        console.log('Success:', response.data);
        if (response.status === 200) {
          setMessage('Employee Deactivated');
          
        } else {
          setMessage('Employee  failed to Deactivate');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Employee  failed to Deactivate');
      });
  };



  return (
    <div className="reviewer-container">
      <div className="table-container1">
      <h3 style={{marginTop:'3%',marginBottom:'2%'}}>Employee List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>IJST ID</th>
            <th>Employee ID</th>
            <th>Role</th>
            <th>Official mailID</th>
            <th>Revoke</th>
          </tr>
        </thead>
        <tbody>
          {userRequestsStatus.map((request) => (
              <tr key={request.IJST_ID}>
              <td>{request.IJST_ID}</td>  
              <td>{request.empid}</td>
              <td>{request.role_needed}</td>
              <td>{request.Official_mail}</td>
              <td>
                <button onClick={() => handleDeleteRequest(request.IJST_ID)}>
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {message && <div>{message}</div>}
    </div>

  );
}

export default DeactivatePublishEmp;
