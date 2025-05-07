import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaperInReview.css';
import { FiCornerDownRight } from "react-icons/fi";

const PaperInReview = () => {
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState({ reviewer1: '', reviewer2: '' });
  const [showReplyBox, setShowReplyBox] = useState({ reviewer1: false, reviewer2: false });

  useEffect(() => {
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
  }, []);

  const handleViewClick = (pdfUrl, paper) => {
    console.log("PDF URL:", pdfUrl);
    setCurrentPdf(pdfUrl);
    setSelectedPaper(paper);
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
      paperId: selectedPaper.pid,
      userComments: commentInput
    })
    .then(response => {
      console.log('Comment posted successfully');
      // Update the selectedPaper state to include the new comment
      setSelectedPaper(prevPaper => ({
        ...prevPaper,
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
      paperId: selectedPaper.pid,
      reviewer: reviewer,
      reply: replyInput[reviewer]
    })
    .then(response => {
      console.log('Reply posted successfully');
      // Update the selectedPaper state to include the new reply
      setSelectedPaper(prevPaper => ({
        ...prevPaper,
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
      paperId: selectedPaper.pid
    })
    .then(response => {
      console.log('Comment deleted successfully');
      // Update the selectedPaper state to remove the comment
      setSelectedPaper(prevPaper => ({
        ...prevPaper,
        user_comments: null
      }));
    })
    .catch(error => {
      console.error('Error deleting comment:', error);
    });
  };

  const handleDeleteReviewer1UserComment = () => {
    axios.post('http://localhost:3002/deleteReviewer1UserComment', {
      paperId: selectedPaper.pid
    })
    .then(response => {
      console.log('Reviewer 1 user comment deleted successfully');
      // Update the selectedPaper state to remove the Reviewer 1 user comment
      setSelectedPaper(prevPaper => ({
        ...prevPaper,
        Reviewer_1_UserCommen: null
      }));
    })
    .catch(error => {
      console.error('Error deleting Reviewer 1 user comment:', error);
    });
  };

  const handleDeleteReviewer2UserComment = () => {
    axios.post('http://localhost:3002/deleteReviewer2UserComment', {
      paperId: selectedPaper.pid
    })
    .then(response => {
      console.log('Reviewer 2 user comment deleted successfully');
      // Update the selectedPaper state to remove the Reviewer 2 user comment
      setSelectedPaper(prevPaper => ({
        ...prevPaper,
        Reviewer_2_UserCommen: null
      }));
    })
    .catch(error => {
      console.error('Error deleting Reviewer 2 user comment:', error);
    });
  };

  return (
    <div className="paper-review-container">
      <div className="paper-review-header">
        <div className="paper-review-header-item">Paper Name</div>
        <div className="paper-review-header-item">Date Submitted</div>
        <div className="paper-review-header-item">Current Status</div>
        <div className="paper-review-header-item">Actions</div>
      </div>

      <div className="paper-review-content">
        {papers.map((paper, index) => (
          <div key={index} className="paper-review-row">
            <div className="paper-review-column">{paper.paper_title}</div>
            <div className="paper-review-column">{paper.submission_date}</div>
            <div className="paper-review-column">{paper.status}</div>
            <div className="paper-review-column">
              <button className="action-btn view-btn" onClick={() => handleViewClick(`http://localhost:3001/public/files/${paper.paper_name}`, paper)}>View</button>
              <button className="action-btn download-btn" onClick={() => handleDownloadClick(`http://localhost:3002/public/files/${paper.paper_name}`)}>Download</button>
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
                           {selectedPaper.Reviewer_1_comments ? (
                <div className="Reviewer1">
                  <strong>Reviewer 1:</strong> {selectedPaper.Reviewer_1_comments}
                  
                  {!selectedPaper.Reviewer_1_comments.includes('No Comments Yet') && (
                    <button className="reply-btn" onClick={() => handleReplyClick('reviewer1')}>Reply</button>
                  )}
                  {selectedPaper.Reviewer_1_UserCommen && (
                    <div className="UserComment">
                      <FiCornerDownRight />
                      <strong>User Reply:</strong> {selectedPaper.Reviewer_1_UserCommen}
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
              {selectedPaper.Reviewer_2_comments ? (
                <div className="Reviewer2">
                  <strong>Reviewer 2:</strong> {selectedPaper.Reviewer_2_comments}
                 
                  {!selectedPaper.Reviewer_2_comments.includes('No Comments Yet') && (
                    <button className="reply-btn" onClick={() => handleReplyClick('reviewer2')}>Reply</button>
                  )}
                   {selectedPaper.Reviewer_2_UserCommen && (
                    <div className="UserComment">
                      <FiCornerDownRight />
                      <strong>User Reply:</strong> {selectedPaper.Reviewer_2_UserCommen}
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
                {selectedPaper.user_comments !== null && (
                  <div>
                    <strong>Your Comments:</strong> {selectedPaper.user_comments}
                    {selectedPaper.user_comments && (
                      <button className="delete-btn" onClick={handleDeleteComment}>Delete</button>
                    )}
                  </div>
                )}
                {selectedPaper.user_comments === null && (
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

export default PaperInReview;

