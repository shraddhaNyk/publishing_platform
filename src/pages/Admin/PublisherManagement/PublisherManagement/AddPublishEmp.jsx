import React, {useEffect, useState } from 'react';
// import './Admin.css';
import axios from 'axios';


function AddPublishEmp({}) {
  const [userId, setuserId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(''); // State to hold the username
  const [corporateOrganizationName, setCorporateOrganizationName] = useState(''); // State to hold the corporate organization name
  const [corporateOrganizationIJSTNo, setCorporateOrganizationIJSTNo] = useState('');// State to hold the corporate organization IJST No
  const [corporate_email_domain, setCorporate_email_domain] = useState('')
  const [employeeId, setEmployeeId] = useState('');
  const [mailId, setMailId] = useState('');
  const [isChecked, setIsChecked] = useState(false);


  useEffect(() => {
    // Function to fetch organisation name
    const fetchOrganisationName = async () => {
      try {
        // Assuming the backend API endpoint
        const response = await fetch('/Fetch_Organisation', {
          method: 'POST',
          credentials: 'same-origin', 
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCorporateOrganizationName(data.Data.corporate_organization_name); 
        setCorporateOrganizationIJSTNo(data.Data.corporate_IJST_identification_number);
        setCorporate_email_domain(data.Data.corporate_email_domain);

        // Update state with the fetched organisation name
      } catch (error) {
        console.error('Error fetching organisation name:', error);
        // Optionally handle the error
      }
    };

    // Call the fetchOrganisationName function when component mounts
    fetchOrganisationName();
  }, []); // Empty dependency array ensures this effect runs only once on mount


  const fetchEmployeeDetails = () => {
    
    axios.post('http://localhost:3002/Fetch_Employee', { IJSTID: userId })
      .then((response) => {
        if (response.status === 200 && response.data.Data) {
          const Data = response.data.Data;
          console.log('Fetched Data:', Data); // Log the data to see its structure
          setUsername(Data.name); // Set the fetched username

        } else {
          setError('Incorrect IJST ID');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Incorrect IJST ID');
      });
  };


  // const handleSave = () => {

  //   axios.post('http://localhost:3002/AddEmp', { IJSTID: userId ,EmpId:employeeId ,mailId:mailId, corporateOrganizationName:corporateOrganizationName})
  //     .then(response => {
  //       console.log('Employee Added successfully:', response.data);
  //       setMessage('Employee Added successfully');
  //     })
  //     .catch(error => {
  //       console.error('Error saving Employee:', error);
  //       setMessage('Error saving Employee. Please try again.');
  //     });
  // };

  const handleSave = () => {
    
    // Check if the employeeId contains the corporate email domain
    if (mailId.endsWith(corporate_email_domain)) {
      axios.post('http://localhost:3002/AddEmp', { IJSTID: userId, EmpId: employeeId, mailId: mailId, corporateOrganizationName: corporateOrganizationName })
        .then(response => {
          console.log('Employee Added successfully:', response.data);
          setMessage('Employee Added successfully');
        })
        .catch(error => {
          console.error('Error saving Employee:', error);
          setMessage('Error saving Employee. Please try again.');
        });
    } else {
      console.log(employeeId,corporate_email_domain);
      setMessage('Invalid employee email domain. Please use a valid email.');
    }
  };
  
 
  const containerStyle = {
    width: '600px',
    border: '1px solid #000',
    padding: '20px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  };

  const formGroupStyle = {
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px'
  };

  const inputStyle = {
    width: 'calc(100% - 22px)',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  };

  const checkboxStyle = {
    marginRight: '10px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#2d324e',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop:'2%'
  };


  const noteStyle = {
    marginTop: '20px',
    fontSize: '12px'
  };


  
  return (
   
    <div style={containerStyle}>
    <h2 style={{marginBottom:'10%'}}>Corporate Admin - Employee Management</h2>
    <form>
      <div style={formGroupStyle}>
        <label>You are from : {corporateOrganizationName}</label> 
        <label style={{marginLeft:'10%'}}>Corporate IJST ID : {corporateOrganizationIJSTNo}</label>
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="ust-id" style={labelStyle}>Please Enter IJST ID</label>
        <input 
          type="text" 
          id="ust-id" 
          value={userId}
          onChange={(e) => setuserId(e.target.value)}
          style={inputStyle}
        />
        {/* <a href="#">Don't Have UST ID, Create One</a> */}
        <button 
          type="button" 
          onClick={fetchEmployeeDetails} 
          style={buttonStyle} 
        >
          Get User Details
        </button>
        
      </div>
      {error && <div style={{color:'Red'}}>{error}</div>}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Select the user</label>
        <input 
          type="checkbox" 
          id="user" 
          name="user"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          style={checkboxStyle}
        />
        <label htmlFor="user">{username}</label>
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="employee-id" style={labelStyle}>{corporateOrganizationName} Employee ID</label>
        <input 
          type="text" 
          id="employee-id" 
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="mail-id" style={labelStyle}>{corporateOrganizationName} Official Mail ID</label>
        <input 
          type="email" 
          id="mail-id" 
          value={mailId}
          onChange={(e) => setMailId(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <button 
          type="button" 
          onClick={handleSave} 
          style={buttonStyle}   
        >
          Assign Employee
        </button>
        {message && <div>{message}</div>}
      </div>
    </form>
  </div>
  );
}

export default AddPublishEmp;
