import React from 'react'

function FindaJournal() {
  return (
    <div style={{ width: '90%',height:'100vh', margin: 'auto', background: "white", borderRadius: '10px',padding:'0px' }}>
      
      <div>

          <div  style={{fontFamily:'Cambria',marginBottom:'5%'}}>
            <h5 style={{fontWeight:'normal',fontSize: '30px',padding:'1%',marginBottom:'0%',marginTop:'1%',marginLeft:'13%'}}> Prepare Your Paper</h5>
            <p style={{width:'70%',marginLeft:'15%',fontSize: '18px'}}> </p> 
          </div>
      

          <div style={{ width: '100%',height:'35vh', margin: 'auto', background: '#d1d1d1',paddingTop:'4%',fontFamily:'Cambria' }}>
            <p style={{width:'70%',marginLeft:'15%',fontSize: '18px',marginBottom:'3%'}}>"Take the next step in your academic exploration by discovering related papers through our intuitive search feature. With just a click, unlock a wealth of scholarly resources tailored to your interests and expertise. Expand your knowledge base and stay abreast of the latest developments in your field with ease."</p>
            <button style={{background: '#007bff',color: 'white',border: 'none',borderRadius: '5px',padding: '5px 5px',cursor: 'pointer',transition: 'background-color 0.3s',marginLeft:'45%',letterSpacing:'1px'}} className='publish-button' >Prepare Paper</button>
          </div>
      
      </div>
      
    </div>
  )
}

export default FindaJournal




