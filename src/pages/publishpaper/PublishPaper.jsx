

import React, { useState } from 'react';
import './PublishPaper.css';
import Prepareyourpaper from './Prepareyourpaper';
import FindaJournal from './FindaJournal';
import SubmitPaper from './SubmitPaper';
import PaperInReview from './PaperInReview';
import Sharepaper from './Sharepaper';

function PublishPaper() {
  const [selectedItem, setSelectedItem] = useState('1. Prepare your paper'); // Default selected item is Find a Journal

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName); // Update selected item when clicked
  };

  const PublishPaperItems = [
   
    {
      name: '1. Prepare your paper',
      component: <Prepareyourpaper />,
    },
    {
      name: '2. Submit the paper',
      component: <SubmitPaper />,
    },
    {
      name: '3. Paper in review',
      component: <PaperInReview />,
    },
    {
      name: '4. Share',
      component: <Sharepaper />,
    },
  ];

  return (
    <div className="publish-container">
      <div className="publish-links">
        <ul className="publish-nav-lists">
          {PublishPaperItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item.name)}
              className={selectedItem === item.name ? 'publish-activated' : ''}
            >
              <div className="publish-path">{item.name}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="publish-content">
        {PublishPaperItems.map((item, index) => (
          <div key={index} style={{ display: selectedItem === item.name ? 'block' : 'none' }}>
            {item.component}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublishPaper;

