import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppText } from "../../../components/AppText";

const API_URL = "http://localhost:4000/api/auth";

  interface TimeLog {
    clockIn?: string;
    clockOut?: string;
    breakStart?: string;
    breakEnd?: string;
  }

  interface Employee {
    _id: string;
    username: string;
    employeeNumber: string;
    hourlyWage: number;
    timeLogs: TimeLog[];
  }

  const ManagerTimeLogs = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

  // ✅ 현재 2주 급여 주기 계산
  const getCurrentPayPeriod = () => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);

    // 이번 달 1~14일, 15~말일 기준으로 쪼갬
    if (today.getDate() <= 14) {
      start.setDate(1);
      end.setDate(14);
    } else {
      start.setDate(15);
      end.setMonth(today.getMonth() + 1, 0); // 이번 달 마지막 날
    }

    // 시간을 0시~23:59로 맞추기
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  // ✅ 로그 합치기 + 2주 구간 필터링
  const mergeTimeLogs = (logs: TimeLog[]) => {
    const merged: TimeLog[] = [];
    let temp: TimeLog | null = null;
    const { start, end } = getCurrentPayPeriod();

    logs.forEach((log) => {
      const logDate = log.clockIn ? new Date(log.clockIn) : null;

      // ✅ 급여 주기 범위 안에 없는 로그는 제외
      if (logDate && (logDate < start || logDate > end)) {
        return;
      }

      if (log.clockIn && !log.clockOut) {
        temp = { clockIn: log.clockIn };
      } else if (!log.clockIn && log.clockOut && temp) {
        temp.clockOut = log.clockOut;
        merged.push(temp);
        temp = null;
      } else {
        merged.push(log);
      }
    });

    if (temp) merged.push(temp);
    return merged;
  };


  const formatDateSafe = (iso?: string) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("ko-KR");
    } catch {
      return "Invalid Date";
    }
  };

  const formatTimeSafe = (iso?: string) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Time";
    }
  };

  const calculateHours = (clockIn?: string, clockOut?: string) => {
    if (!clockIn || !clockOut) return "-";
    try {
      const start = new Date(clockIn);
      const end = new Date(clockOut);
      const diff = (end.getTime() - start.getTime()) / 3600000;
      return `${diff.toFixed(2)} hrs`;
    } catch {
      return "-";
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found, please log in again.");
        return;
      }

      const res = await fetch(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        Alert.alert("Error", errData.message || "Failed to load employees");
        return;
      }

      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("❌ fetchEmployees error:", err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const fetchEmployeeDetail = async (employeeId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        Alert.alert("Error", errData.message || "Failed to load employee logs");
        return;
      }

      const data = await res.json();
      data.timeLogs = mergeTimeLogs(data.timeLogs || []);
      setSelectedEmployee(data);
      setModalVisible(true);
    } catch (err) {
      console.error("❌ fetchEmployeeDetail error:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView className="flex-1 mt-10">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="flex-row justify-between border-b border-white pb-3">
            <AppText className="text-white text-lg font-bold">Manager Dashboard</AppText>
            <AppText className="text-white text-lg font-bold underline">Time Logs</AppText>
          </View>

          {/* 직원 목록 */}
          <View className="mt-6">
            <AppText className="text-white font-bold text-lg tracking-wider">🔹 Employees</AppText>
            {employees.map((emp) => (
              <TouchableOpacity
                key={emp._id}
                className="bg-white p-3 rounded-lg shadow-md mt-3"
                onPress={() => fetchEmployeeDetail(emp._id)}
              >
                <AppText className="text-[#112D4E] font-bold text-lg">{emp.username}</AppText>
                <Text className="text-gray-600">Employee #: {emp.employeeNumber}</Text>
                <Text className="text-gray-600">Wage: ${emp.hourlyWage}/hr</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ✅ Modal with Scroll */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white w-[90%] h-[70%] p-5 rounded-lg shadow-lg">
                <AppText className="text-[#112D4E] font-bold text-xl mb-4">
                  📊 {selectedEmployee?.username} - Time Logs
                </AppText>

                <ScrollView>
                  {selectedEmployee?.timeLogs.length === 0 ? (
                    <Text className="text-gray-600">No logs available</Text>
                  ) : (
                    selectedEmployee?.timeLogs.map((log, idx) => (
                      <View
                        key={idx}
                        className="bg-white p-4 rounded-lg shadow-md mb-3 border-4 border-[#3F72AF]"
                      >
                        <Text className="text-gray-500">📅 {formatDateSafe(log.clockIn)}</Text>
                        <AppText className="text-[#112D4E] font-bold">
                          ⏰ {formatTimeSafe(log.clockIn)} -{" "}
                          {log.clockOut ? formatTimeSafe(log.clockOut) : "Ongoing"}
                        </AppText>
                        <Text className="text-gray-600">
                          • Total Hours:{" "}
                          {log.clockOut ? calculateHours(log.clockIn, log.clockOut) : "In progress"}
                        </Text>
                      </View>
                    ))
                  )}
                </ScrollView>

                <Pressable
                  className="mt-4"
                  onPress={() => setModalVisible(false)}
                >
                  <LinearGradient
                    colors={['#8199B6', '#112D4E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-full py-3 rounded-3xl items-center justify-center border-2 border-white"
                    >
                  <AppText className="text-white text-lg font-bold">Close</AppText>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ManagerTimeLogs;
