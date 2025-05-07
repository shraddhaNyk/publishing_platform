



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate , useLocation  } from 'react-router-dom';



const CreateChapter = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [file, setFile] = useState(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isFileUploadPopupOpen, setIsFileUploadPopupOpen] = useState(false);
  const [link, setlink] = useState('');
  const [selectedLiveClass, setSelectedLiveClass] = useState(null);
  const [selectedVideoOption, setSelectedVideoOption] = useState('');

  const [error, setError] = useState(null);
  const [topic_title, setTopic_title] = useState(null);




const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = location.state || {};



  useEffect(() => {
    if (courseId) {
      fetchCourseData(courseId);
    }
  }, [courseId]);


  const fetchCourseData = async (courseId) => {
    try {
      console.log('courseId:', courseId);
      const response = await axios.get(`http://localhost:3002/course-data/${courseId}`);
      const data = response.data;

      setTitle(data.title || '');
      setCoverImage(data.image_url || '');
      // setChapters(data.chapter_name ? [data.chapter_name] : []);
      // setNewTopicName(data.topic_name ? [data.topic_name] : []);
      console.log(data.chapter_name,data.topic_name)

    
      const formattedChapters = Object.keys(data.chapters || {}).map(chapterName => ({
        name: chapterName,
        topics: data.chapters[chapterName] || []
      }));

    setChapters(formattedChapters);
  
     

    } catch (err) {
      setError('Error fetching course data');
      console.error(err);
    }
  };


  const handleAddChapter = () => {
    if (newChapterName.trim()) {
      setChapters([...chapters, { name: newChapterName, topics: [] }]);
      setNewChapterName('');
      setIsChapterModalOpen(false);
    }
  };

  const topic = { name: newTopicName, type: selectedOption, file };

  const handleSave = async () => {
    // if (newTopicName.trim() && selectedChapter !== null && selectedOption) {
    //   const topic = { name: newTopicName, type: selectedOption, file };
    if (newTopicName.trim() && selectedChapter !== null && selectedOption) {
      const chapter = chapters[selectedChapter];
      if (!chapter || !chapter.name) {
          console.error("Selected chapter is invalid or does not exist.");
          return;
      }
  
      // Form data setup for file types
      const formData = new FormData();
      formData.append('course_title', title);
      formData.append('image_url', coverImage);
      formData.append('chapter_name', chapters[selectedChapter].name);
      formData.append('topic_name', topic.name);
      formData.append('topic_type', topic.type);
      formData.append('vedio_type', selectedVideoOption || ''); 
      formData.append('link', link || '');
      formData.append('live_type', selectedLiveClass || '');
  
      if (file) {
        formData.append('file', topic.file);
      }
  
      // Define where to navigate based on selectedOption
      const routeMapping = {
        PDF: '/uploaditem',
        Video: '/uploaditem',
        Audio: '/uploaditem',
        File: '/uploaditem',
        Quiz: '/quiz',
        'Live test': '/live',
        'Live class':'/live',
        Assignment: '/assignment',
        Form: '/forms'
      };
  
      try {
        // Handle file uploads (PDF, Video, Audio, or File)
        if (['PDF', 'Video', 'Audio', 'File'].includes(selectedOption)) {
          await axios.post('http://localhost:3002/upload-topic', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
  
          // Update state after successful upload
          const updatedChapters = [...chapters];
          updatedChapters[selectedChapter].topics.push(topic);
          setChapters(updatedChapters);
          setFile(null);
          setIsTopicModalOpen(false);
          setIsFileUploadPopupOpen(false);
  
          // Navigate to the correct page for file uploads, passing state
          navigate(routeMapping[selectedOption], {
            state: {
              courseId,
              title,
              chapterName: chapters[selectedChapter].name,
              topicName: topic.name,
              topicType: topic.type,
              topicFile: topic.file,
             
            },
          });
        }
        // Navigate to quiz, test, or form pages
        else if (['Quiz', 'Live test','Live class', 'Assignment', 'Form'].includes(selectedOption)) {
            await axios.post('http://localhost:3002/upload-topic', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            // Update state after successful upload
            const updatedChapters = [...chapters];
            updatedChapters[selectedChapter].topics.push(topic);
          setFile(null);
          setIsTopicModalOpen(false);
          setIsFileUploadPopupOpen(false);
  
          // Navigate to the relevant page for tests or forms
          navigate(routeMapping[selectedOption], {
            state: {
              courseId,
              title,
              chapterName: chapters[selectedChapter].name,
              topicName: topic.name,
              topicType: topic.type,
              topic_title:topic.topic_title,
              selectedLive: topic.selectedLiveClass
            },
          });
        }
      } catch (error) {
        console.error('Error uploading topic:', error);
      }
    }
  };
  

  const handleFileUpload = (e) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0]; // Get the first selected file
      if (file) {
        setFile(file);
      } else {
        console.error('No file selected.');
      }
    } else {
      console.error('File input event target is not correctly defined.');
    }
  };

  const toggleChapterExpansion = (index) => {
    setExpandedChapters(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  const handleCloseFileUploadPopup = () => {
    setIsFileUploadPopupOpen(false);
  };


  const handlelinkChange=(e)=>{
    setlink(link);
  }
  const handleTextInputChange = (e) => {
    setTopic_title(e.target.value);
};
  const handleOptionChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
    setIsFileUploadPopupOpen(true);
  };
  const handleVideoOptionChange = (event) => {
    setSelectedVideoOption(event.target.value);
  };
  const closeModal = () => {
    setIsTopicModalOpen(false);
  };




const handleSelectLiveClass = (classType) => {
  setSelectedLiveClass(classType);
};



 



  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f7f7f7', padding: '2rem' }}>
      <div style={{ width: '25%', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginRight: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{title}</h2>
        {coverImage && (
          <img src={coverImage} alt="Cover" style={{ marginBottom: '1rem', borderRadius: '0.5rem', boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)' }} />
        )}
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
          {chapters.map((chapter, index) => (
            <li key={index} style={{ marginBottom: '1rem' }}>
              <div
                style={{ cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => toggleChapterExpansion(index)}
              >
                {chapter.name}
                <span>{expandedChapters.includes(index) ? '▼' : '▶'}</span>
              </div>

 {expandedChapters.includes(index) && (
        <>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {chapter.topics && chapter.topics.length > 0 ? (
              chapter.topics.map((topic, i) => (
                <li key={i} style={{ fontSize: '0.875rem', position: 'relative', paddingLeft: '1.5rem' }}>
                  <span style={{ position: 'absolute', left: '0', color: '#6c757d' }}>❖</span>
                  {topic.name} ({topic.type})
                </li>
              ))
            ) : (
              <li>No topics available</li>
            )}
          </ul>
            
              <button
              onClick={() => { setSelectedChapter(index); setIsTopicModalOpen(true); }}
              style={{background: 'none',border: 'none',color: '#007bff',padding: '0',fontSize: '1rem',cursor: 'pointer',textDecoration: 'underline',fontWeight: 'normal',marginTop: '1rem',display: 'inline', }}>
               + Add Topic
               </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Create Chapters</h2>
        <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', padding: '1.5rem', width: '100%', maxWidth: '40rem', marginBottom: '2rem' }}>
          <p>This content will be generated by Artificial Intelligence. We highly recommend you review the accuracy of the content. We do not or cannot assure the accuracy of the content presented. You are solely responsible if you use this option, including any legal and other obligations that may arise from this content.</p>
          <button onClick={() => console.log("Generate using AI")} style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', marginTop: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Generate Chapters by AI
          </button>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', padding: '1.5rem', width: '100%', maxWidth: '40rem', marginBottom: '2rem' }}>
          <p>You can create chapters and chapter items by adding the chapter.</p>
          <button onClick={() => setIsChapterModalOpen(true)} style={{ width: '100%', backgroundColor: '#6c757d', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', marginTop: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Create Chapters Manually
          </button>
        </div>
      </div>

      {isChapterModalOpen && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', width: '24rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Chapter</h2>
            <input
              type="text"
              value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
              placeholder="Enter chapter name"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '0.25rem', border: '1px solid #ced4da' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setIsChapterModalOpen(false)} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
              <button onClick={handleAddChapter} style={{ backgroundColor: '#007bff', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
            </div>
          </div>
        </div>
      )}

<>
      {isTopicModalOpen && (
        
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', width: '40rem' }}>
          <div style={{ position: 'relative', textAlign: 'center', paddingRight: '30px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Topic</h2>
         <button style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#555' }} onClick={closeModal}>
            ✖
         </button>
         </div>
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Enter topic name"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '0.25rem', border: '1px solid #ced4da' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Left Column: Upload New Item */}
              <div style={{ width: '48%' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Upload new item</h3>
                <label>
                  <input type="radio" name="option" value="PDF" onChange={handleOptionChange} /> PDF
                </label>
                <br />
                <label>
                  <input type="radio" name="option" value="Video" onChange={handleOptionChange} /> Video
                </label>
                <br />
                <label>
                  <input type="radio" name="option" value="Audio" onChange={handleOptionChange} /> Audio
                </label>
                <br />
                <label>
                  <input type="radio" name="option" value="SCORM" onChange={handleOptionChange} /> SCORM
                </label>
                <br />
                <label>
                  <input type="radio" name="option" value="File" onChange={handleOptionChange} /> File
                </label>
              </div>

              {/* Right Column: Create New Item */}
              <div style={{ width: '48%' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create new item</h3>
                <br />
                <label>
                  <input type="radio" name="option" value="Quiz" onChange={handleOptionChange} /> Quiz
                </label>
                <br />
                <label>
                  <input type="radio" name="option" value="Live test" onChange={handleOptionChange} /> Live test
                </label>
                <br />
                <label>
                  <input type="radio" name="option" value="Live class" onChange={handleOptionChange} /> Live class
                </label>
                <br />
                <label>
                  <input type="radio" name="option" value="Assignment" onChange={handleOptionChange} /> Assignment
                </label>
                <br />
 
                <label>
                  <input type="radio" name="option" value="Form" onChange={handleOptionChange} /> Form
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
             
            </div>
          </div>
        </div>
      )}

      {/* File Upload Pop-Up */}
      {isFileUploadPopupOpen && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', width: '30rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Upload {selectedOption}</h2>
            {selectedOption === 'Video' && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label>
                <input type="radio" name="videoOption" value="Upload" onChange={handleOptionChange} /> Upload
            </label>
            <label>
                <input type="radio" name="videoOption" value="YouTube" onChange={handleOptionChange} /> YouTube
            </label>
            <label>
                <input type="radio" name="videoOption" value="Vimeo" onChange={handleOptionChange} /> Vimeo
            </label>
            <label>
                <input type="radio" name="videoOption" value="SproutVideo" onChange={handleOptionChange} /> SproutVideo
            </label>
        </div>

        {/* Conditionally render the input box based on selected video option */}
        {isFileUploadPopupOpen && selectedOption === 'Video' && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', width: '30rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Upload {selectedOption}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>
                  <input type="radio" name="videoOption" value="Upload" onChange={handleVideoOptionChange} /> Upload
                </label>
                <label>
                  <input type="radio" name="videoOption" value="YouTube" onChange={handleVideoOptionChange} /> YouTube
                </label>
                <label>
                  <input type="radio" name="videoOption" value="Vimeo" onChange={handleVideoOptionChange} /> Vimeo
                </label>
              
              </div>

              {/* Conditionally render the input box based on selected video option */}
              {selectedVideoOption === 'Upload' ? (
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', width: '100%' }} 
                />
              ) : (
                selectedVideoOption && (
                  <input 
                    type="text" 
                    value={link}
                    placeholder="Enter the video URL" 
                    onChange={handlelinkChange} 
                    style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', width: '100%' }} 
                  />
                )
              )}
              
            </div>
            <button onClick={handleCloseFileUploadPopup} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
          <button onClick={handleSave} style={{marginLeft:'5%', backgroundColor: '#007bff', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>Upload</button>
          </div>
          
        </div>
      )}
          
    </div>   
)}

{['PDF',  'Audio', 'File'].includes(selectedOption) && (
<input type="file" onChange={handleFileUpload} style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', width: '100%' }} />
     )}


  
{['Quiz','Assignment', 'Live test','Form'].includes(selectedOption) && (
  <input 
  type="text" 
  placeholder="Enter the Title" 
  onChange={handleTextInputChange} 
  style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', width: '100%' }} 
/>
)}

          
          {selectedOption === 'Live class' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                     style={{border: '1px solid #ccc',padding: '1rem',borderRadius: '0.5rem',backgroundColor: selectedLiveClass === 'YouTube' ? 'gray' : '#fff',cursor: 'pointer'}}
                                    onClick={() => handleSelectLiveClass('YouTube')}
                                >
                                    <h3 style={{ display: 'block', fontWeight: 'bold' }}>YouTube Link</h3>
                                    
                                </button>

                                <button
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        backgroundColor: selectedLiveClass === 'Google meet' ? 'gray' : '#fff',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleSelectLiveClass('Google meet')}
                                >
                                    <h3 style={{ display: 'block', fontWeight: 'bold' }}>Google meet</h3>
                                  
                                </button>

                                <button
                                    style={{ border: '1px solid #ccc', padding: '1rem',borderRadius: '0.5rem', backgroundColor: selectedLiveClass === 'Zoom' ? 'gray' : '#fff',cursor: 'pointer'
                                    }}
                                    onClick={() => handleSelectLiveClass('Zoom')}
                                >
                                    <h3 style={{ display: 'block', fontWeight: 'bold' }}>Zoom</h3>
                                   
                                </button>

                              
                            </div>
                        )}


            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={handleCloseFileUploadPopup} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={handleSave} style={{ backgroundColor: '#007bff', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </>
    </div>
  );
};

export default CreateChapter;

