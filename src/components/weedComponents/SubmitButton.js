import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';

const SubmitButton = ({ onPress, title, isLoading, disabled }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        isLoading && styles.loadingButton
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="white" />
          <Text style={[styles.buttonText, styles.loadingText]}>Processing...</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    elevation: 0,
  },
  loadingButton: {
    backgroundColor: '#64B5F6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
});

export default SubmitButton;