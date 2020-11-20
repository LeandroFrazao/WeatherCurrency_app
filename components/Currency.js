import { useState, useEffect } from "react";
import { Location } from "./Location";

export const Currency = () => {
  const { locationData } = Location();
  let [countryData, setCountryData] = useState({
    name: null,
    capital: null,
    altSpelling: null,
    region: null,
    subregion: null,
    population: null,
    demonym: null,
    area: null,
    timezones: [null],
    borders: [null],
    nativeName: null,
    callingCodes: [null],
    currencyCode: null,
    currencyName: null,
    languages: null,
    flag: null,
  });
  let [currencyData, setCurrencyData] = useState({
    rate: [null],
    date: null,
  });

  const getCountrydata = async (country) => {
    console.log("Inside fecht CountryData");
    await fetch(`https://restcountries.eu/rest/v2/name/${country}`)
      .then((response) => response.json())
      .then((json) =>
        setCountryData({
          name: json[0].name,
          capital: json[0].capital,
          altSpelling: json[0].altSpellings[2],
          region: json[0].region,
          subregion: json[0].subregion,
          population: json[0].population,
          demonym: json[0].demonym,
          area: json[0].area,
          timezones: json[0].timezones,
          borders: json[0].borders,
          nativeName: json[0].nativeName,
          callingCodes: json[0].callingCodes,
          currencyCode: json[0].currencies[0].code,
          currencyName: json[0].currencies[0].name,
          languages: json[0].languages,
          flag: json[0].flag,
        })
      )
      .catch((error) => alert(error));
  };
  const getCurrencyData = async () => {
    console.log("Inside fecht Currency");
    await fetch(`https://api.exchangeratesapi.io/latest?base=USD`)
      .then((response) => response.json())
      .then((json) => [
        setCurrencyData({
          date: json.date,
          rate: json.rates,
        }),
      ])
      .catch((error) => alert(error));
  };

  useEffect(() => {
    if (locationData.country) {
      getCountrydata(locationData.country);
    }
  }, [locationData.country]);

  useEffect(() => {
    if (locationData.country) {
      getCurrencyData();
      let clockCall = setInterval(() => {
        getCurrencyData();
      }, 300000); //every 5 minute, it updates
      return () => clearInterval(clockCall);
    }
  }, [locationData.country]);

  return { ...Currency, countryData, currencyData };
};
