

import React from 'react';

const JoinUs = () => {
  return (
    <div className="bg-blue-50/80">
      <div id="contactus" className="max-w-[1140px] mx-auto w-full p-4 py-10">
        <h2 className="text-center text-3xl p-4 text-gray-700">Contact Us</h2>
        <p className="text-center text-gray-700 py-2">We're standing by!</p>
        <form className="max-w-md mx-auto">
          <div className="grid grid-cols-1 gap-y-4">
            <div className="grid grid-cols-2 gap-x-4">
              <input className="border p-2" type="text" placeholder="First Name" />
              <input className="border p-2" type="text" placeholder="Last Name" />
            </div>
            <input className="border p-2" type="email" placeholder="Email" />
            <input className="border p-2" type="tel" placeholder="Phone" />
            <input className="border p-2" type="text" placeholder="Address" />
            <textarea className="border p-2" placeholder="Message" rows="5"></textarea>
            <button className="topbar-button text-white  py-2 px-4 rounded  w-full">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinUs;
