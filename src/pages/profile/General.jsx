import React, { useState ,useEffect} from 'react';
import "./General.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { FaPencilAlt } from "react-icons/fa";
import axios from 'axios';

const General = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook from react-router-dom for navigation
   
    const [formData, setFormData] = useState({ // Initialize form data state using useState hook
        name: '',
        dobTime: '',
        profilePicture: null, // Initialize profile picture state to null
        phoneNumber: '',
        email: ''
    });

    //Edit  option for name (pencil icon)
    const [isEditingName, setIsEditingName] = useState(false); // State to track whether the name is being edited
    const [editedName, setEditedName] = useState(''); // State to store the edited name temporarily

    const [message, setMessage] = useState('');

    const handleEditNameClick = () => {
        setIsEditingName(true); // Enable editing of the name
        setEditedName(formData.name); // Set the initial value of the edited name
    };

    const handleInputChange = (event) => {
        // Extract the 'name' and 'value' from the input element
        const { name, value } = event.target;
        // Update the form data state with the new input value
        setFormData({ ...formData, [name]: value });
    };

  

    // State to track whether the email is being edited
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    // State to store the edited email temporarily
    const [editedEmail, setEditedEmail] = useState('');

    // Function to handle clicking the edit email button
    const handleEditEmailClick = () => {
        setIsEditingEmail(true); // Enable editing of the email
        setEditedEmail(formData.email); // Set the initial value of the edited email
    };

    //profile picture setting
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        setFormData({ ...formData, profilePicture: file }); // Update profile picture state
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Save changes and exit editing mode here
        setIsEditingName(false);
        // Save changes and exit editing mode for email
        setIsEditingEmail(false);
       
        // Redirect to Education page after successful submission
        navigate('/Education');
    };
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;// Extract the 'name' and 'checked' properties from the checkbox input element
        setFormData({ ...formData, [name]: checked }); // Update the form data state with the new checkbox value
    };

    // State to store the age
    const [age, setAge] = useState('');

    // Function to calculate age based on Date of Birth
    const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const ageDiff = currentDate.getFullYear() - dobDate.getFullYear();
    const dobMonth = dobDate.getMonth();
    const currentMonth = currentDate.getMonth();
    
    if (currentMonth < dobMonth || (currentMonth === dobMonth && currentDate.getDate() < dobDate.getDate())) {
        return ageDiff - 1;
        }

        return ageDiff;
        };

    // Event handler for Date of Birth input change
        const handleDOBChange = (event) => {
        const dob = event.target.value;
        setAge(calculateAge(dob));
        handleInputChange(event); // Forward the change event to the general input change handler
        };

    const defaultProfilePicture = 'default.jpg'; // Default profile picture URL



    
    useEffect(() => {  
        axios.get('http://localhost:3002/Profile', { withCredentials: true })
        .then(res=>{
            console.log(res.data);
            if(res.data.valid){
                setFormData(prevState => ({ ...prevState, 
                    name: res.data.userDetail[0].name,
                    email: res.data.userDetail[0].email, 
                    phoneNumber: res.data.userDetail[0].phoneNo,
                 }));
            }

            else{
                navigate('/Login');
            }
        })
        .catch(err=>console.log(err))
    }, []);

    const handleSave = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        // Construct the data object to be sent
        const dataToSend = {};
    
        // Check if name has been edited, if yes, send edited name, otherwise send existing name
        dataToSend.name = isEditingName ? editedName : formData.name;
    
      
        
        dataToSend.phoneNo=formData.phoneNumber;

        dataToSend.dobTime=formData.dobTime;

        dataToSend.age=age;
    
        // Check if email has been edited, if yes, send edited email, otherwise send existing email
        dataToSend.email = isEditingEmail ? editedEmail : formData.email;

        // Send the data using axios post request
        axios.post('http://localhost:3002/saveprofile', dataToSend)
            .then(response => {
                if (response.status === 200) {
                setMessage('Data saved');
                setTimeout(() => {
                  setMessage(''); // Clear the message after a brief delay
                }, 1000);
            }else{
                setMessage('Failed to save data');
            }
            })
            .catch(error => {
                console.error('Error:', error);
                setMessage('Data entry failed'); 
            });
    };




    return (
        <div style={{alignItems:'center'}} onSubmit={handleSubmit} >
           
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    id="profilePictureInput" 
                />
                <h1>Profile</h1>
                
            </div>

            <div style={{ width: '55%', margin: 'auto', background: "white", borderRadius: '10px' }}>
                <div style={{display:'flex',padding:'2%',justifyContent:'space-evenly'}}>
                    <form >
                        <div style={{ width: '100%', marginLeft: '5%', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <label htmlFor="nameInput" style={{ display: 'inline-block', color: 'black', marginRight: '10px', fontSize: '15px' }}>Name:</label>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    id="nameInput"
                                    name="name"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    required
                                    pattern="[A-Za-z]+" // Only allow alphabets
                                    title="Please enter alphabets only" // Error message if pattern doesn't match
                                    style={{ width: '100%', padding: '3px', borderRadius: '5px',border: '1px solid black',marginLeft:'35px' }}
                                />
                            ) : (
                                <input
                                    id="nameInput"
                                    type="text"
                                    readOnly
                                    style={{ width: '100%', height: '50%', padding: '3px', borderRadius: '5px', border: 'none', marginLeft: '35px' }}
                                    value={formData.name}
                                />
                            )}
                            <span onClick={handleEditNameClick} style={{ cursor: 'pointer',marginLeft: '5px', fontSize: '12px',width:'30%'}}><FaPencilAlt /></span>
                        </div>



                       
                {/*Date of Birth and Age input fields */}
                <div>
                    <div style={{ width: '100%', marginLeft: '5%', marginTop: '4%', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="dobInput" style={{ display: 'inline-block', color: 'black', marginRight: '2px', fontSize: '15px' }}>Date of Birth :</label>
                        <input 
                            type="datetime-local" 
                            id="dobInput" 
                            name="dobTime"
                            value={formData.dobTime} 
                            onChange={handleDOBChange} 
                            required 
                            title="Enter the Date of birth" // Tooltip text 
                            style={{ width: '51%', padding: '3px', borderRadius: '5px', marginBottom: '7px' }}
                        />
                    </div>
                    <div style={{ width: '100%', marginLeft: '5%', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="ageInput" style={{ display: 'inline-block', color: 'black', marginRight: '10px', fontSize: '15px' }}>Age:</label>
                        <input 
                            type="text" 
                            id="ageInput" 
                            name="age"
                            value={age} 
                            readOnly // Make the input field read-only
                            required 
                            title="Automatically calculated age" // Tooltip text 
                            style={{ width: '52%', padding: '3px', borderRadius: '5px', marginBottom: '7px',marginLeft:'50px' }}
                        />
                    </div>
                </div>
                
            <div>
                
                <div style={{ width: '100%', marginLeft: '0%',marginBottom: '15px',marginTop:'7px',display:'flex' }}>
                <label style={{marginLeft: '5%',marginRight: '22px', marginTop: '7px',color:'black'}} htmlFor="phoneNumberInput">Phone No:</label> 
                        
                    <input                  
                        type="text" 
                        id="phoneNumberInput" 
                        name="phoneNumber"
                        readOnly
                        value={formData.phoneNumber} 
                        onChange={handleInputChange} 
                        placeholder="Enter phone number" 
                        required 
                        title="Phone number must be 10 digits long and contain only numbers"
                        style={{ width: '50%', padding: '5px', borderRadius: '5px',marginRight: '0px',marginLeft:'2px', border: 'none'}}
                    />
                </div>
            </div>
            {/* // JSX for the Email input field with edit option */}
                <div style={{ width: '90%', marginLeft: '5%', marginBottom: '10px', marginTop: '10px', display: 'flex' }}>
                    <label style={{ display: 'inline-block', color: 'black', marginRight: '5px', fontSize: '15px' }} htmlFor="emailInput">Email:</label>
                    {isEditingEmail ? (
                        <input 
                            type="email" 
                            id="emailInput" 
                            name="email"
                            value={editedEmail} 
                            onChange={(e) => setEditedEmail(e.target.value)} 
                            required 
                            pattern="^[A-Za-z0-9._%+-]+@gmail\.com$" // Pattern to match email addresses ending with @gmail.com
                            title="Please enter a valid email address ending with @gmail.com"
                            style={{ width: '58%', padding: '3px', borderRadius: '5px',marginLeft:'45px' }}
                        />
                    ) : (
                        <input
                            id="emailInput"
                            type="text"
                            readOnly
                            style={{ width: '80%', height: '50%', padding: '5px', borderRadius: '5px', border: 'none',marginLeft:'40px' }}
                            value={formData.email}
                        />

                    )}
                    <span onClick={handleEditEmailClick} style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '12px' }}><FaPencilAlt /></span>
                    </div>
                    <button 
                    type="submit"
                    onClick={handleSave}
                    style={{ width: '60%', padding: '8px',paddingLeft:'100px',paddingRight:'50px',marginTop: '20px',borderRadius: '5px',backgroundColor: '#a97e87',paddingLeft:'40px', marginLeft: '20%',color:'white',border:'none' }}>Save</button>
                </form>
                    <label htmlFor="profilePictureInput" >
                        <img 
                        src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : defaultProfilePicture} 
                        alt="Profile" 
                        style={{ borderRadius: '50%', width: '150px', height: '150px', cursor: 'pointer' }}
                        />
                    </label>
            </div>
            </div>
            {message && <div>{message}</div>}
        </div>

    );
};

export default General;
 