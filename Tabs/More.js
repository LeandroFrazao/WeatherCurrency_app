import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Alert,
} from "react-native";

//importing components
import { ClimateCondition } from "../components/ClimateCondition";
import { DataTable } from "react-native-paper";
import { Avatar, Card, Title, Paragraph, FAB } from "react-native-paper";

export default function More(props) {
  const position = props.position;
  const locationData = props.locationData;
  const weather = props.weather;
  const currencyData = props.currencyData;
  const countryData = props.countryData;
  const images = props.images;

  //const { dTable } = DataTable();
  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(0);
  const [toUSD, setToUSD] = useState(true);
  const [backgroundURI, setBackgroundURI] = useState("");
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
      places.push(value);
      await AsyncStorage.setItem("places", JSON.stringify(places));

      () =>
        Alert.alert(
          "Information",
          "Data Saved"[
            ({
              text: "Ask me later",
              onPress: () => console.log("Ask me later pressed"),
            },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") })
          ],
          { cancelable: false }
        );
      alert("Information", "Data Saved!!");
      loadInfo();
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const loadInfo = async () => {
    let getData =
      (await AsyncStorage.getItem("places")) &&
      JSON.parse(await AsyncStorage.getItem("places"));
    setDTable(getData);
  };

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
            {"\n"}Weather: {ClimateCondition[weather.main].title} Temperature:{" "}
            {parseInt(Math.round(weather.temp / 0.5) * 0.5)}°, Feels Like:{" "}
            {parseInt(Math.round(weather.feelsLike / 0.5) * 0.5)}˚{"\n"}
            Currency: $1 = {currencyData.rate[countryData.currencyCode]}{" "}
            {countryData.currencyCode}
            {"\n"}
          </Text>
          <View style={styles.button}>
            <Button
              title="Click to Save"
              color="rgba(166, 225, 255,0.5)"
              onPress={() => storageInfo()}
            />
          </View>
        </View>
        <ScrollView>
          <View>
            {dTable &&
              dTable.map((data, index) => (
                <Card
                  key={index}
                  style={{
                    backgroundColor: ClimateCondition[data.weather].color,
                  }}
                >
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
                  {<Card.Cover source={data.background} />}
                </Card>
              ))}
          </View>
        </ScrollView>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
        >
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ width: 100 }}>
                  Date/Time
                </DataTable.Title>

                <DataTable.Title>City</DataTable.Title>

                <DataTable.Title>Country</DataTable.Title>

                <DataTable.Title>Weather</DataTable.Title>

                <DataTable.Title>Temp</DataTable.Title>
                <DataTable.Title>Feelslike</DataTable.Title>
                <DataTable.Title>Currency</DataTable.Title>
                <DataTable.Title>Lat</DataTable.Title>
                <DataTable.Title>Long</DataTable.Title>
              </DataTable.Header>

              {dTable &&
                dTable.map((data, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={{ flex: 3 }}>
                      {data.dateTime}
                    </DataTable.Cell>
                    <DataTable.Cell>{data.city}</DataTable.Cell>
                    <DataTable.Cell>{data.country}</DataTable.Cell>
                    <DataTable.Cell>{data.weather}</DataTable.Cell>
                    <DataTable.Cell>{data.temperature}</DataTable.Cell>
                    <DataTable.Cell>{data.feelslike}</DataTable.Cell>
                    <DataTable.Cell>{data.currency}</DataTable.Cell>
                    <DataTable.Cell>{data.long}</DataTable.Cell>
                    <DataTable.Cell>{data.lat}</DataTable.Cell>
                  </DataTable.Row>
                ))}

              <DataTable.Pagination
                page={1}
                numberOfPages={3}
                onPageChange={(page) => {
                  console.log(page);
                }}
                label="1-2 of 6"
              />
            </DataTable>
          </View>
        </ScrollView>
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
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: 350,
    paddingVertical: 50,
    backgroundColor: "rgba(83, 96, 138, 0.5)",
  },
  button: {
    marginTop: 20,
  },

  backgroundFlag: {
    height: 40,
    width: 80,
    opacity: 0.3,
    position: "absolute",
  },
});
