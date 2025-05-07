import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunityStatistic = () => {
    const [communityStats, setCommunityStats] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [editMode, setEditMode] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const handleInputChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleReply = (index) => {
        const newEditMode = [...editMode];
        newEditMode[index] = true;
        setEditMode(newEditMode);
    };

    const handleDelete = (index) => {
        const newAnswers = [...answers];
        newAnswers[index] = "";
        setAnswers(newAnswers);
    };

    const handleSave = async (index) => {
        const newEditMode = [...editMode];
        newEditMode[index] = false;
        setEditMode(newEditMode);

        try {
            const response = await axios.put('http://localhost:3002/api/updateAnswer', {
                question: questions[index].question,
                answer: answers[index],
            });

            console.log('Answer updated successfully:', response.data);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Error updating answer:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error updating answer, no response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };

    useEffect(() => {
        fetchPendingQuestionsCountByCommunity()
            .then(data => {
                console.log(data);
                setCommunityStats(data);
            })
            .catch(error => {
                console.error('Error fetching community statistics:', error);
            });
    }, []);

    const fetchPendingQuestionsCountByCommunity = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/pendingQuestionsCountByCommunity');
            if (!response.ok) {
                throw new Error('Failed to fetch community statistics');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Failed to fetch community statistics');
        }
    };

    const fetchQuestionsByCommunity = async (communityName) => {
        try {
            const response = await fetch(`http://localhost:3002/api/questionsByCommunity/${communityName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions for community');
            }
            const data = await response.json();
            setQuestions(data);
            setAnswers(data.map(() => ""));
            setEditMode(data.map(() => false));
            return data;
        } catch (error) {
            throw new Error('Failed to fetch questions for community');
        }
    };

    const handlePendingCountClick = (communityName) => {
        fetchQuestionsByCommunity(communityName)
            .then(data => {
                setQuestions(data);
                setSelectedCommunity(communityName);
            })
            .catch(error => {
                console.error('Error fetching questions for community:', error);
            });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Community Statistics</h1>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ border: "2px solid black", textAlign: "center", padding: "10px", backgroundColor: "#f2f2f2" }}>Community Name</th>
                        <th style={{ border: "2px solid black", textAlign: "center", padding: "10px", backgroundColor: "#f2f2f2" }}>Pending questions to be answered</th>
                        <th style={{ border: "2px solid black", textAlign: "center", padding: "10px", backgroundColor: "#f2f2f2" }}>Questions Answered</th>
                        <th style={{ border: "2px solid black", textAlign: "center", padding: "10px", backgroundColor: "#f2f2f2" }}>Total visitors in community</th>
                    </tr>
                </thead>
                <tbody>
                    {communityStats.map((community, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid black", textAlign: "center", padding: "10px" }}>{community.community_name}</td>
                            <td
                                style={{ border: "1px solid black", textAlign: "center", padding: "10px", cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                onClick={() => handlePendingCountClick(community.community_name)}
                            >
                                {community.pendingCount}
                            </td>
                            <td style={{ border: "1px solid black", textAlign: "center", padding: "10px" }}>{community.answeredCount}</td>
                            <td style={{ border: "1px solid black", textAlign: "center", padding: "10px" }}>{community.Total_visitors}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedCommunity && (
                <div>
                    <h3>Pending Questions for {selectedCommunity}</h3>
                    <div>
                        {questions.map((question, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <p>{question.question}</p>
                                {editMode[index] ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={answers[index]}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            placeholder="Type your answer here"
                                            style={{ width: '50%', height: '40px', padding: '10px' }}
                                        />
                                        <button onClick={() => handleSave(index)}>Save</button>
                                        <button onClick={() => handleDelete(index)}>Delete</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{answers[index]}</p>
                                        <button onClick={() => handleReply(index)}>Reply</button>
                                        {answers[index] && <button onClick={() => handleReply(index)}>Edit</button>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="popup">
                    <p>Answer updated successfully!</p>
                </div>
            )}
        </div>
    );
};

export default CommunityStatistic;