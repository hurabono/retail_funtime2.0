import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Clipboard } from 'react-native';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@constants/images'; // image path
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// 사용자 정보 타입을 정의합니다.
interface UserInfo {
  _id: string;
  username: string;
  employeeNumber: string;
  storeNumber: string;
  hourlyWage: number;
  retailNumber: string;
  role: string;
  province: string;
  createdAt: string; // 'hired' 날짜로 사용될 필드
  manager?: {
    username: string;
  }
}

const myInfo = () => {
  const { token } = useAuth(); // AuthContext에서 토큰을 가져옵니다.
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 화면이 포커스될 때마다 최신 사용자 정보를 가져오는 함수
  const fetchMyInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` } // 헤더에 토큰 추가
      });
      setUserInfo(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch user information.');
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect를 사용하여 화면이 보일 때마다 데이터를 새로고침
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchMyInfo();
      }
    }, [token])
  );

  // 날짜 포맷 변경 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // 근무 기간 계산 함수
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

    if (years > 0) {
        return `${years} YEAR${years > 1 ? 'S' : ''}`;
    }
    return `${months} MONTH${months > 1 ? 'S' : ''}`;
  };
  
  // 클립보드 복사 함수
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'Employee number has been copied to clipboard.');
  };

  // 로딩 중일 때 표시될 화면
  if (loading) {
    return (
      <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }

  // 사용자 정보가 없을 때 표시될 화면
  if (!userInfo) {
    return (
      <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{color: 'white', fontSize: 18}}>Could not load user information.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView className='mt-5' style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>

          {/* profile top information */}
          <View className="flex-row justify-between items-center mt-6">
              {/* Employee Store information */}
            <Text className="text-white text-xl font-bold">🏪 <Text className="underline">Store: {userInfo.storeNumber}</Text></Text>
          </View>

              {/* Employee Working information */}
          <View className="mt-4">
            <Text className="text-gray-300 text-xs">📅 {calculateTenure(userInfo.createdAt)}</Text>
            <Text className="text-white text-3xl font-bold mt-2 mb-5">Hello, {userInfo.username}!</Text>
            <Text className="text-gray-300 mt-1">Hired : {formatDate(userInfo.createdAt)}</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-gray-300">WIN {userInfo.employeeNumber} </Text>
              <TouchableOpacity onPress={() => copyToClipboard(userInfo.employeeNumber)}>
                  {/* Copy Employee number */}
                <Text className="text-blue-400 underline">COPY</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* profile photo upload button */}
          <TouchableOpacity className="self-end mt-[-50px] border-dashed border-2 border-gray-300 p-4 rounded-lg items-center p-8">
             <Image source={images.profilePlaceholder} style={{ width: 50 }} resizeMode="contain" />
            <Text className="text-gray-300 text-xs text-center mt-1">Add my profile photo</Text>
          </TouchableOpacity>

          {/* My Availability */}
          <View className="bg-white rounded-xl p-5 mt-6 shadow-md border-4 border-[#3F72AF]">
            <Text className="text-[#3F72AF] font-bold">My Availability</Text>
            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-gray-500">Start</Text>
                <Text className="text-[#3F72AF] font-bold">Oct. 5, 2024</Text>
              </View>
              <View>
                <Text className="text-gray-500">End</Text>
                <Text className="text-[#3F72AF] font-bold">No end date</Text>
              </View>
            
              {/* Calender Image */}
              <Image source={images.calendarIcon} style={{ width: 80}} />
            </View>
            <TouchableOpacity className="mt-4 bg-secondary py-2 rounded-xl items-center">
            
              {/* Move to Full Schedule */}
              <Text className="text-white font-bold">View Details</Text>
            </TouchableOpacity>
          </View>

          {/* Job Information */}
          <View className="bg-white rounded-xl p-5 mt-6 shadow-md  border-4 border-[#3F72AF]">
            <Text className="text-[#3F72AF] font-bold">Job Information</Text>
            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-gray-500">My role</Text>
                <Text className="text-[#3F72AF] font-bold">{userInfo.role}</Text>
              </View>
              <View>
                <Text className="text-gray-500">Reporting to</Text>
                <Text className="text-[#3F72AF] font-bold">{userInfo.manager ? userInfo.manager.username : 'N/A'}</Text>
              </View>
            </View>

            <View className="mt-4">
              {/* Cost Center -> Retail Number로 변경 */}
              <Text className="text-gray-500">Retail Number</Text> 
              <Text className="text-[#3F72AF] font-bold">{userInfo.retailNumber || 'N/A'}</Text>
            </View>

            <View className="mt-4">
              <Text className="text-gray-500">Office</Text>
              <Text className="text-[#3F72AF] font-bold">234 Bily Bishop Way, Oakville, ON L6H 6M4</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default myInfo;

