import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { TiTick } from "react-icons/ti";
import { IoAdd } from "react-icons/io5";
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/pagination';
import './Interest.css';
import '../../App.css';

const Interest = () => {
    const navigate = useNavigate();
    const [interests, setInterests] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        const fetchInterest = async () => {
            try {
                const response = await axios.get('http://localhost:3002/interest');
                setInterests(response.data.filter(interest => interest.status !== 'deactivated'));
            } catch (error) {
                console.error('Error fetching interest:', error);
            }
        };

        fetchInterest();
    }, []);

    const handleTechnologyInterestClick = async (index) => {
        const selectedInterest = interests[index];

        const newInterests = interests.filter((_, i) => i !== index);
        setInterests(newInterests);
        const updatedSelectedInterests = [...selectedInterests, selectedInterest];
        setSelectedInterests(updatedSelectedInterests);

        try {
            // Save the selected interests to the database
            const saveResponse = await axios.post('http://localhost:3002/technology_interest', {
                selectedInterests: updatedSelectedInterests
            });
            if (saveResponse.status === 200) {
                console.log('Interests saved successfully');

                // Fetch PDFs for the new selected interest
                const response = await axios.get('http://localhost:3002/api/getPdf', {
                    params: { tech: selectedInterest.Insertname }
                });
                if (response.status === 200) {
                    setPdfs(prevPdfs => [...prevPdfs,
                        { tech: selectedInterest.Insertname, url: response.data.pdfUrl, paperName: response.data.paperName }]);
                    console.log("name:", selectedInterest.Insertname);
                    console.log("pdf file name :", response.data.paperName);
                    console.log("pdf file:", response.data.pdfUrl);
                } else {
                    console.error('PDF not found');
                }
            } else {
                throw new Error('Failed to save interests');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ width: '43%', height: '5%', margin: 'auto', background: 'white', padding: '3%', borderRadius: '2%' }}>
            <h2>Interests</h2>
            <div style={{ marginBottom: '0%' }}>
                <label style={{ fontSize: '16px', marginLeft: '4%' }}> Popular Technology :</label>
                <Swiper
                    style={{ marginTop: '2%', marginBottom: '5%' }}
                    slidesPerView={3}
                    spaceBetween={'0%'}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {interests.map((interest, index) => (
                        <SwiperSlide key={index}>
                            <div className="swiper-slide-content">
                                <p>{interest.Insertname}</p>
                                <button
                                    type="button"
                                    style={{
                                        marginTop: '5px',
                                        background: '#b2b2b2c3',
                                        width: '100%',
                                        height: '30px',
                                        borderStyle: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleTechnologyInterestClick(index)}
                                >
                                    {selectedInterests.includes(interest) ? <TiTick size='1rem' color='#43ca3a' /> : <IoAdd size='1rem' />}
                                </button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            
            <div>
                <label style={{ fontSize: '18px', marginLeft: '4%', marginTop: '10px' }}> Your Interests :</label>
                <div>
                    {selectedInterests.map((interest, index) => (
                        <p key={index}>{interest.Insertname}</p>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <label style={{ fontSize: '18px', marginLeft: '4%', marginBottom: '5px', marginTop: '1px' }}> Related Papers :</label>
            </div>
            <div>
                {pdfs.length > 0 ? (
                    pdfs.map((pdf, index) => (
                        <div key={index} style={{ marginTop: '20px' }}>
                            <p>{pdf.tech}</p>
                            <a href={`http://localhost:3001/${pdf.url}#toolbar=0&navpanes=0`} target="_blank" rel="noopener noreferrer">
                                {pdf.paperName}
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No papers available</p>
                )}
            </div>
        </div>
    );
};

export default Interest;