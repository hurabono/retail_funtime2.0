import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppText } from "../../../components/AppText";


// 환경별 API URL
const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000/api/auth"
    : "https://retail-funtime-backend.onrender.com/api/auth";

const ManagerInbox = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 직원들의 요청 불러오기
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      const res = await fetch(`${API_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let employees;
      try {
        employees = await res.json();
      } catch {
        const text = await res.text();
        console.error("Server response not JSON:", text);
        Alert.alert("Error", `Server returned: ${text}`);
        return;
      }

      let allRequests: any[] = [];
      employees.forEach((emp: any) => {
        if (emp.leaveRequests) {
          emp.leaveRequests.forEach((req: any) => {
            allRequests.push({
              ...req,
              employeeName: emp.username,
              employeeNumber: emp.employeeNumber,
              employeeId: emp._id,
            });
          });
        }
      });

      setRequests(allRequests);
    } catch (err) {
      console.error("❌ fetchRequests error:", err);
      Alert.alert("Error", "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 승인/거절 처리
  const handleDecision = async (requestId: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("Error", "No token found.");

      const res = await fetch(`${API_URL}/leave-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Server response not JSON:", text);
        Alert.alert("Error", `Server returned: ${text}`);
        return;
      }

      if (res.ok) {
        Alert.alert("Success", `Request ${status}`);
        fetchRequests();
      } else {
        Alert.alert("Error", data.message || "Failed to update request");
      }
    } catch (err) {
      console.error("❌ handleDecision error:", err);
    }
  };

    // 요청 삭제
    const handleDelete = async (requestId: string) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
        }

        const res = await fetch(`${API_URL}/leave-requests/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        });

        // body를 안전하게 읽기 위해 먼저 text로 읽고 JSON 시도
        const text = await res.text();
        let data;
        try {
        data = JSON.parse(text);
        } catch {
        data = { message: text };
        }

        if (res.ok) {
        Alert.alert("Deleted", "Leave request deleted");
        fetchRequests();
        } else if (res.status === 400) {
        Alert.alert("Error", data.message || "Cannot delete pending request");
        } else if (res.status === 404) {
        Alert.alert("Error", "Manager or request not found");
        } else {
        Alert.alert("Error", data.message || "Failed to delete request");
        }
    } catch (err) {
        console.error("❌ handleDelete error:", err);
        Alert.alert("Error", "Something went wrong while deleting");
    }
    };


    const pendingCount = requests.filter((r) => r.status === "pending").length;



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


  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView className="flex-1 mt-10">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}
        >
          <View className="flex-row justify-between border-b border-white pb-3 tracking-wider">
            <AppText className="text-white text-lg font-bold">Manager Panel</AppText>
            <AppText className="text-white text-lg font-bold underline">
              Inbox {pendingCount > 0 && `(${pendingCount})`}
            </AppText>
          </View>

          <View className="mt-6">
            {loading ? (
              <Text className="text-white">Loading requests...</Text>
            ) : requests.length === 0 ? (
              <Text className="text-white">No requests found.</Text>
            ) : (
              requests.map((req) => (
                <View
                  key={req._id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4 border-4 border-[#3F72AF]"
                >
                  <AppText className="text-[#3F72AF] font-bold">
                    {req.employeeName} ({req.employeeNumber || req.employeeId})
                  </AppText>
                  <AppText className="text-[#112D4E] text-lg font-bold">
                    {formatDate(req.date)}
                  </AppText>
                  <Text className="text-gray-500">{req.details}</Text>
                  <Text className="text-gray-500">
                   Submitted: {formatDate(req.submittedAt)}
                  </Text>
                  <Text className="text-gray-500">Status: {req.status}</Text>

                  {req.status === "pending" ? (
                    <View className="flex-row mt-3 justify-between">
                      <TouchableOpacity
                        className="bg-[#3F72AF] px-4 py-2 rounded-lg"
                        onPress={() => handleDecision(req._id, "approved")}
                      >
                        <AppText className="text-white font-bold">Approve</AppText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-[#112D4E] px-4 py-2 rounded-lg"
                        onPress={() => handleDecision(req._id, "denied")}
                      >
                        <AppText className="text-white font-bold">Deny</AppText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="bg-gray-600 px-4 py-2 rounded-lg mt-3"
                      onPress={() => handleDelete(req._id)}
                    >
                      <AppText className="text-white font-bold">Delete</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ManagerInbox;
