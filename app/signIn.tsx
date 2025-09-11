// app/signIn.tsx
// 🎨 디자인 복구 완료 🎨
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
    try {
      // Assuming 'employee' role for sign-in for now.
      // You might want to add a role selection UI if needed.
      await login(username, password, "employee");
      router.replace("/(root)/(tabs)"); // Navigate to the main screen
    } catch (error) {
      Alert.alert("Login Failed", "Invalid username or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/storeImage.png")} // Local image
        style={styles.logo}
      />
      <Text style={styles.title}>Retail FunTime</Text>
      <Text style={styles.subtitle}>
        Log in to your account to continue...
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#A0A0A0"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Link href="/recoverPassword" style={styles.link}>
          Forgot Password?
        </Link>
        <Link href="/signUp" style={styles.link}>
          Don't have an account? Sign Up
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E3A8A", // Dark Blue
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280", // Gray
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB", // Blue
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#2563EB",
    fontSize: 14,
    marginVertical: 5,
  },
});

export default SignIn;