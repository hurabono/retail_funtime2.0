// app/signUp.tsx
// 🎨 진짜 최종 디자인 복구 완료 (Tailwind CSS) 🎨
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Checkbox } from "react-native-paper";
import images from '@constants/images';
import { useAuth } from "../context/AuthContext"; // 수정된 AuthContext 사용

const SignUp = () => {
  const [checked, setChecked] = useState(false);
  // 기능 유지를 위해 email 대신 username을 사용하도록 수정했습니다.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (!checked) {
      Alert.alert("Error", "Please agree to the terms and conditions.");
      return;
    }

    try {
      // 기능 유지를 위해 'employee', 'Ontario'를 기본값으로 전달합니다.
      await register(username, password, "employee", "Ontario");
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => router.replace("/signIn") },
      ]);
    } catch (error) {
      Alert.alert("Registration Failed", "This username may already be taken.");
    }
  };

  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={images.checkIcon}
            style={{ width: 60, height: 60, marginBottom: 20 }}
            resizeMode="contain"
          />
          <Text className="text-white text-3xl font-bold">Register</Text>
          <Text className="text-gray-300 mt-1">Create your account</Text>

          <View className="w-[300px] mt-6">
            <Text className="text-gray-300">• Username</Text>
            <TextInput
              className="border-b border-gray-400 text-white p-2"
              placeholder="Enter your username"
              placeholderTextColor="#A0AEC0"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View className="w-[300px] mt-4">
            <Text className="text-gray-300">• Password</Text>
            <TextInput
              className="border-b border-gray-400 text-white p-2"
              placeholder="Enter your password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className="w-[300px] mt-4">
            <Text className="text-gray-300">• Confirm Password</Text>
            <TextInput
              className="border-b border-gray-400 text-white p-2"
              placeholder="Confirm your password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View className="w-[80%] flex-row items-center mt-4">
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(!checked)}
              color="white"
            />
            <Text className="text-gray-300 text-xs mr-2">
              I agree with privacy policy{" "}
            </Text>
            <Link href="/" className="text-blue-400 underline text-xs">
              Terms and Condition
            </Link>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-6"
            onPress={handleRegister}
          >
            <LinearGradient
              colors={["#8199B6", "#112D4E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-[300px] py-3 rounded-3xl items-center justify-center border-2 border-white"
            >
              <Text className="text-white text-lg font-bold">Register</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-300">You already have an account? </Text>
            <Link href="/signIn" className="text-blue-400 underline">
              Log in
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUp;