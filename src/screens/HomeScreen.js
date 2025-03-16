import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"

const HomeScreen = ({ navigation }) => {
  const [notificationCount, setNotificationCount] = useState(0) // Set initial count
  const [alertMessage, setAlertMessage] = useState("") // State to store alert message
  const [alertData, setAlertData] = useState(null) // State to store detailed alert data

  const features = [
    {
      id: 1,
      title: "Pest Detection",
      description: "Identify common tomato pests",
      icon: "bug",
      screen: "PestScreen",
      color: ["#FF9800", "#F57C00"],
    },
    {
      id: 2,
      title: "Disease Diagnosis",
      description: "Diagnose plant diseases",
      icon: "hospital",
      screen: "Disease",
      color: ["#4CAF50", "#388E3C"],
    },
    {
      id: 3,
      title: "Smart Harvest",
      description: "Predict optimal harvest time",
      icon: "calendar-clock",
      screen: "Harvest",
      color: ["#2196F3", "#1976D2"],
    },
    {
      id: 4,
      title: "Weed Identification",
      description: "Identify and manage weeds",
      icon: "sprout",
      screen: "Weed",
      color: ["#9C27B0", "#7B1FA2"],
    },
    {
      id: 5,
      title: "Farmer Community",
      description: "Connect with other growers",
      icon: "forum",
      screen: "Forum",
      color: ["#E91E63", "#C2185B"],
    },
  ]

  const fetchAlertMessage = async () => {
    try {
      const response = await fetch("http://192.168.8.123:5000/get_alert")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (data.alert_message && data.weather) {
        setAlertMessage(
          `📢 ${data.alert_message}\n🌡️ Temperature: ${data.weather.temperature}°C\n💧 Humidity: ${data.weather.humidity}%\n⚠️ Weather Alert: ${data.weather.condition}`
        )
        setAlertData(data)
      } else {
        console.error("Required data missing in API response")
      }
    } catch (error) {
      console.error("Error fetching alert:", error)
    }
  }

  useEffect(() => {
    fetchAlertMessage() // Initial fetch

    const interval = setInterval(() => {
      fetchAlertMessage()
    }, 30000) // Fetch every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = () => {
    if (alertMessage && alertData) {
      Alert.alert("Alert", alertMessage, [
        {
          text: "OK",
          onPress: () => console.log("Alert dismissed"),
        },
        {
          text: "View Details",
          onPress: () => {
            Alert.alert(
              "Alert Details",
              `
            🌦️ Weather: ${alertData.weather.condition}
            💧 Humidity: ${alertData.weather.humidity}%
            🌡️ Temperature: ${alertData.weather.temperature}°C
            📍 City: ${alertData.city}
            `
            )
          },
        },
      ])
    } else {
      Alert.alert("No Alerts", "There are no new weather alerts.")
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#388E3C" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Hello, Farmer!</Text>
          <Text style={styles.subText}>What would you like to do today?</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Notification Icon with Badge */}
          <TouchableOpacity onPress={handleNotificationClick}>
            <View style={styles.notificationIconContainer}>
              <Icon
                name="bell"
                size={36}
                color="#fff"
                style={styles.notificationIcon}
              />
              {/* Display notification count if greater than 0 */}
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCountText}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Image
            source={require("../assets/tomato.png")}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Weather Summary */}
      <View style={styles.weatherContainer}>
        <View style={styles.weatherInfo}>
          <Icon name="weather-partly-cloudy" size={30} color="#388E3C" />
          <View style={styles.weatherTextContainer}>
            <Text style={styles.weatherTemp}>24°C</Text>
            <Text style={styles.weatherDesc}>Partly Cloudy</Text>
          </View>
        </View>
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Icon name="water-percent" size={20} color="#757575" />
            <Text style={styles.detailText}>65%</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Icon name="thermometer" size={20} color="#757575" />
            <Text style={styles.detailText}>Optimal</Text>
          </View>
        </View>
      </View>

      {/* Feature Cards */}
      <Text style={styles.sectionTitle}>Features</Text>
      <ScrollView
        style={styles.featuresContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsGrid}>
          {features.map(feature => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => navigation.navigate(feature.screen)}
            >
              <LinearGradient
                colors={feature.color}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name={feature.icon} size={36} color="#fff" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Today's Tip</Text>
          <View style={styles.tipCard}>
            <Icon
              name="lightbulb"
              size={24}
              color="#FFC107"
              style={styles.tipIcon}
            />
            <Text style={styles.tipText}>
              Water tomato plants at their base to prevent leaf diseases. Aim
              for 1-2 inches of water per week.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#388E3C",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subText: { fontSize: 16, color: "rgba(255, 255, 255, 0.8)", marginTop: 4 },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
    marginLeft: 15,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIconContainer: {
    position: "relative",
    marginLeft: 20,
  },
  notificationIcon: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4081",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  weatherContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherInfo: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  weatherTextContainer: { marginLeft: 16 },
  weatherTemp: { fontSize: 20, fontWeight: "bold", color: "#333" },
  weatherDesc: { fontSize: 14, color: "#757575" },
  weatherDetails: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  weatherDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  detailText: { marginLeft: 6, color: "#757575" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    color: "#333",
  },
  featuresContainer: { flex: 1 },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  featureCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  featureDesc: { fontSize: 14, color: "#fff", marginTop: 4 },
  tipsContainer: { marginTop: 20 },
  tipCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: { marginRight: 10 },
  tipText: { fontSize: 14, color: "#333" },
  alertContainer: {
    backgroundColor: "#FF4081",
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  alertText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
})

export default HomeScreen
