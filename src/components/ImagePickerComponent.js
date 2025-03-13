import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import axios from "axios"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const ImagePickerComponent = ({
  fetchWeatherData,
  setDiseaseResult,
  setFertilizerRecommendation,
  setAlertMessage,
  setImage,
  theme = "disease", // Default to disease theme
}) => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false) // State for modal visibility

  // Define color themes
  const colors =
    theme === "pest"
      ? { primary: "#FF9800", dark: "#F57C00", modalIcon: "#FF9800" }
      : { primary: "#4CAF50", dark: "#388E3C", modalIcon: "#4CAF50" } // Default is disease theme

  const openCamera = async () => {
    setModalVisible(false) // Close modal before opening camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      fetchWeatherData()
      identifyDisease(result.assets[0].uri)
    }
  }

  const openGallery = async () => {
    setModalVisible(false) // Close modal before opening gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      fetchWeatherData()
      identifyDisease(result.assets[0].uri)
    }
  }

  const identifyDisease = async imageUri => {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    })

    try {
      const response = await axios.post(
        "http://your-backend-api/disease-identification",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      setDiseaseResult(response.data.disease)
      setAlertMessage(response.data.alert)
      setFertilizerRecommendation(response.data.fertilizer)
    } catch (error) {
      console.error("Error identifying disease:", error)
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      {/* Capture Image Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons
          name="camera"
          size={24}
          color="white"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Capture Image</Text>
      </TouchableOpacity>

      {/* Modal for Image Selection */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Capture Image</Text>

            {/* Take a Photo */}
            <TouchableOpacity style={styles.modalOption} onPress={openCamera}>
              <MaterialCommunityIcons
                name="camera"
                size={26}
                color={colors.modalIcon}
              />
              <Text style={[styles.modalText, { color: colors.dark }]}>
                Take a Photo
              </Text>
            </TouchableOpacity>

            {/* Choose from Gallery */}
            <TouchableOpacity style={styles.modalOption} onPress={openGallery}>
              <MaterialCommunityIcons
                name="image"
                size={26}
                color={colors.modalIcon}
              />
              <Text style={[styles.modalText, { color: colors.dark }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            {/* Close Modal */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.dark }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading && <ActivityIndicator size="large" color={colors.primary} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: 320,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalText: {
    fontSize: 18,
    marginLeft: 15,
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ImagePickerComponent
