import React, { useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native"
import axios from "axios"

import ImagePickerComponent from "../components/ImagePickerComponent"
import WeatherComponent from "../components/WeatherComponent"
import DiseaseResultComponent from "../components/DiseaseResultComponent"

const { width } = Dimensions.get("window")

const DiseaseScreen = () => {
  const [weatherData, setWeatherData] = useState({
    humidity: "-",
    temperature: "-",
    condition: "-",
  })

  const [diseaseResult, setDiseaseResult] = useState(null)
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [dosage, setDosage] = useState(null)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.8.123:5000/predict_alert"
      )
      if (response.data) {
        setWeatherData(response.data)
      }
    } catch (err) {
      console.error("Error fetching weather data:", err)
      setError("Failed to load weather data.")
    }
  }

  const identifyDisease = async imageUri => {
    setLoading(true)
    setError(null)

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
        setDosage(response.data.dosage)
        setAlertMessage(response.data.alert)
      } else {
        setError("No data returned from backend.")
      }
    } catch (err) {
      console.error("Error identifying disease:", err)
      setError("Error identifying disease. Please try again.")
    }
    setLoading(false)
  }

  const handleImageUpload = imageUri => {
    setDiseaseResult(null)
    setFertilizerRecommendation(null)
    setAlertMessage(null)
    setImage(imageUri)
    identifyDisease(imageUri)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WeatherComponent weatherData={weatherData} />

        <ImagePickerComponent
          fetchWeatherData={fetchWeatherData}
          setDiseaseResult={setDiseaseResult}
          setFertilizerRecommendation={setFertilizerRecommendation}
          setAlertMessage={setAlertMessage}
          setImage={handleImageUpload}
          theme="disease"
          identifyDisease={identifyDisease}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          diseaseResult && (
            <DiseaseResultComponent
              diseaseResult={diseaseResult}
              alertMessage={alertMessage}
              fertilizerRecommendation={fertilizerRecommendation}
              dosage={dosage}
              // onAddFertilizer={() => console.log("Fertilizer added")}
              // onCancel={() => console.log("Cancelled")}
            />
          )
        )}
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
    width: width * 0.9,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
})

export default DiseaseScreen
