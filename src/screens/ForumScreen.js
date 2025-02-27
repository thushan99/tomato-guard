import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ForumScreen = () => {
    const [posts, setPosts] = useState([
        {
            id: '1',
            author: 'Sarah Johnson',
            avatar: require('../assets/tomato.png'),
            time: '2 hours ago',
            content: 'Has anyone tried companion planting with basil next to tomatoes? I heard it helps deter pests.',
            likes: 24,
            comments: 8,
            liked: false,
            tags: ['#companionplanting', '#pestcontrol']
        },
        {
            id: '2',
            author: 'Mike Chen',
            avatar: require('../assets/tomato.png'),
            time: '5 hours ago',
            content: 'My tomatoes have yellow leaves at the bottom of the plant. Is this normal or should I be concerned?',
            image: require('../assets/tomato.png'),
            likes: 12,
            comments: 15,
            liked: true,
            tags: ['#plantcare', '#diseasehelp']
        },
        {
            id: '3',
            author: 'Raj Patel',
            avatar: require('../assets/tomato.png'),
            time: '1 day ago',
            content: 'Just harvested my first batch of Roma tomatoes for the season! What\'s everyone\'s favorite tomato variety to grow?',
            image: require('../assets/tomato.png'),
            likes: 45,
            comments: 23,
            liked: false,
            tags: ['#harvest', '#varieties']
        }
    ]);

    const [newPostModalVisible, setNewPostModalVisible] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleLike = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    liked: !post.liked,
                    likes: post.liked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const addNewPost = () => {
        if (newPostContent.trim() === '') return;

        const newPost = {
            id: String(posts.length + 1),
            author: 'You',
            avatar: require('../assets/tomato.png'),
            time: 'Just now',
            content: newPostContent,
            likes: 0,
            comments: 0,
            liked: false,
            tags: []
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
        setNewPostModalVisible(false);
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{item.author}</Text>
                    <Text style={styles.postTime}>{item.time}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Icon name="dots-vertical" size={20} color="#757575" />
                </TouchableOpacity>
            </View>

            <Text style={styles.postContent}>{item.content}</Text>

            {item.image && (
                <Image source={item.image} style={styles.postImage} />
            )}

            {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {item.tags.map(tag => (
                        <TouchableOpacity key={tag} style={styles.tagChip}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={styles.postActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleLike(item.id)}
                >
                    <Icon
                        name={item.liked ? "heart" : "heart-outline"}
                        size={22}
                        color={item.liked ? "#e53935" : "#757575"}
                    />
                    <Text style={styles.actionText}>{item.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="comment-outline" size={22} color="#757575" />
                    <Text style={styles.actionText}>{item.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="share-outline" size={22} color="#757575" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Icon name="magnify" size={20} color="#757575" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={[styles.filterChip, styles.activeFilter]}>
                    <Text style={styles.activeFilterText}>All Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterText}>My Feed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterText}>Popular</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.postsList}
            />

            <TouchableOpacity
                style={styles.newPostButton}
                onPress={() => setNewPostModalVisible(true)}
            >
                <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>

            {/* New Post Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={newPostModalVisible}
                onRequestClose={() => setNewPostModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create New Post</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setNewPostModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.postForm}>
                            <Image
                                source={require('../assets/tomato.png')}
                                style={styles.postFormAvatar}
                            />
                            <TextInput
                                style={styles.postInput}
                                placeholder="What's on your mind?"
                                multiline
                                value={newPostContent}
                                onChangeText={setNewPostContent}
                            />
                        </View>

                        <View style={styles.postOptions}>
                            <TouchableOpacity style={styles.postOption}>
                                <Icon name="image" size={22} color="#4CAF50" />
                                <Text style={styles.optionText}>Add Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.postOption}>
                                <Icon name="tag" size={22} color="#2196F3" />
                                <Text style={styles.optionText}>Add Tag</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.postButton,
                                !newPostContent.trim() && styles.disabledButton
                            ]}
                            onPress={addNewPost}
                            disabled={!newPostContent.trim()}
                        >
                            <Text style={styles.postButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
        height: 44,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 15,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    activeFilter: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    filterText: {
        fontSize: 13,
        color: '#757575',
    },
    activeFilterText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 'bold',
    },
    postsList: {
        padding: 16,
        paddingTop: 8,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    authorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    authorName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    postTime: {
        fontSize: 12,
        color: '#757575',
    },
    moreButton: {
        padding: 4,
    },
    postContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tagChip: {
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#757575',
    },
    postActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        fontSize: 13,
        color: '#757575',
        marginLeft: 4,
    },
    newPostButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    postForm: {
        flexDirection: 'row',
        padding: 16,
    },
    postFormAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    postInput: {
        flex: 1,
        minHeight: 100,
        maxHeight: 200,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    postOptions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    postOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    optionText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 6,
    },
    postButton: {
        backgroundColor: '#e53935',
        paddingVertical: 12,
        marginHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#e0e0e0',
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForumScreen;