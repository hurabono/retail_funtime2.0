import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Link, router } from "expo-router";
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import images from '@constants/images';
import api from '../services/api';

const SignUp = () => {
  const [checked, setChecked] = useState(false);
  // ✅ [CORRECTED] Changed state from 'name' and 'email' to 'username'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    setIsSubmitting(true);
    try {
      // ✅ [CORRECTED] Changed endpoint and payload to match backend
      await api.post('/auth/register', { 
        username, 
        password, 
        role: 'employee' // Defaulting role to 'employee'
      });

      Alert.alert('Success', 'Registration successful! Please log in.');
      router.replace('/signIn');
    } catch (error) {
      const errorMessage ='An unexpected error occurred.';
      Alert.alert('Registration Failed', errorMessage);
      console.error("Register Failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={images.checkIcon} style={{ width: 60, height: 60, marginBottom: 20 }} resizeMode="contain" />
          <Text className="text-white text-3xl font-bold mb-2">Sign up</Text>
          <Text className="text-gray-300 text-lg mb-6">GET STARTED</Text>
          
          {/* ✅ [CORRECTED] Changed inputs to a single 'Username' field */}
          <View className="w-[80%] mt-4">
            <Text className="text-white mb-1">Username</Text>
            <TextInput
              className="w-full border-b border-gray-400 text-white p-2"
              placeholder="Enter your username"
              placeholderTextColor="#A0AEC0"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
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

          <TouchableOpacity activeOpacity={0.8} className="mt-6" onPress={handleRegister} disabled={isSubmitting}>
            <LinearGradient
              colors={['#8199B6', '#112D4E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-[300px] py-3 rounded-3xl items-center justify-center border-2 border-white"
            >
              <Text className="text-white text-lg font-bold">
                {isSubmitting ? 'Registering...' : 'Register'}
              </Text>
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