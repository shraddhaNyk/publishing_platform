import React, { useState, useRef,useEffect } from 'react';
import './Reviewer.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Reviewer() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedPublisherType, setSelectedPublisherType] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [incorporationNumber, setIncorporationNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [incorporationCertificate, setIncorporationCertificate] = useState(null);
  const [authorizationLetter, setAuthorizationLetter] = useState(null);
  const [digitalSignature, setDigitalSignature] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [EmpOrganisation, setEmpOrganisation] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [highSchoolFile, setHighSchoolFile] = useState(null);
  const [preUniversityFile, setPreUniversityFile] = useState(null);
  const [undergraduateFile, setUndergraduateFile] = useState(null);
  const [postgraduateFile, setPostgraduateFile] = useState(null);
  const [doctoralFile, setDoctoralFile] = useState(null);
  const [GovernementIdFile, setGovernementIdFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputs = useRef([]);
  const [studentId, setStudentId] = useState('');
  const [stOrganisation, setstOrganisation] = useState('');
  const [studentIdCard, setStudentIdCard] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentGovId, setStudentGovId] = useState(null);
  const [employeeIdCard, setEmployeeIdCard] = useState(null);
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeGovId, setEmployeeGovId] = useState(null);
  const [corporateOrganizationName, setCorporateOrganizationName] = useState('');
  const [corporateIncorporationNumber, setCorporateIncorporationNumber] = useState('');
  const [corporateGstNumber, setCorporateGstNumber] = useState('');
  const [corporateIncorporationCertificate, setCorporateIncorporationCertificate] = useState(null);
  const [corporateAuthorizationLetter, setCorporateAuthorizationLetter] = useState(null);
  const [corporateDigitalSignature, setCorporateDigitalSignature] = useState(null);
  const [corporateGovId, setCorporateGovId] = useState(null);
  const [publicationGovId, setpublicationGovId] = useState(null);
  const [corporate_email_domain,setcorporate_email_domain]=useState('');

  
 const [userid, setUserid] = useState(null);
 const [error, setError] = useState(null);
 const [message, setMessage] = useState('');
 const navigate = useNavigate();
 const [userRequests, setUserRequests] = useState([]);
 const [empId, setempId] = useState('');
 



 useEffect(() => {
  const fetchUserId = async () => {
    try {
      const response = await axios.get('/getUserId');  
      setUserid(response.data.userid);
      setEmployeeId(response.data.empid);
    } catch (err) {
      console.error('Error fetching user ID:', err);
      setError('Failed to fetch user ID');
    }
  };

  fetchUserId();
}, []);


  const handleFileSelect = (event, setter) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['application/pdf']; // Only allow PDF files

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setter(selectedFile);
    } else {
      setErrorMessage('Please select a PDF file.');
      event.target.value = null;
    }
  };

  const handleSubmit = () => {
    if (!highSchoolFile || !preUniversityFile || !undergraduateFile || !postgraduateFile || !doctoralFile || !GovernementIdFile) {
      setErrorMessage('Please select all qualification documents.');
      return;
    }
  
    const formData = new FormData();
    formData.append('request_type', 'Editor');
    formData.append('hs_card', highSchoolFile);
    formData.append('pu_card', preUniversityFile);
    formData.append('ug_card', undergraduateFile);
    formData.append('pg_card', postgraduateFile);
    formData.append('phd_card', doctoralFile);
    formData.append('gvt_card', GovernementIdFile);
  
    // Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    axios.post('http://localhost:3002/reviewer', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Success:', response.data);
      if (response.status === 200) {
        setMessage('Data saved successful');
        setTimeout(() => {
          navigate('/Response', {
            state: {
              role: 'Editor'
            }
          });
        }, 1000);
      } else {
        setMessage('Data failed to save');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('Data failed to save');
    });
  };
  


  const handlePublisherSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
  formData.append('request_type', 'publisher');
  formData.append('role_type', selectedPublisherType);
  formData.append('publication_organization_name', organizationName);
  formData.append('publication_register_number', incorporationNumber);
  formData.append('publication_gst_number', gstNumber);
  formData.append('publication_certificate', incorporationCertificate);
  formData.append('publication_authorization_letter', authorizationLetter);
  formData.append('publication_digital_signature', digitalSignature);
  formData.append('government_id_proof', publicationGovId);
  console.log(formData)

  axios.post('http://localhost:3002/reviewer', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    console.log('Success:', response.data);
              if (response.status === 200) {
                setMessage('Data saved successful');
      setTimeout(() => {
        navigate('/Response', {
          state: {
            role:'publisher'
          }
        });
      }, 1000);
      } else{
        setMessage('Data failed to save');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('Data failed to save');
    });
  };

  const handleBrowseButtonClick = (index) => {
    fileInputs.current[index].click();
  };

  const handleAdminSubmit = () => {
    // Handle admin request approval logic here
    axios.post('http://localhost:3002/reviewer', {
      id:userid,
      request_type:'Admin',
      employee_id:employeeId,
      role_needed:selectedRole
    },{
      withCredentials: true
    })
    .then((response) => {
      console.log('Response:', response.data);
      if (response.status === 200) {
        setMessage('Data saved successful');
        setTimeout(() => {
          navigate('/Response', {
            state: {
              role:'Admin'
            }
          });
        }, 1000);
      } else{
        setMessage('Data failed to save');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('Data failed to save');
    });
  };

  const handleEmployeeSubmit = () => {
    const formData = new FormData();
    formData.append('request_type', 'Employee');
    formData.append('corporate_employee_organisation',EmpOrganisation);
    formData.append('corporate_employee_id', empId);
    formData.append('corporate_employee_email', employeeEmail);
    formData.append('corporate_employee_idcard', employeeIdCard);
    formData.append('government_id_proof', employeeGovId);
   
  // Log FormData entries
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  axios.post('http://localhost:3002/reviewer', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    console.log('Success:', response.data);
    if (response.status === 200) {
      setMessage('Data saved successful');
      setTimeout(() => {
        navigate('/Response', {
          state: {
            role:'employee'
          }
        });
      }, 1000);
    } else {
      setMessage('Data failed to save');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    setMessage('Data failed to save');
  });
};


const handleStudentSubmit = () => {
  const formData = new FormData();
  formData.append('request_type', 'Student');
  formData.append('student_organisation', stOrganisation);
  formData.append('student_id', studentId);
  formData.append('student_email', studentEmail);
  formData.append('student_idcard', studentIdCard);
  formData.append('government_id_proof', studentGovId);
  
// Log FormData entries
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}

axios.post('http://localhost:3002/reviewer', formData, {
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => {
  console.log('Success:', response.data);
  if (response.status === 200) {
    setMessage('Data saved successful');
    setTimeout(() => {
      navigate('/Response', {
        state: {
          role:'employee'
        }
      });
    }, 1000);
  } else {
    setMessage('Data failed to save');
  }
})
.catch((error) => {
  console.error('Error:', error);
  setMessage('Data failed to save');
});
};





  const handleCorporateSubmit = () => {
  const  corporate_IJST_identification_number = Math.floor(100000 + Math.random() * 900000).toString();
    const formData = new FormData();
  formData.append('request_type', 'corporate');
  formData.append('corporate_IJST_identification_number', corporate_IJST_identification_number);
  formData.append('corporate_organization_name', corporateOrganizationName);
  formData.append('corporate_incorporation_number', corporateIncorporationNumber);
  formData.append('corporate_gst_number',  corporateGstNumber);
  formData.append('corporate_incorporation_certificate', corporateIncorporationCertificate);
  formData.append('corporate_authorization_letter', corporateAuthorizationLetter);
  formData.append('corporate_digital_signature', corporateDigitalSignature);
  formData.append('corporate_email_domain', corporate_email_domain);
  formData.append('government_id_proof', corporateGovId);
  console.log(formData)

  axios.post('http://localhost:3002/reviewer', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    console.log('Success:', response.data);
              if (response.status === 200) {
              setMessage ('Data saved successfully');
      setTimeout(() => {
        navigate('/Response', {
          state: {
            role:'corporate'
          }
        });
      }, 1000);
      } else{
        setMessage('Data failed to save');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('Data failed to save');
    });
  };
 


  const [userRequestsStatus, setUserRequestsStatus] = useState([]);

  useEffect(() => {
    fetch('/Display_status')
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

  const handleDeleteRequest = (id, requestType) => { 
    axios.post('http://localhost:3002/delete_request', {
      id: id,
      request_type: requestType, 
    }, {
      withCredentials: true,
    })
      .then(response => {
        console.log('Success:', response.data);
        if (response.status === 200) {
          setMessage('Request deleted');
          
        } else {
          setMessage('Request failed to delete');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Request failed to delete');
      });
  };
 
  const [currentStep, setCurrentStep] = useState(0);
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };




  return (
    <div className="reviewer-container">
      <div className="reviewer-header">
        <h1 style={{marginTop: '2%',marginBottom: '5%'}}> Request for a role</h1>
      <div>
      <label style={{fontSize:'1.1rem'}} className="reviewer-option-label">
        Select your role:
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          style={{ marginLeft: '1%',marginTop: '10px',marginBottom: '5%',fontSize:'1.1rem',padding:'1%',borderRadius: '20px'}}
        >
          <option value="" disabled>Select an option</option>
          <option value="admin">Want to be an admin</option>
          <option value="publisher">Want to be a publisher</option>
          <option value="Employee">I am a employee</option>
          <option value="Student">I am a student</option>
          <option value="reviewer">Want to be a reviewer</option>
          <option value="corporate">I am a corporate company / institution</option>
        </select>
      </label>
    </div>
        

        { /*Admin Block* */}
        {selectedOption === 'admin' && (
          <div className="admin-application">
            <h3>Admin Application</h3>
            <div className='UserEmpID'>
            {currentStep === 0 && (
     <div style={{ marginTop: '10px' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10%' }}>
      <label style={{ marginRight: '5%' }}>User ID:</label>
      <input
        type="text"
        value={userid}
        onChange={(e) => setUserid(e.target.value)}
        style={{ marginRight: '10px',width: '100%'}}
      />
      <button  onClick={handleNext} style={{ width: '35%',marginTop: '5%',height: '25px',backgroundColor:'#2d324e',color:'white' }}>
        Next
      </button>
    </div>
  </div>
)}
  {currentStep === 1 && (
  <div style={{ marginTop: '10px' }}>
    <div style={{ display: 'flex', alignItems: 'center',marginTop: '10%'  }}>
      <label style={{ marginRight: '10px' }}>Employee ID:</label>
      <input
        type="text"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        style={{ marginRight: '10px' }}
      />
     <button  onClick={handleNext} style={{ width: '35%',marginTop: '5%',height: '25px',backgroundColor:'#2d324e',color:'white' }}>
        Next
      </button>
    </div>
  </div>
)}          
          
          </div>
          {currentStep === 2 && (
            <div className='role' style={{ marginTop: '10px' }}>
              <label>What role do you need ?</label>
              <div className='role-options' style={{ marginLeft: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRole === 'User admin'}
                    onChange={() => setSelectedRole('User admin')}
                    style={{marginRight:'2%'}}
                  />
                  User admin 
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRole === 'Community admin'}
                    onChange={() => setSelectedRole('Community admin')}
                    style={{marginRight:'2%'}}
                  />
                  Community admin 
                </label>
                <br/>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRole === 'Interest admin'}
                    onChange={() => setSelectedRole('Interest admin')}
                    style={{marginRight:'2%'}}
                  />
                  Interest admin 
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRole === 'Editor'}
                    onChange={() => setSelectedRole('Editor')}
                    style={{marginRight:'2%'}}
                  />
                  Journal admin/ Editor 
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRole === 'Publisher admin'}
                    onChange={() => setSelectedRole('Publisher admin')}
                    style={{marginRight:'2%'}}
                  />
                  Publisher admin
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={selectedRole === 'Corporate admin'}
                    onChange={() => setSelectedRole('Corporate admin')}
                    style={{marginRight:'2%'}}
                  />
                  Corporate admin 
                </label>
              </div>
            </div>
            )}

           {currentStep === 2 && (
            <div className="submit-btn-container">
              <button className="submit-btn" onClick={handleAdminSubmit}>Request Approval</button>
            </div>
            )}
          </div>
        )}


        {/* Publisher Block */}
       
        {selectedOption === 'publisher' && (
<div className="publisher-application">
      <h3>Publisher Application</h3>
      
      {currentStep === 0 && (
  <div className="publisher-type" style={{ marginTop: '10px' }}>
    <div style={{ marginBottom: '15px' }}>
      <label className="publisher-type-label" style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <input
          type="radio"
          checked={selectedPublisherType === 'university'}
          onChange={() => setSelectedPublisherType('university')}
          style={{ marginRight: '10px' }}
        />
        Academic Institutions
      </label>
      <p style={{ marginLeft: '22px',textAlign:'justify' }}>
        Many universities and research institutions publish their own journals to showcase research conducted by their faculty, students, and affiliated researchers.
      </p>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label className="publisher-type-label" style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <input
          type="radio"
          checked={selectedPublisherType === 'academicSociety'}
          onChange={() => setSelectedPublisherType('academicSociety')}
          style={{ marginRight: '10px' }}
        />
        Professional Societies or Associations
      </label>
      <p style={{ marginLeft: '22px',textAlign:'justify' }}>
        These organizations often publish journals related to their field of expertise. For example, the American Psychological Association (APA) publishes several psychology journals.
      </p>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label className="publisher-type-label" style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <input
          type="radio"
          checked={selectedPublisherType === 'commercial'}
          onChange={() => setSelectedPublisherType('commercial')}
          style={{ marginRight: '10px' }}
        />
        Commercial Publishing Companies
      </label>
      <p style={{ marginLeft: '22px',textAlign:'justify' }}>
        These companies specialize in publishing academic journals across various disciplines. Examples include Elsevier, Springer Nature, Wiley, and Taylor & Francis.
      </p>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label className="publisher-type-label" style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <input
          type="radio"
          checked={selectedPublisherType === 'independent'}
          onChange={() => setSelectedPublisherType('independent')}
          style={{ marginRight: '10px',textAlign:'justify' }}
        />
        Independent Publishers
      </label>
      <p style={{ marginLeft: '22px',textAlign:'justify' }}>
        Some journals are published by independent publishers or small publishing houses that focus on specific niche areas or emerging fields.
      </p>
    </div>
          {selectedPublisherType && (
            <button className="next-btn" onClick={handleNext}  style={{marginLeft: '50%',width: '15%',height: '25px',backgroundColor:'#2d324e',color:'white'}}>
              Next
            </button>
          )}
        </div>
      )}


{currentStep === 1 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Organization Name:</label>
    <input
      type="text"
      value={organizationName}
      onChange={(e) => setOrganizationName(e.target.value)}
      style={{ marginRight: '10px', width: '250px', height: '30px' }}  
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

      {currentStep === 2 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px'}}>Incorporation/Registration Number:</label>
    <input
      type="text"
      value={incorporationNumber}
      onChange={(e) => setIncorporationNumber(e.target.value)}
      style={{ marginRight: '10px', width: '250px', height: '30px' }} 
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

{currentStep === 3 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>GST Number/VAT Number:</label>
    <input
      type="text"
      value={gstNumber}
      onChange={(e) => setGstNumber(e.target.value)}
      style={{ marginRight: '10px', width: '250px', height: '30px' }}
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

{currentStep === 4 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Incorporation Registration Certificate:</label>
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setIncorporationCertificate)}
      style={{ marginRight: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{ marginLeft: '5%',width: '15%',height: '25px',backgroundColor: '#2d324e', color: 'white'}}
    >
      Next
    </button>
  </div>
)}

{currentStep === 5 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px'}}>Authorization Letter:</label>
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setAuthorizationLetter)}
      style={{ marginRight: '10px' }}
    />
  <button
      className="next-btn"
      onClick={handleNext}
      style={{ marginLeft: '5%',width: '15%',height: '25px',backgroundColor: '#2d324e', color: 'white'}}
    >
      Next
    </button>
  </div>
)}
{currentStep === 6 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px'}}>Governement Id Proof:</label>
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setpublicationGovId)}
      style={{ marginRight: '10px' }}
    />
  
  </div>
)}
   
      {currentStep === 6 && (
        <div className="submit-btn-container">
          <button className="submit-btn" onClick={handlePublisherSubmit}>
            Request Approval
          </button>
        </div>
      )}
    </div>

)}



 {/*  Student Block */}
 {selectedOption === 'Student' && (
<div className="publisher-application">
      <h3>Publisher Application</h3> 
      {currentStep === 0 && (
 <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
 <label style={{ marginRight: '10px' }}>Organization Name:</label>
 <input
   type="text"
   value={stOrganisation}
   onChange={(e) => setstOrganisation(e.target.value)}
   style={{ marginRight: '10px', width: '250px', height: '30px' }}  
 />
 <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
   Next
 </button>
</div>

      )}


{currentStep === 1 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Student ID:</label>
    <input
      type="text"
      value={studentId}
      onChange={(e) => setStudentId(e.target.value)}
      style={{ marginRight: '10px', width: '250px', height: '30px' }}  
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

      {currentStep === 2 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px'}}>Student Email:</label>
    <input
      type="text"
      value={studentEmail}
      onChange={(e) => setStudentEmail(e.target.value)}
      style={{ marginRight: '10px', width: '250px', height: '30px' }} 
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

{currentStep === 3 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Student ID:</label>
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setStudentIdCard)}
      style={{ marginRight: '10px' }}
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

{currentStep === 4 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Government ID:</label>
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setStudentGovId)}
      style={{ marginRight: '10px' }}
    />
    
  </div>
)}
      {currentStep === 4 && (
        <div className="submit-btn-container">
          <button className="submit-btn" onClick={handleStudentSubmit}>
            Request Approval
          </button>
        </div>
      )}
    </div>

)}

{/* Employee Block */}
{selectedOption === 'Employee' && (
<div className="publisher-application">
      <h3>Employee Application</h3> 
      {currentStep === 0 && (
 <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
 <label style={{ marginRight: '10px' }}>Organization Name:</label>
 <input
   type="text"
   value={EmpOrganisation}
   onChange={(e) => setEmpOrganisation(e.target.value)}
   style={{ marginRight: '10px', width: '250px', height: '30px' }}  
 />
 <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
   Next
 </button>
</div>

      )}


{currentStep === 1 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Employee ID:</label>
    <input
      type="text"
      value={empId}
      onChange={(e) => setempId(e.target.value)}
      style={{ marginRight: '10px', width: '250px', height: '30px' }}  
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

      {currentStep === 2 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px'}}>Employee Email:</label>
    <input
      type="text"
      value={employeeEmail}
      onChange={(e) => setEmployeeEmail(e.target.value)}
      style={{ marginRight: '10px', width: '250px', height: '30px' }} 
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

{currentStep === 3 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
 
    <label style={{ marginRight: '10px' }}>Employee ID Card:</label>
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setEmployeeIdCard)}
      style={{ marginRight: '10px' }}
    />
    <button className="next-btn" onClick={handleNext} style={{ width: '100px', height: '30px', backgroundColor: '#2d324e', color: 'white' }}>
      Next
    </button>
  </div>
)}

{currentStep === 4 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Government ID:</label>
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setEmployeeGovId)}
      style={{ marginRight: '10px' }}
    />
  
  </div>
)}
      {currentStep === 4 && (
        <div className="submit-btn-container">
          <button className="submit-btn" onClick={handleEmployeeSubmit}>
            Request Approval
          </button>
        </div>
      )}
    </div>

)}

 
       
       
       { /*Reviewer Block* */}
        {selectedOption === 'reviewer' && (
          <div className="qualification-docs">
            <h3>Reviewer Application</h3>
            {/* High School */}
            {currentStep === 0 && (
            <div style={{ marginTop: '20px' }}>
            
              <label>High School :</label>
              <input
                type="file"
                ref={(el) => (fileInputs.current[0] = el)}
                style={{ display: 'none' }}
                onChange={(event) => handleFileSelect(event, setHighSchoolFile)}
                accept=".pdf"
              />
              <label
                htmlFor="highSchoolFileInput"
                style={{ fontSize: '115%', marginLeft: '10px', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}
                onClick={() => handleBrowseButtonClick(0)}
              >
                Browse
              </label>
              {highSchoolFile && <span style={{ marginLeft: '10px' }}>{highSchoolFile.name}</span>}
            
              <button className="next-btn" onClick={handleNext}  style={{marginLeft: '5%', width: '15%', height: '25px', backgroundColor: '#2d324e',color: 'white',marginTop: '3%' }}>
            Next
          </button>
            </div>
            )}
       
            {/* Pre-University College */}
            {currentStep === 1 && (
            <div style={{ marginTop: '20px' }}>
              <label>Pre-University College :</label>
              <input
                type="file"
                ref={(el) => (fileInputs.current[1] = el)}
                style={{ display: 'none' }}
                onChange={(event) => handleFileSelect(event, setPreUniversityFile)}
                accept=".pdf"
              />
              <label
                htmlFor="preUniversityFileInput"
                style={{ fontSize: '115%', marginLeft: '10px', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}
                onClick={() => handleBrowseButtonClick(1)}
              >
                Browse
              </label>
              {preUniversityFile && <span style={{ marginLeft: '10px' }}>{preUniversityFile.name}</span>}
              <button className="next-btn" onClick={handleNext}  style={{marginLeft: '5%', width: '15%', height: '25px', backgroundColor: '#2d324e',color: 'white',marginTop: '3%' }}>
            Next
          </button>
            </div>
            )}
            {/* Undergraduate College */}
            {currentStep === 2 && (
            <div style={{ marginTop: '20px' }}>
              <label>Undergraduate College :</label>
              <input
                type="file"
                ref={(el) => (fileInputs.current[2] = el)}
                style={{ display: 'none' }}
                onChange={(event) => handleFileSelect(event, setUndergraduateFile)}
                accept=".pdf"
              />
              <label
                htmlFor="undergraduateFileInput"
                style={{ fontSize: '115%', marginLeft: '10px', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}
                onClick={() => handleBrowseButtonClick(2)}
              >
                Browse
              </label>
              {undergraduateFile && <span style={{ marginLeft: '10px' }}>{undergraduateFile.name}</span>}
              <button className="next-btn" onClick={handleNext}  style={{marginLeft: '5%', width: '15%', height: '25px', backgroundColor: '#2d324e',color: 'white',marginTop: '3%' }}>
            Next
          </button>
            </div>
            )}

            {/* Postgraduate College */}
            {currentStep === 3 && (
            <div style={{ marginTop: '20px' }}>
              <label>Postgraduate College :</label>
              <input
                type="file"
                ref={(el) => (fileInputs.current[3] = el)}
                style={{ display: 'none' }}
                onChange={(event) => handleFileSelect(event, setPostgraduateFile)}
                accept=".pdf"
              />
              <label
                htmlFor="postgraduateFileInput"
                style={{ fontSize: '115%', marginLeft: '10px', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}
                onClick={() => handleBrowseButtonClick(3)}
              >
                Browse
              </label>
              {postgraduateFile && <span style={{ marginLeft: '10px' }}>{postgraduateFile.name}</span>}
              <button className="next-btn" onClick={handleNext}  style={{marginLeft: '5%', width: '15%', height: '25px', backgroundColor: '#2d324e',color: 'white',marginTop: '3%' }}>
            Next
          </button>
            </div>
            )}
            {/* Doctoral or PhD */}
            {currentStep === 4 && (
            <div style={{ marginTop: '20px' }}>
              <label>Doctoral or PhD :</label>
              <input
                type="file"
                ref={(el) => (fileInputs.current[4] = el)}
                style={{ display: 'none' }}
                onChange={(event) => handleFileSelect(event, setDoctoralFile)}
                accept=".pdf"
              />
              <label
                htmlFor="doctoralFileInput"
                style={{ fontSize: '115%', marginLeft: '10px', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}
                onClick={() => handleBrowseButtonClick(4)}
              >
                Browse
              </label>
              {doctoralFile && <span style={{ marginLeft: '10px' }}>{doctoralFile.name}</span>}
              <button className="next-btn" onClick={handleNext}  style={{marginLeft: '5%', width: '15%', height: '25px', backgroundColor: '#2d324e',color: 'white',marginTop: '3%' }}>
            Next
          </button>
            </div>
            )}
            {/* Doctoral or PhD */}
            {currentStep === 5 && (
            <div style={{ marginTop: '20px' }}>
              <label>Governement Id Proof :</label>
              <input
                type="file"
                ref={(el) => (fileInputs.current[5] = el)}
                style={{ display: 'none' }}
                onChange={(event) => handleFileSelect(event, setGovernementIdFile)}
                accept=".pdf"
              />
              <label
                htmlFor="governementIdFileInput"
                style={{ fontSize: '115%', marginLeft: '10px', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}
                onClick={() => handleBrowseButtonClick(5)}
              >
                Browse
              </label>
              {GovernementIdFile && <span style={{ marginLeft: '10px' }}>{GovernementIdFile.name}</span>}
              
            </div>
            )}
            {/* Submit Button */}
            {currentStep === 5 && (
            <div className="submit-btn-container">
              <button className="submit-btn" onClick={handleSubmit}>Request Approval</button>
            </div>
            )}
          </div>
   
        )}
        
        {/*Corporate Company / Institution Application  */}
        {selectedOption === 'corporate' && (
          <div className="corporate-application">
            <h3>Corporate Company / Institution Application</h3>
            {currentStep === 0 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>Organization Name:</label>
    <input
      type="text"
      value={corporateOrganizationName}
      onChange={(e) => setCorporateOrganizationName(e.target.value)}
      style={{ marginRight: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{
        width: '15%',
        height: '25px',
        backgroundColor: '#2d324e',
        color: 'white',
        marginTop: '1%'
      }}
    >
      Next
    </button>
  </div>
)}

{currentStep === 1 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px'}}>Incorporation/Registration Number:</label>
    <input
      type="text"
      value={corporateIncorporationNumber}
      onChange={(e) => setCorporateIncorporationNumber(e.target.value)}
      style={{ marginRight: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{
        width: '15%',
        height: '25px',
        backgroundColor: '#2d324e',
        color: 'white',
        marginTop: '1%'
      }}
    >
      Next
    </button>
  </div>
)}

{currentStep === 2 && (
  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <label style={{ marginRight: '10px' }}>GST Number/VAT Number:</label>
    <input
      type="text"
      value={corporateGstNumber}
      onChange={(e) => setCorporateGstNumber(e.target.value)}
      style={{ marginRight: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{
        width: '15%',
        height: '25px',
        backgroundColor: '#2d324e',
        color: 'white',
        marginTop: '1%'
      }}
    >
      Next
    </button>
  </div>
)}

{currentStep === 3 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Incorporation Registration Certificate:</label><br />
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setCorporateIncorporationCertificate)}
      style={{  marginRight: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{
        width: '15%',
        height: '25px',
        backgroundColor: '#2d324e',
        color: 'white'
      }}
    >
      Next
    </button>
  </div>
)}


{currentStep === 4 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Authorization Letter:</label><br />
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setCorporateAuthorizationLetter)}
      style={{ marginRight: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{
        width: '15%',
        height: '25px',
        backgroundColor: '#2d324e',
        color: 'white'
      }}
    >
      Next
    </button>
  </div>
)}


{currentStep === 5 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Digital Signature:</label><br />
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setCorporateDigitalSignature)}
      style={{ marginBottom: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{
        width: '15%',
        height: '25px',
        backgroundColor: '#2d324e',
        color: 'white'
      }}
    >
      Next
    </button>
  </div>
)}
{currentStep === 6 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Corporate email domain:</label><br />
    <input
      type="text"
      value={corporate_email_domain}
      onChange={(e) => setcorporate_email_domain(e.target.value)}
      style={{ marginRight: '10px' }}
    />
    <button
      className="next-btn"
      onClick={handleNext}
      style={{
        width: '15%',
        height: '25px',
        backgroundColor: '#2d324e',
        color: 'white'
      }}
    >
      Next
    </button>
  </div>
)}

{currentStep === 7 && (
  <div className="form-group" style={{ marginTop: '10px' }}>
    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Governement Id Proof:</label><br />
    <input
      type="file"
      onChange={(e) => handleFileSelect(e, setCorporateGovId)}
      style={{ marginBottom: '10px' }}
    />
   
  </div>
)}

        {currentStep === 7 && (
            <div className="submit-btn-container">
              <button className="submit-btn" onClick={handleCorporateSubmit}>
                Request Approval
              </button>
            </div>
            )}
          </div>
        )}
      </div>
      {message && <div>{message}</div>}
      <div className="table-container1">
      <h3 style={{marginTop:'5%',marginBottom:'2%'}}>Your previously submitted role request</h3>
      <table className="table">
        <thead>
          <tr>
            <th>IJST ID </th>
            <th>request ID</th>
            <th>Role Requested</th>
            <th>Status</th>
            <th>Revoke</th>
          </tr>
        </thead>
        <tbody>
          {userRequestsStatus.map((request) => (
            <tr key={request.IJST_ID }>
              <td>{request.IJST_ID }</td>
              <td>{request.request_ID}</td>
              <td>{request.request_type}</td>
              <td>{request.role_status}</td>
              <td>
                <button onClick={() => handleDeleteRequest(request.id, request.request_type)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>

  );
}

export default Reviewer;
