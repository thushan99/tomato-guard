import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.editButton}>
                        <Icon name="pencil" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileInfo}>
                    <Image
                        // source={require('../assets/profile-placeholder.png')}
                        source={require('../assets/tomatoLogo2.png')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>John Doe</Text>
                    <Text style={styles.userLocation}>
                        <Icon name="map-marker" size={14} color="#fff" /> California, USA
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Plants</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>8</Text>
                        <Text style={styles.statLabel}>Reports</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Seasons</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="account" size={24} color="#e53935" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Icon name="chevron-right" size={24} color="#bdbdbd" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="bell" size={24} color="#FF9800" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Notifications</Text>
                        <Icon name="chevron-right" size={24} color="#bdbdbd" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="security" size={24} color="#4CAF50" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Privacy & Security</Text>
                        <Icon name="chevron-right" size={24} color="#bdbdbd" />
                    </TouchableOpacity>
                </View>

                {/*<View style={styles.section}>*/}
                {/*    <Text style={styles.sectionTitle}>Preferences</Text>*/}

                {/*    <TouchableOpacity style={styles.menuItem}>*/}
                {/*        <Icon name="earth" size={24} color="#2196F3" style={styles.menuIcon} />*/}
                {/*        <Text style={styles.menuText}>Language</Text>*/}
                {/*        <View style={styles.menuValue}>*/}
                {/*            <Text style={styles.valueText}>English</Text>*/}
                {/*            <Icon name="chevron-right" size={24} color="#bdbdbd" />*/}
                {/*        </View>*/}
                {/*    </TouchableOpacity>*/}

                {/*    <TouchableOpacity style={styles.menuItem}>*/}
                {/*        <Icon name="weather-sunny" size={24} color="#FF9800" style={styles.menuIcon} />*/}
                {/*        <Text style={styles.menuText}>Climate Zone</Text>*/}
                {/*        <View style={styles.menuValue}>*/}
                {/*            <Text style={styles.valueText}>Zone 9b</Text>*/}
                {/*            <Icon name="chevron-right" size={24} color="#bdbdbd" />*/}
                {/*        </View>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}

                <TouchableOpacity style={styles.logoutButton}>
                    <Icon name="logout" size={20} color="#000" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/*<Text style={styles.versionText}>Version 1.0.0</Text>*/}
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
        backgroundColor: '#388E3C',
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 40,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    userLocation: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        marginHorizontal: 20,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    content: {
        padding: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    menuValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 14,
        color: '#757575',
        marginRight: 4,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 8,
    },
    // versionText: {
    //     textAlign: 'center',
    //     fontSize: 12,
    //     color: '#9e9e9e',
    //     marginBottom: 20,
    // },
});

export default ProfileScreen;