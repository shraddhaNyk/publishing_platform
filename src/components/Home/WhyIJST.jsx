

import React from 'react'
import GlobalReach from '../../assets/illustration-vector-graphic-cartoon-character-protection-preservation-earth_516790-505.jpg'
import Multinedia from '../../assets/vlogger-gives-review-about-glasses-illustration_598748-212.jpeg'
import JoinIntrest from '../../assets/feedback-loop-concept-illustration_114360-21826.jpeg'

import Inovative from '../../assets/product-development-concept-illustration_114360-23830.jpg'
import Community from '../../assets/meeting-office-background_23-2148097347.jpeg'

const WhyPublication = () => {
  return (
    <div className='bg-blue-50/80 '>
    <div id='whyijst' className='max-w-[160vh] m-auto w-full px-4 py-14'>
      <h2 className='text-center text-3xl  p-4 text-gray-700'>Why Publication ?</h2>

      <div className='grid sm:grid-cols-5 gap-4'>
        <div className='sm:col-span-3 col-span-2 row-span-2'>
          <img src={Multinedia} className='h-[60%]  w-[100vh]' alt='/' />
          <div className='mt-0 p-2 bg-white h-[40%]'>


            <div class=" rounded-lg">
              <h3 class='primary-text font-bold text-2xl text-left mb-2'>Multimedia Publications</h3>
              <p class=' mb-4'>Enhance your research presentation with multimedia elements, including videos, interactive content, and more.</p>
              <div class="flex items-center mb-4">
                  <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span class="primary-text font-bold text-lg">1</span>
                  </div>
                  <div>
                      <h4 class='font-bold'>Videos :</h4>
                      <p>Provide visual demonstrations and interviews.</p>
                  </div>
              </div>
              <div class="flex items-center mb-4">
                  <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span class="primary-text font-bold text-lg">2</span>
                  </div>
                  <div>
                      <h4 class='font-bold'>Cutting-edge Technologies :</h4>
                      <p >Access innovative multimedia tools.</p>
                  </div>
              </div>
              <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span class="primary-text font-bold text-lg">3</span>
                  </div>
                  <div>
                      <h4 class='font-bold'>Tailored Support :</h4>
                      <p>Receive personalized assistance throughout.</p>
                  </div>
              </div>
          </div>

          </div>

        </div>

        <div className='sm:col-span-1 col-span-1 h-full' >
          <img className='w-full h-[50%] object-cover' src={GlobalReach}  alt='/' />
          <div className='mt-0 p-2 h-[50%] bg-white'>
          <h3 class='primary-text  font-bold text-left mb-2'>Global Reach and Recognition</h3>
            <p>IJST will ensuring your research reaches a global audience.</p>
          </div>
        </div>

        <div className='sm:col-span-1 col-span-1 h-full'>
          <img className='w-full h-[50%] object-cover' src={Community} alt='/' />
          <div className='mt-0 p-2 h-[50%] bg-white'>
          <h3 class='primary-text  font-bold text-left mb-2'>Join Specialized Interest Groups</h3>
  
            <p>Engage with a community of like-minded researchers by joining our specialized interest groups.</p>
          </div>
        </div>

        <div className='sm:col-span-1 col-span-1  h-full'>
          <img className='w-full h-[50%] object-cover' src={JoinIntrest} alt='/' />
          <div className='mt-0 p-2 h-[50%] bg-white'>
          <h3 class='primary-text  font-bold text-left mb-2'>Rigorous Peer Review Process</h3>
            <p>Each submission undergoes a thorough evaluation by experts in the field, ensuring the highest standards of quality and integrity.</p>
          </div>
        </div>

        <div className='sm:col-span-1 col-span-1  h-full'>
          <img className='w-full h-[50%] object-cover' src={Inovative} alt='/' />
          <div className='mt-0 p-2 h-[50%] bg-white'>
          <h3 class='primary-text  font-bold text-left mb-2'>Innovative Platform</h3>
            <p>Easily navigate through our archives, submit your work, and participate in discussions through our interactive platform.</p>
          </div>
        </div>

        
      </div>
    </div>
    </div>
  )
}

export default WhyPublication;

