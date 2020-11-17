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

  useEffect(() => {
    if (position.latitude) {
      reversePosition(position.latitude, position.longitude);
    }
  }, [position.longitude]);

  return { ...Location, locationData };
};
