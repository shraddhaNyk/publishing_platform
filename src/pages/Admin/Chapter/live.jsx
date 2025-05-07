import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'; 

const Live = () => {
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [playerSelection, setPlayerSelection] = useState("YouTube Player");
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve topic name from the previous page's state
  const {chapterName, title, topicName,courseId  } = location.state || {}; 
  

  // Inline styles
  const styles = {
    formContainer: {
      width: "50%",
      margin: "auto",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif"
    },
    formLabel: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold"
    },
    formInput: {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px"
    },
    formTextarea: {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      minHeight: "80px",
      resize: "vertical"
    },
    formCheckbox: {
      marginBottom: "20px"
    },
    formRadioGroup: {
      display: "flex",
      gap: "15px",
      marginBottom: "20px"
    },
    formRadioInput: {
      marginRight: "8px"
    },
    formDateInput: {
      width: "calc(100% - 40px)", // Adjust width for icon
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px"
    },
    calendarIcon: {
      position: "absolute",
      right: "10px",
      top: "calc(50% - 10px)", // Center icon vertically
      cursor: "pointer"
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px"
    },
    button: {
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer"
    },
    backButton: {
      backgroundColor: "gray",
      color: "#fff"
    },
    saveButton: {
      backgroundColor: "#007bff",
      color: "#fff"
    }
  };

  const handleSave = async () => {
    // Collect form data
    const chapter_name=chapterName;
    const course_title  = title;
    const topic_name= topicName;
    const tags = document.querySelector('#tags').value;
    const available_from = document.querySelector('#availableFrom').value;
    const available_till = document.querySelector('#availableTill').value;
    const Link = document.querySelector('#youtubeLink').value;
    // const preClassMessage = document.querySelector('#preClassMessage').value;

    const formData = {
      chapter_name,
      course_title,
      topic_name,
      tags,
      available_from,
      available_till,
      Link,
      // preClassMessage,
      // liveChatEnabled,
      // playerSelection,
    };

    try {
      // Post form data to the backend
      await axios.post('http://localhost:3002/api/live', formData);
      alert('Data saved successfully!');
      navigate('/CreateChapter', { state: { courseId } }); // Navigate back or to another page
    } catch (error) {
      // Handle errors
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };


  return (
    <div style={styles.formContainer}>
      <h2 style={styles.header}>{topicName}</h2> {/* Display the topic name */}

      <label htmlFor="title" style={styles.formLabel}>
        Title: *
      </label>
      <input
        type="text"
        id="title"
        value={topicName}
        readOnly
        style={styles.formInput}
      />

      <label htmlFor="tags" style={styles.formLabel}>
        Tags (Comma separated for multiple tags)
      </label>
      <input
        type="text"
        id="tags"
        style={styles.formInput}
        placeholder="Tags"
      />

      <label htmlFor="availableFrom" style={styles.formLabel}>
        Available From: *
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="datetime-local"
          id="availableFrom"
          style={styles.formDateInput}
        />
        <span style={styles.calendarIcon}>📅</span>
      </div>

      <label htmlFor="availableTill" style={styles.formLabel}>
        Available Till: *
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="datetime-local"
          id="availableTill"
          style={styles.formDateInput}
        />
        <span style={styles.calendarIcon}>📅</span>
      </div>

      <label htmlFor="youtubeLink" style={styles.formLabel}>
        Live Link
      </label>
      <input
        type="url"
        id="youtubeLink"
        style={styles.formInput}
        placeholder="https://www.youtube.com/live/xyz"
      />

      <label htmlFor="preClassMessage" style={styles.formLabel}>
        Pre Class Message (shown to learners before live session)
      </label>
      <textarea
        id="preClassMessage"
        style={styles.formTextarea}
        placeholder="Enter pre-class message"
      ></textarea>

      <div style={styles.buttonContainer}>
        <button
          type="button"
          onClick={() => navigate('/CreateChapter', { state: { courseId } })} // Navigate back to CreateChapter
          style={{ ...styles.button, ...styles.backButton }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSave} // Handle the save action
          style={{ ...styles.button, ...styles.saveButton }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Live;
