import React, { Component } from "react";
import { useState, useEffect } from "react";
import { Gps } from "./Gps";
import { LocationKey } from "../utils/APIKey";

export const Location = () => {
  const { position } = Gps();
  let [locationData, setLocation] = useState({
    city: null,
    country: null,
    county: null,
    state: null,
  });

  // function to fetch apo to get location data based on position.
  const reversePosition = async (lat, long) => {
    console.log("Inside fecht Location");
    await fetch(
      `https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=${LocationKey}&at=${lat},${long}&lang=en-US`
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
  };

  // it calls everytime latitude changes
  useEffect(() => {
    if (position.latitude) {
      reversePosition(position.latitude, position.longitude);
    }
  }, [position.latitude]);

  return { ...Location, locationData };
};
