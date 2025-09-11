import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@constants/images'; // image path

const myInfo = () => {
  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView className='mt-5' style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom:100 }}>

          {/* profile top information */}
          <View className="flex-row justify-between items-center mt-6">
             {/* Employee Store information */}
            <Text className="text-white text-xl font-bold">🏪 <Text className="underline">Store3064</Text></Text>
          </View>

              {/* Employee Working information */}
          <View className="mt-4">
            <Text className="text-gray-300 text-xs">📅 1 YEAR</Text>
            <Text className="text-white text-3xl font-bold mt-2 mb-5">Hello, John Doe!</Text>
            <Text className="text-gray-300 mt-1">Hired : Jan 18, 2023</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-gray-300">WIN 325000142 </Text>
              <TouchableOpacity>
                  {/* Copy Employee number */}
                <Text className="text-blue-400 underline">COPY</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* profile photo upload button */}
          <TouchableOpacity className="self-end mt-[-50px] border-dashed border-2 border-gray-300 p-4 rounded-lg items-center p-8">
            <Image source={images.profilePlaceholder} style={{ width: 50 }} resizeMode="contain" />
            <Text className="text-gray-300 text-xs text-center mt-1">Add my profile photo</Text>
          </TouchableOpacity>

          {/* My Availability */}
          <View className="bg-white rounded-xl p-5 mt-6 shadow-md border-4 border-[#3F72AF]">
            <Text className="text-[#3F72AF] font-bold">My Availability</Text>
            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-gray-500">Start</Text>
                <Text className="text-[#3F72AF] font-bold">Oct. 5, 2024</Text>
              </View>
              <View>
                <Text className="text-gray-500">End</Text>
                <Text className="text-[#3F72AF] font-bold">No end date</Text>
              </View>
            
              {/* Calender Image */}
              <Image source={images.calendarIcon} style={{ width: 80}} />
            </View>
            <TouchableOpacity className="mt-4 bg-secondary py-2 rounded-xl items-center">
              
              {/* Move to Full Schedule */}
              <Text className="text-white font-bold">View Details</Text>
            </TouchableOpacity>
          </View>

          {/* Job Information */}
          <View className="bg-white rounded-xl p-5 mt-6 shadow-md  border-4 border-[#3F72AF]">
            <Text className="text-[#3F72AF] font-bold">Job Information</Text>
            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-gray-500">My role</Text>
                <Text className="text-[#3F72AF] font-bold">Oct. 5, 2024</Text>
              </View>
              <View>
                <Text className="text-gray-500">Reporting to</Text>
                <Text className="text-[#3F72AF] font-bold">Chris Smith</Text>
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-gray-500">Cost center</Text>
              <Text className="text-[#3F72AF] font-bold">CA03064</Text>
            </View>

            <View className="mt-4">
              <Text className="text-gray-500">Office</Text>
              <Text className="text-[#3F72AF] font-bold">234 Bily Bishop Way, Oakville, ON L6H 6M4</Text>
            </View>
          </View>


          
        </ScrollView>

      
      </SafeAreaView>
    </LinearGradient>
  );
};

export default myInfo;
