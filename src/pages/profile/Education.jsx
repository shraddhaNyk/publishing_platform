

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Education.css";
import axios from 'axios';

const Education = () => {
    const navigate = useNavigate();
    const [educationData, setEducationData] = useState({
        // Initialize state for each education level
        highSchool: { schoolName: '', yearOfPassing: '', percentage: '' },
        puCollege: { collegeName: '', yearOfPassing: '', percentage: '' },
        ugCollege: { collegeName: '', yearOfPassing: '', percentage: '' },
        pgCollege: { collegeName: '', yearOfPassing: '', percentage: '' },
        
    });
    const [message, setMessage] = useState('');
    const handleInputChange = (event, level) => {
        const { name, value } = event.target;
        setEducationData({ ...educationData, [level]: { ...educationData[level], [name]: value } });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = {
            h_schoolName:educationData.highSchool.schoolName,
            h_yearOfPassing :educationData.highSchool.yearOfPassing,
            h_percentage:educationData.highSchool.percentage,
            pu_collegeName :educationData.puCollege.schoolName,
            pu_yearOfPassing :educationData.puCollege.yearOfPassing,
            pu_percentage:educationData.puCollege.percentage,
            ug_collegeName :educationData.ugCollege.schoolName,
            ug_yearOfPassing :educationData.puCollege.yearOfPassing,
            ug_percentage :educationData.ugCollege.percentage,
            pg_collegeName :educationData.pgCollege.schoolName,
            pg_yearOfPassing:educationData.pgCollege.yearOfPassing,
            pg_percentage :educationData.pgCollege.percentage,
        }
            // Send the data using axios post request
            axios.post('http://localhost:3002/saveeducation', dataToSend)
            .then(response => {
                if (response.status === 200) {
                setMessage('Data saved');
                setTimeout(() => {
                    setMessage(''); // Clear the message after a brief delay
                  }, 1000);
                  navigate('/Experience');
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
        <div style={{ width: '30%', margin: 'auto',background  : "white"  ,padding:'50px',borderRadius:'10px' }}>
            
            <form onSubmit={handleSubmit}>
                {/* High School */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>High School or Secondary School</h3>
                    <input 
                        
                        type="text" 
                        name="schoolName"
                        value={educationData.highSchool.schoolName} 
                        onChange={(e) => handleInputChange(e, 'highSchool')} 
                        placeholder="School Name" 
                        style={{ width: '100%', padding: '8px' ,marginTop:'5px',borderRadius: '4px'}}
                    />
                    <input 
                        type="date" 
                        name="yearOfPassing"
                        value={educationData.highSchool.yearOfPassing} 
                        onChange={(e) => handleInputChange(e, 'highSchool')} 
                        placeholder="Year of Passing" 
                        title="Enter the year of passing" // Tooltip text
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                    <input 
                        type="number" 
                        name="percentage"
                        value={educationData.highSchool.percentage} 
                        onChange={(e) => handleInputChange(e, 'highSchool')} 
                        placeholder="Percentage Scored %" 
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                </div>

                {/* PU College */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>Pre-University College</h3>
                    <input 
                        type="text" 
                        name="collegeName"
                        value={educationData.puCollege.schoolName} 
                        onChange={(e) => handleInputChange(e, 'puCollege')} 
                        placeholder="College Name" 
                        style={{ width: '100%', padding: '8px' ,marginTop:'5px',borderRadius: '4px'}}
                    />
                    <input 
                        type="date" 
                        name="yearOfPassing"
                        value={educationData.puCollege.yearOfPassing} 
                        onChange={(e) => handleInputChange(e, 'puCollege')} 
                        placeholder="Year of Passing" 
                        title="Enter the year of passing" // Tooltip text
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                     <input 
                        type="number" 
                        name="percentage"
                        value={educationData.puCollege.percentage} 
                        onChange={(e) => handleInputChange(e, 'puCollege')} 
                        placeholder="Percentage Scored %" 
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                    
                </div>

                {/* UG College */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>UnderGraduation College</h3>
                    <input 
                        type="text" 
                        name="collegeName"
                        value={educationData.ugCollege.schoolName} 
                        onChange={(e) => handleInputChange(e, 'ugCollege')} 
                        placeholder="College Name" 
                        style={{ width: '100%', padding: '8px' ,marginTop:'5px',borderRadius: '4px'}}
                    />
                    <input 
                        type="date" 
                        name="yearOfPassing"
                        value={educationData.ugCollege.yearOfPassing} 
                        onChange={(e) => handleInputChange(e, 'ugCollege')} 
                        placeholder="Year of Passing" 
                        title="Enter the year of passing" // Tooltip text
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                     <input 
                        type="number" 
                        name="percentage"
                        value={educationData.ugCollege.percentage} 
                        onChange={(e) => handleInputChange(e, 'ugCollege')} 
                        placeholder="Percentage Scored %" 
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                    {/* Similar input fields as above */}
                </div>

                {/* PG College */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>PostGraduation College</h3>
                    <input 
                        type="text" 
                        name="collegeName"
                        value={educationData.pgCollege.schoolName} 
                        onChange={(e) => handleInputChange(e, 'pgCollege')} 
                        placeholder="College Name" 
                        style={{ width: '100%', padding: '8px' ,marginTop:'5px',borderRadius: '4px'}}
                    />
                    <input 
                        type="date" 
                        name="yearOfPassing"
                        value={educationData.pgCollege.yearOfPassing} 
                        onChange={(e) => handleInputChange(e, 'pgCollege')} 
                        placeholder="Year of Passing"
                        title="Enter the year of passing" // Tooltip text 
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                     <input 
                        type="number" 
                        name="percentage"
                        value={educationData.pgCollege.percentage} 
                        onChange={(e) => handleInputChange(e, 'pgCollege')} 
                        placeholder="Percentage Scored %" 
                        style={{ width: '100%', padding: '8px',marginTop:'5px',borderRadius: '4px' }}
                    />
                    
                </div>

                <button type="submit" 
                onClick={handleSubmit}
                style={{ width: '100%', padding: '8px',borderRadius: '5px',backgroundColor: '#a97e87',borderRadius: '5px',marginLeft:'10px',color:'white',border:'none' }}>Save</button>
                  {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Education;

