import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [waterReminders, setWaterReminders] = useState(true);
    const [autoBackup, setAutoBackup] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
                <Text style={styles.headerSubtitle}>Customize your experience</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>

                    <View style={styles.menuItem}>
                        <Icon name="bell-ring" size={24} color="#e53935" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Push Notifications</Text>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#e0e0e0', true: '#ffcdd2' }}
                            thumbColor={notifications ? '#e53935' : '#bdbdbd'}
                        />
                    </View>

                    <View style={styles.menuItem}>
                        <Icon name="water" size={24} color="#2196F3" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Watering Reminders</Text>
                        <Switch
                            value={waterReminders}
                            onValueChange={setWaterReminders}
                            trackColor={{ false: '#e0e0e0', true: '#bbdefb' }}
                            thumbColor={waterReminders ? '#2196F3' : '#bdbdbd'}
                        />
                    </View>

                    <View style={styles.menuItem}>
                        <Icon name="theme-light-dark" size={24} color="#673AB7" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Dark Mode</Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#e0e0e0', true: '#d1c4e9' }}
                            thumbColor={darkMode ? '#673AB7' : '#bdbdbd'}
                        />
                    </View>

                    <View style={styles.menuItem}>
                        <Icon name="cloud-upload" size={24} color="#4CAF50" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Auto Backup Data</Text>
                        <Switch
                            value={autoBackup}
                            onValueChange={setAutoBackup}
                            trackColor={{ false: '#e0e0e0', true: '#c8e6c9' }}
                            thumbColor={autoBackup ? '#4CAF50' : '#bdbdbd'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="earth" size={24} color="#2196F3" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Language</Text>
                        <View style={styles.menuValue}>
                            <Text style={styles.valueText}>English</Text>
                            <Icon name="chevron-right" size={24} color="#bdbdbd" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="weather-sunny" size={24} color="#FF9800" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Climate Zone</Text>
                        <View style={styles.menuValue}>
                            <Text style={styles.valueText}>Zone 9b</Text>
                            <Icon name="chevron-right" size={24} color="#bdbdbd" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="ruler" size={24} color="#9C27B0" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Measurement Units</Text>
                        <View style={styles.menuValue}>
                            <Text style={styles.valueText}>Imperial</Text>
                            <Icon name="chevron-right" size={24} color="#bdbdbd" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="alert-circle" size={24} color="#607D8B" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Privacy Policy</Text>
                        <Icon name="chevron-right" size={24} color="#bdbdbd" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="file-document" size={24} color="#607D8B" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Terms of Service</Text>
                        <Icon name="chevron-right" size={24} color="#bdbdbd" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="help-circle" size={24} color="#607D8B" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Icon name="chevron-right" size={24} color="#bdbdbd" />
                    </TouchableOpacity>
                </View>

                <View style={styles.versionContainer}>
                    <Image
                        source={require('../assets/tomato.png')}
                        style={styles.versionIcon}
                    />
                    <Text style={styles.versionText}>TomatoGrow v1.0.0</Text>
                    <Text style={styles.copyrightText}>© 2025 TomatoGrow Inc.</Text>
                </View>
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
        backgroundColor: '#e53935',
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
    versionContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    versionIcon: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    versionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e53935',
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
        color: '#9e9e9e',
    },
});

export default SettingsScreen;