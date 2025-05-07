// export default Submit;
import React, { useState,useEffect } from 'react';
import './SubmitPaper.css';
import axios from 'axios';

function Submit() {
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  // State to store the selected cover letter file
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  // State to control the visibility of the cover letter message box
  const [showCoverLetterMessageBox, setShowCoverLetterMessageBox] = useState(false);

  
  // Function to handle file selection for cover letter
  const handleCoverLetterFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['application/pdf']; // Only allow PDF files

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      // Handle the selected file (e.g., store it in state)
      setCoverLetterFile(selectedFile);
    } else {
      // Show the message box for cover letter
      setShowCoverLetterMessageBox(true);
      // Optionally, you can clear the selected file here
      event.target.value = null;
    }
  };

  // State to store the selected paper file
  const [paperFile, setPaperFile] = useState(null);
  // State to control the visibility of the paper message box
  const [showPaperMessageBox, setShowPaperMessageBox] = useState(false);

   // State to store the selected paper file
   const [paperFilePlagiarism, setPaperFilePlagiarism] = useState(null);
   // State to control the visibility of the paper message box
   const [showPaperPlagiarismMessageBox, setShowPaperPlagiarismMessageBox] = useState(false);

  // State to store paper title
  const [paperTitle, setPaperTitle] = useState('');
  // State to control paper title error message
  const [paperTitleError, setPaperTitleError] = useState('');

  // State to store selected technology
  const [selectedTechnology, setSelectedTechnology] = useState('');
  // State to control technology error message
  const [technologyError, setTechnologyError] = useState('');

    // State to store selected Industries
    const [selectedIndustries, setSelectedIndustries] = useState('');
    // State to control Industries error message
    const [IndustriesError, setIndustriesError] = useState('');

  const [mlaCitation, setMlaCitation] = useState('');
  const [apaCitation, setApaCitation] = useState('');
  const [chicagoCitation, setChicagoCitation] = useState('');
  const [harvardCitation, setHarvardCitation] = useState('');
  const [vancouverCitation, setVancouverCitation] = useState('');
  const [refmlaCitation, setRefMlaCitation] = useState('');
  const [refapaCitation, setRefApaCitation] = useState('');
  const [refchicagoCitation, setRefChicagoCitation] = useState('');
  const [refharvardCitation, setRefHarvardCitation] = useState('');
  const [refvancouverCitation, setRefVancouverCitation] = useState('');
  const [technologies, setTechnologies] = useState([]);
const [industries, setIndustries] = useState([]);


  useEffect(() => {
    // Fetch technologies
    axios.get('http://localhost:3002/api/technology')
      .then(response => {
        setTechnologies(response.data);
      })
      .catch(err => console.log(err));
  
    // Fetch industries
    axios.get('http://localhost:3002/api/industry')
      .then(response => {
        setIndustries(response.data);
      })
      .catch(err => console.log(err));
  }, []);
  // Function to handle file selection for paper
  const handlePaperFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['application/pdf']; // Only allow PDF files

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      // Handle the selected file (e.g., store it in state)
      setPaperFile(selectedFile);
    } else {
      // Show the message box for paper
      setShowPaperMessageBox(true);
      // Optionally, you can clear the selected file here
      event.target.value = null;
    }
  };
   // Function to handle file selection for paper
   const handlePaperFilePlagiarismSelect = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['application/pdf']; // Only allow PDF files

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      // Handle the selected file (e.g., store it in state)
      setPaperFilePlagiarism(selectedFile);
    } else {
      // Show the message box for paper
      setShowPaperPlagiarismMessageBox(true);
      // Optionally, you can clear the selected file here
      event.target.value = null;
    }
  };

  // Function to handle upload button click
 // Function to handle upload button click
const handleUpload = () => {
 
    // Reset error messages
    setPaperTitleError('');
    setTechnologyError('');
    setIndustriesError('');


    // Check if all fields are filled out
    if (paperTitle.trim() === '') {
      setPaperTitleError('Please enter paper title.');
      return;
    }

    if (selectedTechnology === '') {
      setTechnologyError('Please select a technology.');
      return;
    }

    if (selectedIndustries === '') {
      setIndustriesError('Please select a technology.');
      return;
    }

    if (!coverLetterFile) {
      setShowCoverLetterMessageBox(true);
      return;
    }
   

    if (!paperFile) {
      setShowPaperMessageBox(true);
      return;
    }

    if (!paperFilePlagiarism) {
      setShowPaperPlagiarismMessageBox(true);
      return;
    }

     // Create FormData object to send files and data
  const formData = new FormData();
  formData.append('paperTitle', paperTitle);
  formData.append('selectedTechnology', selectedTechnology);
  formData.append('selectedIndustries', selectedIndustries);
  formData.append('coverLetterFile', coverLetterFile);
  formData.append('paperFile', paperFile);
  formData.append('paperFilePlagiarism',paperFilePlagiarism);
  formData.append('mlaCitation', mlaCitation);
  formData.append('apaCitation', apaCitation);
  formData.append('chicagoCitation', chicagoCitation);
  formData.append('harvardCitation', harvardCitation);
  formData.append('vancouverCitation', vancouverCitation);
  formData.append('Reference_mla_citation', refmlaCitation);
  formData.append('Reference_apa_citation', refapaCitation);
  formData.append('Reference_chicago_citation', refchicagoCitation);
  formData.append('Reference_harvard_citation', refharvardCitation);
  formData.append('Reference_vancouver_citation', refvancouverCitation);

  // Make a POST request to the backend endpoint
  axios.post('http://localhost:3002/submitPaper', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // Add enctype attribute here
    }
  })
  .then(response => {
    console.log('Success:', response.data);
              if (response.status === 200) {
                alert('upload successfully');
                setPaperTitle('');
                setSelectedTechnology('');
                setSelectedIndustries('');
                setCoverLetterFile(null);
                setPaperFile(null);
                setPaperFilePlagiarism(null);
                setMlaCitation('');
                setApaCitation('');
                setChicagoCitation('');
                setHarvardCitation('');
                setVancouverCitation('');
                setRefMlaCitation('');
                setRefApaCitation('');
                setRefChicagoCitation('');
                setRefHarvardCitation('');
                setRefVancouverCitation('');
      setTimeout(() => {
        setMessage (''); // Clear the message after a brief delay
      }, 1000);
    } else {
      setMessage('Failed to upload');
    }
      
  })
  .catch(err => console.log(err));

   };

     const steps = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Citation' },
    { id: 3, name: 'References' },
    { id: 4, name: 'Uploads' }
  ];
  return (
    <div style={{ width: '90%', height: '75vh', margin: 'auto', background: 'white', borderRadius: '10px', padding: '0px' }}>
      <div>
        <div style={{ fontFamily: 'Cambria'}}>
          {/* Section Title */}
          <h5 style={{ fontWeight: 'normal', fontSize: '30px', padding: '1%', marginLeft: '13%' }}> Submit Paper</h5>



          {/* Step Navigation */}
      <div className="stepper-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {steps.map((step) => (
          <div
            key={step.id}
            className={`step-block ${currentPage === step.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(step.id)}
            style={{
              width: '150px',
              textAlign: 'center',
              padding: '10px',
              margin: '0 5px',
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: currentPage === step.id ? '#04AA6D' : '#e0e0e0',
              color: currentPage === step.id ? 'white' : 'black'
            }}
          >
            {step.name}
          </div>
        ))}
      </div>


          <div style={{ width: '100%', height: 'auto', margin: 'auto', background: '#d1d1d1', paddingTop: '2%',paddingBottom:'2%', fontFamily: 'Cambria', display: 'flex' }}>
            <div style={{ marginLeft: '15%', width: '100%', paddingTop: '0%' }}>
            {currentPage === 1 && (
             <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3%',marginTop:'5%' }}>
                <label htmlFor="paperTitle" style={{ fontSize: '125%', marginRight: '2%', width: '150px', textAlign: 'left' }}>Paper Title:</label>
                <input
                  className="mt-2 mr-2 block w-72 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="paperTitle"
                  placeholder="Enter paper title"
                  onChange={(e) => setPaperTitle(e.target.value)}
                />
                <span style={{ color: 'red', marginLeft: '10px' }}>{paperTitleError}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3%' }}>
                <label htmlFor="Technology" style={{ fontSize: '125%', marginRight: '2%', width: '150px', textAlign: 'left' }}>Technologies:</label>
                <select
                  id="Technology"
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  className=" mr-2 block w-72 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                >
                  <option value="">Select</option>
                      {technologies.map((tech, index) => (
                        <option key={index} value={tech.technologyName}>{tech.technologyName}</option>
                     ))}

                </select>
                <span style={{ color: 'red', marginLeft: '10px' }}>{technologyError}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="Industries" style={{ fontSize: '125%', marginRight: '2%', width: '150px', textAlign: 'left' }}>Industries:</label>
                <select
                  id="Industries"
                  onChange={(e) => setSelectedIndustries(e.target.value)}
                  className=" mr-2 block w-72 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                >
                   <option value="">Select</option>
                        {industries.map((industry, index) => (
                          <option key={index} value={industry.industryName}>{industry.industryName}</option>
                       ))}
                </select>
                <span style={{ color: 'red', marginLeft: '10px' }}>{IndustriesError}</span>
              </div>
              </div>
            )}
                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}></div> */}
                {currentPage === 2 && (

              <div><h2 className='font-normal mr-32'>Please enter your details of the paper in the following formats which other can use to cite your paper</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="mlaCitation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>MLA Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="mlaCitation"
                  value={mlaCitation}
                  onChange={(e) => setMlaCitation(e.target.value)}
                />
               <p
               className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Yanping, et al. "Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol)." Reproductive biomedicine online 29.6 (2014): 684-691.)
                </p>
                <p></p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="apaCitation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>APA Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="apaCitation"
                  value={apaCitation}
                  onChange={(e) => setApaCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Y., Chen, Q., Hong, Q., Lyu, Q., Ai, A., Fu, Y., & Shoham, Z. (2014). Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol). Reproductive biomedicine online, 29(6), 684-691.)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="chicagoCitation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>Chicago Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="chicagoCitation"
                  value={chicagoCitation}
                  onChange={(e) => setChicagoCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Yanping, Qiuju Chen, Qingqing Hong, Qifeng Lyu, Ai Ai, Yonglun Fu, and Zeev Shoham. "Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol)." Reproductive biomedicine online 29, no. 6 (2014): 684-691.)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="harvardCitation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>Harvard Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="harvardCitation"
                  value={harvardCitation}
                  onChange={(e) => setHarvardCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Y., Chen, Q., Hong, Q., Lyu, Q., Ai, A., Fu, Y. and Shoham, Z., 2014. Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol). Reproductive biomedicine online, 29(6), pp.684-691.)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="vancouverCitation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>Vancouver Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="vancouverCitation"
                  value={vancouverCitation}
                  onChange={(e) => setVancouverCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang Y, Chen Q, Hong Q, Lyu Q, Ai A, Fu Y, Shoham Z. Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol). Reproductive biomedicine online. 2014 Dec 1;29(6):684-91.)
                </p>
              </div>
              </div> 
              )}
              {currentPage === 3 && (
              <div><h2 className='font-normal mr-28'>Please enter details of the paper which your are citing</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="Reference_mla_citation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>MLA Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="Reference_mla_citation"
                  value={refmlaCitation}
                  onChange={(e) => setRefMlaCitation(e.target.value)}
                />
               <p
               className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Yanping, et al. "Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol)." Reproductive biomedicine online 29.6 (2014): 684-691.)
                </p>
                <p></p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="Reference_apa_citation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>APA Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="Reference_apa_citation"
                  value={refapaCitation}
                  onChange={(e) => setRefApaCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Y., Chen, Q., Hong, Q., Lyu, Q., Ai, A., Fu, Y., & Shoham, Z. (2014). Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol). Reproductive biomedicine online, 29(6), 684-691.)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="Reference_chicago_citation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>Chicago Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="Reference_chicago_citation"
                  value={refchicagoCitation}
                  onChange={(e) => setRefChicagoCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Yanping, Qiuju Chen, Qingqing Hong, Qifeng Lyu, Ai Ai, Yonglun Fu, and Zeev Shoham. "Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol)." Reproductive biomedicine online 29, no. 6 (2014): 684-691.)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="Reference_harvard_citation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>Harvard Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="Reference_harvard_citation"
                  value={refharvardCitation}
                  onChange={(e) => setRefHarvardCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang, Y., Chen, Q., Hong, Q., Lyu, Q., Ai, A., Fu, Y. and Shoham, Z., 2014. Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol). Reproductive biomedicine online, 29(6), pp.684-691.)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="Reference_vancouver_citation" style={{ fontSize: '125%', marginRight: '0%', width: '150px', textAlign: 'left' }}>Vancouver Citation:</label>
                <textarea
                  className="mt-2 block w-96 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
                  type="text"
                  id="Reference_vancouver_citation"
                  value={refvancouverCitation}
                  onChange={(e) => setRefVancouverCitation(e.target.value)}
                />
                <p
                className='w-96'
                style={{marginLeft:'1%',marginTop:'2%',textAlign:'justify'}}
                > e.g.:(Kuang Y, Chen Q, Hong Q, Lyu Q, Ai A, Fu Y, Shoham Z. Double stimulations during the follicular and luteal phases of poor responders in IVF/ICSI programmes (Shanghai protocol). Reproductive biomedicine online. 2014 Dec 1;29(6):684-91.)
                </p>
              </div>

              
              </div>
        )}
              
              {currentPage === 4 && (
          <div>
           
              {/* Upload Document Section */}
              <div style={{ marginTop: '3.5%' }}>
                <label htmlFor="Upload" style={{ fontSize: '150%', marginRight: '2%' }}>Upload Document (only .pdf File)</label>

                {/* Cover Letter Section */}
                <div className='flex flex-row  space-x-20'>
                <div style={{ marginTop: '3%', display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="coverLetterFile" style={{ fontSize: '125%', marginBottom: '1%' }}>Cover Letter</label>
                  {/* File input for selecting the cover letter */}
                  <input
                    type="file"
                    id="coverLetterFile"
                    name="coverLetterFile"
                    style={{ display: 'none' }}
                    onChange={handleCoverLetterFileSelect}
                    accept=".pdf" // Only accept PDF files
                  />
                  {/* Browse button for selecting file */}
                  <label htmlFor="coverLetterFile"
                   style={{ fontSize: '125%', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}>Browse</label>
                  {/* Display the selected cover letter file name */}
                  {coverLetterFile && 
                  <span style={{ marginLeft: '10px' }}>{coverLetterFile.name}</span>}
                </div>

                {/* Paper Section */}
                <div style={{ marginTop: '3%', display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="paperFile" style={{ fontSize: '125%', marginBottom: '1%' }}>Paper</label>
                  {/* File input for selecting the paper */}
                  <input
                    type="file"
                    id="paperFile"
                    name="paperFile"
                    style={{ display: 'none' }}
                    onChange={handlePaperFileSelect}
                    accept=".pdf" // Only accept PDF files
                  />
                  {/* Browse button for selecting file */}
                  <label htmlFor="paperFile" 
                  style={{ fontSize: '125%', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}>Browse</label>
                  {/* Display the selected paper file name */}
                  {paperFile && <span style={{ marginLeft: '10px' }}>{paperFile.name}</span>}
                </div>

                    {/*Plagiarisum Paper Section */}
                <div style={{ marginTop: '3%', display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="paperFilePlagiarism" style={{ fontSize: '125%', marginBottom: '1%' }}> Plagiarisum Report</label>
                  {/* File input for selecting the paper */}
                  <input
                    type="file"
                    id="paperFilePlagiarism"
                    name="paperFilePlagiarism"
                    style={{ display: 'none' }}
                    onChange={handlePaperFilePlagiarismSelect}
                    accept=".pdf" // Only accept PDF files
                  />

                  {/* Browse button for selecting file */}
                  <label htmlFor="paperFilePlagiarism" 
                  style={{ fontSize: '125%', marginLeft: '10px', color: 'blue', cursor: 'pointer', marginBottom: '1%' }}>Browse</label>
                  {/* Display the selected paper file name */}
                  {paperFilePlagiarism && <span style={{ marginLeft: '10px' }}>{paperFilePlagiarism.name}</span>}
                </div>

                </div>
              </div>
              <button className="upload-btn1" onClick={handleUpload}>Upload</button>
              </div>
              )}

              {/* <form  encType='multipart/form-data'> */}
              
              {/* </form> */}
            </div>

            </div>
          </div>
        </div>
      {/* Cover Letter Message Box */}
      {showCoverLetterMessageBox && (
        <div className="message-box">
          <p>Please select a PDF file for the cover letter.</p>
          <button onClick={() => setShowCoverLetterMessageBox(false)}>OK</button>
        </div>
      )}
      {/* Paper Message Box */}
      {showPaperMessageBox && (
        <div className="message-box">
          <p>Please select a PDF file for the paper.</p>
          <button onClick={() => setShowPaperMessageBox(false)}>OK</button>
        </div>
      )}
       {/*Plagiarisum Paper Message Box */}
       {showPaperPlagiarismMessageBox && (
        <div className="message-box">
          <p>Please select a PDF file for the Plagiarisum paper.</p>
          <button onClick={() => setShowPaperPlagiarismMessageBox(false)}>OK</button>
        </div>
      )}
      
      {message && <p>{message}</p>}
    </div>
  );
}

export default Submit;


