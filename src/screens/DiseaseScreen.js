import React, { useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
} from "react-native"
import axios from "axios"
import ImagePickerComponent from "../components/ImagePickerComponent"
import WeatherComponent from "../components/WeatherComponent"
import DiseaseResultComponent from "../components/DiseaseResultComponent" // Import the new result component

const DiseaseScreen = () => {
  const [weatherData, setWeatherData] = useState({
    humidity: "-",
    temperature: "-",
    condition: "-",
  })

  const [diseaseResult, setDiseaseResult] = useState(null)
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [dosage, setDosage] = useState(null) // Added state for dosage
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.8.123:5000/predict_alert"
      )
      if (response.data) {
        setWeatherData(response.data)
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)
    }
  }

  // Function to identify disease from the uploaded image
  const identifyDisease = async imageUri => {
    setLoading(true)
    const formData = new FormData()
    formData.append("image", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    })

    try {
      const response = await axios.post(
        "http://192.168.8.123:5000/predict_disease",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      if (response.data) {
        setDiseaseResult(response.data.predicted_disease)
        setFertilizerRecommendation(response.data.fertilizer)
        setDosage(response.data.dosage) // Set dosage
        setAlertMessage(response.data.alert)
      } else {
        console.error("No data returned from backend")
      }
    } catch (error) {
      console.error("Error identifying disease:", error)
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Display uploaded or captured image */}
        {image && <Image source={{ uri: image }} style={styles.image} />}

        {/* Image Picker Component */}
        <ImagePickerComponent
          fetchWeatherData={fetchWeatherData}
          setDiseaseResult={setDiseaseResult}
          setFertilizerRecommendation={setFertilizerRecommendation}
          setAlertMessage={setAlertMessage}
          setImage={setImage} // Pass setImage to update the image
          theme="disease"
          identifyDisease={identifyDisease}
        />

        {/* Display Disease Result */}
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          diseaseResult && (
            <DiseaseResultComponent
              diseaseResult={diseaseResult}
              alertMessage={alertMessage}
              fertilizerRecommendation={fertilizerRecommendation}
              dosage={dosage} // Pass dosage here
            />
          )
        )}

        {/* Display weather data */}
        <WeatherComponent weatherData={weatherData} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
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
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
})

export default DiseaseScreen
