import React, { useState,useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { GiOpenBook } from "react-icons/gi";
import axios from 'axios';

const HomeFooter = () => {
 
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3002/api/subscribe', { email });
        setMessage(response.data.message);
        setEmail(''); // Clear the input field after successful submission
    } catch (error) {
        if (error.response && error.response.data.message) {
            setMessage(error.response.data.message);
        } else {
            setMessage('An error occurred. Please try again.');
        }
    }
  };

  return (
    <footer id='footer' className="bg-gray-800 text-gray-200 py-4">
      <div className="max-w-[1140px] max-h-[30%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className='flex items-center justify-center md:justify-start mb-4'>
            <GiOpenBook size={30} className='text-white mr-2'/>
            <h1 className='text-2xl font-bold text-white'>Publication Platform</h1>
          </div>
          <p className="text-gray-400">
          Publication Platform is a leading publication for the latest research and trends in science and technology.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Useful Links</h2>
          <ul className="text-gray-400 space-x-2">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#whyPublication" className="hover:text-white">Why Publication Platform ?</a></li>
            <li><a href="#service" className="hover:text-white">Services</a></li>
            <li><a href="#contactus" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Newsletter</h2>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter to get the latest updates.</p>
          <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-gray-300 focus:outline-none"
              required
            />
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white">
              Subscribe
            </button>
          </form>
          {message && <p className="mt-2 text-sm text-white">{message}</p>}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 it">Email: info@ijst.com</p>
          <div className="flex mt-4 space-x-4">
            <FaFacebookF className='text-gray-400 hover:text-white' />
            <FaTwitter className='text-gray-400 hover:text-white' />
            <FaInstagram className='text-gray-400 hover:text-white' />
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-6">
        &copy; 2024 Publication Platform. All rights reserved.
      </div>
    </footer>
  );
}

export default HomeFooter;
