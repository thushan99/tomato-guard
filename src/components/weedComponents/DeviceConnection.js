import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';

const DeviceConnection = ({ onDeviceDataReceived, deviceData }) => {
  const [showModal, setShowModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Get network info
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkInfo(state);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Check location permissions and get location
  useEffect(() => {
    if (showModal) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          return;
        }

        try {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        } catch (error) {
          setLocationError(`Error getting location: ${error.message}`);
        }
      })();
    }
  }, [showModal]);

  // Scan for ESP32 devices on the network
  const scanForDevices = async () => {
    if (isScanning) return;
    
    try {
      setIsScanning(true);
      setDevices([]);
      
      // Check if we're on WiFi
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected || netInfo.type !== 'wifi') {
        Alert.alert('WiFi Required', 'Please connect to a WiFi network to scan for devices.');
        setIsScanning(false);
        return;
      }
      
      // Get the local IP address parts
      const ipParts = netInfo.details.ipAddress.split('.');
      const baseIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
      
      console.log(`Scanning network: ${baseIP}.0/24`);
      
      // Array to collect promises for all the scan attempts
      const scanPromises = [];
      const discoveredDevices = [];
      
      // Try direct connection to the ESP32
      try {
        console.log("Trying direct connection to 192.168.8.2");
        const directResponse = await fetch('http://192.168.8.2/api/info', { timeout: 2000 });
        const directData = await directResponse.json();
        console.log("Direct connection successful:", directData);
        discoveredDevices.push({
          hostname: directData.hostname,
          ip: directData.ip,
          deviceType: directData.device_type,
          rssi: directData.rssi,
          mac: directData.mac
        });
      } catch (error) {
        console.log("Direct connection failed:", error.message);
      }
      
      // Try mDNS hostnames
      const hostnames = [
        'esp32-dht11.local',
        'esp32-sensor.local',
        'esp-dht11.local'
      ];
      
      for (const hostname of hostnames) {
        console.log(`Trying hostname: ${hostname}`);
        scanPromises.push(
          fetch(`http://${hostname}/api/info`, { timeout: 2000 })
            .then(response => response.json())
            .then(data => {
              console.log(`Found device at ${hostname}:`, data);
              discoveredDevices.push({
                hostname: data.hostname,
                ip: data.ip,
                deviceType: data.device_type,
                rssi: data.rssi,
                mac: data.mac
              });
            })
            .catch(error => {
              console.log(`Error with ${hostname}:`, error.message);
            })
        );
      }
      
      // Scan IP range
      for (let i = 1; i <= 40; i++) { // Reduced scan range for better performance
        const ip = `${baseIP}.${i}`;
        
        scanPromises.push(
          fetch(`http://${ip}/api/info`, { timeout: 1000 })
            .then(response => response.json())
            .then(data => {
              console.log(`Found device at ${ip}:`, data);
              discoveredDevices.push({
                hostname: data.hostname,
                ip: data.ip,
                deviceType: data.device_type,
                rssi: data.rssi,
                mac: data.mac
              });
            })
            .catch(() => {
              // Ignore errors for IPs that don't respond
            })
        );
      }
      
      // Wait for all scan attempts to complete (with a timeout)
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 8000));
      await Promise.race([Promise.all(scanPromises), timeoutPromise]);
      
      // Remove duplicates (by IP address)
      const uniqueDevices = Array.from(
        new Map(discoveredDevices.map(device => [device.ip, device])).values()
      );
      
      setDevices(uniqueDevices);
      console.log(`Found ${uniqueDevices.length} devices`);
    } catch (error) {
      console.log('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Connect to a selected device
  const connectToDevice = async (device) => {
    try {
      // Fetch sensor data
      const sensorResponse = await fetch(`http://${device.ip}/api/sensor`);
      if (!sensorResponse.ok) {
        throw new Error(`HTTP error! Status: ${sensorResponse.status}`);
      }
      const sensorData = await sensorResponse.json();
      
      // Set device data including current location
      onDeviceDataReceived({
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        location: {
          latitude: location?.coords.latitude || null,
          longitude: location?.coords.longitude || null
        }
      });
      
      setSelectedDevice(device);
      setShowModal(false);
      
      Alert.alert('Connected', `Successfully connected to ${device.hostname || 'ESP32 Device'}`);
    } catch (error) {
      console.log('Connection error:', error);
      Alert.alert('Connection Error', 'Failed to connect to the ESP32 device.');
    }
  };

  // Signal strength indicator
  const getSignalStrength = (rssi) => {
    if (!rssi) return 'Unknown';
    if (rssi >= -50) return 'Excellent';
    if (rssi >= -60) return 'Good';
    if (rssi >= -70) return 'Fair';
    return 'Poor';
  };

  // Render device item in the list
  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <View style={styles.deviceItemContent}>
        <View style={styles.deviceIcon}>
          <Text style={styles.deviceIconText}>ESP</Text>
        </View>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.hostname || 'ESP32 Device'}</Text>
          <Text style={styles.deviceIp}>{item.ip}</Text>
          <Text style={styles.deviceType}>{item.deviceType || 'Unknown Type'}</Text>
        </View>
        <View style={styles.deviceSignal}>
          <Text style={styles.signalText}>{getSignalStrength(item.rssi)}</Text>
          <Text style={styles.signalValue}>{item.rssi} dBm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Step 4: Connect to Device</Text>
      
      {deviceData.temperature && deviceData.humidity ? (
        <View style={styles.connectedData}>
          <View style={styles.sensorContainer}>
            <View style={styles.sensorCard}>
              <Text style={styles.sensorLabel}>Temperature</Text>
              <Text style={styles.sensorValue}>{deviceData.temperature}°C</Text>
            </View>
            
            <View style={styles.sensorCard}>
              <Text style={styles.sensorLabel}>Humidity</Text>
              <Text style={styles.sensorValue}>{deviceData.humidity}%</Text>
            </View>
          </View>
          
          <View style={styles.locationData}>
            <Text style={styles.locationLabel}>Location:</Text>
            {deviceData.location.latitude && deviceData.location.longitude ? (
              <Text style={styles.locationValue}>
                {deviceData.location.latitude.toFixed(6)}, {deviceData.location.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text style={styles.locationValue}>Location data not available</Text>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.reconnectButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.buttonText}>Reconnect Device</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.connectButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buttonText}>Connect to Device</Text>
        </TouchableOpacity>
      )}

      {/* Device Connection Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Connect to Sensor Device</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.networkInfo}>
            <Text style={styles.networkText}>
              WiFi: {networkInfo?.details?.ssid || 'Unknown'}
            </Text>
            <Text style={styles.networkSubtext}>
              IP: {networkInfo?.details?.ipAddress || 'Unknown'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.scanButton}
            onPress={scanForDevices}
            disabled={isScanning}
          >
            <Text style={styles.buttonText}>
              {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </Text>
          </TouchableOpacity>
          
          {isScanning && (
            <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
          )}
          
          <Text style={styles.deviceListTitle}>
            {devices.length > 0 
              ? `Found ${devices.length} device${devices.length === 1 ? '' : 's'}`
              : isScanning 
                ? 'Looking for devices...' 
                : 'No devices found'}
          </Text>
          
          <FlatList
            data={devices}
            renderItem={renderDeviceItem}
            keyExtractor={(item) => item.ip}
            style={styles.deviceList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reconnectButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedData: {
    marginBottom: 8,
  },
  sensorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sensorCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    flex: 0.48,
    alignItems: 'center',
  },
  sensorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  locationData: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationValue: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  networkInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  networkText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  networkSubtext: {
    fontSize: 14,
    color: '#666',
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 16,
  },
  deviceListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  deviceItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIconText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceIp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  deviceType: {
    fontSize: 14,
    color: '#888',
  },
  deviceSignal: {
    alignItems: 'flex-end',
  },
  signalText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  signalValue: {
    fontSize: 12,
    color: '#666',
  }
});

export default DeviceConnection;