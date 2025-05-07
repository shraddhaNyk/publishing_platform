import React from 'react';
import './Footer.css'; // Import your CSS file for styling

const Footer = () => {
    return (
        <div className='footer'>
           
                <div className="foot-panel1"></div>
                <div className="foot-panel2">
                    <ul>
                        <p>Get to Know Us</p>
                        <a>Careers</a>
                        <a>Blog</a>
                        <a>About</a>
                    </ul>
                    <ul>
                        <p>Contact Us</p>
                        <a>8020-364558</a>
                    </ul>
                    <ul>
                        <p>Let Us Help You</p>
                        <a>Help</a>
                    </ul>
                </div>
                <div className="foot-panel3">
                    <div className="logo"></div>
                </div>
                <div className="foot-panel4">
                    <div className="pages">
                        <a>Conditions of Use</a>
                        <a>Privacy Notice</a>
                        <a>Your Ads Privacy Choices</a>
                    </div>
                    <div className="copyright">
                        &#169;1996-2023, Journel.com, Inc. or its affiliates
                    </div>
                </div>
           
        </div>
    );
};

export default Footer;
