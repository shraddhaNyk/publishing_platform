

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function MobileComponent() {
  const [query, setQuery] = useState(''); // State for storing the search or ask query
  const [results, setResults] = useState([]); // State for storing search results
  const [loading, setLoading] = useState(false); // State for indicating loading status
  const [error, setError] = useState(null); // State for storing any errors
  const [communityName, setCommunityName] = useState(''); // State for storing the community name from URL params
  const [topTrendingQuestions, setTopTrendingQuestions] = useState([]); // State for storing top trending questions

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('http://localhost:3002/search-or-add', { query });   // Send search query to server
        setResults(response.data);   // Update results with server response
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() !== '') {   // Trigger search if query is not empty
      search();
    }
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(location.search); // Parse URL parameters
    const name = params.get('name');
    if (name) {
      setCommunityName(name);   // Update community name if parameter is present
    }
  }, [location]);

  useEffect(() => {
    const fetchTopTrendingQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/top-trending-questions', {
          params: { communityName }  // Fetch top trending questions specific to the community
        });
        setTopTrendingQuestions(response.data);  // Update state with fetched questions
      } catch (error) {
        console.error('Error fetching top trending questions:', error);
      }
    };

    if (communityName) {
      fetchTopTrendingQuestions(); // Fetch trending questions when communityName changes
    }
  }, [communityName]);

  const handleAsk = async () => {
    try {
      const addResponse = await axios.post('http://localhost:3002/search-or-add', { query, answer: 'null', newAnswer: true, communityName }); // Post new question to server
      console.log('Add Response:', addResponse.data);  // Log server response

      console.log('Community Name:', communityName);  // Log community name
      if (addResponse.data && addResponse.data.message) {
        alert(addResponse.data.message);
        setQuery(''); // Clear the query after asking
      }
    } catch (error) {
      console.error('Error asking question:', error);
      alert('An error occurred while asking the question.');
    }
  };

  const handleQuestionClick = async (question, answer) => {
    try {
      // Increment the count for the clicked question
      await axios.post('http://localhost:3002/api/trending-question-count', { question, communityName });  // Increment click count for the question
      navigate('/Comment', { state: { question, answer } });   // Navigate to comment page with question and answer
    } catch (error) {
      console.error('Error incrementing question count:', error);
      alert('An error occurred while incrementing the question count.');
    }
  };

  return (
    <div>
      <div className='search-container'>
        <div> <h2>{communityName}</h2> </div>
        <div className='search-form'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}  // Update query state on input change
            placeholder='Search or ask a question...'
            style={{ height: "50px" }}
          />
          {query.trim() === '' || (results.length === 0 && query.trim() !== '') ? (
            <button onClick={handleAsk} style={{ height: "45px" }}>Ask</button> // Show 'Ask' button if query is empty or no results found
          ) : null}
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <div className='search-results'>
          {results.map((result, index) => (
            <div key={index} className='result-item' onClick={() => handleQuestionClick(result.question, result.answer)}>
              <h3>{result.question}</h3>
              <p>{result.answer}</p>
            </div>
          ))}
          {results.length === 0 && query.trim()}
        </div>
      </div>

      <div className='trending-questions'>
        <h2>Top Trending Questions</h2>
        <ul>
          {topTrendingQuestions.map((question, index) => (
            <li key={index} onClick={() => handleQuestionClick(question.question, question.answer)}>{question.question}</li>  // Show trending questions
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileComponent;
