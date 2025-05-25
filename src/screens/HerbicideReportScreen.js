// Enhanced component for handling multiple plant detections
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Share, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

// Component for rendering detection boxes with different colors for different plant types
const AnnotatedImage = ({ imageUri, detections, originalImageDimensions }) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageDisplayWidth = screenWidth - 32;

  // Color mapping for different plant types
  const getColorForClass = (className) => {
    const colorMap = {
      'tomato': '#4CAF50',           // Green for crops
      'ground_cherry': '#FF5722',    // Red for weeds
      'cutleaf_nightshade': '#FF9800', // Orange for weeds
      'default': '#F44336'           // Default red
    };
    return colorMap[className] || colorMap.default;
  };

  useEffect(() => {
    if (imageUri && imageUri !== "https://via.placeholder.com/400/320") {
      setImageError(false);
      setImageLoaded(false);

      Image.getSize(
          imageUri,
          (width, height) => {
            const aspectRatio = height / width;
            const displayHeight = imageDisplayWidth * aspectRatio;
            setImageDimensions({ width: imageDisplayWidth, height: displayHeight });
            setImageLoaded(true);
          },
          (error) => {
            console.error('Error getting image dimensions:', error);
            setImageError(true);
            setImageDimensions({ width: imageDisplayWidth, height: 300 });
          }
      );
    } else {
      // Handle placeholder or invalid URI
      setImageError(true);
      setImageDimensions({ width: imageDisplayWidth, height: 300 });
    }
  }, [imageUri]);

  const renderDetectionBoxes = () => {
    if (!detections || detections.length === 0 || !originalImageDimensions) {
      return null;
    }

    return detections.map((detection, index) => {
      const { bbox, confidence, className } = detection;
      const scaleX = imageDimensions.width / originalImageDimensions.width;
      const scaleY = imageDimensions.height / originalImageDimensions.height;

      const scaledBox = {
        left: bbox.x1 * scaleX,
        top: bbox.y1 * scaleY,
        width: (bbox.x2 - bbox.x1) * scaleX,
        height: (bbox.y2 - bbox.y1) * scaleY,
      };

      const confidencePercent = (confidence * 100).toFixed(1);
      const boxColor = getColorForClass(className);

      return (
          <View key={index}>
            <View
                style={[
                  styles.boundingBox,
                  {
                    left: scaledBox.left,
                    top: scaledBox.top,
                    width: scaledBox.width,
                    height: scaledBox.height,
                    borderColor: boxColor,
                  }
                ]}
            />
            <View
                style={[
                  styles.detectionLabel,
                  {
                    left: scaledBox.left,
                    top: Math.max(0, scaledBox.top - 25),
                    backgroundColor: boxColor,
                  }
                ]}
            >
              <Text style={styles.detectionLabelText}>
                {className} ({confidencePercent}%)
              </Text>
            </View>
          </View>
      );
    });
  };

  // Show placeholder if no image or error
  if (!imageUri || imageError || imageUri === "https://via.placeholder.com/400/320") {
    return (
        <View style={[styles.placeholderContainer, { height: 300 }]}>
          <MaterialCommunityIcons name="image-off" size={50} color="#ccc" />
          <Text style={styles.placeholderText}>
            {!imageUri ? "No image available" : "Failed to load image"}
          </Text>
          <Text style={styles.placeholderSubtext}>
            Please capture a new image to see detection results
          </Text>
          {detections && detections.length > 0 && (
              <View style={styles.detectionListFallback}>
                <Text style={styles.fallbackTitle}>Detected Plants:</Text>
                {detections.slice(0, 3).map((detection, index) => (
                    <Text key={index} style={styles.fallbackItem}>
                      • {detection.className}: {(detection.confidence * 100).toFixed(1)}%
                    </Text>
                ))}
                {detections.length > 3 && (
                    <Text style={styles.fallbackMore}>
                      ... and {detections.length - 3} more
                    </Text>
                )}
              </View>
          )}
        </View>
    );
  }

  return (
      <View style={styles.annotatedImageContainer}>
        <Image
            source={{ uri: imageUri }}
            style={[
              styles.annotatedImage,
              {
                width: imageDimensions.width,
                height: imageDimensions.height,
              }
            ]}
            resizeMode="contain"
            onLoad={() => setImageLoaded(true)}
            onError={(error) => {
              console.error('Image load error:', error);
              setImageError(true);
            }}
        />

        {/* Loading indicator */}
        {!imageLoaded && !imageError && (
            <View style={[styles.loadingOverlay, {
              width: imageDimensions.width,
              height: imageDimensions.height
            }]}>
              <MaterialCommunityIcons name="loading" size={30} color="#666" />
              <Text style={styles.loadingText}>Loading image...</Text>
            </View>
        )}

        {/* Detection boxes overlay */}
        {imageLoaded && (
            <View style={StyleSheet.absoluteFillObject}>
              {renderDetectionBoxes()}
            </View>
        )}
      </View>
  );
};

// Component for detection summary statistics
const DetectionSummary = ({ detections }) => {
  const getDetectionStats = () => {
    const stats = {};
    detections.forEach(detection => {
      const className = detection.className;
      if (!stats[className]) {
        stats[className] = {
          count: 0,
          confidences: [],
          avgConfidence: 0,
          isCrop: className.toLowerCase().includes('tomato')
        };
      }
      stats[className].count++;
      stats[className].confidences.push(detection.confidence);
    });

    // Calculate average confidence for each class
    Object.keys(stats).forEach(className => {
      const confidences = stats[className].confidences;
      stats[className].avgConfidence =
          confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    });

    return stats;
  };

  const stats = getDetectionStats();
  const totalDetections = detections.length;
  const cropCount = Object.values(stats).filter(stat => stat.isCrop).reduce((sum, stat) => sum + stat.count, 0);
  const weedCount = totalDetections - cropCount;

  return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Detection Summary</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{totalDetections} Total</Text>
          </View>
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="sprout" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{cropCount}</Text>
            <Text style={styles.statLabel}>Crops</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#FF5722" />
            <Text style={styles.statNumber}>{weedCount}</Text>
            <Text style={styles.statLabel}>Weeds</Text>
          </View>
        </View>

        <View style={styles.detectionBreakdown}>
          {Object.entries(stats).map(([className, stat]) => (
              <View key={className} style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <View style={[
                    styles.classIndicator,
                    { backgroundColor: stat.isCrop ? '#4CAF50' : '#FF5722' }
                  ]} />
                  <Text style={styles.className}>
                    {className.split('_').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{stat.count}</Text>
                  </View>
                </View>
                <Text style={styles.confidenceText}>
                  Avg. Confidence: {(stat.avgConfidence * 100).toFixed(1)}%
                </Text>
              </View>
          ))}
        </View>
      </View>
  );
};

// Component for detailed detection list
const DetectionDetailsList = ({ detections }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const formatWeedName = (name) => {
    return name.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getColorForClass = (className) => {
    const colorMap = {
      'tomato': '#4CAF50',
      'ground_cherry': '#FF5722',
      'cutleaf_nightshade': '#FF9800',
      'default': '#F44336'
    };
    return colorMap[className] || colorMap.default;
  };

  return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Individual Detections ({detections.length})</Text>

        {detections.map((detection, index) => {
          const isExpanded = expandedIndex === index;
          const confidence = (detection.confidence * 100).toFixed(1);
          const isCrop = detection.className.toLowerCase().includes('tomato');
          const color = getColorForClass(detection.className);

          return (
              <TouchableOpacity
                  key={index}
                  style={styles.detectionItem}
                  onPress={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <View style={styles.detectionHeader}>
                  <View style={styles.detectionInfo}>
                    <View style={[styles.detectionIndicator, { backgroundColor: color }]} />
                    <View style={styles.detectionText}>
                      <Text style={styles.detectionName}>
                        {formatWeedName(detection.className)}
                      </Text>
                      <Text style={styles.detectionConfidence}>
                        {confidence}% confidence
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detectionActions}>
                    {isCrop && (
                        <View style={styles.cropBadge}>
                          <Text style={styles.cropBadgeText}>CROP</Text>
                        </View>
                    )}
                    <MaterialCommunityIcons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#666"
                    />
                  </View>
                </View>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                      <View style={styles.boundingBoxInfo}>
                        <Text style={styles.expandedLabel}>Bounding Box:</Text>
                        <Text style={styles.expandedValue}>
                          Position: ({detection.bbox.x1.toFixed(0)}, {detection.bbox.y1.toFixed(0)})
                        </Text>
                        <Text style={styles.expandedValue}>
                          Size: {detection.bbox.width.toFixed(0)} × {detection.bbox.height.toFixed(0)} px
                        </Text>
                      </View>
                      <View style={styles.detectionAdvice}>
                        <Text style={styles.expandedLabel}>
                          {isCrop ? "Crop Management:" : "Weed Management:"}
                        </Text>
                        <Text style={styles.expandedValue}>
                          {isCrop
                              ? "This is a valuable crop plant. Provide proper care and avoid herbicide application."
                              : "Consider targeted herbicide application for this weed species."
                          }
                        </Text>
                      </View>
                    </View>
                )}
              </TouchableOpacity>
          );
        })}
      </View>
  );
};

// Enhanced main component
const HerbicideReportScreen = ({ route, navigation }) => {
  const { reportData } = route.params || {};

  // Use your actual data structure with better fallback handling
  const data = reportData || {
    weedName: "tomato",
    confidence: 73.97066950798035,
    soilType: "Loamy",
    growthStage: "Early",
    temperature: 25.5,
    humidity: 65.0,
    rainfall: 0.0,
    windSpeed: 8.23,
    predictedApplicationRate: 2.03,
    predictedHerbicideName: "Atrazine",
    capturedImageUri: null,
    originalImageDimensions: { width: 1920, height: 1080 },
    herbicideOptions: [
      {
        name: "Atrazine",
        applicationRate: "2.03 L/ha",
        safeForTomato: "false",
        modeOfAction: "Systemic",
        applicationMethod: "Spray",
        weatherConstraints: "Low wind, favorable",
        resistanceReported: "true",
        alternativeHerbicide: "Glufosinate"
      },
      {
        name: "Glufosinate",
        applicationRate: "1.827 L/ha",
        safeForTomato: "true",
        modeOfAction: "Contact",
        applicationMethod: "Spray",
        weatherConstraints: "Low wind, favorable",
        resistanceReported: "false",
        alternativeHerbicide: "Paraquat"
      }
    ],
    safetyPrecautions: {
      toxicity: "High",
      humanProtection: "Wear gloves and mask",
      environmentalPrecautions: "Avoid near water bodies"
    },
    detectionInfo: {
      detectionCount: 15,
      detections: [
        {
          bbox: { height: 303.63, width: 388.66, x1: 550.66, x2: 939.32, y1: 1477.16, y2: 1780.80 },
          classId: 2,
          className: "tomato",
          confidence: 0.7397066950798035
        },
        {
          bbox: { height: 371.99, width: 340.18, x1: 1045.99, x2: 1386.17, y1: 177.40, y2: 549.40 },
          classId: 2,
          className: "tomato",
          confidence: 0.7261600494384766
        },
        {
          bbox: { height: 289.51, width: 404.27, x1: 547.77, x2: 952.04, y1: 1488.82, y2: 1778.33 },
          classId: 1,
          className: "ground_cherry",
          confidence: 0.7072266936302185
        }
      ],
      modelUsed: "YOLOv8x"
    }
  };

  // Debug log to check the image URI
  console.log('Image URI:', data.capturedImageUri);

  const detections = (data.detectionInfo?.detections || []).filter(
      detection => detection.confidence >= 0.4
  );
  const hasMultipleDetections = detections.length > 1;

  // FIXED: Check if there are any weeds detected to show herbicide recommendations
  const weedDetections = detections.filter(detection =>
      !detection.className.toLowerCase().includes('tomato')
  );

  const hasWeedDetections = weedDetections.length > 0;

  // FIXED: Generate appropriate recommendations based on detections
  const getRecommendationTitle = () => {
    if (hasWeedDetections) {
      return "Recommended Herbicide Treatment";
    } else if (detections.length > 0) {
      return "Crop Protection Recommendations";
    } else {
      return "No Recommendations Available";
    }
  };

  const getRecommendationContent = () => {
    if (hasWeedDetections) {
      return {
        title: data.predictedHerbicideName || "Selective Herbicide",
        subtitle: `Application Rate: ${data.predictedApplicationRate || "As per label"} L/ha`,
        icon: "spray",
        color: "#FF5722"
      };
    } else if (detections.length > 0) {
      const cropCount = detections.filter(d => d.className.toLowerCase().includes('tomato')).length;
      return {
        title: "No Herbicide Treatment Needed",
        subtitle: `${cropCount} healthy crop plants detected (≥40% confidence)`,
        icon: "shield-check",
        color: "#4CAF50"
      };
    } else {
      return {
        title: "No Plants Detected",
        subtitle: "Capture an image with plants for recommendations",
        icon: "image-off",
        color: "#999"
      };
    }
  };

  const recommendationContent = getRecommendationContent();

  const handleShare = async () => {
    try {
      const detectionSummary = detections.reduce((acc, detection) => {
        const className = detection.className;
        acc[className] = (acc[className] || 0) + 1;
        return acc;
      }, {});

      const summaryText = Object.entries(detectionSummary)
          .map(([className, count]) => `${className}: ${count}`)
          .join('\n');

      const shareMessage = `
Multi-Plant Detection Report
==========================
Total Detections: ${detections.length}

Plant Breakdown:
${summaryText}

${hasWeedDetections ?
          `Recommended Herbicide: ${data.predictedHerbicideName}\nApplication Rate: ${data.predictedApplicationRate} L/ha` :
          'No herbicide treatment required - only crops detected'
      }

Environmental Conditions:
Temperature: ${data.temperature}°C
Humidity: ${data.humidity}%
Wind Speed: ${data.windSpeed} km/h

Detection Model: ${data.detectionInfo?.modelUsed || 'Unknown'}
      `;

      await Share.share({
        message: shareMessage,
        title: "Multi-Plant Detection Report"
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share report: ' + error.message);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* Enhanced Image Card with Detection Overlay */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                {hasMultipleDetections ? 'Multi-Plant Detection' : 'Plant Detection'}
              </Text>
              <View style={styles.detectionCountBadge}>
                <Text style={styles.detectionCountText}>
                  {detections.length} detection(s)
                </Text>
              </View>
            </View>
            <View style={styles.imageSection}>
              <AnnotatedImage
                  imageUri={data.capturedImageUri}
                  detections={detections}
                  originalImageDimensions={data.originalImageDimensions || { width: 1920, height: 1080 }}
              />

              {/* Color Legend */}
              <View style={styles.colorLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>Crops</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#FF5722' }]} />
                  <Text style={styles.legendText}>Weeds</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Detection Summary Card */}
          {hasMultipleDetections && (
              <View style={styles.card}>
                <DetectionSummary detections={detections} />
              </View>
          )}

          {/* Individual Detections Card */}
          <View style={styles.card}>
            <DetectionDetailsList detections={detections} />
          </View>

          {/* FIXED: Enhanced Recommendation Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{getRecommendationTitle()}</Text>
              <View style={[
                styles.recommendationBadge,
                { backgroundColor: hasWeedDetections ? '#FFEBEE' : '#E8F5E9' }
              ]}>
                <Text style={[
                  styles.recommendationBadgeText,
                  { color: hasWeedDetections ? '#F44336' : '#4CAF50' }
                ]}>
                  {hasWeedDetections ? 'ACTION NEEDED' : 'NO ACTION'}
                </Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.herbicideRecommendation}>
                <View style={[
                  styles.primaryRecommendation,
                  {
                    backgroundColor: hasWeedDetections ? '#FFF3E0' : '#F3F8FF',
                    borderLeftColor: recommendationContent.color
                  }
                ]}>
                  <MaterialCommunityIcons
                      name={recommendationContent.icon}
                      size={24}
                      color={recommendationContent.color}
                  />
                  <View style={styles.recommendationDetails}>
                    <Text style={styles.herbicideName}>
                      {recommendationContent.title}
                    </Text>
                    <Text style={styles.applicationRate}>
                      {recommendationContent.subtitle}
                    </Text>
                    {hasWeedDetections && (
                        <Text style={styles.weedWarning}>
                          ⚠️ {weedDetections.length} weed(s) detected requiring treatment
                        </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* FIXED: Only show herbicide options if weeds are detected */}
          {hasWeedDetections && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Herbicide Options ({data.herbicideOptions?.length || 0})</Text>
                </View>
                <View style={styles.cardContent}>
                  {data.herbicideOptions?.map((herbicide, index) => (
                      <View key={index} style={styles.herbicideOption}>
                        <View style={styles.herbicideHeader}>
                          <Text style={styles.herbicideOptionName}>{herbicide.name}</Text>
                          <View style={[
                            styles.safetyBadge,
                            { backgroundColor: herbicide.safeForTomato === "true" ? '#E8F5E9' : '#FFEBEE' }
                          ]}>
                            <Text style={[
                              styles.safetyBadgeText,
                              { color: herbicide.safeForTomato === "true" ? '#4CAF50' : '#F44336' }
                            ]}>
                              {herbicide.safeForTomato === "true" ? "SAFE" : "CAUTION"}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.herbicideDetails}>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Application Rate:</Text>
                            <Text style={styles.detailValue}>{herbicide.applicationRate}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Mode of Action:</Text>
                            <Text style={styles.detailValue}>{herbicide.modeOfAction}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Application Method:</Text>
                            <Text style={styles.detailValue}>{herbicide.applicationMethod}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Weather Constraints:</Text>
                            <Text style={styles.detailValue}>{herbicide.weatherConstraints}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Resistance Reported:</Text>
                            <Text style={[
                              styles.detailValue,
                              { color: herbicide.resistanceReported === "true" ? '#F44336' : '#4CAF50' }
                            ]}>
                              {herbicide.resistanceReported === "true" ? "Yes" : "No"}
                            </Text>
                          </View>
                          {herbicide.alternativeHerbicide && (
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Alternative:</Text>
                                <Text style={styles.detailValue}>{herbicide.alternativeHerbicide}</Text>
                              </View>
                          )}
                        </View>
                      </View>
                  ))}
                </View>
              </View>
          )}

          {/* FIXED: Only show safety precautions if herbicides are recommended */}
          {hasWeedDetections && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="shield-alert" size={20} color="#FF9800" />
                  <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Safety Precautions</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.safetySection}>
                    <View style={styles.toxicityLevel}>
                      <Text style={styles.safetyLabel}>Toxicity Level</Text>
                      <View style={[
                        styles.toxicityBadge,
                        {
                          backgroundColor: data.safetyPrecautions?.toxicity === "High" ? '#FFEBEE' :
                              data.safetyPrecautions?.toxicity === "Moderate" ? '#FFF3E0' : '#E8F5E9'
                        }
                      ]}>
                        <Text style={[
                          styles.toxicityText,
                          {
                            color: data.safetyPrecautions?.toxicity === "High" ? '#F44336' :
                                data.safetyPrecautions?.toxicity === "Moderate" ? '#FF9800' : '#4CAF50'
                          }
                        ]}>
                          {data.safetyPrecautions?.toxicity || 'Unknown'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.safetyItem}>
                      <MaterialCommunityIcons name="account-hard-hat" size={20} color="#2196F3" />
                      <View style={styles.safetyContent}>
                        <Text style={styles.safetyTitle}>Human Protection</Text>
                        <Text style={styles.safetyDescription}>
                          {data.safetyPrecautions?.humanProtection || 'Follow standard safety protocols'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.safetyItem}>
                      <MaterialCommunityIcons name="earth" size={20} color="#4CAF50" />
                      <View style={styles.safetyContent}>
                        <Text style={styles.safetyTitle}>Environmental Precautions</Text>
                        <Text style={styles.safetyDescription}>
                          {data.safetyPrecautions?.environmentalPrecautions || 'Follow environmental guidelines'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
          )}

          {/* Action Buttons */}
          <TouchableOpacity style={styles.saveButton} onPress={handleShare}>
            <Text style={styles.saveButtonText}>
              Share Report <Feather name="share-2" size={15} color="white" />
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f8',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    padding: 16,
  },
  imageSection: {
    padding: 16,
  },
  annotatedImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  annotatedImage: {
    borderRadius: 8,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  detectionListFallback: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    alignItems: 'flex-start',
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  fallbackItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  fallbackMore: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  loadingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  detectionLabel: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: 150,
  },
  detectionLabelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  colorLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  detectionCountBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detectionCountText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalBadgeText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detectionBreakdown: {
    gap: 12,
  },
  breakdownItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  classIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  countBadge: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 20,
  },
  detailsContainer: {
    padding: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detectionItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  detectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  detectionText: {
    flex: 1,
  },
  detectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detectionConfidence: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  cropBadgeText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expandedContent: {
    padding: 12,
    paddingTop: 0,
    backgroundColor: 'white',
  },
  boundingBoxInfo: {
    marginBottom: 12,
  },
  expandedLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  expandedValue: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detectionAdvice: {
    backgroundColor: '#F0F7FF',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  recommendationBadge: {
    marginTop: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendationBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  herbicideRecommendation: {
    marginBottom: 16,
  },
  primaryRecommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  recommendationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  herbicideName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  applicationRate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  weedWarning: {
    fontSize: 12,
    color: '#FF5722',
    fontWeight: '500',
  },
  herbicideOption: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  herbicideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  herbicideOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  safetyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  herbicideDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  safetySection: {
    gap: 16,
  },
  toxicityLevel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  toxicityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toxicityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  safetyContent: {
    marginLeft: 12,
    flex: 1,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  safetyDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HerbicideReportScreen;
