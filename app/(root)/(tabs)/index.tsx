import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import images from '@constants/images'; 

const index = () => {
  return (
    <LinearGradient colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView style={{ flex: 1 }} className="flex-1 mt-10">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>
          {/* Announcement Bar */}
          <View className="bg-white rounded-full px-4 py-2 mt-3 flex-row justify-center items-center">
          <Image source={images.approval} style={{ width: 30 }} resizeMode="contain" />
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
                  Summary of your work schedule today
            </Text>
            </View>

            <View >
            <Image source={images.storeImage} style={{ width: 120, marginLeft:15,  }} resizeMode="contain" />
            </View>
          </View>

          {/* Work Schedule Card */}
          <View className="bg-white px-4 py-5 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <View className="flex-row justify-between">
              {/* Date Info */}
              <View>
              <View className="flex-row justify-between items-center mb-2" >
                <Text className="bg-[#112D4E] text-white px-2 py-1 font-semibold rounded-full w-[140px]">
                  Nov 12 / 2024
                </Text>
                <Image className="absolute right-[-30px] top-[-7px]" source={images.Indexcalendar} style={{ width: 70 }} resizeMode="contain" />
              </View>

              <View className="mt-3">
              <Text className="text-[#112D4E] font-medium underline">week42</Text>
              <Text className="text-[#3F72AF] text-lg font-bold">NO SCHEDULE</Text>
              </View>
              </View>
              
              

              {/* Clock Status */}

              <View className="items-start">
                <View className="flex-row justify-between items-center mb-2 pr-2" >
                <Text className="bg-[#112D4E] text-white px-2 py-1 font-semibold rounded-full w-[140px] ">
                 Current Status
                </Text>
                <Image className="absolute right-[-15px] top-[-11px]" source={images.IndexClock} style={{ width: 60 }} resizeMode="contain" />
                </View>

                <View className="w-full mt-2">
                <Text className="text-[#112D4E] font-semibold">Clocked out</Text>
                <TouchableOpacity className="bg-[#3F72AF] py-2 px-0 rounded-full mt-2">
                  <Link className="inline-block flex items-center justify-center" href="/_WorkingHours">
                  <Text className="text-white font-semibold items-end text-center text-sm">Clock In</Text>
                  </Link>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Flexible Schedule Section */}
          <View className="mt-6 flex flex-row justify-center items-center">
            <View>
            <Image source={images.reschedule} style={{ width: 200, }} resizeMode="contain" />
            </View>

            <View className="w-[170px] mr-5">
              <Text className="text-white text-xl font-bold">
                Looking for flexible schedule?
              </Text>
              <TouchableOpacity>
                <Text className="text-white underline mt-1">
                  Swipe your schedule here
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="bg-white px-3 py-5 mt-6 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity className="items-center">
              <Image   source={images.requestIcon} style={{ width: 100, }} resizeMode="contain" />
              <Text className="text-[#3F72AF]  font-semibold text-xs">View My</Text>
              <Link href="/_MyRequest">
                <Text className="text-[#3F72AF]  font-semibold text-base">Request</Text>
              </Link>
              </TouchableOpacity>

              <View className="h-[100px] bg-[#3F72AF]  w-[0.5px]"></View>

              <TouchableOpacity className="items-center">
              <Image source={images.fullscheduleIcon} style={{ width: 100, }} resizeMode="contain" />
              <Text className="text-[#3F72AF]  font-semibold text-xs">View My</Text>
                <Link href="/_Schedule">
                <Text className="text-[#3F72AF]  font-semibold text-base">Schedule</Text>
                </Link>
              </TouchableOpacity>

              <View className="h-[100px] bg-[#3F72AF]  w-[0.5px]"></View>

              <TouchableOpacity className="items-center">
              <Image source={images.paymentIcon} style={{ width: 100, }} resizeMode="contain" />
              <Text className="text-[#3F72AF]  font-semibold text-xs mt-2">View My</Text>
              <Link href="/payment">
              <Text className="text-[#3F72AF]  font-semibold text-base">Payment</Text>
              </Link>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default index;
