import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { AppText } from "../../../components/AppText";


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

interface PayPeriod {
  start: Date;
  end: Date;
  totalHours: number;
  grossPay: number;
  tax: number;
  netPay: number;
}

const Payment = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPay, setCurrentPay] = useState<PayPeriod | null>(null);
  const [payHistory, setPayHistory] = useState<PayPeriod[]>([]);
  const [nextPayDate, setNextPayDate] = useState<string>("");

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
      calculatePayrolls(data.hourlyWage, data.timeLogs || []);
    } catch (err) {
      console.error("❌ 유저 데이터 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2주 단위 급여 계산 + 1년치 리스트 유지
  const calculatePayrolls = (hourlyWage: number, logs: TimeLog[]) => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // 1년 내 로그만 필터
    const filteredLogs = logs.filter((log) => log.clockOut && new Date(log.clockIn) >= oneYearAgo);

    // 2주 단위 pay periods
    const payPeriods: PayPeriod[] = [];
    let periodStart = new Date(filteredLogs[0]?.clockIn || oneYearAgo);

    // periodStart를 2주 단위 기준으로 조정
    const dayOffset = periodStart.getDay() % 14; // 0~13
    periodStart.setDate(periodStart.getDate() - dayOffset);

    while (periodStart < now) {
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 14);

      let totalHours = 0;
      filteredLogs.forEach((log) => {
        const start = new Date(log.clockIn);
        const end = new Date(log.clockOut!);
        if (start >= periodStart && end <= periodEnd) {
          totalHours += (end.getTime() - start.getTime()) / 3600000;
        }
      });

      const gross = totalHours * hourlyWage;
      const tax = gross * 0.15;
      const net = gross - tax;

      payPeriods.push({
        start: new Date(periodStart),
        end: new Date(periodEnd),
        totalHours,
        grossPay: gross,
        tax,
        netPay: net,
      });

      periodStart.setDate(periodStart.getDate() + 14);
    }

    // 최신 period를 currentPay, 나머지는 payHistory
    const latestPay = payPeriods.pop() || null;
    setCurrentPay(latestPay);
    setPayHistory(payPeriods);
    if (latestPay) setNextPayDate(latestPay.end.toDateString());
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
          <AppText className="text-white text-2xl font-bold text-center my-6 tracking-wider">My Payment</AppText>

          {/* My Balances */}
          <View className="mt-6">
            <AppText className="text-white text-xl font-bold">My balances</AppText>
            <View className="flex-row justify-between mt-3">
              <View className="border border-white rounded-lg p-4 w-[48%]">
                <AppText className="text-gray-300 text-sm">Working hours</AppText>
                <Text className="text-white text-2xl font-bold">{currentPay?.totalHours.toFixed(2)} hrs</Text>
              </View>

              <View className="border border-white rounded-lg p-4 w-[48%]">
                <AppText className="text-gray-300 text-sm">Wage per hour</AppText>
                <Text className="text-white text-2xl font-bold">${user?.hourlyWage.toFixed(2)}</Text>
              </View>
            </View>

            {/* Next Payment Date */}
            <Text className="text-gray-300 text-lg mt-4">
              <AppText className="font-bold text-white">Next payment date :</AppText> {nextPayDate}
            </Text>
          </View>

          {/* Current Paycheck */}
          <AppText className="text-white text-xl font-bold mt-6">• Current paycheck</AppText>
          {currentPay && (
            <View className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
              <AppText className="text-gray-500 font-bold">
                Pay Period: {currentPay.start.toDateString()} - {currentPay.end.toDateString()}
              </AppText>
              <View className="mt-2">
                <Text className="text-gray-500">
                  — Total working hours <Text className="text-[#3F72AF] font-bold">{currentPay.totalHours.toFixed(2)} hrs</Text>
                </Text>
                <Text className="text-gray-500">
                  — Wage per hour <Text className="text-[#3F72AF] font-bold">${user?.hourlyWage.toFixed(2)}</Text>
                </Text>
                <Text className="text-gray-500">
                  — Gross Pay <Text className="text-[#3F72AF] font-bold">${currentPay.grossPay.toFixed(2)}</Text>
                </Text>
                <Text className="text-gray-500">
                  — Taxes (15%) <Text className="text-[#3F72AF] font-bold">-${currentPay.tax.toFixed(2)}</Text>
                </Text>
              </View>

              <AppText className="text-[#3F72AF] text-lg font-bold mt-3 text-right">
                Net Pay ${currentPay.netPay.toFixed(2)}
              </AppText>
            </View>
          )}

          {/* Previous Paychecks (1년치) */}
          <AppText className="text-white text-xl font-bold mt-6">• Previous paychecks (last 1 year)</AppText>
          {payHistory.reverse().map((pay, idx) => (
            <View key={idx} className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
              <Text className="text-gray-500 font-bold">
                Pay Period: {pay.start.toDateString()} - {pay.end.toDateString()}
              </Text>
              <View className="mt-2">
                <AppText className="text-gray-500">
                  — Total working hours <Text className="text-black font-bold">{pay.totalHours.toFixed(2)} hrs</Text>
                </AppText>
                <Text className="text-gray-500">
                  — Gross Pay <Text className="text-black font-bold">${pay.grossPay.toFixed(2)}</Text>
                </Text>
                <Text className="text-gray-500">
                  — Taxes (15%) <Text className="text-black font-bold">-${pay.tax.toFixed(2)}</Text>
                </Text>
                <AppText className="text-[#3F72AF] text-lg font-bold mt-3 text-right">
                  Net Pay ${pay.netPay.toFixed(2)}
                </AppText>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Payment;
