import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WeedScreen = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [image, setImage] = useState(null);

    // Mock function to simulate taking a photo
    const handleCameraPress = () => {
        // In a real app, you would use react-native-image-picker or camera API
        setImage(require('../assets/tomato.png'));
        setResults(null);
    };

    // Mock function to simulate weed analysis
    const analyzeWeed = () => {
        if (!image) return;

        setAnalyzing(true);

        // Simulate API call delay
        setTimeout(() => {
            setAnalyzing(false);
            setResults({
                name: 'Common Purslane',
                scientificName: 'Portulaca oleracea',
                threat: 'Medium',
                impact: 'Competes with tomato plants for nutrients and water. Can reduce yields by 10-15% if left uncontrolled.',
                treatments: [
                    {
                        name: 'GreenSweep Organic',
                        type: 'Organic',
                        effectiveness: '75%'
                    },
                    {
                        name: 'WeedClear Pro',
                        type: 'Chemical',
                        effectiveness: '95%'
                    }
                ]
            });
        }, 2000);
    };

    const resetIdentification = () => {
        setImage(null);
        setResults(null);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Weed Identification</Text>
                <Text style={styles.headerSubtitle}>Identify and treat unwanted plants</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.imageSection}>
                    {image ? (
                        <View style={styles.capturedImageContainer}>
                            <Image source={image} style={styles.capturedImage} />
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetIdentification}
                            >
                                <Icon name="refresh" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Icon name="image-remove" size={60} color="#e0e0e0" />
                            <Text style={styles.placeholderText}>No weed image captured</Text>
                        </View>
                    )}
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cameraButton]}
                        onPress={handleCameraPress}
                    >
                        <Icon name="camera" size={28} color="#fff" />
                        <Text style={styles.actionButtonText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.analyzeButton,
                            (!image || analyzing) && styles.disabledButton
                        ]}
                        disabled={!image || analyzing}
                        onPress={analyzeWeed}
                    >
                        {analyzing ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Icon name="leaf-maple" size={28} color="#fff" />
                        )}
                        <Text style={styles.actionButtonText}>
                            {analyzing ? 'Analyzing...' : 'Identify Weed'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {results && (
                    <View style={styles.resultsContainer}>
                        <View style={styles.resultHeader}>
                            <View style={styles.resultHeaderContent}>
                                <Text style={styles.resultTitle}>{results.name}</Text>
                                <Text style={styles.resultScientific}>{results.scientificName}</Text>
                            </View>
                            <View style={[
                                styles.threatBadge,
                                results.threat === 'High'
                                    ? styles.highThreat
                                    : results.threat === 'Medium'
                                        ? styles.mediumThreat
                                        : styles.lowThreat
                            ]}>
                                <Text style={styles.threatText}>{results.threat} Threat</Text>
                            </View>
                        </View>

                        <View style={styles.resultSection}>
                            <Text style={styles.sectionTitle}>Impact on Tomato Plants</Text>
                            <Text style={styles.resultText}>{results.impact}</Text>
                        </View>

                        <View style={styles.resultSection}>
                            <Text style={styles.sectionTitle}>Recommended Treatments</Text>
                            {results.treatments.map((treatment, index) => (
                                <View key={index} style={styles.treatmentItem}>
                                    <View style={styles.treatmentHeader}>
                                        <Text style={styles.treatmentName}>{treatment.name}</Text>
                                        <View style={[
                                            styles.treatmentTypeBadge,
                                            treatment.type === 'Organic'
                                                ? styles.organicBadge
                                                : styles.chemicalBadge
                                        ]}>
                                            <Text style={styles.treatmentTypeText}>{treatment.type}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.effectivenessContainer}>
                                        <Text style={styles.effectivenessLabel}>Effectiveness:</Text>
                                        <View style={styles.progressBarContainer}>
                                            <View
                                                style={[
                                                    styles.progressBar,
                                                    { width: treatment.effectiveness }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.effectivenessText}>{treatment.effectiveness}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.saveReportButton}>
                            <Icon name="content-save" size={18} color="#fff" />
                            <Text style={styles.saveReportButtonText}>Save to Reports</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#4CAF50',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    content: {
        padding: 20,
    },
    imageSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9e9e9e',
    },
    capturedImageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    capturedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    resetButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        flex: 0.48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cameraButton: {
        backgroundColor: '#e53935',
    },
    analyzeButton: {
        backgroundColor: '#4CAF50',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    resultsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 16,
    },
    resultHeaderContent: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    resultScientific: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#757575',
    },
    threatBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    highThreat: {
        backgroundColor: '#ffebee',
        borderWidth: 1,
        borderColor: '#ef5350',
    },
    mediumThreat: {
        backgroundColor: '#fff8e1',
        borderWidth: 1,
        borderColor: '#ffc107',
    },
    lowThreat: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#66bb6a',
    },
    threatText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    resultSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    resultText: {
        fontSize: 14,
        color: '#424242',
        lineHeight: 20,
    },
    treatmentItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    treatmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    treatmentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    treatmentTypeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    organicBadge: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#66bb6a',
    },
    chemicalBadge: {
        backgroundColor: '#e3f2fd',
        borderWidth: 1,
        borderColor: '#42a5f5',
    },
    treatmentTypeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    effectivenessContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    effectivenessLabel: {
        fontSize: 13,
        color: '#757575',
        marginRight: 8,
    },
    progressBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        marginRight: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 3,
    },
    effectivenessText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    saveReportButton: {
        backgroundColor: '#2196F3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    saveReportButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default WeedScreen;