import React from "react"
import { View, Text, StyleSheet } from "react-native"

const DiseaseResultComponent = ({
  diseaseResult,
  alertMessage,
  fertilizerRecommendation,
}) => {
  if (!diseaseResult) {
    return <Text style={styles.infoText}>No results available</Text>
  }

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Disease: {diseaseResult}</Text>
      <Text style={styles.resultText}>Alert: {alertMessage}</Text>
      <Text style={styles.resultText}>
        Fertilizer: {fertilizerRecommendation}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  infoText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
})

export default DiseaseResultComponent
