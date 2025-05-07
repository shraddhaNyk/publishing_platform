import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const Assignment = () => {
  const [availability, setAvailability] = useState("always");
  const [fromDate, setFromDate] = useState("");
  const [tillDate, setTillDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {chapterName, topicName, title,courseId } = location.state || {}; // Fetch topic from the state passed by the previous page
 


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
      minHeight: "150px",
      resize: "vertical"
    },
    formRadioGroup: {
      display: "flex",
      gap: "15px",
      marginBottom: "20px"
    },
    formRadioInput: {
      marginRight: "8px"
    },
    header: {
      textAlign: "center",
      marginBottom: "20px"
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
    const formData = {
      chapterName:chapterName,
      title:title,
      topic: topicName,
      availability,
      fromDate,
      tillDate
    };

    try {
      await axios.post('http://localhost:3002/api/assignment', formData); // Adjust endpoint as needed
      alert("Form saved successfully!");
      navigate('/CreateChapter', { state: { courseId } }); // Navigate to CreateChapter page
    } catch (error) {
      console.error("Error saving form data:", error);
      alert("Failed to save form data. Please try again.");
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.header}>{topicName}</h2> {/* Display the topic name as title */}

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

      <label htmlFor="instructions" style={styles.formLabel}>
        Instructions: *
      </label>
      <textarea
        id="instructions"
        style={styles.formTextarea}
        placeholder="Enter instructions"
      ></textarea>

      <label style={styles.formLabel}>Availability Settings: *</label>
      <div style={styles.formRadioGroup}>
        <label>
          <input
            type="radio"
            value="always"
            checked={availability === "always"}
            onChange={() => setAvailability("always")}
            style={styles.formRadioInput}
          />
          Always Available
        </label>
        <label>
          <input
            type="radio"
            value="time"
            checked={availability === "time"}
            onChange={() => setAvailability("time")}
            style={styles.formRadioInput}
          />
          Time Based
        </label>
      </div>

      {availability === "time" && (
        <>
          <label htmlFor="fromDate" style={styles.formLabel}>
            From:
          </label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={styles.formInput}
          />

          <label htmlFor="tillDate" style={styles.formLabel}>
            Till:
          </label>
          <input
            type="date"
            id="tillDate"
            value={tillDate}
            onChange={(e) => setTillDate(e.target.value)}
            style={styles.formInput}
          />
        </>
      )}

      <div style={styles.buttonContainer}>
        <button
          type="button"
          onClick={() => navigate('/CreateChapter', { state: { courseId } })} // Navigate to CreateChapter page
          style={{ ...styles.button, ...styles.backButton }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSave} // Handle save action
          style={{ ...styles.button, ...styles.saveButton }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Assignment;
