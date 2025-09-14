import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

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


  // ✅ 로그 합치기 함수 (clockIn만 있는 거 + clockOut만 있는 거 묶어줌)
  const mergeTimeLogs = (logs: TimeLog[]) => {
    const merged: TimeLog[] = [];
    let temp: TimeLog | null = null;

    logs.forEach((log) => {
      if (log.clockIn && !log.clockOut) {
        // 출근만 있는 경우 → 임시 저장
        temp = { clockIn: log.clockIn };
      } else if (!log.clockIn && log.clockOut && temp) {
        // 이전에 출근만 있었고 지금 퇴근만 있으면 → 합치기
        temp.clockOut = log.clockOut;
        merged.push(temp);
        temp = null;
      } else {
        // 이미 clockIn+clockOut이 있는 경우나 혼자 있는 경우
        merged.push(log);
      }
    });

    // 만약 마지막에 clockIn만 있고 clockOut 없는 상태로 끝나면 ongoing으로 표시
    if (temp) merged.push(temp);

    return merged;
  };

  // 안전한 날짜/시간 포맷터
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

  // 총 근무시간 계산
  const calculateHours = (clockIn?: string, clockOut?: string) => {
    if (!clockIn || !clockOut) return "-";
    try {
      const start = new Date(clockIn);
      const end = new Date(clockOut);
      const diff = (end.getTime() - start.getTime()) / 3600000; // ms → hr
      return `${diff.toFixed(2)} hrs`;
    } catch {
      return "-";
    }
  };

  // 직원 목록 불러오기
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
        console.error("❌ fetchEmployees error:", errData);
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

  // 직원 상세 불러오기
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
      // ✅ 여기서 timeLogs 합쳐줌
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
            <Text className="text-white text-lg font-bold">Manager Dashboard</Text>
            <Text className="text-white text-lg font-bold underline">Time Logs</Text>
          </View>

          {/* 직원 목록 */}
          <View className="mt-6">
            <Text className="text-white font-bold">🔹 Employees</Text>
            {employees.map((emp) => (
              <TouchableOpacity
                key={emp._id}
                className="bg-white p-3 rounded-lg shadow-md mt-3"
                onPress={() => fetchEmployeeDetail(emp._id)}
              >
                <Text className="text-blue-900 font-bold text-lg">{emp.username}</Text>
                <Text className="text-gray-600">Employee #: {emp.employeeNumber}</Text>
                <Text className="text-gray-600">Wage: ${emp.hourlyWage}/hr</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ✅ Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white w-[90%] p-5 rounded-lg shadow-lg">
                <Text className="text-blue-900 font-bold text-xl mb-4">
                  📊 {selectedEmployee?.username} - Time Logs
                </Text>

                {selectedEmployee?.timeLogs.length === 0 ? (
                  <Text className="text-gray-600">No logs available</Text>
                ) : (
                  selectedEmployee?.timeLogs.map((log, idx) => (
                    <View
                      key={idx}
                      className="bg-white p-4 rounded-lg shadow-md mb-3 border-2 border-blue-900"
                    >
                      <Text className="text-gray-500">📅 {formatDateSafe(log.clockIn)}</Text>
                      <Text className="text-blue-900 font-bold">
                        ⏰ {formatTimeSafe(log.clockIn)} -{" "}
                        {log.clockOut ? formatTimeSafe(log.clockOut) : "Ongoing"}
                      </Text>
                      <Text className="text-gray-600">
                        • Total Hours:{" "}
                        {log.clockOut
                          ? calculateHours(log.clockIn, log.clockOut)
                          : "In progress"}
                      </Text>
                    </View>
                  ))
                )}

                <Pressable
                  className="bg-blue-900 mt-4 py-2 rounded"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white text-center font-bold">Close</Text>
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
