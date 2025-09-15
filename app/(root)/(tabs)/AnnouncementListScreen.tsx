import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

const API_URL = 'http://localhost:4000/api/auth';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdBy: string; 
  createdAt?: string; 
}


const AnnouncementListScreen = () => {
  const { user, token } = useAuth(); // ✅ token 추가
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    if (!token) return; // 토큰 없으면 fetch 안 함
    try {
      const { data } = await axios.get(`${API_URL}/announcements`, {
        headers: { Authorization: `Bearer ${token}` } // ✅ 토큰 헤더 추가
      });
      console.log(data);
      setAnnouncements(data);
    } catch (error: any) {
      console.error("❌ Fetch error:", error.response || error.message);
      Alert.alert("Error", "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [token]);

  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView className="flex-1 mt-10">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-5">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-white text-2xl font-bold">📋 Announcements</Text>
            <Text className="text-gray-200 mt-1 text-sm">Hello, {user?.name || "User"}!</Text>
          </View>

          {/* Loading */}
          {loading ? (
            <ActivityIndicator size="large" color="#fff" className="mt-10" />
          ) : announcements.length === 0 ? (
            <Text className="text-white text-center mt-10">No announcements available</Text>
          ) : (
            announcements.map((ann) => (
              <View
                    key={ann._id}
                    className="bg-white px-4 py-4 mb-4 rounded-xl shadow-lg border-2 border-[#3F72AF]"
                >
                    <Text className="text-[#112D4E] font-bold text-lg">{ann.title}</Text>
                    <Text className="text-gray-600 mt-1">{ann.content}</Text>
                    <Text className="text-gray-400 text-xs mt-1">
                     By {ann.createdBy} | {ann.createdAt ? new Date(ann.createdAt).toLocaleString() : ''}
                    </Text>
                </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AnnouncementListScreen;
