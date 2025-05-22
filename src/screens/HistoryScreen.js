import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HistoryScreen = ({ navigation, route }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        userId: route?.params?.userId || null,
        weedName: '',
        herbicideName: '',
        days: null
    });
    const [statistics, setStatistics] = useState(null);

    const API_BASE_URL = 'http://192.168.8.147:8080'; // Replace with your actual API URL
    const PAGE_SIZE = 10;

    // Fetch analysis history with pagination
    const fetchHistory = useCallback(async (page = 0, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
                setCurrentPage(0);
            } else {
                setLoading(true);
            }

            let url = `${API_BASE_URL}/herbicide-analysis/history/paginated?page=${page}&size=${PAGE_SIZE}`;

            // Add user filter if provided
            if (filters.userId) {
                url = `${API_BASE_URL}/herbicide-analysis/history/user/${filters.userId}/paginated?page=${page}&size=${PAGE_SIZE}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                const newData = data.content || [];

                if (isRefresh || page === 0) {
                    setHistoryData(newData);
                } else {
                    setHistoryData(prev => [...prev, ...newData]);
                }

                setHasMoreData(!data.last);
                setCurrentPage(page);
            } else {
                throw new Error('Failed to fetch history');
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            Alert.alert('Error', 'Failed to load analysis history');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filters.userId]);

    // Search history with filters
    const searchHistory = async () => {
        try {
            setLoading(true);
            let url = `${API_BASE_URL}/herbicide-analysis/history/search?`;

            const params = new URLSearchParams();
            if (filters.weedName) params.append('weedName', filters.weedName);
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.herbicideName) params.append('herbicideName', filters.herbicideName);
            if (filters.days) params.append('days', filters.days);

            const response = await fetch(url + params.toString());
            const data = await response.json();

            if (response.ok) {
                setHistoryData(data);
                setHasMoreData(false); // Search results don't support pagination
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Error searching history:', error);
            Alert.alert('Error', 'Failed to search history');
        } finally {
            setLoading(false);
            setFilterModalVisible(false);
        }
    };

    // Fetch statistics
    const fetchStatistics = async () => {
        try {
            let url = `${API_BASE_URL}/herbicide-analysis/statistics`;
            if (filters.userId) {
                url += `?userId=${filters.userId}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setStatistics(data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Delete analysis record
    const deleteRecord = async (id) => {
        Alert.alert(
            'Delete Record',
            'Are you sure you want to delete this analysis record?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_BASE_URL}/herbicide-analysis/history/${id}`, {
                                method: 'DELETE'
                            });

                            if (response.ok) {
                                setHistoryData(prev => prev.filter(item => item.id !== id));
                                Alert.alert('Success', 'Record deleted successfully');
                            } else {
                                throw new Error('Delete failed');
                            }
                        } catch (error) {
                            console.error('Error deleting record:', error);
                            Alert.alert('Error', 'Failed to delete record');
                        }
                    }
                }
            ]
        );
    };

    // Load more data for pagination
    const loadMoreData = () => {
        if (!loading && hasMoreData) {
            fetchHistory(currentPage + 1);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get confidence color
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return '#4CAF50';
        if (confidence >= 0.6) return '#FF9800';
        return '#F44336';
    };

    // Render history item
    const renderHistoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.historyCard}
            onPress={() => navigation.navigate('AnalysisDetail', { recordId: item.id })}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getConfidenceColor(item.confidence) }]}>
                    <Icon name="leaf" size={24} color="#fff" />
                </View>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.weedName || 'Unknown Weed'}</Text>
                    <Text style={styles.itemType}>
                        Confidence: {Math.round((item.confidence || 0) * 100)}%
                    </Text>
                    <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteRecord(item.id)}
                >
                    <Icon name="delete" size={20} color="#F44336" />
                </TouchableOpacity>
            </View>

            <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Herbicide:</Text>
                    <Text style={styles.detailValue}>{item.predictedHerbicideName || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Soil Type:</Text>
                    <Text style={styles.detailValue}>{item.soilType}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Growth Stage:</Text>
                    <Text style={styles.detailValue}>{item.growthStage}</Text>
                </View>
                {item.analysisStatus === 'FAILED' && (
                    <View style={styles.errorContainer}>
                        <Icon name="alert" size={16} color="#F44336" />
                        <Text style={styles.errorText}>Analysis Failed</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    // Render filter modal
    const renderFilterModal = () => (
        <Modal
            visible={filterModalVisible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filter History</Text>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                            <Icon name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Weed Name</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={filters.weedName}
                                onChangeText={(text) => setFilters(prev => ({ ...prev, weedName: text }))}
                                placeholder="Enter weed name"
                            />
                        </View>

                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Herbicide Name</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={filters.herbicideName}
                                onChangeText={(text) => setFilters(prev => ({ ...prev, herbicideName: text }))}
                                placeholder="Enter herbicide name"
                            />
                        </View>

                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Recent Days</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={filters.days?.toString() || ''}
                                onChangeText={(text) => setFilters(prev => ({ ...prev, days: text ? parseInt(text) : null }))}
                                placeholder="Enter number of days"
                                keyboardType="numeric"
                            />
                        </View>

                        <TouchableOpacity style={styles.searchButton} onPress={searchHistory}>
                            <Text style={styles.searchButtonText}>Apply Filters</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                setFilters({ userId: filters.userId, weedName: '', herbicideName: '', days: null });
                                fetchHistory(0, true);
                                setFilterModalVisible(false);
                            }}
                        >
                            <Text style={styles.clearButtonText}>Clear Filters</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    // Render statistics header
    const renderStatistics = () => {
        if (!statistics) return null;

        return (
            <View style={styles.statisticsContainer}>
                <Text style={styles.statisticsTitle}>Statistics</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{statistics.totalAnalysisCount || 0}</Text>
                        <Text style={styles.statLabel}>Total Analyses</Text>
                    </View>
                    {statistics.userAnalysisCount !== undefined && (
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{statistics.userAnalysisCount}</Text>
                            <Text style={styles.statLabel}>Your Analyses</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    useEffect(() => {
        fetchHistory(0, true);
        fetchStatistics();
    }, [fetchHistory]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analysis History</Text>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Icon name="filter-variant" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {renderStatistics()}

            {loading && historyData.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#388E3C" />
                    <Text style={styles.loadingText}>Loading history...</Text>
                </View>
            ) : historyData.length > 0 ? (
                <FlatList
                    data={historyData}
                    renderItem={renderHistoryItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchHistory(0, true)}
                            colors={['#388E3C']}
                        />
                    }
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => (
                        loading && historyData.length > 0 ? (
                            <View style={styles.footerLoading}>
                                <ActivityIndicator size="small" color="#388E3C" />
                            </View>
                        ) : null
                    )}
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

            {renderFilterModal()}
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
    statisticsContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statisticsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#388E3C',
    },
    statLabel: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    },
    listContainer: {
        padding: 16,
    },
    historyCard: {
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
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
    deleteButton: {
        padding: 8,
    },
    cardDetails: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 14,
        color: '#757575',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#F44336',
        marginLeft: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#757575',
        marginTop: 16,
    },
    footerLoading: {
        padding: 20,
        alignItems: 'center',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContent: {
        padding: 20,
    },
    filterGroup: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    filterInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    searchButton: {
        backgroundColor: '#388E3C',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#757575',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HistoryScreen;