import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const API_URL = "http://localhost:4000/api/auth";

interface TimeLog {
  clockIn: string;
  clockOut?: string;
}

interface UserData {
  username: string;
  hourlyWage: number;
  timeLogs: TimeLog[];
}

const Payment = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);
  const [grossPay, setGrossPay] = useState(0);
  const [netPay, setNetPay] = useState(0);
  const [tax, setTax] = useState(0);
  const [nextPayDate, setNextPayDate] = useState<string>("");

  // 유저 정보 & timeLogs 불러오기
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        username: data.username,
        hourlyWage: data.hourlyWage,
        timeLogs: data.timeLogs || [],
      });

      calculatePayroll(data.hourlyWage, data.timeLogs || []);
    } catch (err) {
      console.error("❌ 유저 데이터 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2주 급여 계산
  const calculatePayroll = (hourlyWage: number, logs: TimeLog[]) => {
    const now = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    let total = 0;

    logs.forEach((log) => {
      if (!log.clockOut) return;
      const start = new Date(log.clockIn);
      const end = new Date(log.clockOut);
      if (start >= twoWeeksAgo && end <= now) {
        total += (end.getTime() - start.getTime()) / 3600000; // ms → 시간
      }
    });

    const gross = total * hourlyWage;
    const taxAmount = gross * 0.15; // 단순 세율 15%
    const net = gross - taxAmount;

    setTotalHours(total);
    setGrossPay(gross);
    setTax(taxAmount);
    setNetPay(net);

    // 다음 급여일: 오늘 기준 +14일
    const nextPay = new Date();
    nextPay.setDate(now.getDate() + (14 - (now.getDate() % 14)));
    setNextPayDate(nextPay.toDateString());
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#112D4E", "#8199B6"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#112D4E", "#8199B6"]}>
      <SafeAreaView className="flex-1 px-5 mt-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}>
          {/* Header */}
          <Text className="text-white text-3xl font-bold mt-5">My Payment</Text>

          {/* My Balances */}
          <View className="mt-6">
            <Text className="text-white text-xl font-bold">My balances</Text>

            <View className="flex-row justify-between mt-3">
              <View className="border border-white rounded-lg p-4 w-[48%]">
                <Text className="text-gray-300 text-sm">Working hours</Text>
                <Text className="text-white text-2xl font-bold">{totalHours.toFixed(2)} hrs</Text>
              </View>

              <View className="border border-white rounded-lg p-4 w-[48%]">
                <Text className="text-gray-300 text-sm">Wage per hour</Text>
                <Text className="text-white text-2xl font-bold">${user?.hourlyWage.toFixed(2)}</Text>
              </View>
            </View>

            {/* Next Payment Date */}
            <Text className="text-gray-300 text-lg mt-4">
              <Text className="font-bold text-white">Next payment date :</Text> {nextPayDate}
            </Text>
          </View>

          {/* Current Paycheck */}
          <Text className="text-white text-xl font-bold mt-6">• Current paycheck</Text>

          <View className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <Text className="text-gray-500 font-bold">Pay Period: Last 2 Weeks</Text>
            <View className="mt-2">
              <Text className="text-gray-500">
                — Total working hours <Text className="text-black font-bold">{totalHours.toFixed(2)} hrs</Text>
              </Text>
              <Text className="text-gray-500">
                — Wage per hour <Text className="text-black font-bold">${user?.hourlyWage.toFixed(2)}</Text>
              </Text>
              <Text className="text-gray-500">
                — Gross Pay <Text className="text-black font-bold">${grossPay.toFixed(2)}</Text>
              </Text>
              <Text className="text-gray-500">
                — Taxes (15%) <Text className="text-black font-bold">-${tax.toFixed(2)}</Text>
              </Text>
            </View>

            <Text className="text-[#3F72AF] text-lg font-bold mt-3 text-right">
              Net Pay ${netPay.toFixed(2)}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Payment;
