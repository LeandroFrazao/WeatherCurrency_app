import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
//importing components

import { Location } from "./components/Location";
import CurrencyConverter from "./components/CurrencyConverter";
import { Gps } from "./components/Gps";
import { Weather } from "./components/Weather";

export default function App() {
  //console.log(props);
  // const citytest = props.city;
  // console.log(citytest);
  //const { latitude, longitude, error } = Gps();
  //console.log(latitude);
  const { position, error } = Gps();
  const { dataLocation } = Location();
  const { dataWeather } = Weather();
  console.log(dataLocation);
  console.log(dataWeather);

  let location =
    dataLocation.city != null
      ? dataLocation.city +
        ", " + //there are some countries that doesnt have states, but counties
        (typeof dataLocation.state !== "undefined"
          ? dataLocation.state
          : dataLocation.county) +
        ", " +
        dataLocation.country +
        "\n" +
        position.latitude +
        ", " +
        position.longitude
      : "Searching.. ";
  return (
    // <ImageBackground
    //   source={require("./images/")}
    //   blurRadius={5}
    //   style={styles.container}
    // >
    <View style={styles.overlay}>
      <Text style={styles.h1}>Welcome to</Text>
      <Text style={styles.h2}>{location}</Text>
    </View>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
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
    margin: 20,
  },
  h2: {
    color: "#fff",
    margin: 5,
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  h3: {
    color: "#fff",
    margin: 5,
  },
});
