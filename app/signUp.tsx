import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Link } from "expo-router";
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import images from '@constants/images';
import { signUp } from '../services/authService';

const SignUp = () => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const user = await signUp(email, password);
      alert('Registration successful!');
      console.log("Sign up Success:", user);
    } catch (error) {
      alert(`Registration failed:`);
      console.error("Reguster Failed:", );
    }
  };

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={images.checkIcon} style={{ width: 60, height: 60, marginBottom: 20 }} resizeMode="contain" />
          <Text className="text-white text-3xl font-bold mb-2">Sign up</Text>
          <Text className="text-gray-300 text-lg mb-6">GET STARTED</Text>

          <View className="w-[80%]">
            <Text className="text-white mb-1">Email</Text>
            <TextInput
              className="w-full border-b border-gray-400 text-white p-2"
              placeholder="Enter your email"
              placeholderTextColor="#A0AEC0"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="w-[80%] mt-6">
            <Text className="text-white mb-1">Password</Text>
            <TextInput
              className="w-full border-b border-gray-400 text-white p-2"
              placeholder="Enter your password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className="w-[80%] mt-6">
            <Text className="text-white mb-1">Confirm Password</Text>
            <TextInput
              className="w-full border-b border-gray-400 text-white p-2"
              placeholder="Confirm your password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View className="w-[80%] flex-row items-center mt-4">
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              color="white"
            />
            <Text className="text-gray-300 text-xs mr-2">I agree with privacy policy </Text>
            <Link href="/" className="text-blue-400 underline text-xs">Terms and Condition</Link>
          </View>

          <TouchableOpacity activeOpacity={0.8} className="mt-6" onPress={handleRegister}>
            <LinearGradient
              colors={['#8199B6', '#112D4E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-[300px] py-3 rounded-3xl items-center justify-center border-2 border-white"
            >
              <Text className="text-white text-lg font-bold">Register</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-300">You already have an account? </Text>
            <Link href="/signIn" className="text-blue-400 underline">Log in</Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUp;