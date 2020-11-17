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
import { WeatherKey } from "./utils/APIKey";

export default function App() {
  const { position, error } = Gps();
  const { locationData } = Location();
  const { weather } = Weather();
  const { currencyData, countryData } = Currency();
  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(0);
  const [toUSD, setToUSD] = useState(true);

  useEffect(() => {
    if (countryData.name != null) {
      console.log(countryData);
      //  console.log(countryData.currencyCode);
      //  console.log(currencyData.rate[countryData.currencyCode]);
    }
  }, [countryData.name]);
  useEffect(() => {
    console.log(amount);
  }, []);

  function convertCurrency(usd) {
    if (usd) {
      setToUSD(true);
      let newAmount = amount * currencyData.rate[countryData.currencyCode];
      setConverted(newAmount);
      console.log(converted);
    } else {
      setToUSD(false);
      let newAmount = amount / currencyData.rate[countryData.currencyCode];
      setConverted(newAmount);
    }
  }

  let location =
    locationData.city +
    ", " + //there are some countries that doesnt have states, but counties
    (typeof locationData.state !== "undefined"
      ? locationData.state
      : locationData.county) +
    ", " +
    locationData.country;

  if (weather.main && countryData.currencyName) {
    return (
      // <ImageBackground
      //   source={require("./images/")}
      //   blurRadius={5}
      //   style={styles.container}
      // >
      <View style={styles.overlay}>
        <View style={styles.bodyLocation}>
          <Text style={styles.h1}>Welcome to</Text>
          <Text style={styles.h2}>{location}</Text>
          <Text style={styles.h3}>
            {position.latitude}, {position.longitude}
          </Text>
        </View>
        <View style={styles.bodyWeather}>
          <View style={styles.bodyWeatherChild1}>
            <MaterialCommunityIcons
              size={40}
              name={ClimateCondition[weather.main].icon}
              color={"#fff"}
            />
            <Text style={styles.h1}>
              {parseInt(Math.round(weather.temp / 0.5) * 0.5)}˚
            </Text>
            <Text style={styles.h2}>{weather.description}</Text>
          </View>
          <View style={styles.bodyWeatherChild2}>
            <Text style={styles.h3}>
              Max. {parseInt(Math.round(weather.tempMax / 0.5) * 0.5)}˚
            </Text>
            <Text style={styles.h3}>
              Min. {parseInt(Math.round(weather.tempMin / 0.5) * 0.5)}˚
            </Text>
            <Text style={styles.h3}>
              Feels like {parseInt(Math.round(weather.feelsLike / 0.5) * 0.5)}˚
            </Text>
          </View>
        </View>
        <View style={styles.bodyCurrency}>
          <View style={styles.bodyCurrencyChild1}>
            <Text style={styles.h2}>Currency Converter</Text>
          </View>

          <View style={styles.bodyCurrencyChild2}>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => convertCurrency(true)}
            >
              <Text style={styles.h3}>USD</Text>
            </TouchableOpacity>
            <Text style={styles.h2}>{toUSD ? ">>>" : "<<<"}</Text>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => convertCurrency(false)}
            >
              <Text style={styles.h3}>{countryData.currencyCode}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.h3}>
            {!isNaN(converted)
              ? (!toUSD
                  ? "US DOLAR : "
                  : countryData.currencyName.toUpperCase() + " : ") + converted
              : "Invalid Input!"}
          </Text>
          <View style={styles.bodyCurrencyChild3}>
            <Text style={styles.currency}>
              {toUSD
                ? "US DOLAR : "
                : countryData.currencyName.toUpperCase() + " : "}
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
              onPress={() => console.log("Button with adjusted color pressed")}
            />
          </View>
        </View>
      </View>
      // </ImageBackground>
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
    fontSize: 10,
    textAlign: "center",
  },
  bodyLocation: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  bodyWeather: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,

    marginBottom: 20,
    flexDirection: "row",
  },
  bodyWeatherChild1: {
    paddingRight: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  bodyWeatherChild2: {
    alignItems: "flex-end",
  },
  bodyCurrency: {
    flex: 2,
    borderWidth: 2,
    borderColor: "red",
    alignItems: "stretch",
    justifyContent: "center",
    marginBottom: 30,
  },
  bodyCurrencyChild1: {
    flex: 2,
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  bodyCurrencyChild2: {
    flex: 2,
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
    flexDirection: "row",
  },
  bodyCurrencyChild3: {
    flex: 1,
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    // paddingLeft: 30,
    marginBottom: 10,
    minWidth: 300,
    flexDirection: "row",
  },
  touch: {
    flex: 1,
    borderWidth: 2,
    borderColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    marginBottom: 10,
    flexDirection: "row",
  },
  input: {
    fontSize: 20,
    color: "#fff",
    width: 150,
    borderWidth: 2,
    borderColor: "red",
  },
  currency: {
    fontSize: 18,
    color: "#fff",
    width: 100,
    textAlign: "right",
    paddingRight: 10,
    borderWidth: 2,
    borderColor: "red",
  },
});
