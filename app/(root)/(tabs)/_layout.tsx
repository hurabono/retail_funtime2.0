import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function TabLayout() {
  return (
    
    <Tabs
      screenOptions={{
        headerShown: false, // 기본적으로 헤더 숨김
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
              <Ionicons name="home-outline" size={24} color="black" />
              <Text className="text-black text-xs">Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="myInfo"
        options={{
          tabBarIcon: () => (
            <View className="items-center">
              <Ionicons name="person-outline" size={24} color="black" />
              <Text className="text-black text-xs">Info</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          tabBarIcon: () => (
            <View className="items-center">
              <Ionicons name="cash-outline" size={24} color="black" />
              <Text className="text-black text-xs">Payment</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: () => (
            <View className="flex justify-center items-center">
              <Ionicons name="settings-outline" size={24} color="black" />
              <Text className="text-black text-xs">Settings</Text>
            </View>
          ),
        }}
      />
      {/* ✅ 네비게이션 메뉴에서 숨김 */}
      <Tabs.Screen
        name="_MyRequest"
        options={{
          href: null, // ✅ 탭 바에서 안 보이게 설정
        }}
      />

      <Tabs.Screen
        name="_WorkingHours"
        options={{
          href: null, // ✅ 탭 바에서 안 보이게 설정
        }}
      />

<Tabs.Screen
        name="_Schedule"
        options={{
          href: null, // ✅ 탭 바에서 안 보이게 설정
        }}
      />
    </Tabs>
  );
}
