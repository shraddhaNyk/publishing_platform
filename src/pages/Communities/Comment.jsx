

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Comment.css';
import axios from 'axios';

const Comment = ({ comment, setCommentsData }) => {
  const { handleInsertNode, handleEditNode, handleDeleteNode } = setCommentsData;

  const [input, setInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(true);
  const [inputEdit, setInputEdit] = useState(comment.text);
   // Inside Comment component
   const [userName, setUserName] = useState('');
   const [loading, setLoading] = useState(true);


  
  const handleAddComment = async (parentId) => {
    try {
      const response = await fetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: input, parentId })
      });
      const newComment = await response.json();
      handleInsertNode(parentId, newComment);
      setInput('');
      setShowInput(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await fetch(`/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputEdit })
      });
      handleEditNode(commentId, inputEdit);
      setEditMode(false);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await fetch(`/comments/${commentId}`, {
        method: 'DELETE'
      });
      handleDeleteNode(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/username`); 
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('Unknown User'); // Handle errors or show default name
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  });
  
  return (
    <div className="comment">
      {comment.id === 1 ? (
        <div className="comment-input-container">
         <p style={{marginTop: '20px',marginRight:'550px', fontWeight: 'bold', color: '#333' }}>{userName}</p>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a comment"  style={{ marginTop: '-27px' }} />
          <button onClick={() => handleAddComment(comment.id)} style={{ backgroundColor: 'white' }}>Comment</button>
        </div>
      ) : (
        <div>
          {editMode ? (
            <>
              <input value={inputEdit} onChange={(e) => setInputEdit(e.target.value)} />
              <button onClick={() => handleEditComment(comment.id)}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <div>
              {userName} 
               <p>{comment.text} </p>
              <button className="reply-button" onClick={() => setShowInput(!showInput)}>Reply</button>
              <button className="reply-button" onClick={() => setEditMode(true)}>Edit</button>
              <button className="reply-button" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            </div>
          )}
        </div>
      )}

      {showInput && (
        <div className="comment-input-container">
           <p style={{marginTop: '20px',marginRight:'530px', fontWeight: 'bold', color: '#333' }}>{userName}</p>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a reply" style={{ marginTop: '-27px' }} />
          <div className="button-container">
            <button onClick={() => handleAddComment(comment.id)}>Reply</button>
            <button onClick={() => setShowInput(false)}>Cancel</button>
          </div>
        </div>
      )}

      {comment.items && comment.items.length > 0 && (
        <div>
          <button onClick={() => setExpand(!expand)} className="arrow">
            {expand ? 'Collapse' : 'Expand'}
          </button>
          {expand && (
            <div className="nested-comments">
              {comment.items.map((child) => (
                <Comment key={child.id} comment={child} setCommentsData={setCommentsData} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CommentSection = () => {
  const location = useLocation();
  const { question } = location.state || {};
  const [answer, setanswer] = useState('');

  const [comments, setComments] = useState([
    {
      id: 1,
      text: 'This is the first comment',
      parentId: null,
      items: []
    }
  ]);

  const handleInsertNode = (parentId, newComment) => {
    const updatedComments = addCommentToTree(comments, parentId, newComment);
    setComments(updatedComments);
  };

  const handleEditNode = (commentId, newText) => {
    const updatedComments = editCommentInTree(comments, commentId, newText);
    setComments(updatedComments);
  };

  const handleDeleteNode = (commentId) => {
    const updatedComments = deleteCommentFromTree(comments, commentId);
    setComments(updatedComments);
  };

  useEffect(() => {
    const fetchAnswer = async () => {
      if (question) {
        try {
          const response = await axios.post('/search-answer', { question });
          if (response.data.length > 0) {
           setanswer(response.data[0].answer);
          } else {
            setanswer('No answer found');
          }
        } catch (error) {
          console.error('Error fetching answer:', error);
        }
      }
    };

    fetchAnswer();
  }, [question]);

  return (
    <div className="comment-section">
      {question && (
        <div className="selected-question">
          <h2>{question}</h2>
          <p>{answer}</p>
        </div>
      )}
{/* Add a spacer */}
<div style={{ margin: '40px 0' }} />
      
      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          setCommentsData={{
            handleInsertNode,
            handleEditNode,
            handleDeleteNode
          }}
        />
      ))}
    </div>
  );
};

// Helper functions
const addCommentToTree = (tree, parentId, newComment) => {
  return tree.map(comment => {
    if (comment.id === parentId) {
      return {
        ...comment,
        items: [...(comment.items || []), newComment]
      };
    } else if (comment.items && comment.items.length > 0) {
      return {
        ...comment,
        items: addCommentToTree(comment.items, parentId, newComment)
      };
    }
    return comment;
  });
};

const editCommentInTree = (tree, commentId, newText) => {
  return tree.map(comment => {
    if (comment.id === commentId) {
      return {
        ...comment,
        text: newText
      };
    } else if (comment.items && comment.items.length > 0) {
      return {
        ...comment,
        items: editCommentInTree(comment.items, commentId, newText)
      };
    }
    return comment;
  });
};

const deleteCommentFromTree = (tree, commentId) => {
  return tree.filter(comment => comment.id !== commentId).map(comment => {
    if (comment.items && comment.items.length > 0) {
      return {
        ...comment,
        items: deleteCommentFromTree(comment.items, commentId)
      };
    }
    return comment;
  });
};

export default CommentSection;
