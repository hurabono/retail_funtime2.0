import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from 'expo-router';

// API 호출 base URL
const API_URL = "http://localhost:4000/api/auth";

const MyRequest = () => {
  const [filter, setFilter] = useState("Approved");
  const [requests, setRequests] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("vacation");
  const [details, setDetails] = useState("");

  // Past Requests 불러오기
  const fetchRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); 
      if (!token) {
        Alert.alert("Error", "No token found, please log in again.");
        return;
      }

      const res = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      const data = await res.json();
      setRequests(data.leaveRequests?.filter((req: any) => !req.employeeDelete) || []);
    } catch (err) {
      console.error("❌ fetchRequests error:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  
      // MyRequest.js
      const handleSubmit = async () => {
        if (!date || !reason || !details) {
          Alert.alert("Error", "Please fill out all fields");
          return;
        }
        
        // 💡 수정: 날짜 형식을 YYYY-MM-DD로 변환
        const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            Alert.alert("Error", "No token found, please log in again.");
            return;
          }

          console.log("Submitting leave request:", { date, reason, details, token });

          const res = await fetch(`${API_URL}/request-leave`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // 💡 수정: 변환된 날짜 포맷 사용
            body: JSON.stringify({ date: formattedDate, reason, details }), 
          });

          const data = await res.json();
          console.log("Server response:", data);
          
          if (res.ok) {
            Alert.alert("Success", "Leave request submitted");
            setDate("");
            setReason("vacation");
            setDetails("");
            setShowForm(false);
            fetchRequests(); // 새 요청 반영
          } else {
            Alert.alert("Error", data.message || "Failed to submit");
          }
        } catch (err) {
          console.error("❌ handleSubmit error:", err);
          Alert.alert("Error", "Something went wrong");
        }
      };

      const formatDate = (isoDate: string) => {
          if (!isoDate) return 'N/A';
          try {
            const d = new Date(isoDate);
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          } catch (e) {
            return 'Invalid Date';
          }
        };

        const formatSubmittedDate = (isoDate: string) => {
          if (!isoDate) return 'N/A';
          try {
            const d = new Date(isoDate);
            const formattedDate = d.toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            return formattedDate.replace(/\./g, '').replace(/ /g, '-').replace(/-$/g, '');
          } catch (e) {
            return 'Invalid Date';
          }
        };

       const deleteMyLeaveRequest = async (requestId: string) => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                Alert.alert('Error', 'No token found, please log in again.');
                return;
              }

              const res = await fetch(`${API_URL}/leave-requests/${requestId}/employee`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`, 
                },
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data.message || 'Failed to delete leave request');

              console.log('✅ Employee delete result:', data);

              // state 업데이트: 숨김 처리된 요청 제외
              setRequests((prev) => prev.filter((req) => req._id !== requestId));
            } catch (err) {
              console.error('❌ Error deleting leave request:', err);
              Alert.alert('Error', 'Failed to delete leave request');
            }
          };


  

  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView className="flex-1 mt-10" style={{ flex: 1 }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}
        >
          {/* 상단 네비게이션 */}
          <View className="flex-row justify-between border-b border-white pb-3">
            <Link href="/_Schedule">
              <Text className="text-white text-lg font-bold">My Schedule</Text>
            </Link>
            <Link href="/_MyRequest">
              <Text className="text-white text-lg font-bold underline">My Request</Text>
            </Link>
          </View>

          {/* 설명 섹션 */}
          <View className="mt-6">
            <Text className="text-white text-base font-bold tracking-wide">🔹 Manage my Requests</Text>
            <Text className="text-gray-300 text-sm">
              View and report absences and late arrivals or request time off.
            </Text>
          </View>


          {/* 요청 관리 섹션 */}
          <View className="bg-gray-200 p-4 mt-6 rounded-lg">
            <Text className="text-blue-900 font-bold text-lg">Manage my Requests</Text>
            <Text className="text-gray-500 text-sm">
              Upcoming absences, time off, and shift swaps.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8} className="my-2"
              onPress={() => setShowForm(!showForm)}
            >
              <LinearGradient
                colors={['#8199B6', '#112D4E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full py-3 rounded-xl items-center justify-center border-2 border-white"
              >
              <Text className="text-white font-bold text-center">Make Request</Text>
            </LinearGradient>
            </TouchableOpacity>


            {/* 요청 Form */}
            {showForm && (
              <View className="mt-4 bg-white p-4 rounded-lg">
                {/* Date */}
                <Text className="text-blue-900 font-bold mb-2">Date</Text>
                <TextInput
                  className="border border-gray-400 rounded p-2 mb-3"
                  placeholder="YYYY-MM-DD"
                  value={date}
                  onChangeText={setDate}
                />

                {/* Reason */}
                <Text className="text-blue-900 font-bold mb-2">Reason</Text>
                <View className="border border-gray-400 rounded mb-3">
                  <Picker
                    selectedValue={reason}
                    onValueChange={(itemValue) => setReason(itemValue)}
                  >
                    <Picker.Item label="Vacation" value="vacation" />
                    <Picker.Item label="Absence" value="absence" />
                    <Picker.Item label="Day Off" value="day_off" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>

                {/* Extra Details */}
                <Text className="text-blue-900 font-bold mb-2">Details</Text>
                <TextInput
                  className="border border-gray-400 rounded p-2 mb-3"
                  placeholder="Write additional details..."
                  value={details}
                  onChangeText={setDetails}
                  multiline
                />

                {/* Submit Button */}
                <TouchableOpacity
                  className="bg-[#3F72AF] py-2 px-4 rounded-lg mt-2"
                  onPress={handleSubmit}
                >
                  <Text className="text-white font-bold text-center">Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 과거 요청 섹션 */}
          <View className="mt-6">
            <Text className="text-white text-base font-bold tracking-wide">🔹 Past requests</Text>
            <Text className="text-gray-300 text-sm">
              Past absences, time off and shift swaps.
            </Text>
          </View>

          {/* 필터 버튼 */}
          <View className="flex-row justify-between mt-4 bg-gray-800 p-2 rounded-full">
            {["pending", "approved", "denied"].map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-6 py-2 rounded-full ${
                  filter.toLowerCase() === status ? "bg-[#3F72AF]" : "bg-gray-500"
                }`}
                onPress={() => setFilter(status)}
              >
                <Text className="text-white font-bold">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 요청 목록 */}
          <View className="mt-6">
            {requests
              .filter((req) => req.status?.toLowerCase() === filter.toLowerCase())
              .filter((req) => !req.employeeDelete) // 👈 숨김 처리된 요청 제외
              .map((req) => (
                <View key={req._id} className="bg-white p-4 rounded-lg shadow-md mb-4 border-4 border-[#3F72AF]">
                  <Text className="text-[#3F72AF] font-bold">
                    {req.reason === "vacation" ? "Vacation" : req.reason === "absence" ? "Absence" : req.reason === "day_off" ? "Day Off" : "Other"}
                  </Text>
                  <Text className="text-black text-lg font-bold">{formatDate(req.date)}</Text>
                  <Text className="text-gray-500 text-base mb-2">{req.details}</Text>
                  <Text className="text-gray-500">Submitted: {formatSubmittedDate(req.submittedAt)}</Text>
                  <Text className="text-gray-500">Status: {req.status}</Text>

                  <TouchableOpacity
                    className="bg-red-600 px-4 py-2 rounded-lg mt-3"
                    onPress={() => deleteMyLeaveRequest(req._id)}
                  >
                    <Text className="text-white font-bold text-center">Delete</Text>
                  </TouchableOpacity>
                </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MyRequest;
