import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const SoilTypeSelector = ({ selectedSoilType, onSelectSoilType }) => {
  const soilTypes = [
    { id: 'sandy', name: 'Sandy', description: 'Light, gritty texture with quick drainage' },
    { id: 'clay', name: 'Clay', description: 'Heavy, dense texture with slow drainage' },
    { id: 'loamy', name: 'Loamy', description: 'Well-balanced mix with good drainage' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Step 2: Select Soil Type</Text>
      
      <View style={styles.optionsContainer}>
        {soilTypes.map(soil => (
          <TouchableOpacity
            key={soil.id}
            style={[
              styles.soilOption,
              selectedSoilType === soil.id && styles.selectedOption
            ]}
            onPress={() => onSelectSoilType(soil.id)}
          >
            <View style={styles.soilContent}>
              <Text style={[
                styles.soilName,
                selectedSoilType === soil.id && styles.selectedText
              ]}>
                {soil.name}
              </Text>
              <Text style={styles.soilDescription}>{soil.description}</Text>
            </View>
            {selectedSoilType === soil.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  optionsContainer: {
    marginBottom: 8,
  },
  soilOption: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  soilContent: {
    flex: 1,
  },
  soilName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedText: {
    color: '#2196F3',
  },
  soilDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SoilTypeSelector;