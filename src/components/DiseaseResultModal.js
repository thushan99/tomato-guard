import React from "react"
import { View, Text, StyleSheet, Button, ScrollView } from "react-native"
import Modal from "react-native-modal"
import Icon from "react-native-vector-icons/FontAwesome5"

const DiseaseResultModal = ({
  isVisible,
  onClose,
  diseaseResult,
  alertMessage,
  fertilizerRecommendation,
  dosage,
  downloadPDF,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              <Icon name="cogs" size={28} color="#4CAF50" />
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

          {/* Button to download as PDF */}
          <Button title="Download PDF" onPress={downloadPDF} />
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
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
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
  },
  diseaseText: {
    color: "#388E3C",
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
  scrollContainer: {
    paddingBottom: 20,
  },
})

export default DiseaseResultModal
