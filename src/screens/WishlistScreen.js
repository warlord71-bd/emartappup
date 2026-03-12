import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WishlistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      <Text style={styles.subtitle}>Your wishlist is empty.</Text>
    </View>
  );
};

export default WishlistScreen;

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