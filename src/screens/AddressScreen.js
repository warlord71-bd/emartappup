import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddressScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Address</Text>
      <Text style={styles.subtitle}>No address added yet.</Text>
    </View>
  );
};

export default AddressScreen;

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