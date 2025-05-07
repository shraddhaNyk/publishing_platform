

import React, { useEffect, useRef } from 'react';
import TopBar from './TopBar.jsx';
import HomeNavbar from './HomeNavbar.jsx';
import HomeFooter from './HomeFooter.jsx';
import Search from '../../assets/Publish/Search.png';
import Prepare from '../../assets/Publish/Prepare.png';
import Submit from '../../assets/Publish/submit.png';
import Review from '../../assets/Publish/Review.png';
import Share from '../../assets/Publish/Share.png';

const PublishPaper = () => {
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div>
      <div ref={topRef}></div>

      {/* Your top bar component */}
      

      {/* Your home navbar component */}
      <HomeNavbar />

      <div className="max-w-[1140px] m-auto w-full md:flex">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-12 text-gray-800 text-center">Publish Paper</h2>
          <p className="text-lg text-gray-600 mb-16 text-center">
            Share your research findings with the world. Our platform offers seamless paper publishing services, ensuring that your valuable insights reach a global audience.
          </p>

          {/* First row */}
          <div className="grid grid-cols-2 gap-8">
            {/* Stage 1 */}
            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Search} alt="Stage 1" className="w-48 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">1. Find a Journal</h3>
              <p className="text-gray-600 text-center">
              Select the right journal by considering scope, audience, impact factor, and review process.
              </p>
              
            </div>

            {/* Stage 2 */}
            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Prepare} alt="Stage 2" className="w-48 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">2. Prepare Your Paper</h3>
              <p className="text-gray-600 text-center">
                  Follow the journal's guidelines, including abstract, introduction, methodology, results, and conclusion. 
              </p>
              
            </div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            {/* Stage 3 */}
            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Submit} alt="Stage 3" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">3. Submit the Paper</h3>
              <p className="text-gray-600 text-center">
              Submit your manuscript online, ensuring all necessary documents and supplementary materials are included
              </p>
              
            </div>

            {/* Stage 4 */}
            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Review} alt="Stage 4" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">4. Paper in Review</h3>
              <p className="text-gray-600 text-center">
                
            Upon submission, anticipate peer review, lasting weeks to months, prepare to address comments and revise.
              </p>
              
            </div>

            {/* Stage 5 */}
            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Share} alt="Stage 5" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">5. Share</h3>
              <p className="text-gray-600 text-center">
              Share your research findings globally with our seamless paper publishing services. 
              </p>
              
            </div>
          </div>
        </div>
      </div>

      {/* Your home footer component */}
      <HomeFooter />
    </div>
  );
};

export default PublishPaper;
