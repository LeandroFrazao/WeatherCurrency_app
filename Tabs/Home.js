import { useEffect, useState } from "react";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // to load weather icons
import { SvgCssUri } from "react-native-svg"; //to open svg files

//importing components
import { ClimateCondition } from "../components/ClimateCondition";

export default function Home(props) {
  // load variables by props
  const { position, error } = props.gps;
  const { locationData } = props.location;
  const { weather } = props.weather;
  const { currencyData, countryData } = props.currency;
  const { images } = props.flickrImages;

  // state variables
  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(0);
  const [toUSD, setToUSD] = useState(true);
  const [backgroundURI, setBackgroundURI] = useState("");

  //for dev purpose, it shows information in the console.
  useEffect(() => {
    if (countryData.name && weather.main && images[0]) {
      console.log(countryData);
      console.log(weather);
      console.log(images);
    }
  }, [countryData.name, converted]);

  //function to convert USD to the currency of the country where the user is located.
  function convertCurrency(usd) {
    if (usd) {
      setToUSD(true);
      let newAmount = amount * currencyData.rate[countryData.currencyCode];
      setConverted(newAmount);
    } else {
      setToUSD(false);
      let newAmount = amount / currencyData.rate[countryData.currencyCode];
      setConverted(newAmount);
    }
  }

  // to convert unix timestamp to hours/min/sec
  function convertUnixTime(unixTime) {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString("en-UK");
  }

  // to load the background of the app, based on location and weather
  useEffect(() => {
    //check if variable images is not null
    if (images[0]) {
      //get a random index from the list of images got in flickr
      var randomIndex = Math.floor(Math.random() * images.length);
      let _id = images[randomIndex].id;
      let _secret = images[randomIndex].secret;
      let _server = images[randomIndex].server;
      setBackgroundURI({
        uri:
          "https://live.staticflickr.com/" +
          _server +
          "/" +
          _id +
          "_" +
          _secret +
          ".jpg",
      });
    } //if weather changes, a new list of images to be set on background
  }, [weather.main, images[0]]);

  // string to return location
  let location =
    locationData.city +
    ", " + //there are some countries that doesnt have states, but counties
    (typeof locationData.state !== "undefined"
      ? locationData.state
      : locationData.county) +
    ", " +
    locationData.country;

  //check if variables were loaded otherwise it shows "loading.."
  if (weather.main && countryData.currencyName && backgroundURI != "") {
    return (
      <View style={styles.overlay}>
        <ImageBackground
          source={backgroundURI}
          resizeMode="cover"
          blurRadius={2}
          style={styles.container}
        >
          <View
            style={[
              styles.container,
              { backgroundColor: ClimateCondition[weather.main].color },
            ]}
          >
            <View style={[styles.bodyLocation]}>
              <Text style={styles.h1}>Welcome to</Text>
              <Text style={styles.h2}>{location}</Text>
              <Text style={styles.h4}>
                {position.latitude}, {position.longitude}
              </Text>
            </View>
            <View
              style={[
                styles.bodyWeather,
                {
                  backgroundColor: ClimateCondition[weather.main].color,
                },
              ]}
            >
              <Text style={styles.h2}>Weather</Text>
              <View style={styles.bodyWeatherChild0}>
                <View style={styles.bodyWeatherChild1}>
                  <MaterialCommunityIcons
                    size={35}
                    name={ClimateCondition[weather.main].icon}
                    color={"#fff"}
                  />
                  {/* I used a function to round the value of temperature  */}
                  <Text style={styles.h2}>
                    {parseInt(Math.round(weather.temp / 0.5) * 0.5)}˚
                  </Text>
                  <Text style={styles.h3}>{weather.description}</Text>
                </View>
                <View style={styles.bodyWeatherChild2}>
                  <Text style={styles.h5}>
                    Max. {parseInt(Math.round(weather.tempMax / 0.5) * 0.5)}˚
                  </Text>
                  <Text style={styles.h5}>
                    Min. {parseInt(Math.round(weather.tempMin / 0.5) * 0.5)}˚
                  </Text>
                  <Text style={styles.h5}>
                    Feels like{" "}
                    {parseInt(Math.round(weather.feelsLike / 0.5) * 0.5)}˚
                  </Text>
                </View>
              </View>
              <View style={[styles.bodyWeatherChild1]}>
                <Text style={styles.h5}>Clouds: {weather.cloud}%</Text>
                <Text style={styles.h5}>Humidity: {weather.humidity}%</Text>
                <Text style={styles.h5}>Wind: {weather.wind}m/s</Text>
              </View>
              <View style={[styles.bodyWeatherChild1]}>
                <Text style={styles.h5}>
                  Sunrise: {convertUnixTime(weather.sunrise)}
                </Text>
                <Text style={styles.h5}>
                  Sunset: {convertUnixTime(weather.sunset)}
                </Text>
              </View>
              <View style={styles.bodyWeatherChild1}>
                <Text style={styles.h4}>
                  {"\n"}
                  {ClimateCondition[weather.main].subtitle}
                </Text>
              </View>
            </View>
            <View style={[styles.bodyCurrency]}>
              <View style={styles.bodyCurrencyChild1}>
                <Text style={styles.h2}>Currency Converter</Text>
              </View>

              <View style={styles.bodyCurrencyChild2}>
                <TouchableOpacity
                  style={styles.touch}
                  onPress={() => convertCurrency(true)}
                >
                  {Platform.OS != "web" ? ( //  only works in MOBILE
                    <SvgCssUri
                      width={styles.backgroundFlag.width}
                      height={styles.backgroundFlag.height}
                      viewBox="0 0 1100 600"
                      uri="https://restcountries.eu/data/usa.svg"
                      preserveAspectRatio="xMinYMax meet"
                      style={[styles.backgroundFlag]}
                    />
                  ) : (
                    <ImageBackground
                      source={{ uri: "https://restcountries.eu/data/usa.svg" }}
                      style={styles.backgroundFlag}
                    />
                  )}
                  <Text style={styles.h3}>USD</Text>
                </TouchableOpacity>
                <Text style={styles.h2}>{toUSD ? ">>>" : "<<<"}</Text>
                <TouchableOpacity
                  style={styles.touch}
                  onPress={() => convertCurrency(false)}
                >
                  {Platform.OS != "web" ? ( //  only works in MOBILE
                    <SvgCssUri
                      width={styles.backgroundFlag.width}
                      height={styles.backgroundFlag.height}
                      viewBox="0 0 1100 600"
                      uri={countryData.flag}
                      preserveAspectRatio="xMinYMax meet"
                      style={[styles.backgroundFlag]}
                    />
                  ) : (
                    <ImageBackground
                      source={{ uri: countryData.flag }}
                      style={styles.backgroundFlag}
                    />
                  )}
                  <Text style={styles.h3}>{countryData.currencyCode}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.h3}>
                {!isNaN(converted)
                  ? (!toUSD
                      ? "US DOLAR : "
                      : countryData.currencyName.toUpperCase() + " : ") +
                    converted
                  : "Invalid Input!"}
              </Text>
              <View style={styles.bodyCurrencyChild3}>
                <Text style={styles.currency}>
                  {toUSD
                    ? "US DOLAR :"
                    : countryData.currencyName.toUpperCase() + " :"}
                </Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  keyboardType="decimal-pad"
                  placeholder="Enter amount"
                  onChangeText={setAmount}
                />
                <Button
                  title="Convert"
                  color="rgba(166, 225, 255,0.5)"
                  onPress={() => convertCurrency(toUSD)}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  } else {
    return (
      <View style={styles.overlay}>
        <Text style={styles.h1}>Loading..</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "99%",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
    margin: 10,
  },
  h2: {
    color: "#fff",
    margin: 5,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  h3: {
    color: "#fff",
    margin: 5,
    fontSize: 16,
    textAlign: "center",
  },
  h4: {
    color: "#fff",
    margin: 5,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  h5: {
    color: "#fff",
    margin: 5,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  bodyLocation: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    marginVertical: 20,
  },
  bodyWeather: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  bodyWeatherChild0: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  bodyWeatherChild1: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  bodyWeatherChild2: {
    alignItems: "flex-end",
  },
  bodyCurrency: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "flex-start",
    width: "100%",
  },
  bodyCurrencyChild1: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  bodyCurrencyChild2: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
    flexDirection: "row",
  },
  bodyCurrencyChild3: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    minWidth: 300,
    flexDirection: "row",
  },
  backgroundFlag: {
    height: 40,
    width: 80,
    opacity: 0.3,
    position: "absolute",
  },

  touch: {
    backgroundColor: "rgba(0,0,10,0.3)",
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 80,
    position: "relative",
  },
  input: {
    fontSize: 16,
    width: 150,
    backgroundColor: "rgba(0,0,0,0.4)", // 40% opaque
    color: "white",
  },
  currency: {
    fontSize: 16,
    color: "#fff",
    width: 100,
    textAlign: "right",
    paddingRight: 10,
  },
});
