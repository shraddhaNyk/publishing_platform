// SearchBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className='search-bar'>
      <input type='text' placeholder='Search'/>
      <FaSearch className='search-icon'/>
    </div>
  );
}

export default SearchBar;
