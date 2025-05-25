import { useNavigation } from "@react-navigation/native"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"

const DiseaseResultComponent = ({
  diseaseResult,
  fertilizerRecommendation,
  dosage,
}) => {
  const navigation = useNavigation()

  if (!diseaseResult) return null

  const handleCancel = () => {
    navigation.goBack()
  }

  const onAddFertilizer = async () => {
    try {
      const fertilizer = fertilizerRecommendation

      const response = await fetch("http://192.168.8.122/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fertilizer }),
      })

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`)
      }

      const result = await response.text()
      console.log("ESP32 response:", result)
    } catch (error) {
      console.error("Error sending fertilizer:", error.message)
    }
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.reportTitle}>Disease Diagnosis Report</Text>
      <Text style={styles.reportSubtitle}>
        Below are the results based on image analysis
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Disease Name */}
      <View style={styles.section}>
        <View style={styles.iconCircleRed}>
          <Icon name="virus" size={18} color="#fff" />
        </View>
        <Text style={styles.sectionTextMain}>{diseaseResult}</Text>
      </View>

      {/* Fertilizer Recommendation */}
      {fertilizerRecommendation && (
        <View style={styles.section}>
          <View style={styles.iconCircleOrange}>
            <Icon name="seedling" size={18} color="#fff" />
          </View>
          <Text style={styles.sectionText}>
            <Text style={styles.bold}>Fertilizer: </Text>
            {fertilizerRecommendation}
          </Text>
        </View>
      )}

      {/* Dosage Information */}
      {dosage && (
        <View style={styles.section}>
          <View style={styles.iconCircleGreen}>
            <Icon name="cogs" size={18} color="#fff" />
          </View>
          <Text style={styles.sectionText}>
            <Text style={styles.bold}>Dosage: </Text>
            {dosage}
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={onAddFertilizer}>
          <Text style={styles.buttonText}>➕ Add Fertilizer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>✖ Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ECECEC",
    width: "92%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#374151",
    flexShrink: 1,
  },
  sectionTextMain: {
    fontSize: 18,
    marginLeft: 12,
    color: "#E53935",
    fontWeight: "700",
  },
  iconCircleRed: {
    backgroundColor: "#E53935",
    borderRadius: 20,
    padding: 10,
  },
  iconCircleOrange: {
    backgroundColor: "#FB8C00",
    borderRadius: 20,
    padding: 10,
  },
  iconCircleGreen: {
    backgroundColor: "#388E3C",
    borderRadius: 20,
    padding: 10,
  },
  bold: {
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    marginRight: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F44336",
    paddingVertical: 14,
    marginLeft: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default DiseaseResultComponent
