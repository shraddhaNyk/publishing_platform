import React from 'react'

function FindaJournal() {
  return (
    <div style={{ width: '90%',height:'100vh', margin: 'auto', background: "white", borderRadius: '10px',padding:'0px' }}>
      
      <div>

          <div  style={{fontFamily:'Cambria',marginBottom:'5%'}}>
            <h5 style={{fontWeight:'normal',fontSize: '30px',padding:'1%',marginBottom:'1%',marginTop:'1%',marginLeft:'13%'}}> Prepare Your Book</h5>
            <p style={{width:'70%',marginLeft:'15%',fontSize: '18px'}}> </p> 
          </div>
      
          {/* Add your image here */}
          {/* <div style={{ textAlign: 'center'}}>
            <img src="/images/paper.jpg" alt="related image" style={{ width: '100%', height: '40vh' }} />
          </div> */}

          <div style={{ width: '100%',height:'30vh', margin: 'auto', background: "#d1d1d1",paddingTop:'4%',fontFamily:'Cambria' }}>
            <p style={{width:'70%',marginLeft:'15%',fontSize: '18px',marginBottom:'3%'}}>"Take the next step in your academic exploration by discovering related papers through our intuitive search feature. With just a click, unlock a wealth of scholarly resources tailored to your interests and expertise. Expand your knowledge base and stay abreast of the latest developments in your field with ease."</p>
            <button style={{background: '#007bff',color: 'white',border: 'none',borderRadius: '5px',padding: '5px 10px',cursor: 'pointer',transition: 'background-color: 0.3s',marginLeft:'45%',}} className='publish-button' >Prepare Book</button>
          </div>
      
      </div>
      
    </div>
  )
}

export default FindaJournal
