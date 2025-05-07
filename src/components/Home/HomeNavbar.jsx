


import React, { useState } from 'react';
import { FaBars, FaFacebookF, FaTwitter, FaGooglePlusG, FaInstagram } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GiOpenBook } from "react-icons/gi";
import { IoLocationOutline } from "react-icons/io5";
import './TopBar.css';
import useGeoLocation from './useGeoLocation';

const HomeNavbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const location = useGeoLocation();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleNav = () => {
    setNav(!nav);
  };

  const handleNavigateAndScroll = (path, elementId) => {
    navigate(path);
    setTimeout(() => {
      document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="w-full h-[50px] flex justify-between items-center fixed top-0 z-10 bg-white shadow-md">
      <div className='flex items-center'>
        <GiOpenBook size={40} className='ml-2 text-[#04AA6D]' />
        <h1 className='text-2xl font-bold ml-2 text-black'>Publication Platform</h1>
      </div>
      <ul className='HomeNavUL hidden sm:flex px-2'>
        <li className='homelink mx-2'>
          <RouterLink className='text-black hover:text-[#04AA6D] transition duration-300' to='/' onClick={() => handleNavigateAndScroll('/', 'whyijst')}>Why Publication</RouterLink>
        </li>
        <li className='homelink mx-2'>
          <RouterLink className='text-black hover:text-[#04AA6D] transition duration-300' to='/' onClick={() => handleNavigateAndScroll('/', 'search')}>Search</RouterLink>
        </li>
        <li className='homelink mx-2 '>
          <RouterLink className="text-black hover:text-[#04AA6D] transition duration-300" to='/' onClick={() => handleNavigateAndScroll('/', 'service')}>Service</RouterLink>
        </li>
        <li className='homelink mx-2'>
          <RouterLink className="text-black hover:text-[#04AA6D] transition duration-300" to='/' onClick={() => handleNavigateAndScroll('/', 'contactus')}>Help Center</RouterLink>
        </li>
      </ul>
      <div className='flex items-center'>
        <FaFacebookF className='mx-2 text-black hover:text-[#04AA6D] transition duration-300 cursor-pointer' onClick={() => handleNavigateAndScroll('/', 'footer')} />
        <FaTwitter className='mx-2 text-black hover:text-[#04AA6D] transition duration-300 cursor-pointer' onClick={() => handleNavigateAndScroll('/', 'footer')} />
        <FaGooglePlusG className='mx-2 text-black hover:text-[#04AA6D] transition duration-300 cursor-pointer' onClick={() => handleNavigateAndScroll('/', 'footer')} />
        <FaInstagram className='mx-2 text-black hover:text-[#04AA6D] transition duration-300 cursor-pointer' onClick={() => handleNavigateAndScroll('/', 'footer')} />
      </div>
      <div className='hidden sm:flex items-center px-2'>
        <div className='p-2 bg-transparent '>
          {
            location.loaded && location.details
              ? location.details.country || location.details.state || location.details.district || location.details.postalCode
                ? <div className="text-xs text-gray-700 font-semibold">
                    <div className="flex">
                      <span><IoLocationOutline size={15} className=' text-black hover:text-[#04AA6D] transition duration-300 cursor-pointer' /></span>
                      <span style={{ fontSize: '10px' }} className=' text-black hover:text-[#04AA6D] transition duration-300 cursor-pointer'> { location.details.district}, {location.details.state},{location.details.country}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span> </span>
                    </div> */}
                  </div>
                : <p className='text-xs text-gray-700'>Coordinates: {location.coordinates.lat}, {location.coordinates.lng}</p>
              : <p className='text-xs text-gray-700'>- Turn on Location</p>
          }
        </div>
      </div>
      <div className='hidden sm:flex px-2'>
        <button className='px-2 py-1.5 mx-1 border text-[#04AA6D] border-[#04AA6D] font-medium rounded-md' onClick={handleLogin}>
          Login
        </button>
        <button className='px-2 py-1.5 mx-1 border text-white bg-[#04AA6D] font-medium rounded-md' onClick={handleLogin}>
          Create Free Account
        </button>
      </div>
      <div className='sm:hidden z-10' onClick={handleNav}>
        <FaBars size={20} className='mr-4 cursor-pointer' />
      </div>
      <div onClick={handleNav} className={nav ? 'overflow-hidden md:hidden ease-in duration-300 absolute text-gray-300 left-0 top-0 w-full h-screen bg-black/90 px-4 py-7 flex flex-col' : 'absolute top-0 h-screen left-[-100%] ease-in duration-500'}>
        <ul className='h-full w-full text-center pt-12'>
          <li className='homelink text-2xl py-4'>
            <RouterLink to='/' onClick={() => handleNavigateAndScroll('/', 'whyijst')}>Why Publication</RouterLink>
          </li>
          <li className='homelink text-2xl py-4'>
            <RouterLink to='/' onClick={() => handleNavigateAndScroll('/', 'search')}>Search</RouterLink>
          </li>
          <li className='homelink text-2xl py-4'>
            <RouterLink to='/' onClick={() => handleNavigateAndScroll('/', 'service')}>Service</RouterLink>
            <div className="mt-2">
              <ul>
                <li className="py-2">
                  <RouterLink to='/homepublish-book'>Book Publish</RouterLink>
                </li>
                <li className="py-2">
                  <RouterLink to='/homepublish-paper'>Journal Publish</RouterLink>
                </li>
                <li className="py-2">
                  <RouterLink to='/homepublish-multimedia'>Publish Multimedia</RouterLink>
                </li>
              </ul>
            </div>
          </li>
          <li className='homelink text-2xl py-4'>
            <RouterLink to='/' onClick={() => handleNavigateAndScroll('/', 'contactus')}>Contact us</RouterLink>
          </li>
            <div className="text-xs text-gray-500 font-semibold mt-4 mb-4">
              <div className="flex justify-center">
              <span><IoLocationOutline /></span>
                <span> {location.details.district}, {location.details.state},{location.details.country}</span>
              </div>
              {/* <div className="flex justify-around">
                <span></span>
              </div> */}
            </div>
          <button className='px-2 py-1.5 mx-1 border text-[#04AA6D] border-[#04AA6D] font-medium rounded-md' onClick={handleLogin}>
            Login
          </button>
          <button className='px-2 py-1.5 mx-1  text-white bg-[#04AA6D] font-medium rounded-md' onClick={handleLogin}>
            Create Free Account
          </button>
        </ul>
      </div>
    </div>
  );
};

export default HomeNavbar;
