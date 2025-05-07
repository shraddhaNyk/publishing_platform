

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import HomeNavbar from './HomeNavbar.jsx';
import Hero from './Hero.jsx';
import Activities from './Activities.jsx';
import WhyIJST from './WhyIJST.jsx';
import Search from './Search.jsx';
import ContactUs from './ContactUs.jsx';
import HomeFooter from './HomeFooter.jsx';
import Service from './Service.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* <TopBar /> */}
      <HomeNavbar />
      <Hero />
      <Activities />
      <Search />
      <WhyIJST />
      <Service navigate={navigate} />
      <ContactUs />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
