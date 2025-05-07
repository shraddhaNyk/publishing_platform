
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

const Forms = () => {
  // const [title, setTitle] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [tags, setTags] = useState('');
  const [enableSharing, setEnableSharing] = useState(false);
  const [availability, setAvailability] = useState('always');
  const [fromDate, setFromDate] = useState("");
  const [tillDate, setTillDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { chapterName, topicName, title, courseId} = location.state || {};
  

  const addField = (fieldName) => {
    setFormFields([...formFields, { name: fieldName, value: '' }]);
  };

  const handleFieldChange = (index, value) => {
    const newFormFields = [...formFields];
    newFormFields[index].value = value;
    setFormFields(newFormFields);
  };

  const handleSave = async () => {
    const formData = {
      chapterName,
      title,
      topicName,
      tags,
      enableSharing,
      availability,
      fromDate,
      tillDate,
      formFields,
    };

    try {
      // Post form data to the backend
      await axios.post('http://localhost:3002/api/forms', formData);
      alert('Form data saved successfully!');
      navigate('/CreateChapter', { state: { courseId } }); // Navigate back or to another page
    } catch (error) {
      // Handle errors
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  const styles = {
    formLabel: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold"
    }
  };


  // Dynamic rendering of different input types based on field.name
  const FieldItem = ({ field, index }) => {
    let inputElement = null;

    switch (field.name) {
      case 'Checkbox Group':
        inputElement = (
          <div>
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => handleFieldChange(index, e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <label>Option</label>
          </div>
        );
        break;
      case 'Date Field':
        inputElement = (
          <input
            type="date"
            value={field.value}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginTop: '5px',
            }}
          />
        );
        break;
      case 'File Upload':
        inputElement = (
          <input
            type="file"
            onChange={(e) => handleFieldChange(index, e.target.files[0])}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginTop: '5px',
            }}
          />
        );
        break;
      case 'Text Field':
        inputElement = (
          <input
            type="text"
            value={field.value}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginTop: '5px',
            }}
          />
        );
        break;
      case 'Text Area':
        inputElement = (
          <textarea
            value={field.value}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginTop: '5px',
            }}
          />
        );
        break;
      // Add cases for other field types (e.g., Number, Radio Group, Select, etc.)
      default:
        inputElement = (
          <input
            type="text"
            value={field.value}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginTop: '5px',
            }}
          />
        );
    }

    return (
      <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>{field.name}</label>
        {inputElement}
      </div>
    );
  };

  const Field = ({ name }) => {
    const [, ref] = useDrag({
      type: 'field',
      item: { name },
    });
    return (
      <li ref={ref} style={{ padding: '5px 0', borderBottom: '1px solid #ddd', cursor: 'move' }}>
        {name}
      </li>
    );
  };

  const DropArea = () => {
    const [, ref] = useDrop({
      accept: 'field',
      drop: (item) => addField(item.name),
    });

    return (
      <div ref={ref} style={{ border: '1px dashed #ccc', padding: '20px', borderRadius: '5px', minHeight: '150px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Form Builder: *</label>
        {formFields.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', lineHeight: '150px' }}>
            Drag a field from the right to this area
          </div>
        ) : (
          formFields.map((field, index) => <FieldItem key={index} index={index} field={field} />)
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ marginBottom: '20px' }}>Create Form</h2>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', fontWeight: 'bold' }}>Title: *</label>
          <input
            type="text"
            id="title"
             value={topicName}
            // onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="tags" style={{ display: 'block', fontWeight: 'bold' }}>Tags (Comma separated for multiple tags)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
        </div>

      

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Availability Settings: *</label>
          <label style={{ marginRight: '20px' }}>
            <input
              type="radio"
              name="availability"
              value="always"
              checked={availability === 'always'}
              onChange={(e) => setAvailability(e.target.value)}
              style={{ marginRight: '5px' }}
            />
            Always Available
          </label>
          <label>
            <input
              type="radio"
              name="availability"
              value="time"
              checked={availability === 'time'}
              onChange={(e) => setAvailability(e.target.value)}
              style={{ marginRight: '5px' }}
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


        <DropArea />

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '48%' }}>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
              <Field name="Checkbox Group" />
              <Field name="Date Field" />
              <Field name="File Upload" />
              <Field name="Header" />
              <Field name="Number" />
              <Field name="Paragraph" />
              <Field name="Radio Group" />
              <Field name="Select" />
              <Field name="Text Field" />
              <Field name="Text Area" />
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => navigate('/CreateChapter', { state: { courseId } })}
            style={{
              padding: '10px 20px',
              backgroundColor: 'gray',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Forms;
