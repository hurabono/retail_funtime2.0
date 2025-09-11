// app/(root)/(tabs)/index.tsx
// 🎨 진짜 최종 디자인 복구 완료 (Tailwind CSS) 🎨
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import images from "@constants/images";

const index = () => {
  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView style={{ flex: 1 }} className="flex-1 mt-10">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 100,
          }}
        >
          {/* Announcement Bar */}
          <View className="bg-white rounded-full px-4 py-2 mt-3 flex-row justify-center items-center">
            <Image
              source={images.approval}
              style={{ width: 30 }}
              resizeMode="contain"
            />
            <Text className="text-gray-600 font-semibold">
              No announcement today - Nov 12 2024
            </Text>
          </View>

          {/* Header Section */}
          <View className="flex-row justify-around items-center mt-5">
            <View>
              <Text className="text-white text-lg font-bold">🏪 Store3064</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                Hello, John Doe!
              </Text>
              <Text className="text-gray-300 mt-1 text-xs">
                📅 Monday, November 12, 2024
              </Text>
            </View>
            <Image
              source={images.user}
              style={{ width: 100 }}
              resizeMode="contain"
            />
          </View>

          {/* Clock In/Out Section */}
          <View className="bg-white rounded-xl p-5 mt-6 shadow-md flex-row justify-between items-center border-4 border-[#3F72AF]">
            <View>
              <Text className="text-[#3F72AF] font-bold text-lg">
                8:58 <Text className="text-sm">am</Text>
              </Text>
              <Text className="text-gray-500 text-xs">
                Monday, November 12, 2024
              </Text>
            </View>
            <TouchableOpacity>
              <LinearGradient
                colors={["#4A7DB5", "#1E3A68"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 py-3 rounded-full border-2 border-white"
              >
                <Text className="text-white font-bold text-base">Clock In</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Navigation Grid */}
          <View className="flex-row bg-white rounded-xl p-5 mt-6 shadow-md justify-around items-center border-4 border-[#3F72AF]">
            <TouchableOpacity className="items-center">
              <Image
                source={images.requestIcon}
                style={{ width: 100 }}
                resizeMode="contain"
              />
              <Text className="text-[#3F72AF]  font-semibold text-xs">
                View My
              </Text>
              <Link href="/(root)/(tabs)/_MyRequest">
                <Text className="text-[#3F72AF]  font-semibold text-base">
                  Request
                </Text>
              </Link>
            </TouchableOpacity>

            <View className="h-[100px] bg-[#3F72AF]  w-[0.5px]"></View>

            <TouchableOpacity className="items-center">
              <Image
                source={images.fullscheduleIcon}
                style={{ width: 100 }}
                resizeMode="contain"
              />
              <Text className="text-[#3F72AF]  font-semibold text-xs">
                View My
              </Text>
              <Link href="/(root)/(tabs)/_Schedule">
                <Text className="text-[#3F72AF]  font-semibold text-base">
                  Schedule
                </Text>
              </Link>
            </TouchableOpacity>

            <View className="h-[100px] bg-[#3F72AF]  w-[0.5px]"></View>

            <TouchableOpacity className="items-center">
              <Image
                source={images.paymentIcon}
                style={{ width: 100 }}
                resizeMode="contain"
              />
              <Text className="text-[#3F72AF]  font-semibold text-xs mt-2">
                View My
              </Text>
              <Link href="/(root)/(tabs)/payment">
                <Text className="text-[#3F72AF]  font-semibold text-base">
                  Payment
                </Text>
              </Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default index;