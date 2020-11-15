import React, { Component } from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import { Gps } from "./Gps";

export const Location = () => {
  const { position, error } = Gps();

  let [dataLocation, setLocation] = useState({
    city: null,
    country: null,
    county: null,
    state: null,
  });
  console.log("Location", position.latitude);
  var check1 = false;
  var check2 = false;
  const reversePosition = async (lat, long) => {
    await fetch(
      `https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=JyDMiZZdTrP5qurqE5VQxj2AOs9lIRA80Pf74X0Gwd8&at=${lat},${long}&lang=en-US`
    )
      .then((response) => response.json())
      .then((json) =>
        setLocation({
          city: json.items[0].address.city,
          county: json.items[0].address.county,
          state: json.items[0].address.state,
          country: json.items[0].address.countryName,
        })
      )
      .catch((error) => alert(error));
    check2 = true;
  };
  if (position.longitude) {
    check1 = true;
  }
  useEffect(() => {
    if (position.latitude && check2 != true) {
      reversePosition(position.latitude, position.longitude);
    }
  }, [check1]);

  return { ...Location, dataLocation };
};
