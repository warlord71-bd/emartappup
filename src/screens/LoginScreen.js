import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email/phone and password');
      return;
    }

    const fakeName = emailOrPhone.includes('@')
      ? emailOrPhone.split('@')[0]
      : 'eMart User';

    signIn({
      name: fakeName,
      emailOrPhone,
    });

    navigation.navigate('AccountMain');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Welcome back to eMart BD</Text>

      <TextInput
        placeholder="Email or Phone"
        placeholderTextColor="#999"
        style={styles.input}
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.createText}>Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },
  signInBtn: {
    height: 52,
    backgroundColor: '#ff6b00',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  createBtn: {
    marginTop: 18,
    alignItems: 'center',
  },
  createText: {
    color: '#ff6b00',
    fontSize: 14,
    fontWeight: '600',
  },
});