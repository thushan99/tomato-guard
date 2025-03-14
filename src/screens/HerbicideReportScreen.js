import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const HerbicideReportScreen = ({ route, navigation }) => {
  // In a real app, this would come from route.params or API call
  // For this example, we're using the sample data provided
  const reportData = {
    weed_name: "Black Nightshade",
    herbicide_options: [
      {
        "herbicide name": "Glyphosate",
        "herbicide application_rate": "2.5 L/ha",
        "herbicide safe_for_tomato": false,
        "herbicide mode_of_action": "Systemic",
        "herbicide application_method": "Spray",
        "growth_stage": "Early",
        "soil_type": "Loamy",
        "weather_constraints": "Low wind, no rain",
        "herbicide resistance_reported": true,
        "alternative herbicide": "Glufosinate"
      }
    ],
    safety_precautions: {
      toxicity: "High",
      human_protection: "Wear gloves and mask",
      environmental_precautions: "Avoid near water bodies"
    }
  };

  const handleShare = () => {
    // Share functionality would be implemented here
    alert('Share functionality will be implemented here');
  };

  const handleSave = () => {
    // Save to database functionality would be implemented here
    alert('Report saved successfully!');
  };

  const renderSafetyLevel = (level) => {
    const getColor = () => {
      switch (level.toLowerCase()) {
        case 'high':
          return '#FF5252';
        case 'medium':
          return '#FFC107';
        case 'low':
          return '#4CAF50';
        default:
          return '#9E9E9E';
      }
    };

    return (
      <View style={[styles.safetyBadge, { backgroundColor: getColor() }]}>
        <Text style={styles.safetyText}>{level} Risk</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Herbicide Report</Text>
        <TouchableOpacity onPress={handleShare}>
          <Feather name="share-2" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Weed Identification Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weed Identification</Text>
          </View>
          <View style={styles.weedInfoContainer}>
            <View style={styles.weedImageContainer}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/150' }} 
                style={styles.weedImage} 
              />
            </View>
            <View style={styles.weedDetails}>
              <Text style={styles.weedName}>{reportData.weed_name}</Text>
              <View style={styles.detailRow}>
                <Feather name="map-pin" size={16} color="#666" />
                <Text style={styles.detailText}>Loamy Soil</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="sprout" size={16} color="#666" />
                <Text style={styles.detailText}>Early Growth Stage</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="thermometer" size={16} color="#666" />
                <Text style={styles.detailText}>24°C, 65% Humidity</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Herbicide Recommendations Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recommended Herbicide</Text>
          </View>
          
          {reportData.herbicide_options.map((option, index) => (
            <View key={index} style={styles.herbicideContainer}>
              <View style={styles.herbicideHeader}>
                <Text style={styles.herbicideName}>{option["herbicide name"]}</Text>
                {!option["herbicide safe_for_tomato"] && (
                  <View style={styles.warningBadge}>
                    <Text style={styles.warningText}>Not Safe for Tomato</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Application Rate</Text>
                  <Text style={styles.infoValue}>{option["herbicide application_rate"]}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mode of Action</Text>
                  <Text style={styles.infoValue}>{option["herbicide mode_of_action"]}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Method</Text>
                  <Text style={styles.infoValue}>{option["herbicide application_method"]}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Weather</Text>
                  <Text style={styles.infoValue}>{option["weather_constraints"]}</Text>
                </View>
              </View>
              
              {option["herbicide resistance_reported"] && (
                <View style={styles.resistanceWarning}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color="#F57C00" />
                  <Text style={styles.resistanceText}>
                    Resistance reported. Consider alternative: {option["alternative herbicide"]}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Safety Precautions Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Safety Precautions</Text>
            {renderSafetyLevel(reportData.safety_precautions.toxicity)}
          </View>
          
          <View style={styles.safetyContainer}>
            <View style={styles.safetyItem}>
              <MaterialCommunityIcons name="account-alert" size={22} color="#555" />
              <View style={styles.safetyContent}>
                <Text style={styles.safetyLabel}>Human Protection</Text>
                <Text style={styles.safetyValue}>{reportData.safety_precautions.human_protection}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.safetyItem}>
              <MaterialCommunityIcons name="pine-tree" size={22} color="#555" />
              <View style={styles.safetyContent}>
                <Text style={styles.safetyLabel}>Environmental Precautions</Text>
                <Text style={styles.safetyValue}>{reportData.safety_precautions.environmental_precautions}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weedInfoContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  weedImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  weedImage: {
    width: '100%',
    height: '100%',
  },
  weedDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  weedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  herbicideContainer: {
    padding: 16,
  },
  herbicideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  herbicideName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  warningBadge: {
    backgroundColor: '#FFECB3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warningText: {
    color: '#F57C00',
    fontSize: 12,
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItem: {
    width: '50%',
    padding: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  resistanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  resistanceText: {
    marginLeft: 8,
    color: '#F57C00',
    flex: 1,
    fontSize: 13,
  },
  safetyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  safetyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  safetyContainer: {
    padding: 16,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  safetyContent: {
    marginLeft: 12,
    flex: 1,
  },
  safetyLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    marginBottom: 4,
  },
  safetyValue: {
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HerbicideReportScreen;