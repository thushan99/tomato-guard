import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5" // Changed to FontAwesome5

const DiseaseResultComponent = ({
  diseaseResult,
  alertMessage,
  fertilizerRecommendation,
  dosage,
}) => {
  if (!diseaseResult) return null

  return (
    <View style={styles.resultContainer}>
      {/* Disease Name */}
      <View style={styles.row}>
        <Icon name="seedling" size={28} color="#388E3C" />
        <Text style={[styles.resultText, styles.diseaseText]}>
          Disease: {diseaseResult}
        </Text>
      </View>

      {/* Fertilizer Recommendation */}
      {fertilizerRecommendation && (
        <View style={styles.row}>
          <Icon name="sprout" size={28} color="#FF9800" />
          <Text style={[styles.resultText, styles.fertilizerText]}>
            Fertilizer: {fertilizerRecommendation}
          </Text>
        </View>
      )}

      {/* Dosage Information */}
      {dosage && (
        <View style={styles.row}>
          <Icon name="cogs" size={28} color="#4CAF50" />{" "}
          {/* Cogs icon for dosage */}
          <Text style={[styles.resultText, styles.dosageText]}>
            Dosage: {dosage}
          </Text>
        </View>
      )}

      {/* Alert Message */}
      {alertMessage && (
        <View style={styles.row}>
          <Icon name="exclamation-circle" size={28} color="#D32F2F" />
          <Text style={[styles.resultText, styles.alertText]}>
            Alert: {alertMessage}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 20,
    backgroundColor: "#ffffff", // White background for a clean modern look
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#4CAF50", // Green border for contrast
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000", // Adding shadow for a modern look
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // Increased spacing for a cleaner layout
  },
  resultText: {
    fontSize: 20, // Larger font size
    fontWeight: "700", // Bold font
    marginLeft: 15,
  },
  diseaseText: {
    color: "#388E3C", // Green color for disease name
    fontSize: 22, // Larger size for the disease name
    fontWeight: "900", // Bolder font for emphasis
  },
  alertText: {
    color: "#D32F2F", // Red color for alert
    fontSize: 20, // Adjusted font size for alert
  },
  fertilizerText: {
    color: "#FF9800", // Orange color for fertilizer
    fontSize: 20, // Adjusted font size for fertilizer
  },
  dosageText: {
    color: "#4CAF50", // Green color for dosage
    fontSize: 20, // Adjusted font size for dosage
  },
})

export default DiseaseResultComponent
