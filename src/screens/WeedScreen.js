import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ImageCapture from '../components/weedComponents/ImageCapture';
import SoilTypeSelector from '../components/weedComponents/SoilTypeSelector';
import GrowthStageSelector from '../components/weedComponents/GrowthStageSelector';
import DeviceConnection from '../components/weedComponents/DeviceConnection';
import ModelSelector from '../components/weedComponents/ModelSelector';
import SubmitButton from '../components/weedComponents/SubmitButton';
import { uploadHerbicideAnalysis } from '../services/HerbicideAnalysisService';

const WeedScreen = ({ navigation }) => {  // Add the navigation prop here

  const [capturedImage, setCapturedImage] = useState(null);
  const [soilType, setSoilType] = useState(null);
  const [growthStage, setGrowthStage] = useState(null);
  const [useNewModel, setUseNewModel] = useState(true); // Default to YOLOv8x (true)
  const [deviceData, setDeviceData] = useState({
    temperature: null,
    humidity: null,
    location: {
      latitude: null,
      longitude: null
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

// In your handleSubmit function, replace the navigation part with this:

  const handleSubmit = async () => {
    if (!capturedImage) {
      alert('Please capture or select an image first');
      return;
    }
    if (!soilType) {
      alert('Please select a soil type');
      return;
    }
    if (!growthStage) {
      alert('Please select a growth stage');
      return;
    }
    if (!deviceData.temperature || !deviceData.humidity) {
      alert('Please connect to a device to get temperature and humidity data');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const formData = new FormData();
      formData.append('image', {
        uri: capturedImage.uri,
        type: 'image/jpeg',
        name: 'soil_image.jpg'
      });
      formData.append('soilType', soilType);
      formData.append('growthStage', growthStage);
      formData.append('useNewModel', useNewModel.toString());
      formData.append('temperature', deviceData.temperature.toString());
      formData.append('humidity', deviceData.humidity.toString());
      if (deviceData.location.latitude) {
        formData.append('latitude', deviceData.location.latitude.toString());
      }
      if (deviceData.location.longitude) {
        formData.append('longitude', deviceData.location.longitude.toString());
      }

      // Use the service instead of fetch
      const result = await uploadHerbicideAnalysis(formData);

      console.log('Submission result:', result);
      alert('Data submitted successfully!');

      // FIXED: Add the captured image URI to the result before navigation
      const reportDataWithImage = {
        ...result,
        capturedImageUri: capturedImage.uri, // Add the original image URI
        originalImageDimensions: {
          width: capturedImage.width || 1920,
          height: capturedImage.height || 1080
        }
      };

      // Navigate with the enhanced result
      navigation.navigate('HerbicideReportScreen', {
        reportData: reportDataWithImage
      });

      // Reset form
      setCapturedImage(null);
      setSoilType(null);
      setGrowthStage(null);
      setUseNewModel(true);
      setDeviceData({
        temperature: null,
        humidity: null,
        location: {
          latitude: null,
          longitude: null
        }
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      alert(`Submission error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Capture or select image */}
          <ImageCapture
              capturedImage={capturedImage}
              setCapturedImage={setCapturedImage}
          />

          {/* Step 2: Select soil type */}
          <SoilTypeSelector
              selectedSoilType={soilType}
              onSelectSoilType={setSoilType}
          />

          {/* Step 3: Select growth stage */}
          <GrowthStageSelector
              selectedGrowthStage={growthStage}
              onSelectGrowthStage={setGrowthStage}
          />

          {/* Step 4: Select AI Model */}
          <ModelSelector
              useNewModel={useNewModel}
              onModelChange={setUseNewModel}
          />

          {/* Step 5: Connect to device */}
          <DeviceConnection
              onDeviceDataReceived={setDeviceData}
              deviceData={deviceData}
          />

          {/* Step 6: Submit button */}
          <View style={styles.submitButtonContainer}>
            <SubmitButton
                title="Submit Analysis"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                disabled={!capturedImage || !soilType || !growthStage || !deviceData.temperature}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32, // Extra padding at the bottom for better scrolling
  },
  submitButtonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
});

export default WeedScreen;