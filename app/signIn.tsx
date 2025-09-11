import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from "expo-router";
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@constants/images';
import { Checkbox } from 'react-native-paper';
import { useAuth } from '../context/AuthContext'; // useAuth 훅 가져오기

const SignIn = () => {
  const [checked, setChecked] = useState(false);
  // [수정] email 상태를 username으로 변경하여 백엔드와 일관성 유지
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth(); // AuthContext의 login 함수 사용

  const handleLogin = async () => {
    // [수정] email을 username으로 변경
    if (!username || !password) {
      // [수정] 알림 메시지에서 'email'을 'username'으로 변경
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      // [수정] login 함수에 username 전달
      await login(username, password);
      // 로그인 성공 시 AuthContext의 useEffect가 자동으로 홈 화면으로 이동시킵니다.
    } catch (error) {
      // [수정] 알림 메시지에서 'email'을 'username'으로 변경
      Alert.alert('Login Failed', 'Invalid username or password.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={images.onboarding} style={{ width: '50%' }} resizeMode="contain" />
          <Text className="text-white text-3xl font-bold text-center mb-10 mt-5">Retail Fun Time</Text>
          <Text className="text-gray-300 text-center text-xl">GET STARTED</Text>

          <View className="mt-8">
            <Text className="text-white">User Email</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Enter your Email"
              placeholderTextColor="#A0AEC0"
              // [수정] value와 onChangeText를 username 상태와 연결
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-6">
            <Text className="text-white">Password</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Enter your password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className="w-full flex-row justify-around items-center mt-4">
            <TouchableOpacity>
              <Link href="./recoverPassword" className="text-gray-300 underline">Forget password?</Link>
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Text className="text-gray-300">Remember me</Text>
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => setChecked(!checked)}
                color="white"
              />
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} className="mt-6" onPress={handleLogin} disabled={isSubmitting}>
            <LinearGradient
              colors={['#8199B6', '#112D4E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-[300px] py-3 rounded-3xl items-center justify-center border-2 border-white"
            >
              <Text className="text-white text-lg font-bold">
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-300">Don’t have an account? </Text>
            <TouchableOpacity>
              <Link href="./signUp" className="text-blue-400 underline">Register now</Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignIn;