// 디렉토리: app/signIn.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // [수정] useAuth hook 사용

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // [수정] 역할 상태 추가
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await login(username, password, role);
      // 성공 시 _layout에서 자동으로 라우팅 처리
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {/* [추가] 역할 선택 UI */}
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
      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>
      
      {/* [추가] 회원가입 페이지로 이동하는 버튼 */}
      <TouchableOpacity onPress={() => router.push('/signUp')} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center', color: '#007BFF' }}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  // [추가] 스타일
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
  }
});

export default SignIn;