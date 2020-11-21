import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
//importing components
import { ClimateCondition } from "../components/ClimateCondition";
import { Card, Title, Paragraph } from "react-native-paper";

export default function More(props) {
  // load variables by props
  const position = props.position;
  const locationData = props.locationData;
  const weather = props.weather;
  const currencyData = props.currencyData;
  const countryData = props.countryData;
  const images = props.images;

  // state variables
  const [dTable, setDTable] = useState(false);
  const [dateToday, setDateToday] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateToday((c) => new Date().toLocaleString("en-UK"));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }),
    [];

  useEffect(() => {
    loadInfo();
  }, []);

  // to load the background of the app, based on location and weather
  function loadBackground() {
    //check if variable images is not null
    if (images[0]) {
      //get a random index from the list of images got in flickr
      var randomIndex = Math.floor(Math.random() * images.length);
      let _id = images[randomIndex].id;
      let _secret = images[randomIndex].secret;
      let _server = images[randomIndex].server;
      return {
        uri:
          "https://live.staticflickr.com/" +
          _server +
          "/" +
          _id +
          "_" +
          _secret +
          ".jpg",
      };
    }
  }

  // function to store data in cache using AsyncStorage
  const storageInfo = async () => {
    try {
      const value = {
        dateTime: dateToday,
        city: locationData.city,
        country: locationData.country,
        lat: position.latitude,
        long: position.longitude,
        weather: weather.main,
        temperature: parseInt(Math.round(weather.temp / 0.5) * 0.5) + "°",
        feelslike: parseInt(Math.round(weather.feelsLike / 0.5) * 0.5) + "˚",
        currency:
          currencyData.rate[countryData.currencyCode] +
          " " +
          countryData.currencyCode,
        background: loadBackground(),
      };

      await AsyncStorage.setItem("value", JSON.stringify(value));
      let places = JSON.parse(await AsyncStorage.getItem("places")) || [];
      places.unshift(value);
      await AsyncStorage.setItem("places", JSON.stringify(places));
      // alert("Data Saved!!");
      loadInfo();
      if (Platform.OS == "web") {
        alert("Data Saved!");
      }
      Alert.alert(
        "Information",
        "Data Saved!",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
      loadInfo();
    } catch (e) {
      console.log("error: ", e);
    }
  };

  //function to retrieve data saved in cache
  const loadInfo = async () => {
    let getData =
      (await AsyncStorage.getItem("places")) &&
      JSON.parse(await AsyncStorage.getItem("places"));
    setDTable(getData);
  };

  const cleanStorage = async () => {
    if (Platform.OS == "web") {
      if (confirm("Confirm to clean data?")) {
        await AsyncStorage.clear().then(() => console.log("Cleared"));
        loadInfo();
      }
    }
    Alert.alert(
      "Clean Data",
      "Confirm?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.clear().then(() => console.log("Cleared"));
            loadInfo();
          },
        },
      ],
      { cancelable: false }
    );
  };

  //check if variables were loaded, then renders. otherwise render the message " Loading .. ""
  if (weather.main && countryData.currencyName) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: weather.main
              ? ClimateCondition[weather.main].color
              : "gray",
          },
        ]}
      >
        <View style={styles.bodyInfo}>
          <Text style={styles.h2}>Summary:</Text>
          <Text style={styles.h4}>
            {dateToday} - {locationData.city}, {locationData.country} {"\n"}Lat:{" "}
            {position.latitude}, Long:{position.longitude}
            {"\n"}Weather: {ClimateCondition[weather.main].title}, Temperature:{" "}
            {parseInt(Math.round(weather.temp / 0.5) * 0.5)}°, Feels Like:{" "}
            {parseInt(Math.round(weather.feelsLike / 0.5) * 0.5)}˚{"\n"}
            Currency: $1 = {currencyData.rate[countryData.currencyCode]}{" "}
            {countryData.currencyCode}
            {"\n"}
          </Text>
          <View style={styles.button}>
            <Button
              title="Save Data"
              color="rgba(166, 225, 255,0.5)"
              onPress={() => storageInfo()}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Clear Data"
              color="rgba(166, 225, 255,0.5)"
              onPress={() => cleanStorage()}
            />
          </View>
        </View>
        <>
          <ScrollView>
            <View style={styles.bodyCard}>
              {dTable &&
                dTable.map((data, index) => (
                  <Card
                    key={index}
                    style={{
                      backgroundColor: ClimateCondition[data.weather].color,
                    }}
                  >
                    {<Card.Cover source={data.background} />}
                    <Card.Title title={data.city} subtitle={data.country} />
                    <Card.Content>
                      <Paragraph style={styles.h5}>{data.dateTime}</Paragraph>
                      <Title style={styles.h3}>Information</Title>
                      <Paragraph style={styles.h4}>
                        Weather: {ClimateCondition[data.weather].title},
                        Temperature: {data.temperature}, Feels Like:{" "}
                        {data.feelslike}
                      </Paragraph>
                      <Paragraph style={styles.h4}>
                        {" "}
                        Currency: $1 = {data.currency}{" "}
                      </Paragraph>
                      <Paragraph style={styles.h4}>
                        Position: Lat. {position.latitude}, Long.{" "}
                        {position.longitude}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                ))}
            </View>
          </ScrollView>
        </>
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
    color: "rgb(47, 60, 82)",
    fontSize: 12,
    textAlign: "left",
  },
  bodyInfo: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginVertical: 30,
    width: 350,
    paddingVertical: 10,
    backgroundColor: "rgba(83, 96, 138, 0.5)",
  },
  bodyCard: {
    //alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    marginVertical: 5,
  },
});
