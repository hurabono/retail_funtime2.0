import React, { useEffect, useState, useCallback } from "react"; 
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useFocusEffect } from "expo-router"; 
import images from '@constants/images';
import { useAuth } from '../../../context/AuthContext';
import axios from "axios";
import { AppText } from "../../../components/AppText";


const API_URL = 'https://retail-funtime-backend.onrender.com/api/auth';

// Interfaces (no changes)
interface Announcement {
  _id: string;
  title: string;
  createdAt?: string;
}

interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
  workHours: number;
  position: string;
}

interface TimeLog {
  clockIn?: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
}

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
  manager?: {
  username: string;
}
  address?: string;
  schedules?: Schedule[];
  timeLogs?: TimeLog[];
}

const Index = () => {
  const { user, token, logout } = useAuth();
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<string>("NO SCHEDULE");
  const [weekNumber, setWeekNumber] = useState<string>("week0");
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayPosition, setTodayPosition] = useState<string>("");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

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

  const fetchLatestAnnouncement = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.length > 0) {
        const sorted = data.sort((a: Announcement, b: Announcement) =>
          new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        );
        setLatestAnnouncement(sorted[0]);
      }
    } catch (error: any) {
      console.error("❌ Fetch latest announcement error:", error.response || error.message);
    }
  };

  // This is the key change. This hook runs whenever the screen comes into focus.
  useFocusEffect(
    useCallback(() => {
      fetchMyInfo();
      fetchLatestAnnouncement();
    }, [token])
  );

  // The rest of your useEffect for calculations remains the same, as it depends on `userInfo`
  useEffect(() => {
    if (userInfo) {
      const today = new Date();
      // week 계산
      if (userInfo.createdAt) {
        const start = new Date(userInfo.createdAt);
        const diffWeeks = Math.ceil(((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) / 7);
        setWeekNumber(`week${diffWeeks}`);
      }

      // 오늘 스케줄 찾기
      if (userInfo.schedules && userInfo.schedules.length > 0) {
        const todayShift = userInfo.schedules.find((s: Schedule) => {
          const d = new Date(s.date);
          return d.getFullYear() === today.getFullYear() &&
                 d.getMonth() === today.getMonth() &&
                 d.getDate() === today.getDate();
        });
        if (todayShift) {
          setTodaySchedule(`${todayShift.startTime} - ${todayShift.endTime}`);
          setTodayPosition(todayShift.position);
        } else {
          setTodaySchedule("NO SCHEDULE");
          setTodayPosition("");
        }
      }

      // Clocked in/out 상태
      if (userInfo.timeLogs && userInfo.timeLogs.length > 0) {
        const lastLog = userInfo.timeLogs[userInfo.timeLogs.length - 1];
        // Check if lastLog exists before trying to access its properties
        if (lastLog) {
            setIsClockedIn(!!lastLog.clockIn && !lastLog.clockOut);
        } else {
            setIsClockedIn(false);
        }
      } else {
        setIsClockedIn(false);
      }
    }
  }, [userInfo]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  
  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView style={{ flex: 1 }} className="flex-1 mt-10">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}>

          {/* Header Section */}
          <View className="flex-row justify-between items-center mt-5">
            <View>
              <AppText className="text-white text-lg font-bold">🏪 Store{userInfo?.storeNumber}</AppText>
              <AppText className="text-white text-xl font-bold mt-1 mb-2 font-robotoSlabLight">
                Hello, {userInfo?.username || 'User'}!
              </AppText>
              <AppText className="text-gray-300 mt-1 text-xs">
                Summary of your work schedule today
              </AppText>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <AppText className="text-white underline font-bold text-sm">Logout</AppText>
            </TouchableOpacity>
          </View>

          {/* Announcement Bar */}
          <View className="bg-white rounded-full px-4 py-2 mt-3 flex-row justify-center items-center">
            <Image source={images.approval} style={{ width: 30 }} resizeMode="contain" />
              <Link href={"/AnnouncementListScreen"}>
                <AppText className="text-gray-600 font-semibold ml-2">
                  {latestAnnouncement
                    ? `${latestAnnouncement.title} - ${new Date(latestAnnouncement.createdAt || "").toLocaleDateString()}`
                    : "No announcement today"}
                </AppText>
              </Link>
          </View>

          {/* Rest of the employee screen */}
          <View className="bg-white px-4 py-5 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <View className="flex-row justify-between">
              {/* Date Info */}
              <View>
                <View className="flex-row justify-between items-center mb-2" >
                  <AppText className="bg-[#112D4E] text-white px-2 py-1 font-semibold rounded-full w-[140px]">
                    {formattedDate}
                  </AppText>
                  <Image className="absolute right-[-12px] top-[-7px]" source={images.Indexcalendar} style={{ width: 70 }} resizeMode="contain" />
                </View>

                <View className="ml-2">
                  <AppText className="text-[#112D4E] font-medium underline">{weekNumber}</AppText>
                  <Text className="flex flex-col text-[#3F72AF] text-base font-bold">
                    {todayPosition && (
                        <AppText className="text-[#112D4E] font-bold">{todayPosition}</AppText>
                      )}

                      <AppText className="text-[#3F72AF] text-lg font-bold">{todaySchedule}</AppText>
                  </Text>
                </View>
              </View>

              {/* Clock Status */}
              <View className="items-start">
                <View className="flex-row justify-between items-center mb-2 pr-2" >
                  <AppText className="bg-[#112D4E] text-white px-2 py-1 font-semibold rounded-full w-[140px] ">
                    Current Status
                  </AppText>
                  <Image className="absolute right-[-15px] top-[-11px]" source={images.IndexClock} style={{ width: 60 }} resizeMode="contain" />
                </View>

                <View className="w-full mt-2">
                  <AppText className="text-[#112D4E] font-semibold">{isClockedIn ? 'Clocked In' : 'Clocked Out'}</AppText>
                  <TouchableOpacity className="bg-[#3F72AF] py-2 px-0 rounded-full mt-2">
                    <Link className="inline-block flex items-center justify-center" href="/_WorkingHours">
                      <AppText className="text-white font-semibold items-end text-center text-sm">{isClockedIn ? 'Clock Out' : 'Clock In'}</AppText>
                    </Link>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Remaining UI elements remain unchanged */}
          <View className="mt-6 flex flex-row justify-center items-center">
            <View>
              <Image source={images.reschedule} style={{ width: 200 }} resizeMode="contain" />
            </View>

            <View className="w-[170px] mr-5">
              <AppText className="text-white text-xl font-bold">
                Looking for flexible schedule?
              </AppText>
              <TouchableOpacity>
                <AppText className="text-white underline mt-1">
                  Swipe your schedule here
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white px-3 py-5 mt-6 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity className="items-center">
                <Image source={images.requestIcon} style={{ width: 100 }} resizeMode="contain" />
                <AppText className="text-[#3F72AF] font-semibold text-xs">View My</AppText>
                <Link href="/_MyRequest">
                  <AppText className="text-[#3F72AF] font-semibold text-base">Request</AppText>
                </Link>
              </TouchableOpacity>

              <View className="h-[100px] bg-[#3F72AF] w-[0.5px]"></View>

              <TouchableOpacity className="items-center">
                <Image source={images.fullscheduleIcon} style={{ width: 100 }} resizeMode="contain" />
                <AppText className="text-[#3F72AF] font-semibold text-xs">View My</AppText>
                <Link href="/_Schedule">
                  <AppText className="text-[#3F72AF] font-semibold text-base">Schedule</AppText>
                </Link>
              </TouchableOpacity>

              <View className="h-[100px] bg-[#3F72AF] w-[0.5px]"></View>

              <TouchableOpacity className="items-center">
                <Image source={images.paymentIcon} style={{ width: 100 }} resizeMode="contain" />
                <AppText className="text-[#3F72AF] font-semibold text-xs mt-2">View My</AppText>
                <Link href="/payment">
                  <AppText className="text-[#3F72AF] font-semibold text-base">Payment</AppText>
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Index;