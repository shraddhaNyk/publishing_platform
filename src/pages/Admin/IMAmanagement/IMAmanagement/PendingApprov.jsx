import React, { useState,useEffect } from 'react';
import './PendingApprov.css';
import axios from 'axios';


function PendingApprov() {
  const [rows, setRows] = useState([]); // State to hold fetched data
  const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows

  useEffect(() => {
    // Fetch data from backend when component mounts
    axios.get('http://localhost:3002/role_approval')
      .then(response => {
        console.log('Fetched data:', response.data);
        setRows(response.data); // Update state with fetched data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle error, e.g., set error state
      });
  }, []); // Empty dependency array means this effect runs only once, like componentDidMount

  // Function to handle selection of rows
  const handleRowSelection = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(rowIndex => rowIndex !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };



  const updateStatus = (newStatus) => {
    // Extract IDs and request types of selected rows
    const selectedIds = selectedRows.map(index => rows[index].IJST_ID);
    const selectedRequestTypes = selectedRows.map(index => rows[index].request_type);
    const request_IDs = selectedRows.map(index => rows[index].request_ID);
    // Send a POST request to update status on the backend
    axios.post('http://localhost:3002/update_role_status', {
      ids: selectedIds,
      newStatus: newStatus,
      request_types: selectedRequestTypes, // Corrected key here
      requestIDs:request_IDs
    })
    .then(response => {
      console.log('Status updated:', response.data);
  
      // Update the local state to reflect the updated status
      setRows(rows.map((row, index) =>
        selectedRows.includes(index) ? { ...row, role_status: newStatus } : row
      ));
      setSelectedRows([]); // Clear selected rows after update
    })
    .catch(error => {
      console.error('There was an error updating the status!', error);
      // Handle error, e.g., show error message
    });
  };


  return (
    <div className="pending-approv-container">
      <h2>Pending Approval</h2>
      <div className="table-container1">
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>request ID</th>
              <th>Request type</th>
              <th>IJST ID</th>
              <th>Employee ID</th>
              <th>Role Needed</th>
              <th>Role Type</th>
              <th>Publisher Organization Name</th>
              <th>Publisher Register No</th>
              <th>Publisher GST/VAT No</th>
              <th>Publisher Reg Certificate</th>
              <th>Publisher Authorization Letter</th>
              <th>Publisher Digital Signature</th>
             <th>Student organisation</th>
              <th>Student ID</th>
              <th>Student Email</th>
              <th>Student ID File</th>
              <th>Corporate employee organisation</th>
              <th>Corporate employee ID</th>
              <th>Corporate employee Email</th>
              <th>Corporate employee ID File</th>
              <th>Editor High School File</th>
              <th>Editor PU College File</th>
              <th>Editor UG College File</th>
              <th>Editor PG College File</th>
              <th>Editor PhD/Doctoral File</th>
              <th>Corporate IJST number</th>
              <th>Corporate Institution Name</th>
              <th>Corporate Incorporation No</th>
              <th>Corporate GST/VAT No</th>
              <th>Corporate Reg Certificate</th>
              <th>Corporate Authorization Letter</th>
              <th>Corporate Digital Signature</th>
              <th>Corporate email domain</th>
              <th>Gocernment ID proof</th>
              <th>role Status</th>
              <th>Requested time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedRows.includes(index)} 
                    onChange={() => handleRowSelection(index)} 
                  />
                </td>
                <td>{row.request_ID}</td>
                <td>{row.request_type}</td>
                <td>{row.IJST_ID}</td>
                <td>{row.employee_id}</td>
                <td>{row.role_needed}</td>
                <td>{row.role_type}</td>
                <td>{row.publication_organization_name}</td>
                <td>{row.publication_register_number}</td>
                <td>{row.publication_gst_number}</td>
                <td>{row.publication_certificate}</td>
                <td>{row.publication_authorization_letter}</td>
                <td>{row.publication_digital_signature}</td>
                <td>{row.student_organisation}</td>
                <td>{row.student_id}</td>
                <td>{row.student_email}</td>
                <td>{row.student_idcard}</td>
                <td>{row.corporate_employee_organisation}</td>
                <td>{row.corporate_employee_id}</td>
                <td>{row.corporate_employee_email}</td>
                <td>{row.corporate_employee_idcard}</td>
                <td>{row.high_school_certificate}</td>
                <td>{row.preuniversity_certificate}</td>
                <td>{row.under_graduate_certificate}</td>
                <td>{row.post_graduate_certificate}</td>
                <td>{row.phd_certificate}</td>
                <td>{row.corporate_IJST_identification_number}</td>
                <td>{row.corporate_organization_name}</td>
                <td>{row.corporate_incorporation_number}</td>
                <td>{row.corporate_gst_number}</td>
                <td>{row.corporate_incorporation_certificate}</td>
                <td>{row.corporate_authorization_letter}</td>
                <td>{row.corporate_digital_signature}</td>
                <td>{row.corporate_email_domain}</td>
                <td>{row.government_id_proof}</td>
                <td>{row.role_status}</td>
                <td>{row.request_timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ApprRej">
        <button onClick={() => updateStatus('Approved')}>Approve</button>
        <button onClick={() => updateStatus('Rejected')}>Reject</button>
      </div>
     
    </div>
  );
}

export default PendingApprov;