import React, { useState, useEffect } from "react"
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Alert,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const ImagePickerComponent = ({ setImage, identifyDisease, setLoading }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync()
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync()

      if (mediaLibraryStatus !== "granted" || cameraStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "You need to allow access to the camera and gallery to continue."
        )
      } else {
        setPermissionGranted(true)
      }
    })()
  }, [])

  const openCamera = async () => {
    setModalVisible(false)
    if (!permissionGranted) {
      Alert.alert(
        "Permission Required",
        "Please allow camera access in settings."
      )
      return
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const imageUri = result.assets[0].uri
      setImage(imageUri)
      identifyDisease(imageUri)
    }
  }

  const openGallery = async () => {
    setModalVisible(false)
    if (!permissionGranted) {
      Alert.alert(
        "Permission Required",
        "Please allow gallery access in settings."
      )
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const imageUri = result.assets[0].uri
      setImage(imageUri)
      identifyDisease(imageUri)
    }
  }

  return (
    <View style={styles.container}>
      {/* Capture Image Button */}
      <TouchableOpacity
        style={styles.button}
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
              <MaterialCommunityIcons name="camera" size={26} color="#4CAF50" />
              <Text style={styles.modalText}>Take a Photo</Text>
            </TouchableOpacity>

            {/* Choose from Gallery */}
            <TouchableOpacity style={styles.modalOption} onPress={openGallery}>
              <MaterialCommunityIcons name="image" size={26} color="#4CAF50" />
              <Text style={styles.modalText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {/* Close Modal */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#4CAF50",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: 320,
    alignItems: "center",
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
    backgroundColor: "#4CAF50",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ImagePickerComponent
