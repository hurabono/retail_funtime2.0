import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const API_URL = 'http://localhost:4000/api/auth';

interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
  workHours: number;
  break?: string;
  title?: string;
}


const ScheduleScreen = () => {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  

  // 이번 주 범위 계산 (일요일 ~ 토요일)
  const calculateWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    const weekArr = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
    setWeekDates(weekArr);
  };

  // DB에서 schedules 가져오기
  const fetchSchedules = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    calculateWeek();
    fetchSchedules();
  }, []);

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} className="flex-1">
      <SafeAreaView className="flex-1 mt-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>
          {/* Header */}
          <Text className="text-white text-3xl font-bold mt-5">My Schedule </Text>

          {/* Week Selector */}
          <View className="mt-4 flex-row items-center">
            <View className="bg-white px-3 py-1 rounded-lg">
              <Text className="text-[#3F72AF] font-bold text-sm">This Week</Text>
            </View>
            <View className="flex-row ml-4">
              {weekDates.map((d, idx) => (
                <Text key={idx} className="text-white text-base mx-2">{formatDate(d)}</Text>
              ))}
            </View>
          </View>

          <View className="w-full bg-[#fafafa] h-[0.5px] my-5 "></View>

          {/* Schedule Entries */}
          {weekDates.map((dayDate, index) => {
            const schedule = schedules.find((s: any) => new Date(s.date).toDateString() === dayDate.toDateString());
            return (
              <View key={index} className="bg-white rounded-xl px-5 py-3 mt-6 shadow-md border-4 border-[#3F72AF]">
                {/* Date Badge */}
                <View className="absolute -top-4 left-2 bg-white px-3 py-1 rounded-lg shadow-md">
                  <Text className="text-[#3F72AF] font-bold text-sm text-center">{formatWeekday(dayDate)}</Text>
                  <Text className="text-black font-bold text-lg text-center">{formatDate(dayDate)}</Text>
                </View>

                {/* Schedule Content */}
                <Text 
                  className={`font-bold text-lg mt-[35px] ${schedule ? 'text-[#3F72AF]' : 'text-gray-300'}`}
                >
                  {schedule ? schedule.title || 'Scheduled Shift' : 'Not Scheduled'}
                </Text>
                {schedule && schedule.workHours && <Text className="text-[#3F72AF] font-bold absolute top-5 right-5">{schedule.workHours}h</Text>}
                <Text className="text-gray-500 mt-1">
                  {schedule ? `${schedule.startTime} - ${schedule.endTime}` : 'No available Shift'}
                </Text>
                {schedule && schedule.workHours >= 4 && <Text className="text-gray-500">🍽 Break: 1 hr</Text>}

                {/* Shift Options */}
                {schedule && schedule.workHours && (
                  <TouchableOpacity className="mt-3">
                    <Text className="text-[#3F72AF] font-bold underline text-right">Shift options</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ScheduleScreen;
