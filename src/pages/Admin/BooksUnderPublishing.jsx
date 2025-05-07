// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ApplitinForReviwr.css';

// function BookUnderPublishing() {
//   const [books, setBooks] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [selectedReviewer, setSelectedReviewer] = useState(null);
//   const [viewPDF, setViewPDF] = useState(false);
//   const [currentPdf, setCurrentPdf] = useState(null);
//   const [reviewDecision, setReviewDecision] = useState(null);
//   const [confirmDialog, setConfirmDialog] = useState(false);
//   const [reviewerToConfirm, setReviewerToConfirm] = useState(null);
//   const [decisionType, setDecisionType] = useState(null);
//   const [comments, setComments] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

//   useEffect(() => {
//     axios.get('http://localhost:3002/BookunderPublishing', { withCredentials: true })
//       .then(response => {
//         if (response.data.length > 0) {
//           setBooks(response.data);
//         } else {
//           setBooks([]);
//         }
//       })
//       .catch(err => {
//         setError("Failed to fetch data. Please try again later.");
//       });

//     axios.get('http://localhost:3002/getLoggedInUserId', { withCredentials: true })
//       .then(response => {
//         setLoggedInUserId(response.data.userid);
//       })
//       .catch(err => {
//         console.error("Failed to fetch logged-in user ID", err);
//       });
//   }, []);

//   const handleRowSelectChange = (index) => {
//     setSelectedRow(index);
//     setSelectedReviewer(null);
//     setViewPDF(false);
//     setComments('');
//   };

//   const handleReviewerChange = (reviewer) => {
//     setReviewerToConfirm(reviewer);
//     setConfirmDialog(true);
//   };

//   const handleConfirmResponse = (response) => {
//     setConfirmDialog(false);
//     if (response === 'yes') {
//       setSelectedReviewer(reviewerToConfirm);
//       const selectedBook = books[selectedRow];
//       if (selectedBook) {
//         axios.post('http://localhost:3002/Book-saveSelectedReviewer', {
//           bookId: selectedBook.bid,
//           reviewer: reviewerToConfirm,
//           userId: loggedInUserId
//         })
//         .then(response => {
//           setBooks(books.map(book => 
//             book.bid === selectedBook.bid 
//               ? { ...book, [reviewerToConfirm === 'reviewer1' ? 'first_reviewer' : 'second_reviewer']: loggedInUserId }
//               : book
//           ));
//         })
//         .catch(err => {
//           setError("Failed to save selected reviewer. Please try again later.");
//         });
//       }
//     } else {
//       setReviewerToConfirm(null);
//     }
//   };

//   const handleViewClick = (pdfUrl, type) => {
//     setCurrentPdf(pdfUrl);
//     setViewPDF(true);
//     setDecisionType(type);
//   };

//   const handleCloseClick = () => {
//     setViewPDF(false);
//     setCurrentPdf(null);
//   };

//   const handleReviewDecision = (decision) => {
//     setReviewDecision(decision);
//     const selectedBook = books[selectedRow];

//     if (selectedBook && selectedReviewer) {
//       axios.post('http://localhost:3002/Book-saveReviewDecision', {
//         bookId: selectedBook.bid,
//         reviewer: selectedReviewer,
//         decision: decision,
//         type: decisionType
//       }, { withCredentials: true })
//       .then(response => {
//         const isRejected = Object.keys(selectedBook).some(key => {
//           if (key.includes('Decesion') && selectedBook[key] === 'reject') {
//             return true;
//           }
//           return false;
//         });

//         const status = isRejected ? 'rejected' : 'approved';

//         setBooks(books.map(book => 
//           book.bid === selectedBook.bid 
//             ? { ...book, [selectedReviewer === 'reviewer1' ? 'first_reviewer' : 'second_reviewer']: loggedInUserId, status: status }
//             : book
//         ));
        
//         setViewPDF(false);
//         setCurrentPdf(null);
//       })
//       .catch(err => {
//         setError("Failed to save review decision. Please try again later.");
//       });
//     } else {
//       setError("Please select a book and a reviewer before making a decision.");
//     }
//   };

//   const handleSubmitComments = () => {
//     const selectedBook = books[selectedRow];

//     if (selectedBook && selectedReviewer) {
//       axios.post('http://localhost:3002/Book-saveComments', {
//         bookId: selectedBook.bid,
//         reviewer: selectedReviewer,
//         comments: comments,
//         type: decisionType
//       }, { withCredentials: true })
//       .then(response => {
//         setBooks(books.map(book => 
//           book.bid === selectedBook.bid 
//             ? { ...book, [selectedReviewer === 'reviewer1' ? 'Reviewer_1_comments' : 'Reviewer_2_comments']: comments }
//             : book
//         ));
        
//         setComments('');

//       })
//       .catch(err => {
//         setError("Failed to save comments. Please try again later.");
//       });
//     } else {
//       setError("Please select a book and a reviewer before submitting comments.");
//     }
//   };

//   return (
//     <div className="review-container">
//       <h1 className="review-heading">All Pending Book Requests</h1>
//       {error && <p className="review-error-message">{error}</p>}
//       {books.length === 0 ? (
//         <p className="review-no-data-message">No Book found.</p>
//       ) : (
//         <table className="review-table">
//           <thead>
//             <tr>
//               <th>Select</th>
//               <th>Book Title</th>
//               <th>Technology</th>
//               <th>Cover Letter</th>
//               <th>Book</th>
//               <th>Plagiarism Report</th>
//               <th>Reviewer 1</th>
//               <th>Reviewer 2</th>
//             </tr>
//           </thead>
//           <tbody>
//             {books.map((book, index) => (
//               <tr key={index} className={selectedRow === index ? '' : 'review-disabled-row'}>
//                 <td>
//                   <input
//                     type="radio"
//                     name="selectRow"
//                     onChange={() => handleRowSelectChange(index)}
//                   />
//                 </td>
//                 <td className="review-row-text">{book.book_title}</td>
//                 <td className="review-row-text">{book.technologies || 'N/A'}</td>
//                 <td>
//                   <button
//                     className="review-view-button"
//                     disabled={!selectedReviewer || selectedRow !== index}
//                     onClick={() => handleViewClick(`http://localhost:3001/${book.cover_path}`, 'cover_letter')}
//                   >
//                     View
//                   </button>
//                 </td>
//                 <td>
//                   <button
//                     className="review-view-button"
//                     disabled={!selectedReviewer || selectedRow !== index}
//                     onClick={() => handleViewClick(`http://localhost:3001/${book.book_path}`, 'book')}
//                   >
//                     View
//                   </button>
//                 </td>
//                 <td>
//                   <button
//                     className="review-view-button"
//                     disabled={!selectedReviewer || selectedRow !== index}
//                     onClick={() => handleViewClick(`http://localhost:3001/${book.book_plagiarism_path}`, 'plagiarism_report')}
//                   >
//                     View
//                   </button>
//                 </td>
//                 <td>
//                   {book.first_reviewer ? (
//                     <span>{book.first_reviewer}</span>
//                   ) : (
//                     <>
//                       <input
//                         type="radio"
//                         name={`reviewer1-${index}`}
//                         disabled={selectedRow !== index || (loggedInUserId && books[selectedRow]?.second_reviewer === loggedInUserId)}
//                         onChange={() => handleReviewerChange('reviewer1')}
//                       /> First Reviewer
//                     </>
//                   )}
//                 </td>
//                 <td>
//                   {book.second_reviewer ? (
//                     <span>{book.second_reviewer}</span>
//                   ) : (
//                     <>
//                       <input
//                         type="radio"
//                         name={`reviewer2-${index}`}
//                         disabled={selectedRow !== index || (loggedInUserId && books[selectedRow]?.first_reviewer === loggedInUserId)}
//                         onChange={() => handleReviewerChange('reviewer2')}
//                       /> Second Reviewer
//                     </>
//                   )}
//                 </td>
//                 </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//       {viewPDF && currentPdf && (
//         <div className="review-pdf-viewer">
//           <div className="review-modal-content">
//             <button className="review-close-button" onClick={handleCloseClick}>X</button>
//             <iframe
//               className="review-pdf-iframe"
//               src={`${currentPdf}#toolbar=0&navpanes=0`}
//               title="PDF Viewer"
//             />
//             <div className="review-pdf-actions">
//               {selectedRow !== null && (
//                 <div>
//                   <textarea
//                     className="textarea"
//                     placeholder="Write your comments here"
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                   />
//                   <button
//                     className="review-submit-comments-button"
//                     onClick={handleSubmitComments}
//                   >
//                     Submit Comments
//                   </button>
//                 </div>
//               )}
//               <div>
//                 <button
//                   className="review-pdf-action-button review-approve-button mr-2"
//                   onClick={() => handleReviewDecision('approve')}
//                 >
//                   Approve
//                 </button>
//                 <button
//                   className="review-pdf-action-button review-reject-button"
//                   onClick={() => handleReviewDecision('reject')}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {confirmDialog && (
//         <div className="review-confirm-dialog">
//           <div className="review-modal">
//             <p>Do you want to confirm as {reviewerToConfirm}?</p>
//             <div className="button-row">
//               <button onClick={() => handleConfirmResponse('yes')}>Yes</button>
//               <button onClick={() => handleConfirmResponse('no')}>No</button>
//              </div>
//            </div>
//          </div>
//        )}
//     </div>
//   );
// }

// export default BookUnderPublishing;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookUnderPublishing.css';

function BookUnderPublishing() {
  const [books, setBooks] = useState([]);
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
    axios.get('http://localhost:3002/BookunderPublishing', { withCredentials: true })
      .then(response => {
        if (response.data.length > 0) {
          setBooks(response.data);
        } else {
          setBooks([]);
        }
      })
      .catch(err => {
        setError("Failed to fetch Books. Please try again later.");
      });

    axios.get('http://localhost:3002/Book-getLoggedInUserId', { withCredentials: true })
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
      const selectedBook = books[selectedRow];
      if (selectedBook) {
        axios.post('http://localhost:3002/Book-saveSelectedReviewer', {
          bookId: selectedBook.bid,
          reviewer: reviewerToConfirm,
          userId: loggedInUserId
        })
        .then(response => {
          setBooks(books.map(book => 
            book.bid === selectedBook.bid 
              ? { ...book, [reviewerToConfirm === 'reviewer1' ? 'first_reviewer' : 'second_reviewer']: loggedInUserId }
              : book
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
    const selectedBook = books[selectedRow];

    if (selectedBook && selectedReviewer) {
      axios.post('http://localhost:3002/Book-saveReviewDecision', {
        bookId: selectedBook.bid,
        reviewer: selectedReviewer,
        decision: decision,
        type: decisionType
      }, { withCredentials: true })
      .then(response => {
        const isRejected = Object.keys(selectedBook).some(key => {
          if (key.includes('Decesion') && selectedBook[key] === 'reject') {
            return true;
          }
          return false;
        });

        const status = isRejected ? 'rejected' : 'approved';

        setBooks(books.map(book => 
          book.bid === selectedBook.bid 
            ? { ...book, [selectedReviewer === 'reviewer1' ? 'first_reviewer' : 'second_reviewer']: loggedInUserId, status: status }
            : book
        ));
        
        setViewPDF(false);
        setCurrentPdf(null);
      })
      .catch(err => {
        setError("Failed to save review decision. Please try again later.");
      });
    } else {
      setError("Please select a book and a reviewer before making a decision.");
    }
  };

  const handleSubmitComments = () => {
    const selectedBook = books[selectedRow];

    if (selectedBook && selectedReviewer) {
      axios.post('http://localhost:3002/Book-saveComments', {
        bookId: selectedBook.bid,
        reviewer: selectedReviewer,
        comments: comments,
        type: decisionType
      }, { withCredentials: true })
      .then(response => {
        setBooks(books.map(book => 
          book.bid === selectedBook.bid 
            ? { ...book, [selectedReviewer === 'reviewer1' ? 'Reviewer_1_comments' : 'Reviewer_2_comments']: comments }
            : book
        ));
        
        setComments('');

      })
      .catch(err => {
        setError("Failed to save comments. Please try again later.");
      });
    } else {
      setError("Please select a book and a reviewer before submitting comments.");
    }
  };

  return (
    <div className="review-container">
      <h1 className="review-heading">All Pending Book Requests</h1>
      {error && <p className="review-error-message">{error}</p>}
      {books.length === 0 ? (
        <p className="review-no-data-message">No Book found.</p>
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
            {books.map((book, index) => (
              <tr key={index} className={selectedRow === index ? '' : 'review-disabled-row'}>
                <td>
                  <input
                    type="radio"
                    name="selectRow"
                    onChange={() => handleRowSelectChange(index)}
                  />
                </td>
                <td className="review-row-text">{book.book_title}</td>
                <td className="review-row-text">{book.technologies || 'N/A'}</td>
                <td>
                  <button
                    className="review-view-button"
                    disabled={!selectedReviewer || selectedRow !== index}
                    onClick={() => handleViewClick(`http://localhost:3001/${book.cover_path}`, 'cover_letter')}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="review-view-button"
                    disabled={!selectedReviewer || selectedRow !== index}
                    onClick={() => handleViewClick(`http://localhost:3001/${book.book_path}`, 'book')}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="review-view-button"
                    disabled={!selectedReviewer || selectedRow !== index}
                    onClick={() => handleViewClick(`http://localhost:3001/${book.book_plagiarism_path}`, 'plagiarism_report')}
                  >
                    View
                  </button>
                </td>
                <td>
                  {book.first_reviewer ? (
                    <span>{book.first_reviewer}</span>
                  ) : (
                    <>
                      <input
                        type="radio"
                        name={`reviewer1-${index}`}
                        disabled={selectedRow !== index || (loggedInUserId && books[selectedRow]?.second_reviewer === loggedInUserId)}
                        onChange={() => handleReviewerChange('reviewer1')}
                      /> First Reviewer
                    </>
                  )}
                </td>
                <td>
                  {book.second_reviewer ? (
                    <span>{book.second_reviewer}</span>
                  ) : (
                    <>
                      <input
                        type="radio"
                        name={`reviewer2-${index}`}
                        disabled={selectedRow !== index || (loggedInUserId && books[selectedRow]?.first_reviewer === loggedInUserId)}
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
                    placeholder="Write your comments here"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                  <button
                    className="review-submit-comments-button"
                    onClick={handleSubmitComments}
                  >
                    Submit Comments
                  </button>
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

export default BookUnderPublishing;