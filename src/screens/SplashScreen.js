import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text, Animated } from 'react-native';
import * as Progress from 'react-native-progress';

const SplashScreen = ({ navigation }) => {
    // Animation for logo
    const logoOpacity = new Animated.Value(0);
    const logoTranslate = new Animated.Value(50);

    // Animation for progress
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        // Animate logo
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(logoTranslate, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Simulate loading
        let loadingProgress = 0;
        const interval = setInterval(() => {
            loadingProgress += 0.1;
            setProgress(loadingProgress);

            if (loadingProgress >= 1) {
                clearInterval(interval);
                setTimeout(() => {
                    navigation.replace('MainTabs');
                }, 500);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ translateY: logoTranslate }]
                    }
                ]}
            >
                <Image
                    source={require('../assets/tomato.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>TomatoGrow</Text>
                <Text style={styles.tagline}>Smart Cultivation Assistant</Text>
            </Animated.View>

            <View style={styles.progressContainer}>
                <Progress.Bar
                    progress={progress}
                    width={200}
                    color="#e53935"
                    borderWidth={0}
                    unfilledColor="#f5f5f5"
                    height={8}
                    borderRadius={4}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e53935',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: '#757575',
    },
    progressContainer: {
        marginTop: 30,
    },
});

export default SplashScreen;