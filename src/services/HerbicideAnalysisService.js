// services/soilAnalysisService.js
import axios from 'axios';

// Base URL configuration - change this based on your environment
const API_BASE_URL = 'http://192.168.8.147:8080'; // For Android Emulator
// const API_BASE_URL = 'http://localhost:8080'; // For iOS Simulator
// const API_BASE_URL = 'https://your-production-api.com'; // For Production

export const uploadHerbicideAnalysis = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/herbicide-analysis`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with an error
            throw new Error(error.response.data.message || 'Server error');
        } else if (error.request) {
            // No response received
            throw new Error('No response from server. Check your connection.');
        } else {
            // Request setup error
            throw new Error('Error setting up request');
        }
    }
};