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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth(); // AuthContext의 login 함수 사용

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      // 로그인 성공 시 AuthContext의 useEffect가 자동으로 홈 화면으로 이동시킵니다.
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
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
              value={email}
              onChangeText={setEmail}
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