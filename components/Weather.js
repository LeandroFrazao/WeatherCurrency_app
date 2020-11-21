import React, { Component } from "react";
import { useState, useEffect } from "react";
import { Gps } from "./Gps";
import { Location } from "./Location";
import { WeatherKey } from "../utils/APIKey";

export const Weather = () => {
  const { locationData } = Location();
  const { position, error } = Gps();

  let [weather, setWeather] = useState({
    main: null,
    description: null,
    icon: null,
    tempMin: null,
    tempMax: null,
    temp: null,
    humidity: null,
    feelsLike: null,
    sunrise: null,
    sunset: null,
    wind: null,
    cloud: null,
  });

  //function to fetch api to get weather data based on position
  const getWeather = async (lat, long) => {
    console.log("Inside fecht Weather");
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WeatherKey}&units=metric`
    )
      .then((response) => response.json())
      .then((json) => [
        setWeather({
          main: json.weather[0].main,
          description: json.weather[0].description,
          icon: json.weather[0].icon,
          tempMin: json.main.temp_min,
          tempMax: json.main.temp_max,
          temp: json.main.temp,
          humidity: json.main.humidity,
          wind: json.wind.speed,
          cloud: json.clouds.all,
          feelsLike: json.main.feels_like,
          sunrise: json.sys.sunrise,
          sunset: json.sys.sunset,
        }),
      ])
      .catch((error) => alert("Reached Limit of API ", error));
  };

  // every 5 min or if city changes, it calls the function getWeather
  useEffect(() => {
    if (position.latitude && locationData.city) {
      getWeather(position.latitude, position.longitude);
      const clockCall = setInterval(() => {
        console.log("test");
        getWeather(position.latitude, position.longitude);
      }, 300000); //every 5 minutes, it updates
      return () => clearInterval(clockCall);
    }
  }, [locationData.city]);

  return { ...Weather, weather };
};
