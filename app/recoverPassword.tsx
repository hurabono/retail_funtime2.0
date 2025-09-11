import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import { Link } from "expo-router";

const recoverPassword = () => {
  const [checked, setChecked] = useState(false);

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Icon and Title */}
          <Text style={{ fontSize: 50 }}>🔑</Text>
          <Text className="text-white text-3xl font-bold mt-2">Password recovery</Text>
          <Text className="text-gray-300 mt-1">Forget my password</Text>

          {/* Email Input */}
          <View className="w-[300px] mt-6">
            <Text className="text-gray-300">• Email</Text>
            <View className="flex-row items-center border-b border-gray-400">
              <TextInput className="flex-1 text-white p-2" placeholder="Enter your email" placeholderTextColor="#A0AEC0" />

              {/* Email Verify Button */}
              <TouchableOpacity className="border border-gray-300 px-3 py-1 rounded-lg">
                <Text className="text-gray-300">Verify</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Enter the password */}
          <View className="w-[300px] mt-6">
            <Text className="text-gray-300">• New password</Text>
            <TextInput className="border-b border-gray-400 text-white p-2" placeholder="Enter new password" placeholderTextColor="#A0AEC0" secureTextEntry />
          </View>

          {/* verify Number */}
          <View className="w-[300px] mt-6">
            <Text className="text-gray-300">• Verify Number</Text>
            <TextInput className="border-b border-gray-400 text-white p-2" placeholder="Enter verification code" placeholderTextColor="#A0AEC0" />
          </View>

          {/* Terms and condition Checkbox */}
          <View className="w-[80%] flex-row items-center mt-4">
                      <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={() => setChecked(!checked)} color="white" />
                      <Text className="text-gray-300 text-xs mr-2">I agree with privacy policy </Text>
                      <Link href="/" className="text-blue-400 underline text-xs">Terms and Condition</Link>
        </View>

          {/* Revoer Button */}
          <TouchableOpacity activeOpacity={0.8} className="mt-6">
            <LinearGradient colors={['#4A7DB5', '#1E3A68']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="w-[300px] py-3 rounded-3xl items-center justify-center border-2 border-gray-300">
              <Text className="text-gray-300 text-lg font-bold">Recover</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* LogIn Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-300">You already have an account? </Text>
            <TouchableOpacity>
              <Link href="./signIn" className="text-blue-300 underline">Log in</Link>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default recoverPassword;
