import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import ImagePickerComponent from "../components/ImagePickerComponent" // Import the component

const PestScreen = () => {
  // State variables to manage image selection and results
  const [selectedImage, setSelectedImage] = useState(null)
  const [pestResult, setPestResult] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState("")

  // Function to handle additional data fetching if required
  const fetchPestData = () => {
    console.log("Fetching pest-related data...")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pest Identification</Text>

      {/* Image Picker Component */}
      <ImagePickerComponent
        fetchWeatherData={fetchPestData}
        setDiseaseResult={setPestResult}
        setFertilizerRecommendation={setFertilizerRecommendation}
        setAlertMessage={setAlertMessage}
        setImage={setSelectedImage}
        theme="pest"
      />

      {/* Display Results */}
      {pestResult ? (
        <Text style={styles.resultText}>Pest: {pestResult}</Text>
      ) : null}
      {alertMessage ? (
        <Text style={styles.alertText}>{alertMessage}</Text>
      ) : null}
      {fertilizerRecommendation ? (
        <Text style={styles.recommendationText}>
          Fertilizer: {fertilizerRecommendation}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  resultText: {
    fontSize: 18,
    marginTop: 10,
    color: "#ff6347",
  },
  alertText: {
    fontSize: 16,
    color: "red",
    marginTop: 5,
  },
  recommendationText: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
  },
})

export default PestScreen
