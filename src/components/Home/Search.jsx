


import React, { useState } from 'react';
import iconSearch from '../../assets/Search.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const ManuscriptMatcherDialog = ({ onClose }) => {
  const navigate = useNavigate(); // Create a navigate function

  const handleLogin = () => {
    navigate('/login'); // Navigate to the login page
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 -mt-4 -mr-4 bg-white text-[#000000] font-semibold py-2 px-3 rounded-full  "
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Publication Finder</h2>
        <div className="search-tips flex items-start gap-6">
          <img src={iconSearch} alt="Search Tips" className="w-16 h-auto" />
          <div className="search-tips-description">
            <p>
              Find relevant, reputable journals for potential publication of
              your research based on an analysis of tens of millions of citation
              connections in Web of Science Core Collection using Manuscript
              Matcher.
            </p>
            <p className="mt-2">To continue please login or create a free account.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-[#223182]  text-white font-semibold py-2 px-4 rounded-md mr-4 focus:outline-none focus:ring focus:ring-[#223182]"
            onClick={handleLogin}>
            Login
          </button>
          <button
            className="border text-[#223182] border-[#223182] font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            onClick={handleLogin}>
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};


const Search = () => {
  const [showDialog, setShowDialog] = useState(false);

  const openDialog = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div id='search' className='w-full bg-blue-50/80'>
      {showDialog && <ManuscriptMatcherDialog onClose={closeDialog} />}
      <div className="mx-auto max-w-4xl p-6 ">
        <div className="search-wrapper bg-white rounded-lg shadow-xl p-10 bg-opacity-2">
          <div className="search-wrapper-entry flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <form className="w-full md:w-auto flex-grow">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search journal/book by ISSN, name or keywords..."
                  className="my-3 py-4 px-3 w-full border border-black rounded-md focus:outline-none focus:border-blue-400"
                  id="search-box"
                  maxLength="200"
                  name="searchBox"
                  aria-invalid="false"
                  aria-required="false"
                  
                />
              </div>
            </form>
            <div className="search-wrapper-search">
              <button
                onClick={openDialog}
                className="w-[13rem] py-4 bg-[#223182] text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              >
                Search
              </button>
            </div>
          </div>
          <div className="search-wrapper-entry flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
            <div className="search-tips flex items-start gap-6">
              <img
                src={iconSearch}
                alt="Search Tips"
                className="w-16 h-auto"
              />
              <div className="search-tips-description">
                <h2 className="font-medium">
                  Do you already possess a manuscript ?
                </h2>
                <p class="font-sans text-[13px] ">
                  Discover credible journals suitable for publishing your
                  research by leveraging an extensive analysis of citation
                  connections within the Web of Science Core Collection using
                  Publication Finder.
                </p>
              </div>
            </div>
            <button
              className="w-[13] py-4 border text-[#223182] border-[#223182]  font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-[#223182]"
              onClick={openDialog}
            >
              Find Publication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
