import React from 'react';

function Hero() {
  return (
    <div className='w-full h-[90vh] bg-ijst-blue relative'>
      <div className="absolute w-full h-[85vh]">
        {[...Array(150)].map((_, index) => {
          const shape = Math.random() < 0.6 ? 'circle' : 'square';
          const size = `${Math.random() * 10 + 5}px`;
          const rotation = `${Math.random() * 360}deg`;
          const color = `rgba(89, 144, 222, ${Math.random() * 0.5 + 0.3})`;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: shape === 'circle' ? size : '10px',
                height: shape === 'circle' ? size : '10px',
                borderRadius: shape === 'circle' ? '50%' : '3px',
                transform: `rotate(${rotation})`,
                backgroundColor: shape === 'square' ? color : 'transparent',
                boxShadow: shape === 'circle' ? `0 0 5px ${color}` : 'none',
              }}
            />
          );
        })}
      </div>
      <div className="max-w-[1140px] mx-auto">
        <div className="absolute top-[30%] w-full max-w-[900px] h-full flex flex-col text-white p-4 rounded-md">
          <h1 className="font-bold text-4xl md:text-3xl sm:text-2xl text-white w-full">
            Connecting Knowledge, Transforming Research
          </h1>
          <h2 className="text-2xl md:text-2xl sm:text-xl py-4 italic text-gray-300 ">
            With Publication Platform.
          </h2>
          <p className="text-md md:text-base sm:text-sm text-white w-full">
            Welcome to the Publication Platform,your gateway to cutting-edge research and global collaboration. 
            Explore the latest scientific advancements, connect with experts worldwide,
            and be part of shaping the future of technology and innovation. 
            Join us in our pursuit of excellence and discovery.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;


