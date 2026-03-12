import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      <Text style={styles.subtitle}>No payment methods added.</Text>
    </View>
  );
};

export default PaymentsScreen;

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