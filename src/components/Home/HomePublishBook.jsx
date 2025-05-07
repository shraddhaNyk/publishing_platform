
import React, { useEffect, useRef } from 'react';
import TopBar from './TopBar.jsx';
import HomeNavbar from './HomeNavbar.jsx';
import HomeFooter from './HomeFooter.jsx';
import Search from '../../assets/Publish/Search.png';
import Prepare from '../../assets/Publish/Prepare.png';
import Submit from '../../assets/Publish/submit.png';
import Review from '../../assets/Publish/Review.png';
import Share from '../../assets/Publish/Share.png';

const PublishBook = () => {
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

      <div className="max-w-[1140px] m-auto w-full md:flex">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-12 text-gray-800 text-center">Publish Book</h2>
          <p className="text-lg text-gray-600 mb-16 text-center">
            Fulfill your dream of becoming a published author. With our book publishing services, you can transform your ideas into a tangible reality.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Search} alt="Stage 1" className="w-48 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">1. Find a Publisher</h3>
              <p className="text-gray-600 text-center">
                Select the right publisher by considering their specialties, target audience, and distribution channels.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Prepare} alt="Stage 2" className="w-48 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">2. Prepare Your Book</h3>
              <p className="text-gray-600 text-center">
                Follow the publisher's guidelines, including manuscript formatting, cover design, and author bio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Submit} alt="Stage 3" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">3. Submit Your Book</h3>
              <p className="text-gray-600 text-center">
                Submit your manuscript to the publisher, ensuring all necessary documents and supplementary materials are included.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Review} alt="Stage 4" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">4. Book In Review</h3>
              <p className="text-gray-600 text-center">
                Upon submission, anticipate manuscript review by the publisher, which may involve revisions and edits.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl">
              <img src={Share} alt="Stage 5" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">5. Share Your Book</h3>
              <p className="text-gray-600 text-center">
                Share your published book with the world, utilizing various distribution channels and marketing strategies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default PublishBook;

