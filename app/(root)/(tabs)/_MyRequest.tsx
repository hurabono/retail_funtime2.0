import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const requests = [
  {
    id: 1,
    date: "Saturday, November 9",
    type: "Absence",
    reason: "Personal Injury / Illness",
    confirmation: "246310354",
    submitted: "11/08/2024 11:25pm",
    status: "Approved",
  },
  {
    id: 2,
    date: "Friday, November 1",
    type: "Absence",
    reason: "Personal Injury / Illness",
    confirmation: "246310354",
    submitted: "11/08/2024 11:25pm",
    status: "Rejected",
  },
];

const myRequest = () => {
  const [filter, setFilter] = useState("Approved");

  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView className="flex-1 mt-10" style={{ flex: 1 }}>
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>
          {/* 상단 네비게이션 */}
          <View className="flex-row justify-between border-b border-white pb-3">
            <Text className="text-white text-lg font-bold">My Schedule</Text>
            <Text className="text-white text-lg font-bold underline">
              My Request
            </Text>
          </View>

          {/* 설명 섹션 */}
          <View className="mt-6">
            <Text className="text-white font-bold">🔹 Manage my Requests</Text>
            <Text className="text-gray-300 text-sm">
              View and report absences and late arrivals or request time off.
            </Text>
          </View>

          {/* 잔여 시간 정보 */}
          <View className="mt-4 border-t border-gray-500 pt-4">
            <Text className="text-white font-bold">🔹 My balances</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-300 text-sm">Vacation: 56:32hrs</Text>
              <Text className="text-gray-300 text-sm">Personal: 6:30hrs</Text>
              <Text className="text-gray-300 text-sm">Attendance: 23.00pts</Text>
              <Text className="text-gray-300 text-sm">PEL: 2 days</Text>
            </View>
          </View>

          {/* 요청 관리 섹션 */}
          <View className="bg-gray-200 p-4 mt-6 rounded-lg">
            <Text className="text-blue-900 font-bold text-lg">
              Manage my Requests
            </Text>
            <Text className="text-gray-500 text-sm">
              Upcoming absences, time off, and shift swaps.
            </Text>
            <TouchableOpacity className="bg-blue-900 py-2 px-4 rounded-lg mt-3">
              <Text className="text-white font-bold text-center">
                Make Request
              </Text>
            </TouchableOpacity>
          </View>

          {/* 과거 요청 섹션 */}
          <View className="mt-6">
            <Text className="text-white font-bold">🔹 Past requests</Text>
            <Text className="text-gray-300 text-sm">
              Past absences, time off and shift swaps.
            </Text>
          </View>

          {/* 필터 버튼 */}
          <View className="flex-row justify-between mt-4 bg-gray-800 p-2 rounded-full">
            {["Review", "Approved", "Rejected"].map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 rounded-full ${
                  filter === status ? "bg-green-400" : "bg-gray-500"
                }`}
                onPress={() => setFilter(status)}
              >
                <Text className="text-white font-bold">{status}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 요청 목록 */}
          <View className="mt-6">
            {requests
              .filter((req) => req.status === filter)
              .map((req) => (
                <View
                  key={req.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4 border-4 border-blue-500"
                >
                  <Text className="text-blue-900 font-bold">{req.type}</Text>
                  <Text className="text-black text-lg font-bold">
                    {req.date}
                  </Text>
                  <Text className="text-gray-500">{req.reason}</Text>
                  <Text className="text-gray-500">
                    Confirmation: {req.confirmation}
                  </Text>
                  <Text className="text-gray-500">Submitted: {req.submitted}</Text>
                </View>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default myRequest;
