import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { AppText } from "../../../components/AppText";


const API_URL = 'https://retail-funtime-backend.onrender.com/api/auth';

interface Announcement {
  _id: string;
  title: string;
  content: string;
}

const AnnouncementManagerScreen = () => {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncements = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(data);
    } catch (error: any) {
      console.error("❌ Fetch error:", error.response || error.message);
    }
  };

  const handlePost = async () => {
  if (!title || !content) {
    Alert.alert("Error", "Please fill out all fields.");
    return;
  }

  if (!token) {
    Alert.alert("Error", "You are not logged in.");
    return;
  }

  try {
    const { data } = await axios.post(
      `${API_URL}/announcements`,
      { title, content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 서버에서 반환한 마지막 공지를 뽑아 추가
    const newAnn = data.announcements[data.announcements.length - 1];

    setAnnouncements(prev => [newAnn, ...prev]); // ✅ 한번만 호출

    setTitle("");
    setContent("");
    Alert.alert("Success", "Announcement posted successfully!");
  } catch (error: any) {
    console.error("❌ Axios error:", error.response || error.message);
    Alert.alert("Error", "Failed to post announcement.");
  }
};



  const handleDelete = async (id: string) => {
  if (!token) return;

  try {
    await axios.delete(`${API_URL}/announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 삭제 후 local state에서 제거
    setAnnouncements(prev => prev.filter(ann => ann._id !== id));
    Alert.alert("Deleted", "Announcement deleted successfully.");
  } catch (error: any) {
    console.error("❌ Delete error:", error.response || error.message);
    Alert.alert("Error", "Failed to delete announcement.");
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
            <AppText className="text-white text-2xl font-bold text-center my-6 tracking-wider"> Manage Announcements</AppText>
            <AppText className="text-gray-200 mt-1 text-sm text-center">Hello, Manager!</AppText>
          </View>

          {/* Form */}
          <View className="bg-white rounded-xl px-4 py-5 shadow-lg border-4 border-[#3F72AF] mb-6">
            <AppText className="text-[#112D4E] font-bold mb-2 tracking-wider">Title</AppText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter announcement title"
              className="border border-gray-300 rounded-lg p-2 mb-4"
            />

            <AppText className="text-[#112D4E] font-bold mb-2 tracking-wider">Content</AppText>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Enter announcement content"
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg p-2 mb-4 h-[100px] text-start"
            />

            <TouchableOpacity
              onPress={handlePost}
              className="bg-[#3F72AF] py-3 rounded-lg mt-2"
            >
              <AppText className="text-white text-center font-bold tracking-wider">Post Announcement</AppText>
            </TouchableOpacity>
          </View>

          {/* ✅ Announcements List */}
          <View>
            {announcements.map(ann => (
                <View key={ann._id ?? Math.random().toString()} className="bg-white rounded-xl p-4 mb-3 shadow-md border-2 border-[#3F72AF]">
                    <AppText className="text-[#112D4E] font-bold text-lg">{ann.title}</AppText>
                    <Text className="text-gray-500 mt-1">{ann.content}</Text>
                    <TouchableOpacity
                        onPress={() => handleDelete(ann._id)}
                        className="bg-[#112D4E] py-1 px-3 rounded-lg mt-2 self-end"
                    >
                        <AppText className="text-white text-sm font-bold text-center">Delete</AppText>
                    </TouchableOpacity>
                </View>
                ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AnnouncementManagerScreen;
