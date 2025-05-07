import React from 'react'
import {
  FacebookIcon,
  FacebookShareButton,EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
 
 } from "react-share";

function Share() {
  const shareUrl ='https://www.facebook.com';
  return (
    <div>
      <h2> Share your  paper and get recognized</h2>
      <div style={{ textAlign: 'center', marginTop: '20px', }}>
      <FacebookShareButton url={shareUrl} quote={"title name "}>
        <FacebookIcon size={40}/>
      </FacebookShareButton>

      <EmailShareButton url={shareUrl} quote={"title name "}>
        <EmailIcon size={40}/>
      </EmailShareButton>


      <WhatsappShareButton url={shareUrl} quote={"title name "}>
        <WhatsappIcon size={40}/>
      </WhatsappShareButton>

      <TwitterShareButton url={shareUrl} quote={"title name "}>
        <TwitterIcon size={40}/>
      </TwitterShareButton>

      
     
</div>
    </div>
  )
}

export default Share;


