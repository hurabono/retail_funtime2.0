import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const WorkingHours = () => {
  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} className="flex-1">
      <SafeAreaView className="flex-1 mt-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>

          {/* Store Name */}
          <View className="mt-6 flex-row justify-between items-center">
            <Text className="text-white text-xl font-bold">🏪 <Text className="underline">Store3064</Text></Text>
          </View>

            {/* Header */}
          <Text className="text-white text-3xl font-bold mt-5">Working hours</Text>


          {/* Meeting Notification */}
          <View className="mt-4 bg-white rounded-full py-2 px-4 flex-row items-center">
            <Text className="text-[#3F72AF] font-semibold text-xs ">⚠️ Team meeting scheduled 10am ~ 11am | Nov 15 / 2024</Text>
          </View>

          {/* Clock In Section */}
          <View className="mt-6">
            <Text className="text-white text-lg font-semibold">• Clock In</Text>

            <View className="bg-white rounded-3xl p-2 mt-3 shadow-md flex-row justify-evenly items-center border-4 border-[#3F72AF]">
              <View>
                <Text className="text-[#3F72AF] text-sm font-bold ">• Today</Text>
                <Text className="text-[#112D4E] text-3xl font-bold">00:50 hr</Text>
              </View>
              <View className="h-[100px] bg-[#3F72AF]  w-[0.5px]"></View>
              <View>
                <Text className="text-[#3F72AF] text-sm font-bold">• This week</Text>
                <Text className="text-[#112D4E] text-3xl font-bold">32:50 hr</Text>
              </View>
            </View>

               {/* Clock in and out button */}
            <TouchableOpacity activeOpacity={0.8} className="mt-6 items-center justify-center">
                        <LinearGradient
                          colors={['#3F72AF', '#112D4E']} 
                          start={{ x: 0, y: 0 }} 
                          end={{ x: 1, y: 1 }} 
                          className="w-[200px] py-2 rounded-full flex items-center justify-center border-2 border-white"
                        >
                      <Text className="text-white text-lg font-bold"> Clocked out </Text>
                        </LinearGradient>
            </TouchableOpacity>

          </View>

          {/* Work Log Section */}
          {[{ date: '27 October 2024' }, { date: '20 October 2024' }].map((log, index) => (
            <View key={index} className="bg-white rounded-xl p-5 mt-6 shadow-md border-4 border-[#3F72AF]">
              <Text className="text-gray-500 text-sm">📅 {log.date}</Text>
              <View className="mt-2 flex-row justify-between">
                <View>
                  <Text className="text-gray-500">• Total Hours</Text>
                  <Text className="text-[#3F72AF] font-bold">8:00 hrs</Text>
                </View>
                <View>
                  <Text className="text-gray-500">• Check in & out</Text>
                  <Text className="text-[#3F72AF] font-bold">9:00am - 5:00pm</Text>
                </View>
              </View>
            </View>
          ))}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WorkingHours;
