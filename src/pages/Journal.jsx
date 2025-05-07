

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RiDoubleQuotesR } from 'react-icons/ri';

const ApprovedPapers = () => {
  const [approvedPapers, setApprovedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [citeClicked, setCiteClicked] = useState(null);

  useEffect(() => {
    const fetchApprovedPapers = async () => {
      try {
        const response = await axios.get('/ApprovedPapers');
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

  const handleCiteClick = (paperId) => {
    setCiteClicked(paperId);
  };

  const handleCloseCiteModal = () => {
    setCiteClicked(null);
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
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">Journals</h1>
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
                  <p className="text-gray-700">
                    <strong>IJST_ID:</strong> {paper.IJST_ID}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Cited by: {paper.citations || 0}</span>
                  <button
                    className={`py-2 px-4 bg-transparent rounded hover:text-blue-500 transition duration-200 ${citeClicked === paper.pid ? 'text-red-500' : 'text-black'}`}
                    onClick={() => handleCiteClick(paper.pid)}
                  >
                    <div className="flex items-center space-x-2">
                      <RiDoubleQuotesR />
                      Cite
                    </div>
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                    onClick={() => handleDownloadClick(`http://localhost:3002/public/files/${paper.paper_name}`)}
                  >
                    Download
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>Submission Date:</strong> {new Date(paper.submission_date).toLocaleDateString()} | 
                <strong> Technologies:</strong> {paper.technologies} | 
                <strong> Reviewers:</strong> {paper.first_reviewer} & {paper.second_reviewer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {citeClicked && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto relative">
             <button
              className=" absolute top-4 right-3 py-2 px-4  text-gray-600 rounded-lg  transition duration-200"
              onClick={handleCloseCiteModal}
              >
                &#x2715;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cite</h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-2"><strong>MLA Citation:</strong> {approvedPapers.find(paper => paper.pid === citeClicked).mla_citation}</p>
              <p className="text-gray-700 mb-2"><strong>APA Citation:</strong> {approvedPapers.find(paper => paper.pid === citeClicked).apa_citation}</p>
              <p className="text-gray-700 mb-2"><strong>Chicago Citation:</strong> {approvedPapers.find(paper => paper.pid === citeClicked).chicago_citation}</p>
              <p className="text-gray-700 mb-2"><strong>Harvard Citation:</strong> {approvedPapers.find(paper => paper.pid === citeClicked).harvard_citation}</p>
              <p className="text-gray-700 mb-2"><strong>Vancouver Citation:</strong> {approvedPapers.find(paper => paper.pid === citeClicked).vancouver_citation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedPapers;
