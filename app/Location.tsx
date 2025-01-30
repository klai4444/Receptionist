// Location.tsx
import React, { useState, useEffect } from 'react';

interface LocationProps {
  onLocationFetched: (lat: number | null, lng: number | null) => void;
  onError: (error: string) => void;
}

const Location: React.FC<LocationProps> = ({ onLocationFetched, onError }) => {
  useEffect(() => {
    // Step 2: Use geolocation to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Pass the location back to the parent component using the callback
          onLocationFetched(lat, lng);
        },
        (err) => {
          // Handle error
          onError('Unable to retrieve location');
        }
      );
    } else {
      // Handle error if geolocation is not supported
      onError('Geolocation is not supported by this browser.');
    }
  }, [onLocationFetched, onError]);

  return null; // Since you're not rendering anything, return null
};

export default Location;
