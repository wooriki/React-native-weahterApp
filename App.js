import React, { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";

import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";

const SCREEN_SIZE = Dimensions.get("window").width;
const API_KEY = "2398d05573fd9f3ccb8f3b598d970936";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snows",
  Drizzle: "rains",
  Thundersorm: "lighting",
};
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={style.container}>
      <StatusBar style="light" />
      <View style={style.city}>
        <Text style={style.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.weather}
      >
        {days.length === 0 ? (
          // <View style={{ ...style.day, alignItems: "center" }}>
          <View style={style.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={style.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={style.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="#006b3b"
                />
              </View>

              <Text style={style.description}>{day.weather[0].main}</Text>
              <Text style={style.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f56a00",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_SIZE,
    paddingLeft: 20,
    paddingRight: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 120,
    fontWeight: "700",
    color: "white",
  },
  description: {
    fontSize: 40,
    paddingLeft: 20,
    marginTop: -10,
    color: "#ad4b00",
  },
  tinyText: {
    fontSize: 20,
    paddingLeft: 20,
    color: "#783406",
  },
});
