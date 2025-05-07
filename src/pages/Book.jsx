import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RiDoubleQuotesR } from 'react-icons/ri';

const ApprovedBooks = () => {
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [citeClicked, setCiteClicked] = useState(null);
  const [citeConfirmed, setCiteConfirmed] = useState(null);

  useEffect(() => {
    const fetchApprovedBooks = async () => {
      try {
        const response = await axios.get('/ApprovedBooks');
        setApprovedBooks(response.data);
      } catch (err) {
        setError('Error fetching approved books');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedBooks();
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

  const handleCiteClick = (bookId) => {
    setCiteClicked(bookId);
  };

  const handleCiteConfirm = async () => {
    try {
      await axios.post('/citeBook', { bid: citeClicked });
      setCiteConfirmed(citeClicked);
      setCiteClicked(null);
    } catch (error) {
      console.error('Error citing book:', error);
    }
  };

  const handleCiteCancel = () => {
    setCiteClicked(null);
  };

  const handleCloseCiteModal = () => {
    setCiteConfirmed(null);
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
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">Books</h1>
      <div className="container mx-auto mt-0 px-4 align-super">
        <div className="flex flex-col ml-auto mr-auto gap-2">
          {approvedBooks.map((book) => (
            <div
              key={book.bid}
              className="bg-white rounded-lg p-6 border border-gray-200 transition duration-300 hover:shadow-xl hover:border-transparent transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{book.book_title}</h2>
                  <p className="text-gray-700">
                    <strong>IJST_ID:</strong> {book.IJST_ID}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Cited by: {book.citations || 0}</span>
                  <button
                    className={`py-2 px-4 bg-transparent rounded hover:text-blue-500 transition duration-200 ${citeClicked === book.bid ? 'text-red-500' : 'text-black'}`}
                    onClick={() => handleCiteClick(book.bid)}
                  >
                    <div className="flex items-center space-x-2">
                      <RiDoubleQuotesR />
                      Cite
                    </div>
                  </button>
                  <button
                    className={`py-2 px-4 bg-blue-500 text-white rounded ${citeConfirmed === book.bid ? '' : 'cursor-not-allowed opacity-50'}`}
                    onClick={() => handleDownloadClick(`http://localhost:3002/public/files/${book.book_name}`)}
                    disabled={citeConfirmed !== book.bid}
                  >
                    Download
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>Submission Date:</strong> {new Date(book.submission_date).toLocaleDateString()} | 
                <strong> Technologies:</strong> {book.technologies} | 
                <strong> Reviewers:</strong> {book.first_reviewer} & {book.second_reviewer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {citeConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-auto relative">
            <button
              className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 transition duration-200"
              onClick={handleCloseCiteModal}
            >
              &#x2715;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Cite</h2>
            <div className="space-y-2">
              {['mla_citation', 'apa_citation', 'chicago_citation', 'harvard_citation', 'vancouver_citation'].map((citationType, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-gray-700"><strong>{citationType.replace('_', ' ').toUpperCase()}:</strong></p>
                  <p className="text-gray-700 ml-4">{approvedBooks.find(book => book.bid === citeConfirmed)[citationType]}</p>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         )}

         {citeClicked && (
           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
           <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
             <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Confirm Citation</h2>
             <p className="mb-4 text-gray-700">
               Are you sure you want to cite this Book? By citing this Book,
               The publisher of this book will earn a credit and you will be able to download and read the paper.
             </p>
             <div className="flex justify-between">
               <button
                 className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                 onClick={handleCiteConfirm}
               >
                 Yes
               </button>
               <button
                 className="py-2 px-6 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition duration-200"
                 onClick={handleCiteCancel}
               >
                 No
               </button>
             </div>
           </div>
         </div>
         )}
       </div>
     );
   };

   export default ApprovedBooks;
