import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { Link } from "expo-router";
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@constants/images';
import { Checkbox } from 'react-native-paper';
import { signIn } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await signIn(email, password);
      if (checked) {
        await AsyncStorage.setItem('rememberMe', JSON.stringify({ email, password }));
      }
      // 로그인 성공 후 리다이렉트 로직 추가
    } catch (error) {
      alert("Login failed: " + (error as Error).message);
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
            <Text className="text-white">User id</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Enter your Id"
              placeholderTextColor="#A0AEC0"
              value={email}
              onChangeText={setEmail}
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

          <TouchableOpacity activeOpacity={0.8} className="mt-6" onPress={handleLogin}>
            <LinearGradient
              colors={['#8199B6', '#112D4E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-[300px] py-3 rounded-3xl items-center justify-center border-2 border-white"
            >
              <Text className="text-white text-lg font-bold">Log in</Text>
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