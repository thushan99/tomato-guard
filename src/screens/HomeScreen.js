// screens/HomeScreen.js

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
    const features = [
        {
            id: 1,
            title: 'Pest Detection',
            description: 'Identify common tomato pests',
            icon: 'bug',
            screen: 'PestDetection',
            color: ['#FF9800', '#F57C00']
        },
        {
            id: 2,
            title: 'Disease Diagnosis',
            description: 'Diagnose plant diseases',
            icon: 'hospital',
            screen: 'Disease',
            color: ['#4CAF50', '#388E3C']
        },
        {
            id: 3,
            title: 'Smart Harvest',
            description: 'Predict optimal harvest time',
            icon: 'calendar-clock',
            screen: 'Harvest',
            color: ['#2196F3', '#1976D2']
        },
        {
            id: 4,
            title: 'Weed Identification',
            description: 'Identify and manage weeds',
            icon: 'sprout',
            screen: 'Weed',
            color: ['#9C27B0', '#7B1FA2']
        },
        {
            id: 5,
            title: 'Farmer Community',
            description: 'Connect with other growers',
            icon: 'forum',
            screen: 'Forum',
            color: ['#E91E63', '#C2185B']
        }
    ];

    const renderFeatureCard = (feature) => (
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
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#e53935" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greetingText}>Hello, Farmer!</Text>
                    <Text style={styles.subText}>What would you like to do today?</Text>
                </View>
                <Image
                    // source={require('../assets/profile-placeholder.png')}
                    source={require('../assets/tomato.png')}
                    style={styles.profileImage}
                />
            </View>

            {/* Weather Summary */}
            <View style={styles.weatherContainer}>
                <View style={styles.weatherInfo}>
                    <Icon name="weather-partly-cloudy" size={30} color="#e53935" />
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
                    {features.map(feature => renderFeatureCard(feature))}
                </View>

                {/* Tips Section */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.sectionTitle}>Today's Tip</Text>
                    <View style={styles.tipCard}>
                        <Icon name="lightbulb" size={24} color="#FFC107" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                            Water tomato plants at their base to prevent leaf diseases. Aim for 1-2 inches of water per week.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#e53935',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
    },
    weatherContainer: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    weatherTextContainer: {
        marginLeft: 16,
    },
    weatherTemp: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    weatherDesc: {
        fontSize: 14,
        color: '#757575',
    },
    weatherDetails: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    weatherDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    detailText: {
        marginLeft: 6,
        color: '#757575',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        color: '#333',
    },
    featuresContainer: {
        flex: 1,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    featureCard: {
        width: '48%',
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardGradient: {
        padding: 16,
        height: 140,
        justifyContent: 'space-between',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 16,
    },
    featureDesc: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    tipsContainer: {
        marginBottom: 20,
    },
    tipCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tipIcon: {
        marginRight: 16,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});

export default HomeScreen;