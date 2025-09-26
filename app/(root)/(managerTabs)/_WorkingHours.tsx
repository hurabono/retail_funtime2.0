import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import images from '@constants/images';
import { AppText } from "../../../components/AppText";
import { useFocusEffect } from "expo-router"; 

const API_URL = 'https://retail-funtime-backend.onrender.com/api/auth';


interface UserInfo {
  _id: string;
  storeNumber: string;
}

interface TimeLog {
  _id?: string;
  clockIn: string;
  clockOut?: string;
}


interface Announcement {
  _id: string;
  title: string;
  createdAt?: string;
}


const WorkingHours = () => {
  const { token } = useAuth();
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [todaySeconds, setTodaySeconds] = useState(0);
  const [weekSeconds, setWeekSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);


  // DB에서 기존 시간 기록 불러오기
  const fetchTimeLogs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeLogs(data.timeLogs || []);
      calculateWeekTime(data.timeLogs || []);
      // 현재 clockIn 상태 체크
      const lastLog = data.timeLogs?.[data.timeLogs.length - 1];
      if (lastLog && !lastLog.clockOut) {
        setIsClockedIn(true);
        startTimer();
      }
    } catch (error) {
      console.error(error);
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

   useFocusEffect(
      useCallback(() => {
      fetchMyInfo();
      fetchLatestAnnouncement();
    }, [token])
    );



  // 이번 주 누적 시간 계산
  const calculateWeekTime = (logs: TimeLog[]) => {
    const now = new Date();
    let weekTotal = 0;
    let todayTotal = 0;

    logs.forEach((log) => {
      if (!log.clockOut) return;
      const start = new Date(log.clockIn);
      const end = new Date(log.clockOut);
      const diffSec = (end.getTime() - start.getTime()) / 1000;

      if (start.toDateString() === now.toDateString()) todayTotal += diffSec;
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (start >= weekStart && start <= weekEnd) weekTotal += diffSec;
    });

    setTodaySeconds(todayTotal);
    setWeekSeconds(weekTotal);
  };

  // 초를 hh:mm:ss 형식으로 변환
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 타이머 시작
  const startTimer = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTodaySeconds((prev) => prev + 1);
      setWeekSeconds((prev) => prev + 1);
    }, 1000) as unknown as number;
  };

  // 타이머 멈춤
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as unknown as number);
      intervalRef.current = null;
    }
  };

  // Clock In 버튼
  const handleClockIn = async () => {
    try {
      const nowISO = new Date().toISOString();
      await axios.post(`${API_URL}/logtime`, { clockIn: nowISO }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsClockedIn(true);

      // 새 로그 추가 (clockOut 없음)
      setTimeLogs(prev => [
        ...prev.filter(log => log.clockOut), // 이전 미완료 로그 제거
        { clockIn: nowISO }
      ]);

      startTimer();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to clock in');
    }
  };

  // Clock Out 버튼
  const handleClockOut = async () => {
    try {
      const nowISO = new Date().toISOString();
      await axios.post(`${API_URL}/logtime`, { clockOut: nowISO }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsClockedIn(false);
      stopTimer();

      // 마지막 로그만 clockOut 업데이트
      setTimeLogs(prev =>
        prev.map((log, idx) =>
          idx === prev.length - 1 ? { ...log, clockOut: nowISO } : log
        )
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to clock out');
    }
  };

  // useEffect 종료 시 clearInterval
  useEffect(() => {
    fetchTimeLogs();
    return () => {
      stopTimer();
    };
  }, []);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);


  // 최신 공지 가져오기
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

  useEffect(() => {
    fetchLatestAnnouncement();
  }, [token]);



  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} className="flex-1">
      <SafeAreaView className="flex-1 mt-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}>
          {/* Store Name */}
          <View className="mt-6 flex-row justify-between items-center">
            <AppText className="text-white text-base tracking-wider">🏪 <AppText className="underline">Store{userInfo?.storeNumber}</AppText></AppText>
          </View>

          {/* Header */}
          <AppText className="text-white text-2xl font-bold text-center my-6 tracking-wider">Working hours</AppText>

          {/* Announcement Bar */}
          <View className="bg-white rounded-full px-4 py-2 mt-3 flex-row justify-center items-center">
            <Image source={images.approval} style={{ width: 30 }} resizeMode="contain" />
            <AppText className="text-gray-600 font-semibold ml-2">
              {latestAnnouncement
                ? `${latestAnnouncement.title} - ${new Date(latestAnnouncement.createdAt || "").toLocaleDateString()}`
                : "No announcement today"}
            </AppText>
          </View>

          {/* Clock In Section */}
          <View className="mt-6">
            <AppText className="text-white text-lg font-semibold tracking-wider">• Clock In</AppText>

            <View className="bg-white rounded-3xl p-2 mt-3 shadow-md flex-row justify-evenly items-center border-4 border-[#3F72AF]">
              <View>
                <AppText className="text-[#3F72AF] text-sm font-bold ">• Today</AppText>
                <Text className="text-[#112D4E] text-3xl font-bold">{formatTime(todaySeconds)}</Text>
              </View>
              <View className="h-[100px] bg-[#3F72AF]  w-[0.5px]"></View>
              <View>
                <AppText className="text-[#3F72AF] text-sm font-bold">• This week</AppText>
                <Text className="text-[#112D4E] text-3xl font-bold">{formatTime(weekSeconds)}</Text>
              </View>
            </View>

            {/* Clock in/out Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="mt-6 items-center justify-center"
              onPress={isClockedIn ? handleClockOut : handleClockIn}
            >
              <LinearGradient
                colors={['#3F72AF', '#112D4E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-[200px] py-2 rounded-full flex items-center justify-center border-2 border-white"
              >
                <AppText className="text-white text-lg font-bold tracking-wider">{isClockedIn ? 'Clocked Out' : 'Clock In'}</AppText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Work Log Section */}
          {timeLogs
            .filter(log => log.clockIn && new Date(log.clockIn) >= oneWeekAgo)
            .map((log, index) => (
              <View key={index} className="bg-white rounded-xl p-5 mt-6 shadow-md border-4 border-[#3F72AF]">
                <Text className="text-gray-500 text-sm">
                  📅 {log.clockIn ? new Date(log.clockIn).toLocaleDateString() : '-'}
                </Text>
                <View className="mt-2 flex-row justify-between">
                  <View>
                    <Text className="text-gray-500">• Total Hours</Text>
                    <AppText className="text-[#3F72AF] font-bold">
                      {log.clockIn && log.clockOut
                        ? ((new Date(log.clockOut).getTime() - new Date(log.clockIn).getTime()) / 3600000).toFixed(2)
                        : log.clockIn && !log.clockOut
                        ? (todaySeconds / 3600).toFixed(2)
                        : '0'} hrs
                    </AppText>
                  </View>
                  <View>
                    <Text className="text-gray-500">• Check in & out</Text>
                    <AppText className="text-[#3F72AF] font-bold">
                      {log.clockIn ? new Date(log.clockIn).toLocaleTimeString() : '-'} - {log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : '-'}
                    </AppText>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WorkingHours;
