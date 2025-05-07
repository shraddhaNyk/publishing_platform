

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookInReview.css';
import { FiCornerDownRight } from "react-icons/fi";


const BookInReview = () => {
  const [Books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState({ reviewer1: '', reviewer2: '' });
  const [showReplyBox, setShowReplyBox] = useState({ reviewer1: false, reviewer2: false });


  useEffect(() => {
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
        setError("Failed to fetch Book data. Please try again later.");
      });
  }, []);


  const handleViewClick = (pdfUrl, book) => {
    console.log("PDF URL:", pdfUrl);
    setCurrentPdf(pdfUrl);
    setSelectedBook(book);
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


  const handlePostComment = () => {
    axios.post('http://localhost:3002/postComment', {
      bookId: selectedBook.bid,
      userComments: commentInput
    })
    .then(response => {
      console.log('Comment posted successfully');
      // Update the selectedBook state to include the new comment
      setSelectedBook(prevBook => ({
        ...prevBook,
        user_comments: commentInput
      }));
      // Clear the comment input field
      setCommentInput('');
    })
    .catch(error => {
      console.error('Error posting comment:', error);
    });
  };


  const handlePostReply = (reviewer) => {
    axios.post('http://localhost:3002/postReply', {
      bookId: selectedBook.bid,
      reviewer: reviewer,
      reply: replyInput[reviewer]
    })
    .then(response => {
      console.log('Reply posted successfully');
      // Update the selectedBook state to include the new reply
      setSelectedBook(prevBook => ({
        ...prevBook,
        [`${reviewer}_UserCommen`]: replyInput[reviewer]
      }));
      // Clear the reply input field
      setReplyInput(prevState => ({
        ...prevState,
        [reviewer]: ''
      }));
      // Hide the reply box
      setShowReplyBox(prevState => ({
        ...prevState,
        [reviewer]: false
      }));
    })
    .catch(error => {
      console.error('Error posting reply:', error);
    });
  };


  const handleDeleteComment = () => {
    axios.post('http://localhost:3002/deleteComment', {
      bookId: selectedBook.bid
    })
    .then(response => {
      console.log('Comment deleted successfully');
      // Update the selectedBook state to remove the comment
      setSelectedBook(prevBook => ({
        ...prevBook,
        user_comments: null
      }));
    })
    .catch(error => {
      console.error('Error deleting comment:', error);
    });
  };


  const handleDeleteReviewer1UserComment = () => {
    axios.post('http://localhost:3002/deleteReviewer1UserComment', {
      bookId: selectedBook.bid
    })
    .then(response => {
      console.log('Reviewer 1 user comment deleted successfully');
      // Update the selectedBook state to remove the Reviewer 1 user comment
      setSelectedBook(prevBook => ({
        ...prevBook,
        Reviewer_1_UserCommen: null
      }));
    })
    .catch(error => {
      console.error('Error deleting Reviewer 1 user comment:', error);
    });
  };


  const handleDeleteReviewer2UserComment = () => {
    axios.post('http://localhost:3002/deleteReviewer2UserComment', {
      bookId: selectedBook.bid
    })
    .then(response => {
      console.log('Reviewer 2 user comment deleted successfully');
      // Update the selectedBook state to remove the Reviewer 2 user comment
      setSelectedBook(prevBook => ({
        ...prevBook,
        Reviewer_2_UserCommen: null
      }));
    })
    .catch(error => {
      console.error('Error deleting Reviewer 2 user comment:', error);
    });
  };


  return (
    <div className="book-review-container">
      <div className="book-review-header">
        <div className="book-review-header-item">Book Name</div>
        <div className="book-review-header-item">Date Submitted</div>
        <div className="book-review-header-item">Current Status</div>
        <div className="book-review-header-item">Actions</div>
      </div>


      <div className="book-review-content">
        {Books.map((book, index) => (
          <div key={index} className="book-review-row">
            <div className="book-review-column">{book.book_title}</div>
            <div className="book-review-column">{book.submission_date}</div>
            <div className="book-review-column">{book.status}</div>
            <div className="book-review-column">
              <button className="action-btn view-btn" onClick={() => handleViewClick(`http://localhost:3001/public/bookpdf/${book.book_name}`, book)}>View</button>
              <button className="action-btn download-btn" onClick={() => handleDownloadClick(`http://localhost:3002/public/bookpdf/${book.book_name}`)}>Download</button>
            </div>
          </div>
        ))}
       
        {error && <div className="error-message">{error}</div>}
        {currentPdf && (
          <div className="pdf-viewer">
            <button className="close-btn1" onClick={handleClosePdf}>X</button>
            <iframe src={currentPdf} title="PDF Viewer" />
            <div className="Usercomments-section">
              <h3>Comments:</h3>
                           {/* Reviewer 1 Comments */}
                           {selectedBook.Reviewer_1_comments ? (
                <div className="Reviewer1">
                  <strong>Reviewer 1:</strong> {selectedBook.Reviewer_1_comments}
                 
                  {!selectedBook.Reviewer_1_comments.includes('No Comments Yet') && (
                    <button className="reply-btn" onClick={() => handleReplyClick('reviewer1')}>Reply</button>
                  )}
                  {selectedBook.Reviewer_1_UserCommen && (
                    <div className="UserComment">
                      <FiCornerDownRight />
                      <strong>User Reply:</strong> {selectedBook.Reviewer_1_UserCommen}
                      <button className="delete-btn" onClick={handleDeleteReviewer1UserComment}>Delete</button>
                    </div>
                  )}
                  {showReplyBox.reviewer1 && (
                    <div className="reply-box">
                      <input type="text" placeholder="Type your reply here" value={replyInput.reviewer1} onChange={(e) => handleReplyChange('reviewer1', e)} />
                      <button onClick={() => handlePostReply('reviewer1')}>Post</button>
                    </div>
                  )}
                  <br/>
                </div>
              ) : (
                <div className="Reviewer1">
                  <strong>Reviewer 1:</strong> No Comments Yet
                </div>
              )}
              {/* Reviewer 2 Comments */}
              {selectedBook.Reviewer_2_comments ? (
                <div className="Reviewer2">
                  <strong>Reviewer 2:</strong> {selectedBook.Reviewer_2_comments}
                 
                  {!selectedBook.Reviewer_2_comments.includes('No Comments Yet') && (
                    <button className="reply-btn" onClick={() => handleReplyClick('reviewer2')}>Reply</button>
                  )}
                   {selectedBook.Reviewer_2_UserCommen && (
                    <div className="UserComment">
                      <FiCornerDownRight />
                      <strong>User Reply:</strong> {selectedBook.Reviewer_2_UserCommen}
                      <button className="delete-btn" onClick={handleDeleteReviewer2UserComment}>Delete</button>
                    </div>
                  )}
                  {showReplyBox.reviewer2 && (
                    <div className="reply-box">
                      <input type="text" placeholder="Type your reply here" value={replyInput.reviewer2} onChange={(e) => handleReplyChange('reviewer2', e)} />
                      <button onClick={() => handlePostReply('reviewer2')}>Post</button>
                    </div>
                  )}
                  <br/>
                </div>
              ) : (
                <div className="Reviewer2">
                  <strong>Reviewer 2:</strong> No Comments Yet
                </div>
              )}
              {/* User Comments */}
                {selectedBook.user_comments !== null && (
                  <div>
                    <strong>Your Comments:</strong> {selectedBook.user_comments}
                    {selectedBook.user_comments && (
                      <button className="delete-btn" onClick={handleDeleteComment}>Delete</button>
                    )}
                  </div>
                )}
                {selectedBook.user_comments === null && (
                  <div>
                    Add your comments below.
                  </div>
                )}
                <div className="reply-box">
                  <input type="text" placeholder="Type your comment here" value={commentInput} onChange={handleCommentChange} />
                  <button onClick={handlePostComment}>Post</button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default BookInReview;

