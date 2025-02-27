import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HistoryScreen = ({ navigation }) => {
    const historyData = [
        {
            id: '1',
            type: 'pest',
            title: 'Tomato Hornworm',
            date: 'Feb 24, 2025',
            icon: 'bug',
            color: '#FF9800'
        },
        {
            id: '2',
            type: 'disease',
            title: 'Early Blight',
            date: 'Feb 22, 2025',
            icon: 'hospital',
            color: '#4CAF50'
        },
        {
            id: '3',
            type: 'harvest',
            title: 'Roma Tomatoes',
            date: 'Feb 20, 2025',
            icon: 'calendar-check',
            color: '#2196F3'
        },
        {
            id: '4',
            type: 'weed',
            title: 'Common Purslane',
            date: 'Feb 15, 2025',
            icon: 'sprout',
            color: '#9C27B0'
        }
    ];

    const renderHistoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.historyCard}
            onPress={() => navigation.navigate(getScreenByType(item.type))}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={24} color="#fff" />
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemType}>{getTypeLabel(item.type)}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#bdbdbd" />
        </TouchableOpacity>
    );

    const getTypeLabel = (type) => {
        switch(type) {
            case 'pest': return 'Pest Detection';
            case 'disease': return 'Disease Diagnosis';
            case 'harvest': return 'Harvest Prediction';
            case 'weed': return 'Weed Identification';
            default: return '';
        }
    };

    const getScreenByType = (type) => {
        switch(type) {
            case 'pest': return 'PestDetection';
            case 'disease': return 'Disease';
            case 'harvest': return 'Harvest';
            case 'weed': return 'Weed';
            default: return 'Home';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analysis History</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="filter-variant" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {historyData.length > 0 ? (
                <FlatList
                    data={historyData}
                    renderItem={renderHistoryItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Icon name="history" size={80} color="#e0e0e0" />
                    <Text style={styles.emptyText}>No history found</Text>
                    <Text style={styles.emptySubText}>
                        Your analysis history will appear here
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#388E3C',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    itemType: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 2,
    },
    itemDate: {
        fontSize: 12,
        color: '#9e9e9e',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#9e9e9e',
        marginTop: 20,
    },
    emptySubText: {
        fontSize: 14,
        color: '#bdbdbd',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default HistoryScreen;