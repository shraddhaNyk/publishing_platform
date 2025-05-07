import React from 'react'
import './FindaBook.css'
import {FaSearch } from "react-icons/fa";

function FindaBook() {
  return (
    <div style={{ width: '90%',height:'100vh', margin: 'auto', background: "white", borderRadius: '10px',padding:'0px' }}>
      
      <div>

          <div  style={{fontFamily:'Cambria',marginBottom:'5%'}}>
            <h5 style={{fontWeight:'normal',fontSize: '30px',padding:'1%',marginBottom:'1%',marginTop:'1%',marginLeft:'13%'}}>1. Find a Book</h5>
            <p style={{width:'70%',marginLeft:'15%',fontSize: '18px'}}> "By entering a related topic in the search box and clicking the button, you can find a research paper related to that topic."</p> 
              <div style={{display:'flex',width: '100%',paddingTop:'3%'}}>
                  <div className='Fj-search'>
                      <input type='text' placeholder='Search'/>
                      <FaSearch className='img'/>
                  </div>
                <button style={{background:'#0401bf',marginLeft:'3%',alignitems: 'center',height:'30%',padding:'1%',borderRadius: '1px'}} className='publish-button' >Find Related Paper</button>
              </div>
          </div>
      
          {/* Add your image here */}
          {/* <div style={{ textAlign: 'center'}}>
            <img src="/images/paper.jpg" alt="related image" style={{ width: '100%', height: '40vh' }} />
          </div> */}

          <div style={{ width: '100%',height:'25vh', margin: 'auto', background: "#f9e2e7",paddingTop:'3%',fontFamily:'Cambria',display:'flex' }}>
            {/* <p style={{width:'70%',marginLeft:'15%',fontSize: '18px',marginBottom:'3%'}}>"Take the next step in your academic exploration by discovering related papers through our intuitive search feature. With just a click, unlock a wealth of scholarly resources tailored to your interests and expertise. Expand your knowledge base and stay abreast of the latest developments in your field with ease."</p> */}
              
          </div>
      
      </div>
      
    </div>
  )
}

export default FindaBook;
