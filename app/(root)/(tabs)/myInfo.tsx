import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Clipboard, Platform } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@constants/images';
import { Link,useFocusEffect } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AppText } from "../../../components/AppText";


interface UserInfo {
  _id: string;
  username: string;
  employeeNumber: string;
  storeNumber: string;
  hourlyWage: number;
  retailNumber: string;
  role: string;
  province: string;
  createdAt: string;
  profileImage?: string;
  manager?: { username: string };
  address?: string;
  timeLogs?: { clockIn?: string; clockOut?: string }[];
}

const API_URL = 'http://localhost:4000/api/auth';



const myInfo = () => {
  const { token } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [todayClockIn, setTodayClockIn] = useState('Available');
  const [todayClockOut, setTodayClockOut] = useState('Available');

  
  const fetchMyInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/me`, {
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

  useFocusEffect(
    useCallback(() => {
      if (token) fetchMyInfo();
    }, [token])
  );

  useEffect(() => {
    if (userInfo?.timeLogs) {
      setProfileImage(userInfo.profileImage || null);
      const today = new Date();
      const todayLog = userInfo.timeLogs.find(log => {
        if (!log.clockIn) return false;
        const clockInDate = new Date(log.clockIn);
        return clockInDate.getFullYear() === today.getFullYear() &&
               clockInDate.getMonth() === today.getMonth() &&
               clockInDate.getDate() === today.getDate();
      });
      if (todayLog) {
        setTodayClockIn(formatTime(todayLog.clockIn!));
        setTodayClockOut(todayLog.clockOut ? formatTime(todayLog.clockOut) : 'In Progress');
      } else {
        setTodayClockIn('Available');
        setTodayClockOut('Available');
      }
    }
  }, [userInfo]);

  const pickImage = async () => {
  // 권한 요청
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Camera roll permissions are required!');
    return;
  }

  // 이미지 선택
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.3, // 압축
  });

  if (!result.canceled) {
    const imageUri = result.assets[0].uri;

    try {
      let formData = new FormData();
      // 웹에서는 Blob으로 변환
      if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('image', blob, 'profile.jpg');
      } else {
        // 모바일(Android/iOS)
        formData.append('image', {
          uri: imageUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const response = await axios.put(`${API_URL}/me/photo`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        // 서버가 profileImage(base64)를 반환한다고 가정
        setProfileImage(response.data.profileImage);

        Alert.alert('Success', 'Profile image uploaded successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  }
};

  const removeImage = async () => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setProfileImage(null);
              await axios.put(`${API_URL}/me/photo`,
                { image: "" },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } catch (error) {
              console.error("Image removal failed:", error);
              Alert.alert("Error", "Could not remove image.");
              setProfileImage(userInfo?.profileImage || null);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const calculateTenure = (startDate: string) => {
    if (!startDate) return 'N/A';
    const start = new Date(startDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years > 0) return `${years} YEAR${years > 1 ? 'S' : ''}`;
    return `${months} MONTH${months > 1 ? 'S' : ''}`;
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'Employee number has been copied to clipboard.');
  };

  if (loading) {
    return (
      <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }

  if (!userInfo) {
    return (
      <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Could not load user information.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView className='mt-5' style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}>
          {/* profile top information */}
          <View className="flex-row justify-between items-center mt-6">
            <AppText className="text-white text-xl font-bold">🏪 <Text className="underline">Store: {userInfo.storeNumber}</Text></AppText>
          </View>

          <View className="mt-4">
            <AppText className="text-gray-300 text-xs">📅 {calculateTenure(userInfo.createdAt)}</AppText>
            <AppText className="text-white text-3xl font-bold mt-2 mb-5 tracking-wider">Hello, {userInfo.username}!</AppText>
            <Text className="text-gray-300 mt-1">Hired : {formatDate(userInfo.createdAt)}</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-gray-300">WIN {userInfo.employeeNumber} </Text>
              <TouchableOpacity onPress={() => copyToClipboard(userInfo.employeeNumber)}>
                <Text className="text-blue-400 underline">COPY</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="self-end mt-[-50px] w-[110px] h-[110px] items-center justify-center">
            {profileImage ? (
              <View>
                <Image source={{ uri: profileImage }} style={{ width: 110, height: 110, borderRadius: 55 }} />
                <TouchableOpacity
                  onPress={removeImage}
                  style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, padding: 4 }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>X</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="w-full h-full border-dashed border-2 border-gray-300 rounded-lg items-center justify-center p-4"
              >
                <Image source={images.profilePlaceholder} style={{ width: 50 }} resizeMode="contain" />
                <Text className="text-gray-300 text-xs text-center mt-1">Add my profile photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* My Availability */}
          <View className="bg-white rounded-xl p-5 mt-6 shadow-md border-4 border-[#3F72AF]">
            <AppText className="text-[#3F72AF] font-bold">My Availability</AppText>
            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-gray-500">Start</Text>
                <AppText className="text-[#3F72AF] font-bold">{todayClockIn}</AppText>
              </View>
              <View>
                <Text className="text-gray-500">End</Text>
                <AppText className="text-[#3F72AF] font-bold">{todayClockOut}</AppText>
              </View>
              <Image source={images.calendarIcon} style={{ width: 80 }} />
            </View>
            
            <TouchableOpacity className="mt-4 bg-secondary py-2 rounded-xl items-center">
              <Link href="/_Schedule" className="inline-block flex items-center justify-center">
              <AppText className="text-white font-bold tracking-wider">View Details</AppText>
              </Link>
            </TouchableOpacity>
          </View>

          {/* Job Information */}
          <View className="bg-white rounded-xl p-5 mt-6 shadow-md border-4 border-[#3F72AF]">
            <AppText className="text-[#3F72AF] font-bold">Job Information</AppText>
            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-gray-500">My role</Text>
                <AppText className="text-[#3F72AF] font-bold">{userInfo.role}</AppText>
              </View>
              <View>
                <Text className="text-gray-500">Reporting to</Text>
                <AppText className="text-[#3F72AF] font-bold">{userInfo.manager ? userInfo.manager.username : 'N/A'}</AppText>
              </View>
            </View>
            <View className="mt-4">
              <Text className="text-gray-500">Retail Number</Text>
              <AppText className="text-[#3F72AF] font-bold">{userInfo.retailNumber || 'N/A'}</AppText>
            </View>
            <View className="mt-4">
              <Text className="text-gray-500">Office</Text>
              <AppText className="text-[#3F72AF] font-bold">{userInfo.address || 'N/A'}</AppText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default myInfo;
