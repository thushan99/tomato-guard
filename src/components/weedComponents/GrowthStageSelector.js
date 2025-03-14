import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const GrowthStageSelector = ({ selectedGrowthStage, onSelectGrowthStage }) => {
  const growthStages = [
    { id: 'early', name: 'Early', description: 'Plant is in its early stage of growth' },
    { id: 'mature', name: 'Mature', description: 'Plant has reached maturity' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Step 3: Select Growth Stage</Text>
      
      <View style={styles.stageButtons}>
        {growthStages.map(stage => (
          <TouchableOpacity
            key={stage.id}
            style={[
              styles.stageButton,
              selectedGrowthStage === stage.id && styles.selectedStage
            ]}
            onPress={() => onSelectGrowthStage(stage.id)}
          >
            <Text style={[
              styles.stageName,
              selectedGrowthStage === stage.id && styles.selectedStageText
            ]}>
              {stage.name}
            </Text>
            <Text style={styles.stageDescription}>{stage.description}</Text>
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
  stageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageButton: {
    flex: 0.48,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedStage: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  stageName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedStageText: {
    color: '#2196F3',
  },
  stageDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default GrowthStageSelector;