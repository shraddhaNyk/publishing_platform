import React, { useEffect, useRef } from 'react';
import TopBar from './TopBar.jsx';
import HomeNavbar from './HomeNavbar.jsx';
import HomeFooter from './HomeFooter.jsx';

const PublishMultimedia = () => {
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div>
      <div ref={topRef}></div>
      <HomeNavbar />
      <div className='max-w-[1000px] m-auto px-4 py-16 mb-[300px]'>
        <h2 className='text-4xl font-bold mb-12 text-gray-700'>Publish Multimedia Content (Coming Soon)</h2>
        <p className='text-gray-600'>
          We're excited to announce that the ability to share multimedia content will be available in an upcoming update! Stay tuned for captivating videos, stunning images, and immersive audio to share effortlessly with your audience.
        </p>
      </div>
      <HomeFooter />
    </div>
  );
};

export default PublishMultimedia;
