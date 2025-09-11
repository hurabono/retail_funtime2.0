import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ScheduleScreen = () => {
  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} className="flex-1">
      <SafeAreaView className="flex-1 mt-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>
          {/* Header */}
          <Text className="text-white text-3xl font-bold mt-5">My Schedule </Text>

          {/* Meeting Notification */}
           <View className="mt-4 bg-white rounded-full py-2 px-4 flex-row items-center">
                <Text className="text-[#3F72AF] font-semibold text-xs ">⚠️ Team meeting scheduled 10am ~ 11am | Nov 15 / 2024</Text>
          </View>

          {/* Tabs */}
          <View className="mt-6 flex-row justify-between pb-2">
            <Text className="text-white text-lg font-bold pb-1 ">•  My Schedule</Text>
            <Text className="text-gray-400 text-lg">My Request</Text>
          </View>

          {/* Week Selector */}
          <View className="mt-4 flex-row items-center">
            <View className="bg-white px-3 py-1 rounded-lg">
              <Text className="text-[#3F72AF] font-bold text-sm">WEEK 42</Text>
            </View>
            <View className="flex-row ml-4">
              {['9', '10', '11', '12', '13', '14', '15'].map((day, index) => (
                <Text key={index} className="text-white text-base mx-2">{day}</Text>
              ))}
            </View>
          </View>

            <View className="w-full bg-[#fafafa] h-[0.5px] my-5 "></View>

          {/* Date Range and Total Hours */}
          <View className="mt-2 flex-row justify-between">
            <Text className="text-gray-300">09-15 Nov</Text>
            <Text className="text-white font-bold">11.50h</Text>
          </View>

          {/* Schedule Entries */}
          {[
            { day: 'TUE', date: '12', title: 'Not Scheduled', shift: 'No available Shift' },
            { day: 'WED', date: '13', title: 'Product sales Associate', shift: '7:00am - 1:00pm', break: '10:45am - 11:15am', hours: '5.50h' },
            { day: 'THUR', date: '14', title: 'Product sales Associate', shift: '7:00am - 1:00pm', break: '10:45am - 11:15am', hours: '6h' },
          ].map((schedule, index) => (
            <View key={index} className="bg-white rounded-xl px-5 py-3 mt-6 shadow-md border-4 border-[#3F72AF]">

              {/* Date Badge */}
              <View className="absolute -top-4 left-2 bg-white px-3 py-1 rounded-lg shadow-md">
                <Text className="text-[#3F72AF] font-bold text-sm text-center">{schedule.day}</Text>
                <Text className="text-black font-bold text-lg text-center">{schedule.date}</Text>
              </View>

              {/* Schedule Content */}
              <Text className="text-[#3F72AF] font-bold text-lg mt-[35px]">{schedule.title}</Text>
              {schedule.hours && <Text className="text-[#3F72AF] font-bold absolute top-5 right-5">{schedule.hours}</Text>}
              <Text className="text-gray-500 mt-1">{schedule.shift}</Text>
              {schedule.break && <Text className="text-gray-500">🍽 {schedule.break}</Text>}

              {/* Shift Options */}
              {schedule.hours && (
                <TouchableOpacity className="mt-3">
                  <Text className="text-[#3F72AF] font-bold underline text-right">Shift options</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ScheduleScreen;
