

import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const SearchPublishEmployee = () => {
  const [data, setData] = useState('');
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState([]);

  const fetchUserDetails = () => {
    axios.post('http://localhost:3002/corporate/Search_Employee', { data: data })
      .then((response) => {
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        if (response.data.error) {
          setMessage('Incorrect ID');
        } else {
          const Data = response.data.Data;
          console.log('Fetched Data:', Data); 
          setUserData(Array.isArray(Data) ? Data : []);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('User ID not found');
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchUserDetails();
    }
  };

  const handleClick = () => {
    fetchUserDetails();
  };

  return (
    <div>
      <div className='search-bar' style={{ width: '50%' }}>
        <input
          type='text'
          placeholder='Search'
          value={data}
          onChange={(e) => setData(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FaSearch className='search-icon' onClick={handleClick} />
      </div>
      <div className="table-container1">
        <h3 style={{ marginTop: '3%', marginBottom: '2%' }}>Employee List</h3>
        <table className="table">
          <thead>
            <tr>
              <th>IJST ID</th>
              <th>Employee ID</th>
              <th>Role</th>
              <th>Official mailID</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((request) => (
              <tr key={request.IJST_ID}>
                <td>{request.IJST_ID}</td>
                <td>{request.empid}</td>
                <td>{request.role_needed}</td>
                <td>{request.Official_mail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SearchPublishEmployee;
