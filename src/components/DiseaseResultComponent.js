import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"

const DiseaseResultComponent = ({
  diseaseResult,
  // alertMessage,
  fertilizerRecommendation,
  dosage,
}) => {
  if (!diseaseResult) return null

  return (
    <View style={styles.resultContainer}>
      {/* Disease Name */}
      <View style={styles.row}>
        <Icon name="seedling" size={28} color="#C34A2C" />
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
          <Icon name="cogs" size={28} color="#4CAF50" />
          <Text style={[styles.resultText, styles.dosageText]}>
            Dosage: {dosage}
          </Text>
        </View>
      )}

      {/* Alert Message */}
      {/* Uncomment and pass alertMessage prop if needed */}
      {/* {alertMessage && (
        <View style={styles.row}>
          <Icon name="exclamation-circle" size={28} color="#D32F2F" />
          <Text style={[styles.resultText, styles.alertText]}>
            Alert: {alertMessage}
          </Text>
        </View>
      )} */}
    </View>
  )
}

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#4CAF50",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 15,
  },
  diseaseText: {
    color: "#C34A2C",
    fontSize: 22,
    fontWeight: "900",
  },
  alertText: {
    color: "#D32F2F",
    fontSize: 20,
  },
  fertilizerText: {
    color: "#FF9800",
    fontSize: 20,
  },
  dosageText: {
    color: "#4CAF50",
    fontSize: 20,
  },
})

export default DiseaseResultComponent
