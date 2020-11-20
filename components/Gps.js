import { useState, useEffect } from "react";
//import { Location, Permissions } from "expo-permissions";
//import * as Permissions from "expo-permissions";
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

  const getCoord = () => {
    // navigator.permissions
    //   .query({ name: "geolocation" })
    //   .then(function (result) {
    //     if (result.state != "granted") {
    //       setError("Geolocation is not supported on your device");
    //       return;
    //     }
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
    getCoord();
    const clockCall = setInterval(() => {
      getCoord();
    }, 300000); //every 5 minutes, it updates
    return () => clearInterval(clockCall);
  }, []);

  return { ...Gps, position, error };
};
