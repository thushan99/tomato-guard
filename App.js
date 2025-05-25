import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

// Import screens
import SplashScreen from "./src/screens/SplashScreen"
import HomeScreen from "./src/screens/HomeScreen"
import HistoryScreen from "./src/screens/HistoryScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import PestScreen from "./src/screens/PestScreen"
import PestDetectionScreen from "./src/screens/PestDetectionScreen"
import DiseaseScreen from "./src/screens/DiseaseScreen"
import WeedScreen from "./src/screens/WeedScreen"
import HarvestScreen from './src/screens/HarvestScreen';

import ForumScreen from './src/screens/ForumScreen';

import HerbicideReportScreen from './src/screens/HerbicideReportScreen';



const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "History") {
            iconName = focused ? "history" : "history"
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "cog" : "cog-outline"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#388E3C",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

// Main App with Navigation
const App = () => {
  return (

      <NavigationContainer>
        <StatusBar backgroundColor="#ededed" barStyle="light-content" />
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="PestDetection"
              component={PestScreen}
              options={{
              title: 'Pest Detection',
              headerStyle: {
              backgroundColor: '#e53935',
             },
               headerTintColor: '#fff',
           }}
          /> 
          <Stack.Screen
            name="Disease"
              component={DiseaseScreen}
              options={{
               title: 'Disease Diagnosis',
                headerStyle: {
              backgroundColor: '#e53935',
           },
          headerTintColor: '#fff',
          }}
          />
          <Stack.Screen
            name="Harvest"
             component={HarvestScreen}
            options={{
              title: 'Smart Harvest',
              headerStyle: {
                backgroundColor: '#e53935',
               },
                headerTintColor: '#fff',
              }}
          /> 
          <Stack.Screen
              name="Weed"
              component={WeedScreen}
              options={{
                title: 'Weed Identification',
                headerStyle: {
                  backgroundColor: '#4CAF50',
                },
                headerTintColor: '#fff',
              }}
          />
          <Stack.Screen
              name="HerbicideReportScreen"
              component={HerbicideReportScreen}
              options={{
                  title: 'Herbicide Report',
                  headerStyle: {
                      backgroundColor: '#4CAF50',
                  },
                  headerTintColor: '#fff',
              }}
          />
          <Stack.Screen
              name="Forum"
              component={ForumScreen}
              options={{
                title: 'Farmer Community',
                headerStyle: {
                  backgroundColor: '#4CAF50',
                },
                headerTintColor: '#fff',
              }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
};
export default App
