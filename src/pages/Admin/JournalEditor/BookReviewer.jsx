import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplicationForReviewer.css';

function BookReviewer() {
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [viewPDF, setViewPDF] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [reviewDecision, setReviewDecision] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [reviewerToConfirm, setReviewerToConfirm] = useState(null);
  const [decisionType, setDecisionType] = useState(null);
  const [comments, setComments] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3002/ApplicationForReviewer', { withCredentials: true })
      .then(response => {
        if (response.data.length > 0) {
          setPapers(response.data);
        } else {
          setPapers([]);
        }
      })
      .catch(err => {
        setError("Failed to fetch data. Please try again later.");
      });

    axios.get('http://localhost:3002/getLoggedInUserId', { withCredentials: true })
      .then(response => {
        setLoggedInUserId(response.data.userid);
      })
      .catch(err => {
        console.error("Failed to fetch logged-in user ID", err);
      });
  }, []);

  const handleRowSelectChange = (index) => {
    setSelectedRow(index);
    setSelectedReviewer(null);
    setViewPDF(false);
    setComments('');
  };

  const handleReviewerChange = (reviewer) => {
    setReviewerToConfirm(reviewer);
    setConfirmDialog(true);
  };

  const handleConfirmResponse = (response) => {
    setConfirmDialog(false);
    if (response === 'yes') {
      setSelectedReviewer(reviewerToConfirm);
      const selectedPaper = papers[selectedRow];
      if (selectedPaper) {
        axios.post('http://localhost:3002/saveSelectedReviewer', {
          paperId: selectedPaper.pid,
          reviewer: reviewerToConfirm,
          userId: loggedInUserId
        })
        .then(response => {
          setPapers(papers.map(paper => 
            paper.pid === selectedPaper.pid 
              ? { ...paper, [reviewerToConfirm === 'reviewer1' ? 'first_reviewer' : 'second_reviewer']: loggedInUserId }
              : paper
          ));
        })
        .catch(err => {
          setError("Failed to save selected reviewer. Please try again later.");
        });
      }
    } else {
      setReviewerToConfirm(null);
    }
  };

  const handleViewClick = (pdfUrl, type) => {
    setCurrentPdf(pdfUrl);
    setViewPDF(true);
    setDecisionType(type);
  };

  const handleCloseClick = () => {
    setViewPDF(false);
    setCurrentPdf(null);
  };

  const handleReviewDecision = (decision) => {
    setReviewDecision(decision);
    const selectedPaper = papers[selectedRow];
  
    if (selectedPaper && selectedReviewer) {
      axios.post('http://localhost:3002/saveReviewDecision', {
        paperId: selectedPaper.pid,
        reviewer: selectedReviewer,
        decision: decision,
        type: decisionType
      }, { withCredentials: true })
      .then(response => {
        // Check if any decision is rejected
        const isRejected = Object.keys(selectedPaper).some(key => {
          if (key.includes('Decesion') && selectedPaper[key] === 'reject') {
            return true;
          }
          return false;
        });
  
        // Update the status column based on the decisions
        const status = isRejected ? 'rejected' : 'approved';
  
        // Update the status column in the UI
        setPapers(papers.map(paper => 
          paper.pid === selectedPaper.pid 
            ? { ...paper, [reviewerToConfirm === 'reviewer1' ? 'first_reviewer' : 'second_reviewer']: loggedInUserId, status: status }
            : paper
        ));
        
        setViewPDF(false);
        setCurrentPdf(null);
      })
      .catch(err => {
        setError("Failed to save review decision. Please try again later.");
      });
    } else {
      setError("Please select a paper and a reviewer before making a decision.");
    }
  };
  


  return (
    <div className="review-container">
      <h1 className="review-heading">All Pending Requests</h1>
      {error && <p className="review-error-message">{error}</p>}
      {papers.length === 0 ? (
        <p className="review-no-data-message">No papers found.</p>
      ) : (
        <table className="review-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Book Title</th>
              <th>Technology</th>
              <th>Cover Letter</th>
              <th>Book</th>
              <th>Plagiarism Report</th>
              <th>Reviewer 1</th>
              <th>Reviewer 2</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper, index) => (
              <tr key={index} className={selectedRow === index ? '' : 'review-disabled-row'}>
                <td>
                  <input
                    type="radio"
                    name="selectRow"
                    onChange={() => handleRowSelectChange(index)}
                  />
                </td>
                <td className="review-row-text">{paper.paper_title}</td>
                <td className="review-row-text">{paper.technologies || 'N/A'}</td>
                <td>
                  <button
                    className="review-view-button"
                    disabled={!selectedReviewer || selectedRow !== index}
                    onClick={() => handleViewClick(`http://localhost:3001/${paper.cover_path}`, 'cover_letter')}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="review-view-button"
                    disabled={!selectedReviewer || selectedRow !== index}
                    onClick={() => handleViewClick(`http://localhost:3001/${paper.paper_path}`, 'paper')}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="review-view-button"
                    disabled={!selectedReviewer || selectedRow !== index}
                    onClick={() => handleViewClick(`http://localhost:3001/${paper.paper_plagiarism_path}`, 'plagiarism_report')}
                  >
                    View
                  </button>
                </td>
                <td>
                  {paper.first_reviewer ? (
                    <span>{paper.first_reviewer}</span>
                  ) : (
                    <>
                      <input
                        type="radio"
                        name={`reviewer1-${index}`}
                        disabled={selectedRow !== index || (loggedInUserId && papers[selectedRow]?.second_reviewer === loggedInUserId)}
                        onChange={() => handleReviewerChange('reviewer1')}
                      /> First Reviewer
                    </>
                  )}
                </td>
                <td>
                  {paper.second_reviewer ? (
                    <span>{paper.second_reviewer}</span>
                  ) : (
                    <>
                      <input
                        type="radio"
                        name={`reviewer2-${index}`}
                        disabled={selectedRow !== index || (loggedInUserId && papers[selectedRow]?.first_reviewer === loggedInUserId)}
                        onChange={() => handleReviewerChange('reviewer2')}
                      /> Second Reviewer
                    </>
                  )}
                </td>
                </tr>
            ))}
          </tbody>
        </table>
      )}
      {viewPDF && currentPdf && (
        <div className="review-pdf-viewer">
          <div className="review-modal-content">
            <button className="review-close-button" onClick={handleCloseClick}>X</button>
            <iframe
              className="review-pdf-iframe"
              src={`${currentPdf}#toolbar=0&navpanes=0`}
              title="PDF Viewer"
            />
            <div className="review-pdf-actions">
              {selectedRow !== null && (
                <div>
                  <textarea
                    className="textarea"
                    placeholder="Give comments on this paper"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  ></textarea>
                </div>
              )}
              <div>
                <button
                  className="review-pdf-action-button review-approve-button mr-2"
                  onClick={() => handleReviewDecision('approve')}
                >
                  Approve
                </button>
                <button
                  className="review-pdf-action-button review-reject-button"
                  onClick={() => handleReviewDecision('reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmDialog && (
        <div className="review-confirm-dialog">
          <div className="review-modal">
            <p>Do you want to confirm as {reviewerToConfirm}?</p>
            <div className="button-row">
              <button onClick={() => handleConfirmResponse('yes')}>Yes</button>
              <button onClick={() => handleConfirmResponse('no')}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookReviewer;

