
import React, { useState } from 'react';
import './PublishBook.css';
import PrepareyourBook from './PrepareyourBook';
import FindaBook from './FindaBook';
import SubmitBook from './SubmitBook';
import BookInReview from './BookInReview';
import ShareBook from './ShareBook';

function PublishBook() {
  const [selectedItem, setSelectedItem] = useState('1. Prepare your Book'); // Default selected item is Find

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName); // Update selected item when clicked
  };

  const PublishPaperItems = [
    // {
    //   name: '1. Find a Book',
    //   component: <FindaBook/>, // Render Find a Journal component when Find is clicked
    // },
    {
      
      name: '1. Prepare your Book',
      component: <PrepareyourBook/>,
    },
    {
      name: '2. Submit the Book',
      component: <SubmitBook/>,
    },
    {
      name: '3. Book in review',
      component: <BookInReview/>,
    },
   
    {
      name: '4. Share',
      component: <ShareBook/>,
    },
    // Add other items as needed
  ];

  return (
    <div className="publish-container">
      <div className="publish-links">
        <ul className="publish-nav-lists">
          {PublishPaperItems.map((item, index) => (
            <li key={index} onClick={() => handleItemClick(item.name)} className={selectedItem === item.name ? 'publish-activated' : ''}>
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

export default PublishBook;
