import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

const ImageCapture = ({ capturedImage, setCapturedImage }) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null); // ✅ Use a ref instead of state

  // Request permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraStatus === "granted");

    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(galleryStatus === "granted");

    return { camera: cameraStatus === "granted", gallery: galleryStatus === "granted" };
  };

  // Take picture with camera
  const takePicture = async () => {
    const { camera: hasCamera } = await requestPermissions();

    if (!hasCamera) {
      Alert.alert("Permission required", "Camera permission is required to take pictures");
      return;
    }

    setShowCamera(true);
  };

  // Handle actual picture taking
  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setShowCamera(false);
      setCapturedImage(photo);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const { gallery: hasGallery } = await requestPermissions();

    if (!hasGallery) {
      Alert.alert("Permission required", "Gallery permission is required to select images");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Step 1: Capture or Select Image</Text>

      {showCamera ? (
        <View style={styles.cameraContainer}>
          <Camera ref={cameraRef} style={styles.camera} type={CameraType.back} ratio="4:3" />
          <View style={styles.cameraButtons}>
            <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.captureButton, styles.cancelButton]} onPress={() => setShowCamera(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          {capturedImage ? (
            <>
              <Image source={{ uri: capturedImage.uri }} style={styles.imagePreview} />
              <TouchableOpacity style={[styles.imageButton, styles.cancelButton]} onPress={() => setCapturedImage(null)}>
                <Text style={styles.buttonText}>Remove Image</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
              <Text style={styles.buttonText}>Capture Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Select from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white", borderRadius: 8, padding: 16, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  imageContainer: { alignItems: "center" },
  imagePreview: { width: "100%", height: 200, borderRadius: 8, marginBottom: 16 },
  placeholderContainer: { width: "100%", height: 200, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center", borderRadius: 8, marginBottom: 16 },
  placeholderText: { color: "#666", fontSize: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  imageButton: { backgroundColor: "#2196F3", padding: 12, borderRadius: 8, alignItems: "center", flex: 0.48 },
  cancelButton: { backgroundColor: "#FF5722" },
  buttonText: { color: "white", fontSize: 14, fontWeight: "bold" },
  cameraContainer: { width: "100%", height: 300, marginBottom: 16 },
  camera: { flex: 1 },
  cameraButtons: { flexDirection: "row", justifyContent: "space-between", padding: 8 },
  captureButton: { backgroundColor: "#2196F3", padding: 12, borderRadius: 8, alignItems: "center", flex: 0.48 },
});

export default ImageCapture;
