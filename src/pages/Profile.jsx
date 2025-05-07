
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import General from '../pages/profile/General'; // Import the General component
import Education from '../pages/profile/Education';
import Experience from '../pages/profile/Experience';
import Interest from '../pages/profile/Interest';
import './Profile.css';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Personal'); // Default selected item is Personal (General)

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName); // Update selected item when clicked
  };

  const navigate = useNavigate(); // Initialize useNavigate hook from react-router-dom for navigation

  const ProfileItems = [
    {
      name: 'Personal',
      component: <General />, // Render General component when Personal is clicked
    },
    {
      name: 'Education',
      component: <Education />
    },
    {
      name: 'Experience',
      component: <Experience />
    },
    {
      name: 'Interest',
      component: <Interest />
    },
    
    
  ];

  return (
    <div className="profileclass">
      <div style={{ width: isOpen ? '20%' : '70%', marginBottom: '2%', marginLeft: '10%' }} className="topbar">
        {ProfileItems.map((item, index) => (
          <div key={index} className="toplink" onClick={() => handleItemClick(item.name)}>
            <div className='topName'>{item.name}</div>
            <div style={{ display: isOpen ? 'block' : 'none' }} className="toplink_text">
              {item.name}
            </div>
          </div>
        ))}
      </div>
      <div className="content">
        {ProfileItems.map((item, index) => (
          <div key={index} style={{ display: selectedItem === item.name ? 'block' : 'none' }}>
            {item.component}
          </div>
        ))}
      </div>
      {/* Footer section */}
    </div>
  );
};

export default Profile;