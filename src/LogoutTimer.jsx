// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const LogoutTimer = () => {
//   const navigate = useNavigate();

//   // Function to handle logout
//   const handleLogout = async () => {
//     try {
//       // Send a request to the logout endpoint
//       await axios.get('http://localhost:3002/logout', { withCredentials: true });
//       // Navigate to the login page after successful logout
//       navigate('/Login');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   useEffect(() => {
//     let logoutTimer;

//     // Function to logout after 5 minutes of inactivity
//     const startLogoutTimer = () => {
//       logoutTimer = setTimeout(async () => {
//         await handleLogout(); // Logout after 5 minutes
//       //}, 5 * 60 * 1000); 
//     }, 30 * 1000);// 5 minutes in milliseconds
//     };

//     // Start the logout timer on component mount
//     startLogoutTimer();

//     // Reset the logout timer on user activity
//     const resetLogoutTimer = () => {
//       clearTimeout(logoutTimer); // Clear the existing timer
//       startLogoutTimer(); // Restart the timer
//     };

//     // Add event listeners for user activity
//     document.addEventListener('mousemove', resetLogoutTimer);
//     document.addEventListener('keydown', resetLogoutTimer);

//     // Cleanup event listeners on component unmount
//     return () => {
//       document.removeEventListener('mousemove', resetLogoutTimer);
//       document.removeEventListener('keydown', resetLogoutTimer);
//       clearTimeout(logoutTimer); // Clear the timer to prevent logout after unmount
//     };
//   }, [navigate]);

//   return null; // No need to render anything
// };

// export default LogoutTimer;