

import React from 'react';
import { AiFillPhone, AiOutlineClockCircle } from 'react-icons/ai';
import { BsChatSquareDots } from 'react-icons/bs';
import { GiOpenBook } from "react-icons/gi";
import { Link } from 'react-router-dom'; // Import Link component
import './TopBar.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import useGeoLocation from './useGeoLocation';

const TopBar = () => {
  const navigate = useNavigate(); // Create a navigate function


  const handleLogin = () => {
    navigate('/login'); // Navigate to the login page
  
  };


  return (
    <div className=' flex justify-between items-center bg-black px-4 py-2'>
      <div className='flex items-center'>
      <GiOpenBook size={40} className='mr-2 text-white'/>
        {/* <BsChatSquareDots size={30} className='icon-color mr-2'/> */}
        <h1 className='text-2xl font-bold text-white' >Publication Platform</h1>
      </div>
      <div className='flex'>
        <a href='#contactus' className='hidden md:flex items-center px-6' >
          {/* <AiFillPhone size={20} className='mr-2 text-[var(--primary-dark)]'/> */}
          {/* Use Link component to navigate to "/login" */}
          <p className='text-white font-bold' >Contact us</p>
          </a>
          <a href='#contactus' className='hidden md:flex items-center px-6' >
         {
          
         }
          </a>
        


        
        <button className='px-4 py-1.5 text-[#04AA6D]  bg-white  font-bold rounded-md' onClick={handleLogin}>
          Login
        </button>
        
        <button className='px-4 py-2 ml-2 text-[#04AA6D]  bg-white font-bold rounded-md' onClick={handleLogin}>
          Create Free Account
        </button>
        {/* <button className='px-4 py-2 ml-2 border text-[var(--primary-dark)] border-[var(--primary-dark)] font-bold rounded-lg' onClick={handleLogin}>
          Create Free Account
        </button> */}
      </div>
    
    </div>
  );
}

export default TopBar;
