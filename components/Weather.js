import { useState, useEffect } from "react";
import { Gps } from "./Gps";

export const Weather = () => {
  const { position, error } = Gps();
  let [dataWeather, setData] = useState({
    mainVar: [null],
    weather: [null],
    sunTime: [null],
  });
  var check1 = false;
  var check2 = false;
  const getWeather = async (lat, long) => {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=5e8125fc41d440e593621143f22138a1`
    )
      .then((response) => response.json())
      .then((json) =>
        setData({
          mainVar: json.main,
          weather: json.weather[0],
          sunTime: json.sys,
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
      getWeather(position.latitude, position.longitude);
    }
  }, [check1]);
  return { ...Weather, dataWeather };
};
