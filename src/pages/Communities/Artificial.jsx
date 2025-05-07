// SearchComponent.js
import React, { useState } from 'react';
import './Artificial.css'

// Creating a functional component SearchComponent
function ArtificialComponent() {
  // Defining state variables using the useState hook
  const [query, setQuery] = useState(''); // State variable to store the search query
  const [results, setResults] = useState([]); // State variable to store search results

  // Asynchronous function to handle search
  const handleSearch = async () => {
    // Your search logic goes here
    // Make an API call to your backend with the search query
    // Update the results state with the response from the backend
    // Example:
    // const response = await fetch(`your-backend-url/search?q=${query}`);
    // const data = await response.json();
    // setResults(data.results);
  };
     // Placeholder data for trending questions
  const trendingQuestions = [
    "What is artificial intelligence?",
    "How does machine learning work?",
    "Top programming languages for AI development",
    "Future of AI in healthcare",
    "Ethical considerations in AI"
  ];
  // Rendering the JSX
  return (

    <div>
    <div className='search-container'> {/* Container for the search component */}
      {/* Search form */}
      <div className='search-form'>
        <input
          type='text'
          value={query} // Binding the input value to the query state variable
          onChange={(e) => setQuery(e.target.value)} // Handling input change and updating the query state
          placeholder='Search or ask a question...' // Placeholder text for the input field
        />
        <button onClick={handleSearch}>Search</button> {/* Button to trigger search */}
      </div>

      
      {/* Displaying search results */}
      <div className='search-results'>
        {results.map((result, index) => (
          <div key={index} className='result-item'> {/* Individual search result item */}
            <h3>{result.title}</h3> {/* Displaying result title */}
            <p>{result.description}</p> {/* Displaying result description */}
            {/* Additional result details can be added here */}
          </div>
          
        ))}
      </div>
    </div>
        {/* Trending Questions */}
      <div className='trending-questions'>
        <h2>Trending Questions</h2>
        <ul>
          {trendingQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArtificialComponent; // Exporting the SearchComponent function as default


