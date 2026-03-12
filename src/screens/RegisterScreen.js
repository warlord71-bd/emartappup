import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    register({
      name: fullName,
      phone,
      email,
    });

    navigation.navigate('AccountMain');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Account</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#999"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.backText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },
  registerBtn: {
    height: 50,
    backgroundColor: '#ff6b00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: {
    marginTop: 18,
    alignItems: 'center',
  },
  backText: {
    color: '#ff6b00',
    fontSize: 14,
    fontWeight: '600',
  },
});