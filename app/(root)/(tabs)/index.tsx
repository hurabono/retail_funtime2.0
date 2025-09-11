// 디렉토리: app/(root)/(tabs)/index.tsx

// [수정] StyleSheet와 useAuth import 추가
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import images from '@constants/images'; // [수정] 경로를 프로젝트 구조에 맞게 수정
import { useAuth } from '../../../context/AuthContext'; // [수정] 경로를 프로젝트 구조에 맞게 수정

const HomeScreen = () => {
  // [추가] useAuth hook을 사용하여 user 정보와 logout 함수 가져오기
  const { user, logout } = useAuth();

  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} className="flex-1 mt-10">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>
          <View style={styles.container}>
            {/* [수정] 헤더 부분: user와 logout을 사용하도록 수정 */}
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>Welcome, {user?.username || 'User'}!</Text>
                <Text style={styles.storeText}>Store: {user?.storeNumber || 'Not Assigned'}</Text>
              </View>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Announcement Bar */}
          <View className="bg-white rounded-full px-4 py-2 mt-3 flex-row justify-center items-center">
            <Image source={images.approval} style={{ width: 30 }} resizeMode="contain" />
            <Text className="text-gray-600 font-semibold">
              No announcement today - Nov 12 2024
            </Text>
          </View>

          {/* [삭제] 중복되는 헤더 섹션 제거 */}

          {/* Work Schedule Card */}
          <View className="bg-white px-4 py-5 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <View className="flex-row justify-between">
              {/* Date Info */}
              <View>
                <View className="flex-row justify-between items-center mb-2" >
                  <Text className="bg-[#112D4E] text-white px-2 py-1 font-semibold rounded-full w-[140px]">
                    Nov 12 / 2024
                  </Text>
                  <Image className="absolute right-[-30px] top-[-7px]" source={images.Indexcalendar} style={{ width: 70 }} resizeMode="contain" />
                </View>
                <View className="mt-3">
                  <Text className="text-[#112D4E] font-medium underline">week42</Text>
                  <Text className="text-[#3F72AF] text-lg font-bold">NO SCHEDULE</Text>
                </View>
              </View>

              {/* Clock Status */}
              <View className="items-start">
                <View className="flex-row justify-between items-center mb-2 pr-2" >
                  <Text className="bg-[#112D4E] text-white px-2 py-1 font-semibold rounded-full w-[140px] ">
                   Current Status
                  </Text>
                  <Image className="absolute right-[-15px] top-[-11px]" source={images.IndexClock} style={{ width: 60 }} resizeMode="contain" />
                </View>
                <View className="w-full mt-2">
                  <Text className="text-[#112D4E] font-semibold">Clocked out</Text>
                  <TouchableOpacity className="bg-[#3F72AF] py-2 px-0 rounded-full mt-2">
                    <Link className="inline-block flex items-center justify-center" href="/_WorkingHours">
                      <Text className="text-white font-semibold items-end text-center text-sm">Clock In</Text>
                    </Link>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Flexible Schedule Section */}
          <View className="mt-6 flex flex-row justify-center items-center">
            <View>
              <Image source={images.reschedule} style={{ width: 200, }} resizeMode="contain" />
            </View>
            <View className="w-[170px] mr-5">
              <Text className="text-white text-xl font-bold">
                Looking for flexible schedule?
              </Text>
              <TouchableOpacity>
                <Text className="text-white underline mt-1">
                  Swipe your schedule here
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="bg-white px-3 py-5 mt-6 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity className="items-center">
                <Image source={images.requestIcon} style={{ width: 100, }} resizeMode="contain" />
                <Text className="text-[#3F72AF] font-semibold text-xs">View My</Text>
                <Link href="/_MyRequest">
                  <Text className="text-[#3F72AF] font-semibold text-base">Request</Text>
                </Link>
              </TouchableOpacity>
              <View className="h-[100px] bg-[#3F72AF] w-[0.5px]"></View>
              <TouchableOpacity className="items-center">
                <Image source={images.fullscheduleIcon} style={{ width: 100, }} resizeMode="contain" />
                <Text className="text-[#3F72AF] font-semibold text-xs">View My</Text>
                <Link href="/_Schedule">
                  <Text className="text-[#3F72AF] font-semibold text-base">Schedule</Text>
                </Link>
              </TouchableOpacity>
              <View className="h-[100px] bg-[#3F72AF] w-[0.5px]"></View>
              <TouchableOpacity className="items-center">
                <Image source={images.paymentIcon} style={{ width: 100, }} resizeMode="contain" />
                <Text className="text-[#3F72AF] font-semibold text-xs mt-2">View My</Text>
                <Link href="/payment">
                  <Text className="text-[#3F72AF] font-semibold text-base">Payment</Text>
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// [추가] styles 객체 생성
const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  storeText: {
    fontSize: 14,
    color: '#ddd'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mainContent: {
    // 필요한 경우 여기에 스타일 추가
  },
  title: {
    // 필요한 경우 여기에 스타일 추가
  }
});

export default HomeScreen;