import { useState, useEffect } from "react";
import { Gps } from "./Gps";
import { WeatherKey } from "../utils/APIKey";

export const Weather = () => {
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
      .catch((error) => alert(error));
  };

  useEffect(() => {
    if (position.latitude) {
      getWeather(position.latitude, position.longitude);
      let clockCall = setInterval(() => {
        getWeather(position.latitude, position.longitude);
      }, 600000); //every 10 minutes, it updates
    }
  }, [position.longitude]);

  return { ...Weather, weather };
};
