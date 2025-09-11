import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// [삭제] 잘못된 import 경로 제거
// import { loginUser } from '../services/authService';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // [수정] API 호출 로직 추가
  const handleSignIn = async () => {
    // 'employee' 또는 'manager'를 선택하는 UI가 필요하지만, 우선 'employee'로 고정
    const role = 'employee';

    try {
      // 백엔드 서버의 주소를 입력해야 합니다.
      // 예: http://<your-backend-ip-address>:5000/api/auth/login
      const response = await fetch('http://YOUR_BACKEND_API_URL/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공 시 토큰 저장 및 메인 화면으로 이동
        // 예: AsyncStorage.setItem('token', data.token);
        Alert.alert('Login Success', `Welcome ${username}`);
        router.push('/'); // 메인 화면으로 이동
      } else {
        Alert.alert('Login Failed', data.msg || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
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

export default SignIn;