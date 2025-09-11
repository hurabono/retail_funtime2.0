import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// [삭제] 잘못된 import 경로 제거
// import { registerUser } from '../services/authService';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  // [수정] API 호출 로직으로 변경
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Sign Up Failed", "Passwords do not match.");
      return;
    }

    try {
      // ⚠️ 중요: YOUR_BACKEND_API_URL을 실제 백엔드 주소로 변경해야 합니다.
      const response = await fetch('http://YOUR_BACKEND_API_URL/api/auth/register/manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공
        Alert.alert('Sign Up Success', 'Your account has been created.');
        // 성공 후 로그인 페이지로 이동
        router.push('/signIn');
      } else {
        // 회원가입 실패
        Alert.alert('Sign Up Failed', data.msg || 'An error occurred.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Sign Up Error', 'Could not connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
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
});

export default SignUp;