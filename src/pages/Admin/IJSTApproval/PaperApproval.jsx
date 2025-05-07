import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaperApproval = () => {
  const [approvedPapers, setApprovedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState({});
  const [validationMessages, setValidationMessages] = useState({});

  useEffect(() => {
    const fetchApprovedPapers = async () => {
      try {
        const response = await axios.get('/UnderPublishing');
        setApprovedPapers(response.data);
      } catch (err) {
        setError('Error fetching approved papers');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPapers();
  }, []);

  const handleDownloadClick = (url) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.setAttribute('download', url.split('/').pop());
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      })
      .catch(error => console.error('Error downloading file:', error));
  };

  const handleFileChange = (event, paperId) => {
    setSelectedFile((prevState) => ({
      ...prevState,
      [paperId]: event.target.files[0],
    }));
  };

  const handleUploadClick = (paperId) => {
    const file = selectedFile[paperId];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      axios.post(`/uploadApproval/${paperId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          setValidationMessages((prevState) => ({
            ...prevState,
            [paperId]: { message: 'Paper uploaded successfully!', type: 'success' },
          }));
          setTimeout(() => {
            setValidationMessages((prevState) => ({
              ...prevState,
              [paperId]: { message: '', type: '' },
            }));
          }, 3000);
        })
        .catch(error => {
          console.error('Error uploading paper:', error);
          setValidationMessages((prevState) => ({
            ...prevState,
            [paperId]: { message: 'Failed to upload paper', type: 'error' },
          }));
          setTimeout(() => {
            setValidationMessages((prevState) => ({
              ...prevState,
              [paperId]: { message: '', type: '' },
            }));
          }, 3000);
        });
    } else {
      setValidationMessages((prevState) => ({
        ...prevState,
        [paperId]: { message: 'Please select a file to upload.', type: 'error' },
      }));
      setTimeout(() => {
        setValidationMessages((prevState) => ({
          ...prevState,
          [paperId]: { message: '', type: '' },
        }));
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">Paper Publishing</h1>
      <div className="container mx-auto mt-0 px-4 align-super">
        <div className="flex flex-col ml-auto mr-auto gap-2">
          {approvedPapers.map((paper) => (
            <div
              key={paper.pid}
              className="bg-white rounded-lg p-6 border border-gray-200 transition duration-300 hover:shadow-xl hover:border-transparent transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{paper.paper_title}</h2>
                  <p className="text-gray-700 flex-row space-x-60">
                    <strong>IJST_ID:</strong> {paper.IJST_ID}
                    <strong> Publishing Status:</strong> {paper.publishing_status}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>Submission Date:</strong> {new Date(paper.submission_date).toLocaleDateString()} | 
                <strong> Technologies:</strong> {paper.technologies} | 
                <strong> Reviewers:</strong> {paper.first_reviewer} & {paper.second_reviewer}
              </p>
              <div className="mt-4">
                <input
                  type="file"
                  onChange={(event) => handleFileChange(event, paper.pid)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf"
                />
                <div className="flex justify-between">
                  <button
                    className="mt-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-200"
                    onClick={() => handleUploadClick(paper.pid)}
                  >
                    Upload Paper
                  </button>
                  <button
                    className="mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                    onClick={() => handleDownloadClick(`http://localhost:3002/public/files/${paper.paper_name}`)}
                  >
                    Download
                  </button>
                </div>
                {validationMessages[paper.pid]?.message && (
                  <div
                    className={`mt-2 text-sm ${validationMessages[paper.pid].type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {validationMessages[paper.pid].message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperApproval;