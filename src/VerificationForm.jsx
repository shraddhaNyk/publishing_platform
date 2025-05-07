import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { CgMail } from "react-icons/cg";
import axios from 'axios';
import { FaPencilAlt } from 'react-icons/fa';

function VerificationForm() {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const location = useLocation();//to get data from registretion
  const { userId, registerEmail, registerMobileNumber, password, registerUsername} = location.state;
  const [Newemail, setNewemail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);


  useEffect(() => {
    axios.get('/api/data')
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}, []);



  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };
  
  const handleVerifyClick = () => {
    console.log('Verification code:', verificationCode);
    const emailToSend = Newemail ? Newemail : registerEmail;
    axios.post('http://localhost:3000/verify', { 
    id: userId,
    email: emailToSend,
    phoneNo: registerMobileNumber,
    password: password,
    name:registerUsername,
    token: verificationCode,
 
  })
  .then((response) => {
    console.log('Response status:', response.status);
    console.log('Response data:', response.data); // Verify the response data
    if (response.data.error) {  
      setMessage('Verification code incorrect');
    } else {
      setMessage('Verification is successful'); // Update the message state
      setTimeout(() => { // Display the message for a brief period
        setMessage('');
        setVerificationCode('');// Clear the message after a brief delay
        navigate('/Login'); // Navigate to the login page
      }, 1000); // Adjust the delay time as needed (in milliseconds)
    }
  })
  .catch((error) =>{
    console.error('Error:', error);
    setMessage('User not found ! please modify your email');
    setTimeout(() => { // Display the message for a brief period
      setMessage('');
      setVerificationCode('');
  },2000); 
  });
  }


  const handleChange = (e) => {
    setNewemail(e.target.value);
};

const handleEmailEdit = () => {
  if (editingEmail) {
  axios.post('http://localhost:3000/change-email', { 
    id: userId,
    email:Newemail,
    phoneNo: registerMobileNumber,
    password: password,
    name:registerUsername,
    })
    .then((response) => {
      console.log('Response status:', response.status);
      console.log('Response data:', response.data); // Verify the response data
      if (response.data.error) {
        setMessage(response.data.error);  
        setMessage('Email is incorrect');
        }else {
         setMessage('Verification is sent to new email'); // Update the message state
         setTimeout(() => { // Display the message for a brief period
          setMessage(''); // Clear the message after a brief delay
          }, 3000); // Adjust the delay time as needed (in milliseconds)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('User not found ! please modify your email');
      });
    }
    setEditingEmail(!editingEmail); // Toggle editing mode
};
  
const styles = {
  icon: {
    position: 'absolute',
    left: '46%',
    top:'20%',
    transform: 'translateY(-50%)',
    fontSize: '700%',
    color: '#666',
  },
  container: {
    marginTop:'50px',
    width: '30%',
    margin: '5% auto',
    padding: '5%',
    border: '1% solid #ccc',
    borderRadius: '10%',
    backgroundColor: '#fff',
  },
  inputContainer: {
    position: 'relative',
    height:'60%',
    marginTop:'20%',
    marginBottom: '3%',
  },
  
  input: {
    width: '85%',
    padding:'3%',
    paddingLeft: '10%',
    border: '40% solid #ccc',
    borderRadius: '1%',
    marginTop:'5%'
  },
  button: {
    width: '100%',
    height: '40px',
    backgroundColor: '#007bff',
    color: '#ffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop:'1%',
  },
  message: {
    marginTop: '10px',
    color: '#ff', 
  },
  
};





return (
<div style={{ backgroundColor: '#dccdf5', minHeight: '100vh', padding: '10px' }}>
 <div style={styles.container}>
    <CgMail style={styles.icon} />
    <div style={styles.inputContainer}>
      <h3 style={{ textAlign: 'center', marginBottom: '1%', marginTop: '10%' }}>Verification code has been sent to your email.</h3>
      <h3 style={{ textAlign: 'center', marginBottom: '1%', marginTop: '10%' }}>If you are not received the verification Code please check ypur email below is correct or not if not edit it.</h3>
      <div style={{ background: '#fff', color: '#000', padding: '20px' }}>
        </div>
        <div>
        <p  style={{ fontSize: '130%',marginBottom: '2%' }}>Name: {registerUsername}</p>
         <p  style={{ fontSize: '130%',marginBottom: '3%'}}>Email: {editingEmail ? (
      <>
      <input
      type="text"
      value={Newemail}
      onChange={handleChange}
      placeholder="New email"
      style={{fontSize: '100%'}}
    />
    
    <button style={{ ...styles.editButton, marginLeft: '10px' ,color: '#ffff',width: '20%',height: '25px', backgroundColor: '#007bff'}} onClick={handleEmailEdit}> Save</button>
  </>
) : (
  <>
     {Newemail || registerEmail}
    <button style={{ ...styles.editButton, marginLeft: '10px'}} onClick={handleEmailEdit}><FaPencilAlt /></button>
  </>
)}
</p>
    
  </div>
      <input
        type="text"
        placeholder="Verification Code"
        style={styles.input}
        value={verificationCode}
        onChange={handleVerificationCodeChange}
      />
      <button style={styles.button} onClick={handleVerifyClick}>Verify</button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  </div>
</div>
);


}

export default VerificationForm;