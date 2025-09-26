import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function TabLayout() {
  return (
    
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          left: 8,
          right: 8,
          elevation: 5,
          backgroundColor: "white",
          borderRadius: 20,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarIconStyle: { marginTop: 15 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => (
            <View className="items-center justify-center">
              <Ionicons name="home-outline" size={24} color="#112D4E" />
              <Text className="font-robotoSlabLight text-[#112D4E] text-xs">Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          tabBarIcon: () => (
            <View className="items-center">
              <Ionicons name="person-outline" size={24} color="#112D4E" />
              <Text className="font-robotoSlabLight text-[#112D4E] text-xs">Employees</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ManagerInbox"
        options={{
          tabBarIcon: () => (
            <View className="items-center">
              <Ionicons name="mail-outline" size={24} color="#112D4E" />
              <Text className="font-robotoSlabLight text-[#112D4E] text-xs">Inbox</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: () => (
            <View className="flex justify-center items-center">
              <Ionicons name="settings-outline" size={24} color="#112D4E" />
              <Text className="font-robotoSlabLight text-[#112D4E] text-xs">Settings</Text>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="_WorkingHours"
        options={{
          href: null, // ✅ 탭 바에서 안 보이게 설정
        }}
      />

      <Tabs.Screen
        name="ManagerTimeLogs"
        options={{
           href: null,// ✅ 탭 바에서 안 보이게 설정
        }}
      />

      <Tabs.Screen
        name="ManagerPayments"
        options={{
           href: null, // ✅ 탭 바에서 안 보이게 설정
        }}
      />

      <Tabs.Screen
        name="AnnouncementManagerScreen"
        options={{
           href: null,// ✅ 탭 바에서 안 보이게 설정
        }}
      />

    <Tabs.Screen
        name="_ManagerSchedule"
        options={{
           href: null,// ✅ 탭 바에서 안 보이게 설정
        }}
      />
    </Tabs>
    
    
    
  );
}