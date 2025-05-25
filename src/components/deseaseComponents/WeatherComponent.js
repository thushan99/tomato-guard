import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import axios from "axios"

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_KEY = "48b1307218c54026ba6143246240212"
  const LOCATION = "Colombo"
  const FORECAST_DAYS = 1
  const BASE_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&days=${FORECAST_DAYS}`

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(BASE_URL)
      const data = response.data

      setWeatherData({
        condition: data.current.condition.text,
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        location: data.location.name,
      })
      setLoading(false)
    } catch (error) {
      console.error("Error fetching weather data: ", error)
      setError("Failed to load weather data. Please try again later.")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={styles.loadingIndicator}
      />
    )
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>
  }

  const getWeatherIcon = condition => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("sunny"))
      return { name: "weather-sunny", color: "#FBC02D" }
    if (conditionLower.includes("rain"))
      return { name: "weather-rainy", color: "#2196F3" }
    if (conditionLower.includes("cloud"))
      return { name: "weather-cloudy", color: "#90A4AE" }
    if (conditionLower.includes("storm"))
      return { name: "weather-lightning", color: "#FF7043" }
    if (conditionLower.includes("snow"))
      return { name: "weather-snowy", color: "#B3E5FC" }
    if (conditionLower.includes("fog"))
      return { name: "weather-fog", color: "#B0BEC5" }
    return { name: "weather-partly-cloudy", color: "#607D8B" }
  }

  const weatherIcon = getWeatherIcon(weatherData.condition)

  return (
    <View style={styles.container}>
      <View style={styles.weatherInfo}>
        <View style={styles.weatherBox}>
          <MaterialCommunityIcons
            name={weatherIcon.name}
            size={30}
            color={weatherIcon.color}
          />
          <Text style={styles.conditionText}>{weatherData.condition}</Text>
        </View>

        <View style={styles.weatherBox}>
          <MaterialCommunityIcons
            name="thermometer"
            size={28}
            color="#F57C00"
          />
          <Text style={styles.label}>Temperature</Text>
          <Text style={styles.value}>{weatherData.temperature}°C</Text>
        </View>
        <View style={styles.weatherBox}>
          <MaterialCommunityIcons name="water" size={28} color="#2196F3" />
          <Text style={styles.label}>Humidity</Text>
          <Text style={styles.value}>{weatherData.humidity}%</Text>
        </View>
        <View style={styles.weatherBox}>
          <MaterialCommunityIcons name="map-marker" size={28} color="#4CAF50" />
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{weatherData.location}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 0,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    margin: 10,
    alignItems: "center",
    width: 350,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  conditionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  weatherInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 5,
  },
  weatherBox: {
    alignItems: "center",
    padding: 5,
    width: 85,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
})

export default WeatherComponent
