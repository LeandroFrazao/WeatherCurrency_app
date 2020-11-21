import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

//importing components
import { Location } from "./components/Location";
import { Gps } from "./components/Gps";
import { Weather } from "./components/Weather";
import { ClimateCondition } from "./components/ClimateCondition";
import { Currency } from "./components/Currency";
import { FlickrImages } from "./components/FlickrImages";

import Home from "./Tabs/Home";
import More from "./Tabs/More";

const Tab = createBottomTabNavigator();

export default function App() {
  const { position, error } = Gps();
  const { locationData } = Location();
  const { currencyData, countryData } = Currency();
  const { weather } = Weather();
  const { images } = FlickrImages();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused
                ? weather.main
                  ? ClimateCondition[weather.main].iconTab
                  : "ios-home"
                : weather.main
                ? ClimateCondition[weather.main].iconTab
                : "ios-home";
            } else if (route.name === "More") {
              iconName = focused ? "ios-more" : "ios-more";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#57A6FF",
          inactiveTintColor: "gray",
          labelStyle: { fontSize: 14 },
        }}
      >
        <Tab.Screen
          name="Home"
          children={() => (
            <Home
              gps={Gps()}
              location={Location()}
              weather={Weather()}
              currency={Currency()}
              flickrImages={FlickrImages()}
            />
          )}
        />
        <Tab.Screen
          name="More"
          children={() => (
            <More
              position={position}
              locationData={locationData}
              weather={weather}
              currencyData={currencyData}
              countryData={countryData}
              images={images}
            />
          )}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
