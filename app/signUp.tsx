// 디렉토리: app/signUp.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker'; // [추가] Picker 라이브러리

const canadianProvinces = [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island",
    "Quebec", "Saskatchewan"
];

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [province, setProvince] = useState(canadianProvinces[0]); // [추가] 주(Province) 상태
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Sign Up Failed", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(username, password, role, province);
      Alert.alert('Sign Up Success', 'Account created successfully!');
      router.replace('/signIn');
    } catch (error) {
      Alert.alert('Sign Up Failed', 'Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* 역할 선택 UI */}
      <View style={styles.roleSelector}>
         <TouchableOpacity
          style={[styles.roleButton, role === 'employee' && styles.roleButtonActive]}
          onPress={() => setRole('employee')}
        >
          <Text style={[styles.roleText, role === 'employee' && styles.roleTextActive]}>Employee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'manager' && styles.roleButtonActive]}
          onPress={() => setRole('manager')}
        >
          <Text style={[styles.roleText, role === 'manager' && styles.roleTextActive]}>Manager</Text>
        </TouchableOpacity>
      </View>
      
      {/* [추가] 주 선택 Picker */}
      <View style={styles.pickerContainer}>
        <Picker
            selectedValue={province}
            onValueChange={(itemValue) => setProvince(itemValue)}>
            {canadianProvinces.map(p => <Picker.Item key={p} label={p} value={p} />)}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      
       <TouchableOpacity onPress={() => router.push('/signIn')} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center', color: '#007BFF' }}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

// [수정] 스타일 전체
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
  },
  roleButtonActive: {
    backgroundColor: '#007BFF',
  },
  roleText: {
    color: '#007BFF',
  },
  roleTextActive: {
    color: '#fff',
  },
  pickerContainer: {
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12
  }
});

export default SignUp;