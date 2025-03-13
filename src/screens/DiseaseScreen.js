import React, { useState } from "react"
import { View, StyleSheet, ScrollView, Image } from "react-native"
import axios from "axios"
import ImagePickerComponent from "../components/ImagePickerComponent"
import WeatherComponent from "../components/WeatherComponent"
import ResultComponent from "../components/DiseaseResultComponent"

const DiseaseScreen = () => {
  const [weatherData, setWeatherData] = useState({
    humidity: "-",
    temperature: "-",
    condition: "-",
  })

  const [diseaseResult, setDiseaseResult] = useState(null)
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [image, setImage] = useState(null) // Store the image URI here

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get("http://your-backend-api/weather")
      if (response.data) {
        setWeatherData(response.data)
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Display uploaded or captured image at the top */}
        {image && <Image source={{ uri: image }} style={styles.image} />}

        <ImagePickerComponent
          fetchWeatherData={fetchWeatherData}
          setDiseaseResult={setDiseaseResult}
          setFertilizerRecommendation={setFertilizerRecommendation}
          setAlertMessage={setAlertMessage}
          setImage={setImage} // Pass setImage to update the image in the parent component
          theme="disease" // Ensure consistent theme
        />

        <WeatherComponent weatherData={weatherData} />
        <ResultComponent
          diseaseResult={diseaseResult}
          alertMessage={alertMessage}
          fertilizerRecommendation={fertilizerRecommendation}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9", // Light green background
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 10, // Smooth edges
    borderWidth: 2,
    borderColor: "#4CAF50", // Green border
  },
  button: {
    backgroundColor: "#4CAF50", // Green for buttons
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#388E3C", // Dark green for modal separators
  },
  modalText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#388E3C", // Dark green text
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#388E3C", // Darker green for close button
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default DiseaseScreen
