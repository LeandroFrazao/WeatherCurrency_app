import React, { Component } from "react";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";

export const Gps = () => {
  let [position, setPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);
  let watchId;

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const onError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    Location.requestPermissionsAsync();
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported on your device");
      return;
    }
    // navigator.geolocation.getCurrentPosition(
    //   ({ coords }) => {
    //     setPosition({
    //       latitude: coords.latitude,
    //       longitude: coords.longitude,
    //     });
    //   },
    //   onError,
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );
    watchId = navigator.geolocation.watchPosition(
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
  }, []);

  return { ...Gps, position, error };
};
