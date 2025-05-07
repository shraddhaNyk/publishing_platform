
import React, {useEffect,useState} from 'react';
import { FaUser, FaLock, FaSync  } from 'react-icons/fa';//to import icon
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; //Import generate userId
import axios from 'axios';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import './Loging.css'




//generate captcha
const generateCaptcha = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};



function LoginAndRegistration() {
    const [loginUserId, setLoginUserId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const[registerUsername,setregisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    
    const [registerMobileNumber, setRegisterMobileNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState('');
    const [generatedId, setGeneratedId] = useState('');

    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(true);

    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    const [captcha, setCaptcha] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [cmessage, setcMessage] = useState('');
    const [roledata, setroledata]= useState('');



    const [cartItems, setCartItems] = useState(null); // Variable to store cart data
    const location = useLocation();

    //To resive captcha
    useEffect(() => {
      setCaptcha(generateCaptcha());
    }, []);
    
    

    useEffect(() => {
      document.addEventListener('copy', preventCopyAndPaste);
      document.addEventListener('paste', preventCopyAndPaste);
      return () => {
        document.removeEventListener('copy', preventCopyAndPaste);
        document.removeEventListener('paste', preventCopyAndPaste);
      };
    }, []);



    //To resive or send data to database
    useEffect(() => {
      axios.get('/')
          .then(response => {
              setData(response.data);
          })
          .catch(error => {
              console.error('Error fetching data:', error);
              console.log('Error details:', error.response);
          });
  }, []);


  const handleChange = (e) => {
    setPassword(e.target.value);
  };
 

  const validatePassword = () => {
    const pattern = /^(?=(?:.*[A-Z]){2})(?=(?:.*[!@#$%^&()]){2})(?=(?:.*\d){2})[A-Za-z\d!@#$%^&()]{15,60}$/;
    const isValidPassword = pattern.test(password);
    setIsValid(isValidPassword);
  };
  const [data, setData] = useState(null);
 

  const preventCopyAndPaste = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const checkProfileValidity = () => {
    axios.get('http://localhost:3001/Profile', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          navigate('/Profile');
        } else {
          navigate('/Login');
        }
      })
      .catch(err => console.log(err));
  };
  
  // UseEffect to check profile validity on component mount
  useEffect(() => {
    checkProfileValidity();
  }, []);
  
// Handle login
const handleLogin = async (e) => {
  e.preventDefault(); 
  console.log("Login clicked. UserName:", loginUserId, "Password:", loginPassword);

  try {


    const response = await axios.post('http://localhost:3002/login', {
      logid: loginUserId,
      logpassword: loginPassword
    }, {
      withCredentials: true
    });

    console.log('Response:', response.data);

    if (response.status === 200) {
      setMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        setMessage(''); // Clear the message after a brief delay
        
        // Check if cartItems were passed through navigation state
        if (location.state?.cartItems && location.state.cartItems.length > 0) {
          console.log("Navigating to ShoppingCart with cartItems:", location.state.cartItems);
          navigate('/ShoppingCart', { state: { cartItems: location.state.cartItems } });
        } else {
          console.log("Navigating to Dashboard");
          navigate('/Dashboard');
        }
      }, 1000);
    } else {
      setMessage('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Error:', error);
    setMessage('Login failed');
  }
};

 
    
const handleRegistration = async (e) => {
  e.preventDefault();
  
  if (!isVerified) {
    alert('Please verify the captcha.');
    return;
  }
  
  if (registerUsername === '' || registerEmail === '' || registerMobileNumber === '' || password === '') {
    alert('Enter required fields');
    return;
  }

  try {
    const newId = generateId();
    const userId = parseInt(newId);

    if (isNaN(userId)) {
      console.error('Generated ID is not a valid integer:', newId);
      return;
    }
    const response = await axios.post('http://localhost:3002/register', {
      id: userId,
      email: registerEmail,
      phoneNo: registerMobileNumber,
      password: password,
      name: registerUsername,
      role:roledata 
    });
    console.log(roledata);

  
    console.log('Response from backend:', response); // Log the response

    if (response && response.status === 200) {
      // Registration successful, navigate to the next page
      navigate('/Verification', {
        state: {
          userId: userId,
          registerEmail: registerEmail,
          registerMobileNumber: registerMobileNumber,
          password: password,
          registerUsername: registerUsername,
          role:roledata

        }
      });
    } else {
      console.error('Unexpected response status:', response.status);
      alert('An error occurred. Please try again later.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response && error.response.status === 300) {
      alert('Email already exists');
    } 
    else if (error.response && error.response.status === 400) {
      alert('Phone number already exists');
    }

  }

  // Reset form fields
  setregisterUsername('');
  setRegisterEmail('');
  setRegisterMobileNumber('');
  setPassword('');
};

// Function to generate a 10-digit random ID
const generateId = () => {
  let newId = '';
  while (newId.length < 10) {
    newId += Math.floor(Math.random()*10);
  }
  return newId;
};


//handleCaptcha
  const handleCaptchaChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCaptchaBlur = () => {
    if (inputValue.toLowerCase() === captcha.toLowerCase()) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      setInputValue('');
      setcMessage('Captcha incorrect. Please try again.');
    }
  };
 
  const handleCaptchaRefresh = () => {
    setCaptcha(generateCaptcha());
    setIsVerified(false);
    setInputValue('');
    setcMessage(''); // Clear any previous messages when refreshing
  };

   
  return (
    <div className="wrapper">
      <div className="login-form" style={{border:'none'}}>
          <form onSubmit={handleLogin}>
              <h2 style={{textAlign:'center'}}>Login</h2>
              <div className='input-box'>
              <input
                    type="text"
                    placeholder="User ID"
                    value={loginUserId}
                    onChange={(e) => setLoginUserId(e.target.value)}
                    style={{padding:'8px',marginTop:'12px',marginLeft:'50px',width:'180px',border:'none',background:'#E8F0FE'}}
                    required 
                  />
                  <FaUser className='icon' /> {/*user ID icon*/}
              </div>
              <div className='input-box'>
                  <input
                      type="password"
                      minLength={15}
                      maxLength={60}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{padding:'8px',marginTop:'12px',marginLeft:'50px',width:'180px',border:'none',background:'#E8F0FE'}}
                      required 
                  />
                  <FaLock className='icon' />
              </div>
              <button 
        type="submit" style={{padding:'8px',width:'220px',marginTop:'20px',marginLeft:'20px',borderRadius: '5px',color: '#04AA6D',backgroundColor: 'white',border: '2px solid #04AA6D',fontWeight:'normal',letterSpacing: '1px'}} >Login</button>
        {message && <div>{message}</div>}
        <div className="forgot-password-link">
            <a href="/VerifyIJST">Forgot Password?</a> {/* Add this line */}
          </div>
        </form>
       
      </div>

      {/* REGISTERTION PART*/}
    
      <div className="register-form" style={{border:'none'}}> 
        <h2 style={{textAlign:'center'}}>Register</h2>
        <form onSubmit={handleRegistration}>
        <input
            type="test"
            placeholder="Name"
            required
            value={registerUsername}
            onChange={(e) => setregisterUsername(e.target.value)}
            style={{padding:'8px',marginTop:'20px',marginLeft:'25px',width:'200px',marginBottom:'15px',border:'none',background:'#E8F0FE'}}
            />
         
          <input
            type="email"
            placeholder="Email"
            required
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            style={{padding:'8px',marginTop:'15px',marginLeft:'25px',width:'200px',marginBottom:'15px',border:'none',background:'#E8F0FE'}}
          
          />
           <div style={{display:'flex'}}>
            
            <PhoneInput
            placeholder="MobileNumber"
            value={registerMobileNumber || "+91"}
            onChange={(registerMobileNumber)=> setRegisterMobileNumber(registerMobileNumber)}    
            required
            style={{width:'204px',padding:'3px',marginTop:'10px',marginLeft:'25px',marginBottom:'15px',border:'none',background:'#E8F0FE',borderRadius:'5px'}} />
            </div>
            <input
            type="Password"
            placeholder="Password"
            value={password}
            required
            title='Password minimum 15 character maximum 60 at least 2 uppercase 2 digits 2 special characters  '
            onChange={handleChange}
            onBlur={validatePassword} // Validate when the input field loses focus
            style={{padding:'8px',marginTop:'12px',marginLeft:'25px',width:'200px',marginBottom:'10px',border:'none',background:'#E8F0FE'}}
          />

          {isValid ? null : <p style={{ color: 'red', margin: '5px 0', fontSize: '14px' }}>Password should 15 characters long, contain 1 uppercase letter, and 2 special character.</p>}
          <div>
          <input
          required
            type="text"
           value={captcha}
            disabled
             style={{
           marginLeft: '25px',
           border: 'none',
           fontSize: '16px',
           textAlign: 'center',
           width: '150px',
           backgroundColor: '#E8F0FE',
            pointerEvents: 'none',
           marginTop: '12px',
           caretColor: 'transparent', /* Hide caret */
           userSelect: 'none', // Prevent selection
           MozUserSelect: 'none', // Firefox
           WebkitUserSelect: 'none', // Chrome, Safari, Edge
           msUserSelect: 'none', // Internet Explorer/Edge Legacy
             }}
             />
          
            <button type="button" onClick={handleCaptchaRefresh} style={{ padding:'4px', marginTop:'1px', marginLeft:'20px',color: '#ffff',borderRadius: '5px', backgroundColor: '#04AA6D',width:'30px',border:'none' }}><FaSync /></button>
        <br />
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
        required 
         type="text"
         value={inputValue}
         placeholder="Captcha"
         onChange={handleCaptchaChange}
         onBlur={handleCaptchaBlur} 
         style={{ padding: '8px', width: '200px', marginTop: '15px', marginLeft: '25px', marginBottom: '15px',border:'none',background:'#E8F0FE' }}
        />
        </div>
        
        {cmessage && <p style={{ color: isVerified ? 'green' : 'red' }}>{cmessage}</p>}
    </div>
            
          <button type="submit" onClick= {handleRegistration} style={{padding:'8px',width:'220px',marginTop:'30px',marginLeft:'20px',borderRadius: '5px',color: '#ffff',backgroundColor: '#04AA6D',border:'none',fontWeight:'normal',letterSpacing: '1px'}}>Register</button>
        </form>
        
      </div>
    </div>
    
  );

};
export default LoginAndRegistration;
