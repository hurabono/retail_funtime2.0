import React, { useEffect, useState, useCallback } from "react"; 
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router"; 
import { Ionicons, MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from '../../../context/AuthContext';
import axios from "axios";
import { AppText } from "../../../components/AppText";

const API_URL = 'https://retail-funtime-backend.onrender.com/api/auth';

interface UserInfo {
  storeNumber: string;
}



const SettingsScreen = () => {
  const { token } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  // 홈 화면에 내 정보 패치시켜두기
  const fetchMyInfo = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.get('https://retail-funtime-backend.onrender.com/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setUserInfo(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch user information.');
    } finally {
      setLoading(false);
    }
  };


  // This is the key change. This hook runs whenever the screen comes into focus.
    useFocusEffect(
      useCallback(() => {
      fetchMyInfo();
    }, [token])
    );


  const settingsItems = [
    { label: "Data saver", icon: <Ionicons name="filter" size={20} color="#3F72AF" /> },
    { label: "Language", icon: <Ionicons name="language" size={20} color="#3F72AF" /> },
    { label: "Push notifications", icon: <Ionicons name="notifications" size={20} color="#3F72AF" /> },
    { label: "Associate info", icon: <Ionicons name="information-circle" size={20} color="#3F72AF" /> },
    { label: "Change PIN", icon: <Entypo name="lock" size={20} color="#3F72AF" /> },
    { label: "App version", icon: <MaterialIcons name="app-settings-alt" size={20} color="#3F72AF" /> },
    { label: "Terms and Conditions", icon: <FontAwesome5 name="file-contract" size={18} color="#3F72AF" /> },
  ];

  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView 
          contentContainerStyle={{
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          {/* Header */}
          <AppText className="text-white text-2xl font-bold text-center my-6 tracking-wider">Settings</AppText>

          {/* WIN + Logout */}
          <View className="flex-row justify-between items-center mb-4">
            <AppText className="text-white font-semibold">🏪 Store{userInfo?.storeNumber}</AppText>
            <TouchableOpacity>
              <AppText className="text-white underline font-bold">Logout</AppText>
            </TouchableOpacity>
          </View>

          {/* Help section */}
          <TouchableOpacity className="mb-8">
            <AppText className="text-white text-sm">
              Do you need any help?{" "}
              <Text className="underline font-semibold ml-2">Click here</Text>
            </AppText>
          </TouchableOpacity>

          {/* Settings buttons */}
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white py-3 px-5 rounded-2xl mb-6 flex-row justify-between items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              {/* icon + test */}
              <View className="flex-row items-center space-x-3">
                {item.icon}
                <AppText className="text-[#112D4E] font-semibold text-base">
                  {item.label}
                </AppText>
              </View>

              {/*arrow icons */}
              <Ionicons name="chevron-forward" size={22} color="#3F72AF" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsScreen;
