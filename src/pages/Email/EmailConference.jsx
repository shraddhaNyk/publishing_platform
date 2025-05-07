

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const ConferencePage = () => {
  const { conferenceTitle } = useParams();
  const [conference, setConference] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/EmailConference/${encodeURIComponent(conferenceTitle)}`)
      .then(response => {
        setConference(response.data);
        setError(null); // Clear any previous errors
      })
      .catch(error => {
        console.error('Error fetching conference details:', error);
        setError('Conference not found or an error occurred.');
      });
  }, [conferenceTitle]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!conference) {
    return <div className="text-center">Loading...</div>;
  }

  // Construct the thumbnail URL based on the response
  const thumbnailUrl = conference.thumbnail_url.startsWith('/')
    ? `http://localhost:3001${conference.thumbnail_url}`
    : conference.thumbnail_url;

  return (
    <div className="min-h-screen bg-dark-blue-900 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#282f59]">Conference Details</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div>
          <img 
            src={thumbnailUrl} 
            alt={conference.title} 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{conference.title}</h2>
          <p className="text-gray-600 text-sm mb-2">Instructor: {conference.instructor_id}</p>
          <p className="text-sm text-gray-500 mb-2">Price: ₹{conference.price}</p>
          <p className="text-sm text-gray-500 mb-2">
            Join Link: <a href={conference.join_link} className="text-blue-500 underline">{conference.join_link}</a>
          </p>
          <p className="text-sm text-gray-500 mb-2">Created on: {new Date(conference.created_at).toLocaleDateString()}</p>
          <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded mt-2 flex items-center transition-transform transform hover:scale-105">
            Enroll Now <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;
