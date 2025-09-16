import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
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
  _id: string;
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

const ManagerPayments = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [employees, setEmployees] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPay, setCurrentPay] = useState<PayPeriod | null>(null);
  const [payHistory, setPayHistory] = useState<PayPeriod[]>([]);
  const [nextPayDate, setNextPayDate] = useState<string>("");
  const [employeePayrolls, setEmployeePayrolls] = useState<{
    [key: string]: { current: PayPeriod | null; history: PayPeriod[] };
  }>({});
  const [selectedEmployee, setSelectedEmployee] = useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        _id: data._id,
        username: data.username,
        hourlyWage: data.hourlyWage,
        timeLogs: data.timeLogs || [],
      });
      calculatePayrolls(data._id, data.hourlyWage, data.timeLogs || [], true);
    } catch (err) {
      console.error("❌ 유저 데이터 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(data);

      // 직원별 급여 계산
      const payrolls: any = {};
      data.forEach((emp: UserData) => {
        const { current, history } = calculatePayrolls(
          emp._id,
          emp.hourlyWage,
          emp.timeLogs || [],
          false
        );
        payrolls[emp._id] = { current, history };
      });
      setEmployeePayrolls(payrolls);
    } catch (err) {
      console.error("❌ 직원 데이터 불러오기 실패:", err);
    }
  };

  // 2주 단위 급여 계산 + 1년치 리스트 유지
  const calculatePayrolls = (
    id: string,
    hourlyWage: number,
    logs: TimeLog[],
    isSelf: boolean
  ) => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const filteredLogs = logs.filter(
      (log) => log.clockOut && new Date(log.clockIn) >= oneYearAgo
    );

    const payPeriods: PayPeriod[] = [];
    if (filteredLogs.length === 0) {
      return { current: null, history: [] };
    }

    let periodStart = new Date(filteredLogs[0].clockIn);
    const dayOffset = periodStart.getDay() % 14;
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

    const latestPay = payPeriods.pop() || null;
    if (isSelf) {
      setCurrentPay(latestPay);
      setPayHistory(payPeriods);
      if (latestPay) setNextPayDate(latestPay.end.toDateString());
    }

    return { current: latestPay, history: payPeriods };
  };

  useEffect(() => {
    fetchUserData();
    fetchEmployees();
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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 100,
          }}
        >
          {/* Header */}
          <Text className="text-white text-3xl font-bold mt-5">My Payment</Text>

          {/* My Balances */}
          <View className="mt-6">
            <Text className="text-white text-xl font-bold">My balances</Text>
            <View className="flex-row justify-between mt-3">
              <View className="border border-white rounded-lg p-4 w-[48%]">
                <Text className="text-gray-300 text-sm">Working hours</Text>
                <Text className="text-white text-2xl font-bold">
                  {currentPay?.totalHours.toFixed(2)} hrs
                </Text>
              </View>

              <View className="border border-white rounded-lg p-4 w-[48%]">
                <Text className="text-gray-300 text-sm">Wage per hour</Text>
                <Text className="text-white text-2xl font-bold">
                  ${user?.hourlyWage.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Next Payment Date */}
            <Text className="text-gray-300 text-lg mt-4">
              <Text className="font-bold text-white">Next payment date :</Text>{" "}
              {nextPayDate}
            </Text>
          </View>

          {/* Current Paycheck */}
          <Text className="text-white text-xl font-bold mt-6">
            • Current paycheck
          </Text>
          {currentPay && (
            <View className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
              <Text className="text-gray-500 font-bold">
                Pay Period: {currentPay.start.toDateString()} -{" "}
                {currentPay.end.toDateString()}
              </Text>
              <View className="mt-2">
                <Text className="text-gray-500">
                  — Total working hours{" "}
                  <Text className="text-black font-bold">
                    {currentPay.totalHours.toFixed(2)} hrs
                  </Text>
                </Text>
                <Text className="text-gray-500">
                  — Wage per hour{" "}
                  <Text className="text-black font-bold">
                    ${user?.hourlyWage.toFixed(2)}
                  </Text>
                </Text>
                <Text className="text-gray-500">
                  — Gross Pay{" "}
                  <Text className="text-black font-bold">
                    ${currentPay.grossPay.toFixed(2)}
                  </Text>
                </Text>
                <Text className="text-gray-500">
                  — Taxes (15%){" "}
                  <Text className="text-black font-bold">
                    -${currentPay.tax.toFixed(2)}
                  </Text>
                </Text>
              </View>

              <Text className="text-[#3F72AF] text-lg font-bold mt-3 text-right">
                Net Pay ${currentPay.netPay.toFixed(2)}
              </Text>
            </View>
          )}

          {/* Previous Paychecks (1년치) */}
          <Text className="text-white text-xl font-bold mt-6">
            • Previous paychecks (last 1 year)
          </Text>
          {payHistory
            .slice()
            .reverse()
            .map((pay, idx) => (
              <View
                key={idx}
                className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]"
              >
                <Text className="text-gray-500 font-bold">
                  Pay Period: {pay.start.toDateString()} -{" "}
                  {pay.end.toDateString()}
                </Text>
                <View className="mt-2">
                  <Text className="text-gray-500">
                    — Total working hours{" "}
                    <Text className="text-black font-bold">
                      {pay.totalHours.toFixed(2)} hrs
                    </Text>
                  </Text>
                  <Text className="text-gray-500">
                    — Gross Pay{" "}
                    <Text className="text-black font-bold">
                      ${pay.grossPay.toFixed(2)}
                    </Text>
                  </Text>
                  <Text className="text-gray-500">
                    — Taxes (15%){" "}
                    <Text className="text-black font-bold">
                      -${pay.tax.toFixed(2)}
                    </Text>
                  </Text>
                </View>
                <Text className="text-[#3F72AF] text-lg font-bold mt-3 text-right">
                  Net Pay ${pay.netPay.toFixed(2)}
                </Text>
              </View>
            ))}

          {/* Employees' Payments */}
          <Text className="text-white text-3xl font-bold mt-10">
            Employees' Payments
          </Text>
          {employees.map((emp) => (
            <Pressable
              key={emp._id}
              onPress={() => {
                setSelectedEmployee(emp);
                setModalVisible(true);
              }}
              className="bg-[#3F72AF] mt-4 p-4 rounded-xl"
            >
              <Text className="text-white text-xl font-bold">{emp.username}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Modal for Employee Payments */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 rounded-2xl p-5">
            <Text className="text-2xl font-bold mb-3 text-center text-[#112D4E]">
              {selectedEmployee?.username}'s Payments
            </Text>

            <ScrollView style={{ maxHeight: 500 }}>
              {selectedEmployee &&
                employeePayrolls[selectedEmployee._id] &&
                (() => {
                  const payroll = employeePayrolls[selectedEmployee._id];
                  return (
                    <>
                      {/* Current Pay */}
                      {payroll.current && (
                        <View className="bg-gray-100 p-4 rounded-lg mb-4 border-2 border-[#3F72AF]">
                          <Text className="text-gray-700 font-bold">
                            Current Paycheck
                          </Text>
                          <Text>
                            Pay Period:{" "}
                            {payroll.current.start.toDateString()} -{" "}
                            {payroll.current.end.toDateString()}
                          </Text>
                          <Text>
                            Hours: {payroll.current.totalHours.toFixed(2)} hrs
                          </Text>
                          <Text>
                            Gross: ${payroll.current.grossPay.toFixed(2)}
                          </Text>
                          <Text>
                            Tax: -${payroll.current.tax.toFixed(2)}
                          </Text>
                          <Text className="font-bold text-[#3F72AF] mt-2">
                            Net: ${payroll.current.netPay.toFixed(2)}
                          </Text>
                        </View>
                      )}

                      {/* History */}
                      {payroll.history
                        .slice()
                        .reverse()
                        .map((pay, idx) => (
                          <View
                            key={idx}
                            className="bg-gray-100 p-4 rounded-lg mb-3 border border-[#3F72AF]"
                          >
                            <Text className="font-bold text-gray-700">
                              Pay Period: {pay.start.toDateString()} -{" "}
                              {pay.end.toDateString()}
                            </Text>
                            <Text>
                              Hours: {pay.totalHours.toFixed(2)} hrs
                            </Text>
                            <Text>Gross: ${pay.grossPay.toFixed(2)}</Text>
                            <Text>Tax: -${pay.tax.toFixed(2)}</Text>
                            <Text className="font-bold text-[#3F72AF] mt-1">
                              Net: ${pay.netPay.toFixed(2)}
                            </Text>
                          </View>
                        ))}
                    </>
                  );
                })()}
            </ScrollView>

            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-[#112D4E] p-3 rounded-xl mt-5"
            >
              <Text className="text-white text-center font-bold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default ManagerPayments;
