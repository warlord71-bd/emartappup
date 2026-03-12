import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.subtitle}>How can we help you?</Text>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8
  }
});