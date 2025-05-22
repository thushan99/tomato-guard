import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ModelSelector = ({ useNewModel, onModelChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select AI Model</Text>
            <Text style={styles.subtitle}>Choose the detection model for analysis</Text>

            <View style={styles.optionsContainer}>
                {/* VGG16 Model Option */}
                <TouchableOpacity
                    style={[
                        styles.optionCard,
                        !useNewModel && styles.selectedCard
                    ]}
                    onPress={() => onModelChange(false)}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioContainer}>
                        <View style={[
                            styles.radioButton,
                            !useNewModel && styles.radioButtonSelected
                        ]}>
                            {!useNewModel && (
                                <MaterialCommunityIcons
                                    name="check"
                                    size={16}
                                    color="#2196F3"
                                />
                            )}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={[
                                styles.optionTitle,
                                !useNewModel && styles.selectedText
                            ]}>
                                VGG16 Model
                            </Text>
                            <Text style={styles.optionDescription}>
                                Traditional CNN model with good accuracy
                            </Text>
                            <View style={styles.featureContainer}>
                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={14}
                                    color="#666"
                                />
                                <Text style={styles.featureText}>Slower processing</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* YOLOv8x Model Option */}
                <TouchableOpacity
                    style={[
                        styles.optionCard,
                        useNewModel && styles.selectedCard
                    ]}
                    onPress={() => onModelChange(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioContainer}>
                        <View style={[
                            styles.radioButton,
                            useNewModel && styles.radioButtonSelected
                        ]}>
                            {useNewModel && (
                                <MaterialCommunityIcons
                                    name="check"
                                    size={16}
                                    color="#2196F3"
                                />
                            )}
                        </View>
                        <View style={styles.optionContent}>
                            <View style={styles.titleContainer}>
                                <Text style={[
                                    styles.optionTitle,
                                    useNewModel && styles.selectedText
                                ]}>
                                    YOLOv8x Model
                                </Text>
                                <View style={styles.recommendedBadge}>
                                    <Text style={styles.recommendedText}>Recommended</Text>
                                </View>
                            </View>
                            <Text style={styles.optionDescription}>
                                Latest YOLO model with superior accuracy and speed
                            </Text>
                            <View style={styles.featuresRow}>
                                <View style={styles.featureContainer}>
                                    <MaterialCommunityIcons
                                        name="lightning-bolt"
                                        size={14}
                                        color="#4CAF50"
                                    />
                                    <Text style={styles.featureText}>Fast processing</Text>
                                </View>
                                <View style={styles.featureContainer}>
                                    <MaterialCommunityIcons
                                        name="target"
                                        size={14}
                                        color="#4CAF50"
                                    />
                                    <Text style={styles.featureText}>High accuracy</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    optionsContainer: {
        gap: 12,
    },
    optionCard: {
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#FAFAFA',
    },
    selectedCard: {
        borderColor: '#2196F3',
        backgroundColor: '#F3F9FF',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#DDD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
        backgroundColor: 'white',
    },
    radioButtonSelected: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    optionContent: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    selectedText: {
        color: '#2196F3',
    },
    recommendedBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    recommendedText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    featuresRow: {
        flexDirection: 'row',
        gap: 16,
    },
    featureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
});

export default ModelSelector;