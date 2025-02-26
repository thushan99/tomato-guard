import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Modal,
    // TextInput,
    Platform,
    PermissionsAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import BluetoothSerial from 'react-native-bluetooth-serial';
// import WeedScreen from "./WeedScreen";

const WeedIdentificationScreen = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [image, setImage] = useState(null);
    const [showImageSelectionModal, setShowImageSelectionModal] = useState(false);
    const [showAdvancedSettingsModal, setShowAdvancedSettingsModal] = useState(false);

    // Location
    const [location, setLocation] = useState(null);

    // Form inputs
    const [soilType, setSoilType] = useState('loamy');
    const [growthStage, setGrowthStage] = useState('early');

    // IoT sensor data
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [connectingToIoT, setConnectingToIoT] = useState(false);
    const [iotConnected, setIotConnected] = useState(false);

    // Get location when component mounts
    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => console.log(error.code, error.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // Handle image capture from camera
    const handleCameraCapture = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                setImage(response.assets[0]);
                setShowImageSelectionModal(false);
            }
        });
    };

    // Handle image selection from gallery
    const handleGallerySelection = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImage(response.assets[0]);
                setShowImageSelectionModal(false);
            }
        });
    };

    // Connect to IoT device
    const connectToIoTDevice = async () => {
        setConnectingToIoT(true);

        try {
            // Check if Bluetooth is enabled
            const isEnabled = await BluetoothSerial.isEnabled();
            if (!isEnabled) {
                await BluetoothSerial.enable();
            }

            // Get list of paired devices
            const devices = await BluetoothSerial.list();

            // Find ESP32 device (you would match by a known name or address)
            const esp32Device = devices.find(device => device.name === 'ESP32-DHT11');

            if (esp32Device) {
                // Connect to the device
                await BluetoothSerial.connect(esp32Device.id);

                // Start listening for data
                BluetoothSerial.on('read', (data) => {
                    try {
                        const sensorData = JSON.parse(data);
                        setTemperature(sensorData.temperature);
                        setHumidity(sensorData.humidity);
                    } catch (error) {
                        console.log('Error parsing data:', error);
                    }
                });

                setIotConnected(true);
            } else {
                // Simulate connection for demo purposes (REMOVE IN PRODUCTION)
                setTimeout(() => {
                    setTemperature(27.5);
                    setHumidity(65.2);
                    setIotConnected(true);
                }, 1500);
            }
        } catch (error) {
            console.log('Error connecting to IoT device:', error);

            // Simulate connection for demo purposes (REMOVE IN PRODUCTION)
            setTimeout(() => {
                setTemperature(27.5);
                setHumidity(65.2);
                setIotConnected(true);
            }, 1500);
        } finally {
            setConnectingToIoT(false);
        }
    };

    // Reset all form data
    const resetIdentification = () => {
        setImage(null);
        setResults(null);
        setSoilType('loamy');
        setGrowthStage('early');
        // We don't reset temperature and humidity as they're from sensors
    };

    // Analyze weed based on image and metadata
    const analyzeWeed = () => {
        if (!image) return;

        setAnalyzing(true);

        // In a real app, you would upload the image and metadata to your API
        // const formData = new FormData();
        // formData.append('image', {
        //     uri: image.uri,
        //     type: image.type,
        //     name: image.fileName
        // });
        // formData.append('soilType', soilType);
        // formData.append('growthStage', growthStage);
        // formData.append('temperature', temperature);
        // formData.append('humidity', humidity);
        // if (location) {
        //     formData.append('latitude', location.latitude);
        //     formData.append('longitude', location.longitude);
        // }

        // Simulate API call delay
        setTimeout(() => {
            setAnalyzing(false);
            setResults({
                weed_name: "Black Nightshade",
                herbicide_options: [
                    {
                        name: "Glyphosate",
                        application_rate: "2.5 L/ha",
                        safe_for_tomato: false,
                        mode_of_action: "Systemic",
                        application_method: "Spray",
                        conditions: {
                            growth_stage: "Early",
                            soil_type: ["Loamy"],
                            weather_constraints: "Low wind, no rain"
                        },
                        resistance_reported: true,
                        alternative: "Glufosinate"
                    },
                    {
                        name: "Pendimethalin",
                        application_rate: "3.3 L/ha",
                        safe_for_tomato: true,
                        mode_of_action: "Pre-emergence",
                        application_method: "Soil incorporation",
                        conditions: {
                            growth_stage: "Early",
                            soil_type: ["Loamy", "Clay"],
                            weather_constraints: "Irrigate after application"
                        },
                        resistance_reported: false,
                        alternative: null
                    }
                ],
                safety_precautions: {
                    toxicity: "High",
                    human_protection: "Wear gloves and mask",
                    environmental_precautions: "Avoid near water bodies"
                }
            });
        }, 2000);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Weed Identification</Text>
                <Text style={styles.headerSubtitle}>Identify and treat unwanted plants</Text>
            </View>

            <View style={styles.content}>
                {/* Image Section */}
                <View style={styles.imageSection}>
                    {image ? (
                        <View style={styles.capturedImageContainer}>
                            <Image
                                source={{ uri: image.uri }}
                                style={styles.capturedImage}
                            />
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetIdentification}
                            >
                                <Icon name="refresh" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Icon name="image-remove" size={60} color="#e0e0e0" />
                            <Text style={styles.placeholderText}>No weed image captured</Text>
                        </View>
                    )}
                </View>

                {/* Input Parameters Section */}
                <View style={styles.parametersContainer}>
                    <Text style={styles.sectionTitle}>Parameters</Text>

                    <View style={styles.parameterRow}>
                        <View style={styles.parameterItem}>
                            <Text style={styles.parameterLabel}>Soil Type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={soilType}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setSoilType(itemValue)}
                                >
                                    <Picker.Item label="Sandy" value="sandy" />
                                    <Picker.Item label="Loamy" value="loamy" />
                                    <Picker.Item label="Clay" value="clay" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.parameterItem}>
                            <Text style={styles.parameterLabel}>Growth Stage</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={growthStage}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setGrowthStage(itemValue)}
                                >
                                    <Picker.Item label="Early" value="early" />
                                    <Picker.Item label="Mature" value="mature" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* IoT Sensor Data */}
                    <View style={styles.iotContainer}>
                        <View style={styles.iotHeader}>
                            <Text style={styles.iotTitle}>Environmental Data</Text>
                            {!iotConnected && (
                                <TouchableOpacity
                                    style={styles.connectButton}
                                    onPress={connectToIoTDevice}
                                    disabled={connectingToIoT}
                                >
                                    {connectingToIoT ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.connectButtonText}>Connect to Sensor</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.sensorReadings}>
                            <View style={styles.sensorReading}>
                                <Icon name="thermometer" size={24} color="#FF9800" />
                                <Text style={styles.sensorLabel}>Temperature</Text>
                                <Text style={styles.sensorValue}>
                                    {temperature ? `${temperature}°C` : '--'}
                                </Text>
                            </View>

                            <View style={styles.sensorReading}>
                                <Icon name="water-percent" size={24} color="#2196F3" />
                                <Text style={styles.sensorLabel}>Humidity</Text>
                                <Text style={styles.sensorValue}>
                                    {humidity ? `${humidity}%` : '--'}
                                </Text>
                            </View>

                            <View style={styles.sensorReading}>
                                <Icon name="map-marker" size={24} color="#4CAF50" />
                                <Text style={styles.sensorLabel}>Location</Text>
                                <Text style={styles.sensorValue}>
                                    {location ? `Captured` : '--'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cameraButton]}
                        onPress={() => setShowImageSelectionModal(true)}
                    >
                        <Icon name="camera" size={28} color="#fff" />
                        <Text style={styles.actionButtonText}>Capture Weed</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.analyzeButton,
                            (!image || analyzing) && styles.disabledButton
                        ]}
                        disabled={!image || analyzing}
                        onPress={analyzeWeed}
                    >
                        {analyzing ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Icon name="leaf-maple" size={28} color="#fff" />
                        )}
                        <Text style={styles.actionButtonText}>
                            {analyzing ? 'Analyzing...' : 'Identify Weed'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Results Section */}
                {results && (
                    <View style={styles.resultsContainer}>
                        <View style={styles.resultHeader}>
                            <View style={styles.resultHeaderContent}>
                                <Text style={styles.resultTitle}>{results.weed_name}</Text>
                            </View>
                        </View>

                        {/* Herbicide Options */}
                        <View style={styles.resultSection}>
                            <Text style={styles.sectionTitle}>Recommended Herbicides</Text>
                            {results.herbicide_options.map((herbicide, index) => (
                                <View key={index} style={styles.herbicideItem}>
                                    <View style={styles.herbicideHeader}>
                                        <Text style={styles.herbicideName}>{herbicide.name}</Text>
                                        <View style={[
                                            styles.safetyBadge,
                                            herbicide.safe_for_tomato ?
                                                styles.safeBadge : styles.unsafeBadge
                                        ]}>
                                            <Text style={styles.safetyText}>
                                                {herbicide.safe_for_tomato ?
                                                    'Tomato Safe' : 'Not Tomato Safe'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.herbicideDetails}>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Application Rate:</Text>
                                            <Text style={styles.detailValue}>{herbicide.application_rate}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Mode of Action:</Text>
                                            <Text style={styles.detailValue}>{herbicide.mode_of_action}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Method:</Text>
                                            <Text style={styles.detailValue}>{herbicide.application_method}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Suitable for:</Text>
                                            <Text style={styles.detailValue}>
                                                {herbicide.conditions.growth_stage} Growth,
                                                {herbicide.conditions.soil_type.join('/')} Soil
                                            </Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Constraints:</Text>
                                            <Text style={styles.detailValue}>{herbicide.conditions.weather_constraints}</Text>
                                        </View>

                                        {herbicide.resistance_reported && (
                                            <View style={styles.resistanceWarning}>
                                                <Icon name="alert" size={18} color="#FFC107" />
                                                <Text style={styles.resistanceText}>
                                                    Resistance reported. Consider {herbicide.alternative} as alternative.
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Safety Precautions */}
                        <View style={styles.resultSection}>
                            <Text style={styles.sectionTitle}>Safety Precautions</Text>
                            <View style={styles.safetyContainer}>
                                <View style={styles.safetyHeader}>
                                    <Icon name="alert-octagon" size={24} color="#e53935" />
                                    <Text style={styles.safetyTitle}>
                                        {results.safety_precautions.toxicity} Toxicity Level
                                    </Text>
                                </View>

                                <View style={styles.safetyDetail}>
                                    <Icon name="account-alert" size={20} color="#757575" />
                                    <Text style={styles.safetyText}>
                                        {results.safety_precautions.human_protection}
                                    </Text>
                                </View>

                                <View style={styles.safetyDetail}>
                                    <Icon name="nature" size={20} color="#757575" />
                                    <Text style={styles.safetyText}>
                                        {results.safety_precautions.environmental_precautions}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.saveReportButton}>
                            <Icon name="content-save" size={18} color="#fff" />
                            <Text style={styles.saveReportButtonText}>Save to Reports</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Image Selection Modal */}
            <Modal
                visible={showImageSelectionModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowImageSelectionModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Capture Weed Image</Text>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleCameraCapture}
                        >
                            <Icon name="camera" size={28} color="#4CAF50" />
                            <Text style={styles.modalOptionText}>Take a Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleGallerySelection}
                        >
                            <Icon name="image-album" size={28} color="#2196F3" />
                            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowImageSelectionModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#4CAF50',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    content: {
        padding: 20,
    },
    imageSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9e9e9e',
    },
    capturedImageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    capturedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    resetButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    parametersContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    parameterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    parameterItem: {
        flex: 1,
        marginHorizontal: 4,
    },
    parameterLabel: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    iotContainer: {
        marginTop: 8,
    },
    iotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    iotTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    connectButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    connectButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sensorReadings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    sensorReading: {
        alignItems: 'center',
        flex: 1,
    },
    sensorLabel: {
        fontSize: 12,
        color: '#757575',
        marginTop: 4,
    },
    sensorValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        flex: 0.48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cameraButton: {
        backgroundColor: '#e53935',
    },
    analyzeButton: {
        backgroundColor: '#4CAF50',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    resultsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 16,
    },
    resultHeaderContent: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    resultSection: {
        marginBottom: 16,
    },
    herbicideItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    herbicideHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        paddingBottom: 8,
    },
    herbicideName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    safetyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    safeBadge: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#66bb6a',
    },
    unsafeBadge: {
        backgroundColor: '#ffebee',
        borderWidth: 1,
        borderColor: '#ef5350',
    },
    // safetyText: {
    //     fontSize: 12,
    //     fontWeight: 'bold',
    // },
    herbicideDetails: {
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    detailLabel: {
        flex: 0.4,
        fontSize: 14,
        color: '#757575',
    },
    detailValue: {
        flex: 0.6,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    resistanceWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff8e1',
        borderWidth: 1,
        borderColor: '#FFB300',
        borderRadius: 4,
        padding: 8,
        marginTop: 8,
    },
    resistanceText: {
        fontSize: 12,
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    safetyContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    safetyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        paddingBottom: 8,
    },
    safetyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    safetyDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    safetyText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    saveReportButton: {
        backgroundColor: '#2196F3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    saveReportButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default WeedIdentificationScreen;