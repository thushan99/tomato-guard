import React, { useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Text,
} from "react-native"
import axios from "axios"

import PestImagePickerComponent from "../components/PestImagePickerComponent"

const PestScreen = () => {
  const [pestResult, setPestResult] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState(null)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to identify pests from the uploaded image
  const identifyPest = async imageUri => {
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
        "http://192.168.8.123:5000/predict_pest",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      if (response.data) {
        setPestResult(response.data.predicted_pest)
        setFertilizerRecommendation(response.data.fertilizer)
        setAlertMessage(response.data.alert)
      } else {
        setError("No data returned from backend.")
      }
    } catch (err) {
      console.error("Error identifying pest:", err)
      setError("Error identifying pest. Please try again.")
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title with Waving Hand Emoji */}
        <Text style={styles.title}>
          👋 Hey Farmer, Shield Your Crops with Smart Detection!
        </Text>

        {/* Image Picker Component */}
        <PestImagePickerComponent
          setPestResult={setPestResult}
          setFertilizerRecommendation={setFertilizerRecommendation}
          setAlertMessage={setAlertMessage}
          setImage={setImage}
          identifyPest={identifyPest}
        />

        {/* Show Loading Indicator while Identifying Pest */}
        {loading ? (
          <ActivityIndicator size="large" color="#FF9800" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          pestResult && (
            <PestResultComponent
              pestResult={pestResult}
              alertMessage={alertMessage}
              fertilizerRecommendation={fertilizerRecommendation}
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF9800",
  },
  lottie: {
    width: 450,
    height: 550,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
})

export default PestScreen;
