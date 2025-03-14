import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../component/weedComponents/Header';
import ImageCapture from '../component/weedComponents/ImageCapture';
import SoilTypeSelector from '../component/weedComponents/SoilTypeSelector';
import GrowthStageSelector from '../component/weedComponents/GrowthStageSelector';
import DeviceConnection from '../component/weedComponents/DeviceConnection';
import SubmitButton from '../component/weedComponents/SubmitButton';

const WeedScreen = () => {
   
    const [capturedImage, setCapturedImage] = useState(null);
    const [soilType, setSoilType] = useState(null);
    const [growthStage, setGrowthStage] = useState(null);
    const [deviceData, setDeviceData] = useState({
      temperature: null,
      humidity: null,
      location: {
        latitude: null,
        longitude: null
      }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Handle submission to backend
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
        formData.append('temperature', deviceData.temperature);
        formData.append('humidity', deviceData.humidity);
        formData.append('latitude', deviceData.location.latitude);
        formData.append('longitude', deviceData.location.longitude);
        
        // Send to backend
        const response = await fetch('https://your-spring-boot-api.com/soil-analysis', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit data');
        }
        
        const result = await response.json();
        console.log('Submission result:', result);
        alert('Data submitted successfully!');

        // Navigate to HerbicideReportScreen with the result data
    navigation.navigate('HerbicideReportScreen', { reportData: result });
        
        // Reset form
        setCapturedImage(null);
        setSoilType(null);
        setGrowthStage(null);
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
      <Header title="Soil Analysis" subtitle="Capture and Analyze Soil Data" />
      
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
        
        {/* Step 4: Connect to device */}
        <DeviceConnection 
          onDeviceDataReceived={setDeviceData} 
          deviceData={deviceData}
        />
        
        {/* Step 5: Submit button */}
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