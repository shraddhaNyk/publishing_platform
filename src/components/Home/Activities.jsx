import React from 'react'
import joincomun from '../../assets/people-2568603_1280.jpg';
import paper from '../../assets/writing-3934298_1280.jpg';
import book from '../../assets/laptop-3196481_640.jpg';

const Activities = () => {
  return (
    <div >
    <div className=' max-w-[1140px] m-auto w-full md:flex mt-[-70px]'>
          <div className='relative p-4 responsive-div'>
                <h3 className='absolute z-10 top-[50%] left-[50%] translate-x-[-50%] text-black bg-white text-2xl font-bold'>Join Communities</h3>
                <img className='w-full h-full object-cover  relative border-4 border-white shadow-lg ' src={joincomun} alt='/'/>
          </div>
          <div className='relative p-4 responsive-div'>
              <h3 className='absolute z-10 top-[50%] left-[50%] translate-x-[-50%] text-black bg-white text-2xl font-bold'>Publish Book</h3>
              <img className='w-full h-full object-cover relative border-4 border-white shadow-lg '   src={book} alt='/'/>
          </div>
          <div className='relative p-4 responsive-div'>
              <h3 className='absolute z-10 top-[50%] left-[50%] translate-x-[-50%] text-black bg-white text-2xl font-bold'>Publish Paper</h3>
              <img className='w-full h-full object-cover relative border-4 border-white shadow-lg'  src={paper} alt='/'/>
          </div>
    </div>
    </div>
  )
}

export default Activities
