

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBook, FaRegNewspaper, FaChalkboardTeacher, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState({
    username: 'User123',
    email: '',
    phoneNo: '',
  });
  const [papers, setPapers] = useState([]);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState({ reviewer1: '', reviewer2: '' });
  const [showReplyBox, setShowReplyBox] = useState({ reviewer1: false, reviewer2: false });

  useEffect(() => {
    // Fetch user details from the server
    axios.get('http://localhost:3002/Profile', { withCredentials: true })
      .then(response => {
        if (response.data.valid) {
          const { name, email, phoneNo } = response.data.userDetail[0];
          setUserDetails({ username: name, email, phoneNo });
        } else {
          console.error('Error fetching user details:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    // Fetch papers for "My Journal" block
    axios.get('http://localhost:3002/PaperInreview', { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (response.data.length > 0) {
          setPapers(response.data);
        } else {
          setError("No papers found.");
        }
      })
      .catch(err => {
        console.log("failed to fetch", err);
        setError("Failed to fetch paper data. Please try again later.");
      });

    // Fetch books for "My Book" block
    axios.get('http://localhost:3002/BookInreview', { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (response.data.length > 0) {
          setBooks(response.data);
        } else {
          setError("No books found.");
        }
      })
      .catch(err => {
        console.log("failed to fetch", err);
        setError("Failed to fetch book data. Please try again later.");
      });
  }, []);

  const handleViewClick = (pdfUrl, item) => {
    console.log("PDF URL:", pdfUrl);
    setCurrentPdf(pdfUrl);
    setSelectedBook(item); // Assuming it handles both papers and books
  };

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

  const handleClosePdf = () => {
    setCurrentPdf(null);
    setSelectedPaper(null);
    setSelectedBook(null);
  };

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleReplyClick = (reviewer) => {
    setShowReplyBox(prevState => ({ ...prevState, [reviewer]: !prevState[reviewer] }));
  };

  const handleReplyChange = (reviewer, e) => {
    setReplyInput(prevState => ({ ...prevState, [reviewer]: e.target.value }));
  };

  return (
    <div className="bg-transparent min-h-auto py-6 rounded-t-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-gray-800 text-2xl font-semibold mb-8">{userDetails.username}'s Dashboard</h1>
          {/* Add logout button or other actions here */}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 10px rgba(0, 0, 0, 0.4)" }} className="bg-[#00b4d8] rounded-lg shadow-2xl overflow-hidden">
            <Link to="/Profile" className="block px-6 py-6 text-xl font-semibold text-white hover:text-gray-200 flex flex-col justify-between">
              <div className="flex items-center justify-center">
                <span className="text-3xl mr-3"><FaUser /></span>
                My Profile
              </div>
              <div className="mt-4 text-sm text-gray-200 font-normal">
                <p><strong className="font-normal">Name : </strong> {userDetails.username}</p>
                <p><strong className="font-normal">Email : </strong> {userDetails.email}</p>
                <p><strong className="font-normal">Phone : </strong> {userDetails.phoneNo}</p>
              </div>
              <p className="mt-4 text-sm text-gray-200 font-normal">View and update your profile information.</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 10px rgba(0, 0, 0, 0.4)" }} className="bg-[#282f59] rounded-lg shadow-lg overflow-hidden">
            <div className="block px-6 py-6 text-xl font-semibold text-white hover:text-gray-200 flex flex-col justify-between">
              <Link to='/PaperInReview' className="flex items-center justify-center">
                <span className="text-3xl mr-3"><FaRegNewspaper /></span>
                My Journals
              </Link>
              <div className="mt-4 text-sm text-gray-200">
                {papers.length > 0 ? (
                  papers.map((paper, index) => (
                    <div key={index} className="my-2 flex items-center justify-between">
                      <div className="flex-grow" style={{ maxWidth: '400px' }}>
                        <div className=" break-words font-normal">{paper.paper_title}</div>
                        <div className="text-gray-500 font-normal">{paper.status}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <button style={{ fontSize: '0.7rem' }} className="text-white bg-green-500 px-1 py-0.5 rounded-md mr-2" onClick={() => handleViewClick(`http://localhost:3001/public/files/${paper.paper_name}`, paper)}>View</button>
                        <button style={{ fontSize: '0.7rem' }} className="text-white bg-blue-500 px-1 py-0.5 rounded-md" onClick={() => handleDownloadClick(`http://localhost:3001/public/files/${paper.paper_name}`)}>Download</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No papers found.</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 10px rgba(0, 0, 0, 0.4)" }} className="bg-[#282f59] rounded-lg shadow-lg overflow-hidden">
            <div className="block px-6 py-6 text-xl font-semibold text-white hover:text-gray-200 flex flex-col justify-between">
              <Link to='/BookInReview' className="flex items-center justify-center">
                <span className="text-3xl mr-3"><FaBook /></span>
                My Books
              </Link>
              <div className="mt-4 text-sm text-gray-200">
                {books.length > 0 ? (
                  books.map((book, index) => (
                    <div key={index} className="my-2 flex items-center justify-between">
                      <div className="flex-grow" style={{ maxWidth: '400px' }}>
                        <div className="font-normal break-words">{book.book_title}</div>
                        <div className="text-gray-500 font-normal">{book.status}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <button style={{ fontSize: '0.7rem' }} className="text-white bg-green-500 px-1 py-0.5 rounded-md mr-2" onClick={() => handleViewClick(`http://localhost:3001/public/bookpdf/${book.book_name}`, book)}>View</button>
                        <button style={{ fontSize: '0.7rem' }} className="text-white bg-blue-500 px-1 py-0.5 rounded-md" onClick={() => handleDownloadClick(`http://localhost:3001/public/bookpdf/${book.book_name}`)}>Download</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No books found.</p>
                )}
              </div>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 10px rgba(0, 0, 0, 0.4)" }} className="bg-[#00b4d8] rounded-lg shadow-lg overflow-hidden">
             <Link to="/MyCourses" className="block px-6 py-6 text-xl font-semibold text-white hover:text-gray-200 flex flex-col justify-between">
               <div className="flex items-center justify-center">
                 <span className="text-3xl mr-3"><FaChalkboardTeacher /></span>
                 My Courses
               </div>
               <p className="mt-4 text-sm text-gray-200 font-normal">Manage your Course and subscriptions.</p>
             </Link>
           </motion.div>
          {/* Additional blocks and functionalities can be added here */}
        </div>
      </div>

      {/* Modal for viewing PDF */}
      {currentPdf && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-4xl relative">
            <div className="flex justify-end p-2">
              <button className="text-gray-500 hover:text-gray-700" onClick={handleClosePdf}>
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <div className="h-96">
              <iframe
                src={currentPdf}
                title="PDF Viewer"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
