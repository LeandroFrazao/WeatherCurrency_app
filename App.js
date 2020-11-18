import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import React, { isValidElement } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//importing components
import { Location } from "./components/Location";
import { Gps } from "./components/Gps";
import { Weather } from "./components/Weather";
import { ClimateCondition } from "./components/ClimateCondition";
import { Currency } from "./components/Currency";
import { FlickrImages } from "./components/FlickrImages";

export default function App() {
  const { position, error } = Gps();
  const { locationData } = Location();
  const { weather } = Weather();
  const { currencyData, countryData } = Currency();
  const { images } = FlickrImages();

  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(0);
  const [toUSD, setToUSD] = useState(true);
  const [backgroundURI, setBackgroundURI] = useState("");
  useEffect(() => {
    if (countryData.name != null) {
      console.log(countryData);
      console.log(weather);
      //  console.log(countryData.currencyCode);
      //  console.log(currencyData.rate[countryData.currencyCode]);
      // getImages().then((results) => {
      //   console.log(results);
      //   console.log("there are " + results.length + " photos");
      //   // updates the photos state
      //   setImages({
      //     photos: results,
      //   });
      // });
      console.log(images);
    }
  }, [countryData.name, amount]);

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
      var randomIndex = Math.floor(Math.random() * images.length);
      console.log(randomIndex);
    }
  }
  // to convert unix timestamp to hours/min/sec
  function convertUnixTime(unixTime) {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString("en-UK");
  }

  // to load the background of the app, based on gps position, and weather

  useEffect(() => {
    if (images[0]) {
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
    }
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

  const backURI = {
    uri: "https://live.staticflickr.com/65535/50552123048_3935e8d74a_b.jpg",
  };

  //check if variables were loaded otherwise it shows "loading.."
  if (weather.main && countryData.currencyName && images[0]) {
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
              <Text style={styles.h3}>
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
                  {"\n\n"}
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
                  <ImageBackground
                    source={{ uri: "https://restcountries.eu/data/usa.svg" }}
                    style={styles.backgroundFlag}
                  />
                  <Text style={styles.h3}>USD</Text>
                </TouchableOpacity>
                <Text style={styles.h2}>{toUSD ? ">>>" : "<<<"}</Text>
                <TouchableOpacity
                  style={styles.touch}
                  onPress={() => convertCurrency(false)}
                >
                  <ImageBackground
                    source={{ uri: countryData.flag }}
                    style={styles.backgroundFlag}
                  />
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
    marginBottom: 20,
  },
  bodyWeather: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //borderWidth: 2,
    // borderColor: "red",
  },
  bodyWeatherChild0: {
    // borderWidth: 2,
    // borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    // marginBottom: 20,
    flexDirection: "row",
  },
  bodyWeatherChild1: {
    //borderWidth: 2,
    // borderColor: "pink",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    alignContent: "flex-start",

    paddingHorizontal: 10,
    // marginBottom: 20,
    flexDirection: "row",
  },
  bodyWeatherChild2: {
    alignItems: "flex-end",
  },
  bodyCurrency: {
    flex: 2,
    //borderWidth: 2,
    // borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "flex-start",
    width: "100%",
  },
  bodyCurrencyChild1: {
    //flex: 2,
    //borderWidth: 2,
    //borderColor: "gray",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  bodyCurrencyChild2: {
    // flex: 2,
    //borderWidth: 2,
    //borderColor: "gray",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
    flexDirection: "row",
  },
  bodyCurrencyChild3: {
    // flex: 1,
    //borderWidth: 2,
    //borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    // paddingLeft: 30,
    marginBottom: 10,
    minWidth: 300,
    flexDirection: "row",
  },
  backgroundFlag: {
    height: 70,
    width: 120,
    opacity: 0.3,
    position: "absolute",
  },

  touch: {
    flex: 1,
    backgroundColor: "rgba(0,0,10,0.3)",
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 120,
    position: "relative",
  },
  input: {
    fontSize: 16,
    //color: "#fff",
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
    //borderWidth: 2,
    // borderColor: "red",
  },
});
