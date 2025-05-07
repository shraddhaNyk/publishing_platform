

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Communities.css'; // Import your CSS file for styling
import axios from 'axios';

function Communities() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get('http://localhost:3002/communities');
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const handleCommunityClick = async (communityName) => {
    try {
      await axios.post('http://localhost:3002/api/increment-visitor', { communityName });
      console.log(`Visitor count incremented for ${communityName}`);
      // Optionally update local state or UI to reflect the visitor count change
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
      // Optionally handle error in UI
    }
  };

  return (
    <div>
      <h2 style={{ margin: '40px' }}>Join Interested Community</h2>
      <div className="communities-container">
        {communities.map((community) => (
          <div key={community.id} className="community-block">
            {community.status === 'deactivated' ? (
              <div>
                <img src={`http://localhost:3002/${community.Communitypath}`} alt={community.Communityname} />
                <span>{community.Communityname}</span>
                <p>This community is deactivated</p>
              </div>
            ) : (
              <Link to={`/SearchCommunity?name=${community.Communityname}`} onClick={() => handleCommunityClick(community.Communityname)}>
                <img src={`http://localhost:3002/${community.Communitypath}`} alt={community.Communityname} />
                <span>{community.Communityname}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Communities;