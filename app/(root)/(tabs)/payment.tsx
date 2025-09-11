import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const payment = () => {
  return (
    <LinearGradient style={{ flex: 1 }} colors={["#112D4E", "#8199B6"]} className="flex-1">
      <SafeAreaView className="flex-1 px-5 mt-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>
          
          {/* Header */}
          <Text className="text-white text-3xl font-bold mt-5">My Payment</Text>

          {/* My Balances */}
          <View className="mt-6">
            <Text className="text-white text-xl font-bold">My balances</Text>

            {/* Working Hours & Wage Rate */}
            <View className="flex-row justify-between mt-3">
              <View className="border border-white rounded-lg p-4 w-[48%]">
                <Text className="text-gray-300 text-sm">Working hours</Text>
                <Text className="text-white text-2xl font-bold">56:32hrs</Text>
              </View>

              <View className="border border-white rounded-lg p-4 w-[48%]">
                <Text className="text-gray-300 text-sm">Wage per hour</Text>
                <Text className="text-white text-2xl font-bold">$18.00</Text>
              </View>
            </View>

            {/* Next Payment Date */}
            <Text className="text-gray-300 text-lg mt-4">
              <Text className="font-bold text-white">Next payment date :</Text> November 22 2024
            </Text>
          </View>

          {/* Past Payments */}
          <Text className="text-white text-xl font-bold mt-6">• Past payments</Text>

          {/* Payment Cards */}
          <View className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <Text className="text-gray-500 font-bold">Paycheck</Text>
            <Text className="text-[#3F72AF] text-lg font-bold mt-1">Friday, October 8</Text>

            <View className="mt-2">
              <Text className="text-gray-500">
                — Total working hours <Text className="text-black font-bold">72hrs</Text>
              </Text>
              <Text className="text-gray-500">
                — Total wages per hour <Text className="text-black font-bold">$18.00</Text>
              </Text>
              <Text className="text-gray-500">
                — Taxes <Text className="text-black font-bold">$233.28</Text>
              </Text>
            </View>

            <Text className="text-gray-400 text-sm mt-2">#Confirmation 21577712</Text>
            <Text className="text-[#3F72AF] text-lg font-bold mt-2 text-right">Total $1,062.72</Text>
          </View>

          {/* Second Payment Card */}
          <View className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <Text className="text-gray-500 font-bold">Paycheck</Text>
            <Text className="text-[#3F72AF] text-lg font-bold mt-1">Friday, September 24</Text>

            <View className="mt-2">
              <Text className="text-gray-500">
                — Total working hours <Text className="text-black font-bold">72hrs</Text>
              </Text>
              <Text className="text-gray-500">
                — Total wages per hour <Text className="text-black font-bold">$18.00</Text>
              </Text>
              <Text className="text-gray-500">
                — Taxes <Text className="text-black font-bold">$233.28</Text>
              </Text>
            </View>

            <Text className="text-gray-400 text-sm mt-2">#Confirmation 30577112</Text>
            <Text className="text-[#3F72AF] text-lg font-bold mt-2 text-right">Total $1,062.72</Text>
          </View>


           {/* Second Payment Card */}
           <View className="bg-white p-4 mt-4 rounded-xl shadow-lg border-4 border-[#3F72AF]">
            <Text className="text-gray-500 font-bold">Paycheck</Text>
            <Text className="text-[#3F72AF] text-lg font-bold mt-1">Friday, September 24</Text>

            <View className="mt-2">
              <Text className="text-gray-500">
                — Total working hours <Text className="text-black font-bold">72hrs</Text>
              </Text>
              <Text className="text-gray-500">
                — Total wages per hour <Text className="text-black font-bold">$18.00</Text>
              </Text>
              <Text className="text-gray-500">
                — Taxes <Text className="text-black font-bold">$233.28</Text>
              </Text>
            </View>

            <Text className="text-gray-400 text-sm mt-2">#Confirmation 30577112</Text>
            <Text className="text-[#3F72AF] text-lg font-bold mt-2 text-right">Total $1,062.72</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default payment;
