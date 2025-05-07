import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import img1 from '../../assets/video-editing-doodle-concept-animation-montage_107791-13486.jpg';
import img2 from '../../assets/world-book.jpeg';
import img3 from '../../assets/giant-.jpeg';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Service = ({ navigate }) => {
  return (
    <div className='bg-gradient-to-b from-blue-200 to-blue-50 text-center py-16'>
      <div id='service' className='max-w-[1000px] m-auto px-4'>
        <h2 className='text-4xl font-bold mb-12 text-gray-700'>Our Services</h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <motion.div
            className='bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 1 }}
            variants={cardVariants}
            onClick={() => navigate('/homepublish-paper')}
          >
            <img src={img3} alt='Service 3' className='w-full h-[50%] object-cover' />
            <div className='p-6'>
              <h3 className='text-2xl font-bold text-left mb-2 text-blue-600'>Publish Paper</h3>
              <p className='text-gray-600 text-left'>
                Share your research findings with the world. Our platform offers seamless paper publishing services, ensuring that your valuable insights reach a global audience.
              </p>
            </div>
          </motion.div>
          <motion.div
            className='bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            variants={cardVariants}
            onClick={() => navigate('/homepublish-book')}
          >
            <img src={img2} alt='Service 2' className='w-full h-[50%] object-cover' />
            <div className='p-6'>
              <h3 className='text-2xl font-bold text-left mb-2 text-blue-600'>Publish Book</h3>
              <p className='text-gray-600 text-left'>
                Transform your manuscript into a published book. Our expert team provides comprehensive publishing services, from editing to distribution.
              </p>
            </div>
          </motion.div>
          <motion.div
            className='bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            variants={cardVariants}
            onClick={() => navigate('/homepublish-multimedia')}
          >
            <img src={img1} alt='Service 1' className='w-full h-[50%] object-cover' />
            <div className='p-6'>
              <h3 className='text-2xl font-bold text-left mb-2 text-blue-600'>Publish Multimedia</h3>
              <p className='text-gray-600 text-left'>
                Bring your multimedia projects to life with our dedicated publishing services. We handle everything from video editing to content distribution.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Service;


