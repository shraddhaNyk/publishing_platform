
import React, { useContext } from 'react';
import { FaBars, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GiOpenBook } from "react-icons/gi";
import axios from 'axios';
import { ShopContext } from '../context/shop-context';


const HomeNavbar = () => {
  const [nav, setNav] = React.useState(false);
  const navigate = useNavigate();
  const { cartItems } = useContext(ShopContext) ?? { cartItems: {} };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3002/logout', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigateAndScroll = (path, elementId) => {
    navigate(path);
    setTimeout(() => {
      document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePublish = () => {
    navigate('/publish-paper');
  };

  const handleBook = () => {
    navigate('/publish-book');
  };

  return (
    <div className="navbar">
      <div className="w-full h-[50px] flex justify-between items-center relative top-0 z-10 bg-white shadow-md">
        <div className='flex items-center'>
          <GiOpenBook size={40} className='ml-2 text-[#04AA6D]' />
          <h1 className='text-2xl font-bold ml-2 text-black'>Publication Platform</h1>
        </div>

        {/* Search Box with Tailwind CSS */}
        <div className="relative mx-2">
          <input type='text' placeholder='Search' className="border border-gray-300 rounded-3xl px-3 py-1 focus:outline-none focus:border-[#04AA6D] focus:ring-1 focus:ring-[#04AA6D] ring-opacity-50 w-[100%] sm:w-96 sm:h-8 placeholder-black"/>
          <FaSearch className='absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 cursor-pointer' />
        </div>

        {/* Buttons for Publishing */}
        <div className="hidden sm:flex px-2 space-x-2">
          <button className="publish-button px-4 py-1 border text-white bg-[#2d324e] transition duration-300 rounded-md tracking-wider hover:bg-[#04AA6D]" onClick={handlePublish}>
            Publish Paper
          </button>
          <button className="publish-button px-4 py-1 border text-white bg-[#2d324e] transition duration-300 rounded-md tracking-wider hover:bg-[#04AA6D]" onClick={handleBook}>
            Publish Book
          </button>
        </div>

          {/* Cart Button and Logout Button */}
          <div className='flex items-center space-x-8'>
            <Link to="/cart" className="navlink relative">
              <FaShoppingCart size={30} className='text-black hover:text-[#04AA6D] transition duration-300 cursor-pointer' />
              {Object.values(cartItems).reduce((acc, curr) => acc + curr, 0) > 0 && (
                <span className="absolute top-[-10px] right-[-10px] bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                  {Object.values(cartItems).reduce((acc, curr) => acc + curr, 0)}
                </span>
              )}
            </Link>
            {/* Conditional rendering for logout button */}
            <button className='hidden sm:block px-2 py-1.5 border text-[#04AA6D] border-[#04AA6D] bg-white hover:bg-[#04AA6D] hover:text-white rounded-md tracking-wide' onClick={handleLogout}>
              Logout
            </button>

          </div>

        {/* Hamburger Icon for Mobile */}
        <div className='sm:hidden z-10' onClick={handleNav}>
          <FaBars size={20} className='mr-4 cursor-pointer' />
        </div>

        {/* Mobile Navigation Menu */}
        <div onClick={handleNav} className={nav ? 'overflow-hidden md:hidden ease-in duration-300 absolute text-gray-300 left-0 top-0 w-full h-screen bg-black/90 px-4 py-7 flex flex-col' : 'absolute top-0 h-screen left-[-100%] ease-in duration-500'}>
          <ul className='h-full w-full text-center pt-12'>
            <li className='py-3'>
              <button className="publish-button px-4 py-1  text-white bg-[#04AA6D]  rounded-md tracking-wider" onClick={handlePublish}>
                Publish Paper
              </button>
            </li>
            <li className='py-3'>
              <button className="publish-button px-4 py-1  text-white bg-[#04AA6D]  rounded-md tracking-wider" onClick={handleBook}>
                Publish Book
              </button>
            </li>
            {/* Conditional rendering for logout button in mobile menu */}
            <li className='py-3 sm:hidden'>
              <button className='px-2 py-1.5 border text-[#04AA6D] border-[#04AA6D] font-bold rounded-md' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
