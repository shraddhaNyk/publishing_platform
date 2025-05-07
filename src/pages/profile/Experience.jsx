

// export default Experience;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Experience.css";
import axios from 'axios';

const Experience = () => {
    const navigate = useNavigate();
    const [experienceData, setExperienceData] = useState({
        experienceType: '', // Experienced or Fresher
        experiences: [
            { companyName: '', joinedDate: '', resignedDate: '' } // Initial empty experience entry
        ]
    });
    const [message, setMessage] = useState('');
    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const newExperiences = [...experienceData.experiences];
        newExperiences[index] = { ...newExperiences[index], [name]: value };
        setExperienceData({ ...experienceData, experiences: newExperiences });
    };

    const handleAddExperience = () => {
        setExperienceData({
            ...experienceData,
            experiences: [...experienceData.experiences, { companyName: '', joinedDate: '', resignedDate: '' }]
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!experienceData.experienceType) {
            setMessage('Please select your experience type (Fresher or Experienced).');
            return;
          }
      
          // Prepare data to send based on experience type
          let dataToSend;
          if (experienceData.experienceType === 'fresher') {
            dataToSend = {
              experienceType: experienceData.experienceType,
            };
          } else {
            // Validate required fields for experienced users
            const requiredFields = ['companyName', 'joinedDate'];
            const missingFields = requiredFields.filter(field => !experienceData.experiences.every(exp => exp[field]));
            if (missingFields.length) {
              setMessage(`Please fill in the following required fields: ${missingFields.join(', ')}`);
              return;
            }
            dataToSend = {
              experienceType: experienceData.experienceType,
              experiences: experienceData.experiences.map(exp => ({
                companyName: exp.companyName,
                joinedDate: exp.joinedDate,
                resignedDate: exp.resignedDate,
              })),
            };
          }
      
          try {
            const response = await axios.post('http://localhost:3002/experience', dataToSend); 
            console.log(response.data); 
            setMessage('Data saved');
            setTimeout(() => {
                setMessage(''); // Clear the message after a brief delay
              }, 1000);
              navigate('/Interest'); 
          } catch (error) {
            console.error('Error submitting experience data:', error);
            setMessage('Data faield to store');
          }
    
    };

    return (
        <div style={{ width: '30%', margin: 'auto',background  : "white"  ,padding:'50px',borderRadius:'10px'  }}>
            <h2>Experience</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px',marginTop:'20px' }}>
                    <label style={{ marginRight: '20px' }}>
                        <input 
                            type="radio" 
                            name="experienceType" 
                            value="experienced" 
                            checked={experienceData.experienceType === 'experienced'} 
                            onChange={(e) => setExperienceData({ ...experienceData, experienceType: e.target.value })} 
                        />
                        Experienced
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="experienceType" 
                            value="fresher" 
                            checked={experienceData.experienceType === 'fresher'} 
                            onChange={(e) => setExperienceData({ ...experienceData, experienceType: e.target.value })} 
                        />
                        Fresher
                    </label>
                </div>

                {/* If the user is experienced, display experience fields */}
                {experienceData.experienceType === 'experienced' && (
                    <div>
                        {experienceData.experiences.map((experience, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <label>Company Name:</label>
                                <input 
                                    type="text" 
                                    name="companyName" 
                                    value={experience.companyName} 
                                    onChange={(e) => handleInputChange(e, index)} 
                                    required 
                                    style={{ width: '100%', padding: '8px',marginBottom: '15px',borderRadius:'4px' }}
                                />
                                <label>Date of Joining:</label>
                                <input 
                                    type="date" 
                                    name="joinedDate" 
                                    value={experience.joinedDate} 
                                    onChange={(e) => handleInputChange(e, index)} 
                                    placeholder="Joined Date" 
                                    required 
                                    style={{ width: '100%', padding: '8px',marginBottom: '15px',borderRadius:'4px' }}
                                />
                                <label>Last working day:</label>
                                <input 
                                    type="date" 
                                    name="resignedDate" 
                                    value={experience.resignedDate} 
                                    onChange={(e) => handleInputChange(e, index)} 
                                    placeholder="Resigned Date" 
                                    style={{ width: '100%', padding: '8px',marginBottom: '5px',borderRadius:'4px' }}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddExperience} style={{ width: '100%', padding: '8px',marginBottom: '10px',borderRadius:'4px' }}>Add +</button>
                    </div>
                )}

                <button type="submit" 
                onClick={handleSubmit}
                style={{ width: '100%', padding: '8px',marginTop: '20px',backgroundColor: '#a97e87',borderRadius: '5px',color:'white',border:'none'  }}>Save</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Experience;
