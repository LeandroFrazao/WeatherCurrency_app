import { useState, useEffect } from "react";
//import { Location, Permissions } from "expo-permissions";
//import * as Permissions from "expo-permissions";
import React, { Component } from "react";
import * as Location from "expo-location";
export const Gps = () => {
  let [position, setPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);

  const onError = (error) => {
    setError(error.message);
  };

  //Function to get permission
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }
    })();
  }, []);

  // function to access the GPS from device, and returns latitude and longitude
  const getCoord = () => {
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setPosition({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      onError,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    return () => geo.clearWatch(watchId);
  };

  useEffect(() => {
    // check permissions
    if (navigator.geolocation) {
      getCoord();
      const clockCall = setInterval(() => {
        getCoord();
      }, 300000); //every 5 minutes, it updates
      return () => clearInterval(clockCall);
    } else {
      alert("Geolocation is not supported on your device");
    }
  }, []);

  return { ...Gps, position, error };
};
