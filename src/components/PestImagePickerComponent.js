import React, { useState, useEffect } from "react"
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const PestImagePickerComponent = ({
  setImage,
  identifyPest,
  captureFromIoT,
}) => {
  const [imageUri, setImageUri] = useState(null)
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

  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setImageUri(uri)
      setImage(uri)
      identifyPest(uri)
    }
  }

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setImageUri(uri)
      setImage(uri)
      identifyPest(uri)
    }
  }

  return (
    <View style={styles.container}>
      {/* Image Frame */}
      <View style={styles.imageFrame}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={openGallery}>
            <MaterialCommunityIcons
              name="image-plus"
              size={40}
              color="#FF9800"
            />
            <Text style={styles.uploadText}>Upload from Gallery</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Separator */}
      <Text style={styles.separator}>------- or -------</Text>

      {/* Capture Image Button */}
      <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
        <MaterialCommunityIcons
          name="camera"
          size={24}
          color="white"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Capture Image</Text>
      </TouchableOpacity>

      {/* Capture from IoT Button */}
      <TouchableOpacity
        style={styles.captureIoTButton}
        onPress={captureFromIoT}
      >
        <MaterialCommunityIcons
          name="chip"
          size={24}
          color="white"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Capture from IoT</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imageFrame: {
    width: 350,
    height: 250,
    borderWidth: 2,
    borderColor: "#FF9800",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 16,
    color: "#FF9800",
    marginTop: 5,
  },
  separator: {
    marginVertical: 10,
    fontSize: 30,
    fontWeight: "bold",
    color: "#777",
  },
  captureButton: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    width: 350,
    marginBottom: 10,
  },
  captureIoTButton: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00796B",
    width: 350,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default PestImagePickerComponent
