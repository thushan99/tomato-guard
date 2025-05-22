import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ImageCapture = ({ capturedImage, setCapturedImage }) => {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [galleryPermission, setGalleryPermission] = useState(null);

    useEffect(() => {
        // Request permissions on component mount
        const requestPermissions = async () => {
            // Camera permission
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            setCameraPermission(cameraStatus.status === "granted");

            // Gallery permission
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setGalleryPermission(galleryStatus.status === "granted");
        };

        requestPermissions();
    }, []);

    // Take picture with camera using ImagePicker
    const takePicture = async () => {
        if (!cameraPermission) {
            Alert.alert("Permission required", "Camera permission is needed to take photos.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setCapturedImage(result.assets[0]);
        }
    };

    // Pick image from gallery
    const pickImage = async () => {
        if (!galleryPermission) {
            Alert.alert("Permission required", "Gallery permission is needed to select images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
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

            <View style={styles.imageContainer}>
                {capturedImage ? (
                    <>
                        <Image source={{ uri: capturedImage.uri }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={[styles.imageButton, styles.cancelButton]}
                            onPress={() => setCapturedImage(null)}
                        >
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16
    },
    imageContainer: {
        alignItems: "center"
    },
    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 16
    },
    placeholderContainer: {
        width: "100%",
        height: 200,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 16
    },
    placeholderText: {
        color: "#666",
        fontSize: 16
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    imageButton: {
        backgroundColor: "#2196F3",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        flex: 0.48,
        marginBottom:8
    },
    cancelButton: {
        backgroundColor: "#FF5722"
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold"
    }
});

export default ImageCapture;