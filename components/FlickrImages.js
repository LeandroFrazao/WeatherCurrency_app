import React, { Component } from "react";
import { useState, useEffect } from "react";
import { FlickrKey } from "../utils/APIKey";
import { Weather } from "./Weather";
import { Location } from "./Location";
import { Currency } from "./Currency";

import { Gps } from "./Gps";

export const FlickrImages = (rand) => {
  const { weather } = Weather();
  const { countryData } = Currency();
  const { locationData } = Location();
  let [images, setImages] = useState([]);

  // function to fetch api to get astrophotos images based on weather country and city where the use is located
  const getImages = async (tag, condition) => {
    console.log("Inside fecht Flickr");
    await fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FlickrKey}&tags=wallpaper,${tag}&text=${condition}&sort=interestingness-asc&geo_context=2&content_type=1&media=photos&format=json&nojsoncallback=1&per_page=10`
    )
      .then((response) => response.json())
      .then((json) => setImages(json.photos.photo))
      .catch((error) => alert(error));
  };

  useEffect(() => {
    if (weather.main && countryData.name) {
      let tags =
        weather.main + ", " + countryData.name + ", " + locationData.city;
      getImages(tags, "astrophotography");
    }
  }, [weather.main, countryData.name]);

  return { ...FlickrImages, images };
};
