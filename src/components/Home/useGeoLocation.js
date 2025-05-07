

//02-07-24
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    details: {
      country: null,
      state: null,
      district: null,
      // postalCode: null,
    },
    error: null,
  });

  const onSuccess = async (location) => {
    const { latitude, longitude } = location.coords;
    const details = await fetchAddress(latitude, longitude);
    setLocation({
      loaded: true,
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
      details,
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      error,
    });
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const address = response.data.address;
      return {
        country: address.country,
        state: address.state,
        district: address.county, // Nominatim might use 'county' for district
        // postalCode: address.postcode,
      };
    } catch (error) {
      console.error("Error fetching address:", error);
      return {
        country: null,
        state: null,
        district: null,
        // postalCode: null,
      };
    }
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }, []);

  return location;
};

export default useGeoLocation;


//01-07-24 with Coordinates values
// import React, { useEffect } from 'react'
// import { useState } from 'react'

// const useGeoLocation = () => {
//   const [location, setLocation] = useState ({ 
//     loaded: false,
//     coordinates:{lat:"", lng:""},
//   });

//   const onSuccess = location => {
//     setLocation({
//       loaded: true,
//       coordinates:{
//         lat:location.coords.latitude,
//         lng:location.coords.longitude,
//       },
//     });
//   };

//   const onError = error =>{
//     setLocation({
//       loaded:true,
//       error,
  
//     });
//   }

//   useEffect(() =>{
//     if(!("geolocation" in navigator)){
//       onError({
//         code:0,
//         message:"Geolocation not supported",
//       });
//     }

//     navigator.geolocation.getCurrentPosition(onSuccess,onError);
//   },[]); 

//   return location;
  
// };

// export default useGeoLocation


//--------------------------------------------------------------------------with Country and State---------------------------------------------------------------------

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useGeoLocation = () => {
//   const [location, setLocation] = useState({ 
//     loaded: false,
//     coordinates: { lat: "", lng: "" },
//     country: "",
//     state: ""
//   });

//   const onSuccess = async (position) => {
//     const { latitude, longitude } = position.coords;
//     console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Log coordinates
//     const { country, state } = await getAddress(latitude, longitude);
//     setLocation({
//       loaded: true,
//       coordinates: { lat: latitude, lng: longitude },
//       country,
//       state
//     });
//   };

//   const onError = (error) => {
//     console.error("Error getting location:", error); // Log geolocation error
//     setLocation({
//       loaded: true,
//       error,
//     });
//   };

//   const getAddress = async (lat, lng) => {
//     try {
//       const apiKey = 'e17da029a9bd49a7810260a1eba10050'; // Replace with your OpenCage API key
//       const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en&pretty=1`);
//       console.log("OpenCage Geocoder response:", response.data); // Log API response
//       const results = response.data.results;
//       const components = results[0]?.components;

//       let country = components?.country;
//       let state = components?.state;

//       return { country, state };
//     } catch (error) {
//       console.error("Error fetching address:", error); // Log API request error
//       return { country: "Country not found", state: "State not found" };
//     }
//   };

//   useEffect(() => {
//     if (!("geolocation" in navigator)) {
//       onError({
//         code: 0,
//         message: "Geolocation not supported",
//       });
//     }

//     navigator.geolocation.getCurrentPosition(onSuccess, onError);
//   }, []);

//   return location;
// };

// export default useGeoLocation;



//---------------------------------------------------------------------- ----with full Address-------------------------------------------------------------------------
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useGeoLocation = () => {
//   const [location, setLocation] = useState({ 
//     loaded: false,
//     coordinates: { lat: "", lng: "" },
//     address: ""
//   });

//   const onSuccess = async (position) => {
//     const { latitude, longitude } = position.coords;
//     console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Log coordinates
//     const address = await getAddress(latitude, longitude);
//     setLocation({
//       loaded: true,
//       coordinates: { lat: latitude, lng: longitude },
//       address
//     });
//   };

//   const onError = (error) => {
//     console.error("Error getting location:", error); // Log geolocation error
//     setLocation({
//       loaded: true,
//       error,
//     });
//   };

//   const getAddress = async (lat, lng) => {
//     try {
//       const apiKey = 'e17da029a9bd49a7810260a1eba10050'; // Replace with your OpenCage API key
//       const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en&pretty=1`);
//       console.log("OpenCage Geocoder response:", response.data); // Log API response
//       const results = response.data.results;
//       const formattedAddress = results[0]?.formatted;

//       return formattedAddress || "Address not found";
//     } catch (error) {
//       console.error("Error fetching address:", error); // Log API request error
//       return "Address not found";
//     }
//   };

//   useEffect(() => {
//     if (!("geolocation" in navigator)) {
//       onError({
//         code: 0,
//         message: "Geolocation not supported",
//       });
//     }

//     navigator.geolocation.getCurrentPosition(onSuccess, onError);
//   }, []);

//   return location;
// };

// export default useGeoLocation;
