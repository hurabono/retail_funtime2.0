import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Modal, FlatList, ListRenderItem } from 'react-native';
import { Link, router } from "expo-router";
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const canadianProvinces: string[] = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon'
];

const SignUp = () => {
  const { register } = useAuth();
  // -- 수정된 부분: form 상태 객체에 storeNumber와 managerEmployeeNumber 추가 -- //
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    employeeNumber: '',
    province: '',
    role: 'employee',
    storeNumber: '',
    managerEmployeeNumber: ''
  });
  // --//
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProvinceModalVisible, setProvinceModalVisible] = useState(false);

  const handleSignUp = async () => {
    // -- 수정된 부분: 새로운 필드에 대한 유효성 검사 추가 -- //
    if (!form.username || !form.password || !form.confirmPassword || !form.province || !form.employeeNumber || !form.storeNumber || (form.role === 'employee' && !form.managerEmployeeNumber)) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    // --//
    if (!/^\d{6}$/.test(form.employeeNumber)) {
        Alert.alert('Error', 'Please enter a valid 6-digit employee number.');
        return;
    }
    // -- 추가된 부분: 매니저 사원번호 유효성 검사 -- //
    if (form.role === 'employee' && !/^\d{6}$/.test(form.managerEmployeeNumber)) {
        Alert.alert('Error', "Please enter a valid 6-digit manager's employee number.");
        return;
    }
    // --//
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      // -- 수정된 부분: register 함수에 새로운 필드 전달 -- //
      await register(
        form.username,
        form.password,
        form.role,
        form.province,
        form.employeeNumber,
        form.storeNumber,
        form.managerEmployeeNumber
      );
      // --//
      Alert.alert('Success', 'Registration successful! You can now log in.');
      router.replace('/signIn');
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error) && error.response) {
        // -- 수정된 부분: 백엔드 모델 변경으로 인해 에러 메시지 필드를 'message'로 변경 -- //
        errorMessage = error.response.data.message || 'Registration failed.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProvinceItem: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity
      style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}
      onPress={() => {
        setForm({ ...form, province: item });
        setProvinceModalVisible(false);
      }}
    >
      <Text style={{ textAlign: 'center', fontSize: 18 }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <Text className="text-white text-3xl font-bold text-center mb-6">Create Account</Text>
          
          <View className="flex-row mb-6">
            <TouchableOpacity 
              className={`border-2 p-3 w-[140px] rounded-l-2xl ${form.role === 'employee' ? 'bg-white/30 border-white' : 'border-gray-400'}`}
              onPress={() => setForm({...form, role: 'employee'})}
            >
              <Text className="text-white text-center font-bold">Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`border-2 p-3 w-[140px] rounded-r-2xl ${form.role === 'manager' ? 'bg-white/30 border-white' : 'border-gray-400'}`}
              onPress={() => setForm({...form, role: 'manager'})}
            >
              <Text className="text-white text-center font-bold">Manager</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-white">Username</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Enter your Username"
              placeholderTextColor="#A0AEC0"
              value={form.username}
              onChangeText={(text) => setForm({...form, username: text})}
              autoCapitalize="none"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-white">Employee Number</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Enter 6-digit employee number"
              placeholderTextColor="#A0AEC0"
              value={form.employeeNumber}
              onChangeText={(text) => setForm({...form, employeeNumber: text})}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <View className="mb-4">
            <Text className="text-white">Password</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Enter your password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({...form, password: text})}
            />
          </View>

          <View className="mb-4">
            <Text className="text-white">Confirm Password</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Confirm your password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(text) => setForm({...form, confirmPassword: text})}
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-white">Province</Text>
            <TouchableOpacity 
              onPress={() => setProvinceModalVisible(true)} 
              className="w-[300px] border-b border-gray-400 p-2 mt-1 h-[40px] justify-center"
            >
              <Text className={form.province ? "text-white" : "text-gray-400"}>
                {form.province || 'Select your province'}
              </Text>
            </TouchableOpacity>
          </View>

          {/*// -- 추가된 부분: Store Number 입력 필드 -- //*/}
          <View className="mb-4">
            <Text className="text-white">Store Number</Text>
            <TextInput
              className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
              placeholder="Enter your store number"
              placeholderTextColor="#A0AEC0"
              value={form.storeNumber}
              onChangeText={(text) => setForm({...form, storeNumber: text})}
              keyboardType="number-pad"
            />
          </View>

          {/*// -- 추가된 부분: 직원이면 매니저 사원번호 입력 필드 표시 -- //*/}
          {form.role === 'employee' && (
            <View className="mb-4">
              <Text className="text-white">Manager's Employee Number</Text>
              <TextInput
                className="w-[300px] border-b border-gray-400 text-white p-2 mt-1"
                placeholder="Enter manager's 6-digit number"
                placeholderTextColor="#A0AEC0"
                value={form.managerEmployeeNumber}
                onChangeText={(text) => setForm({...form, managerEmployeeNumber: text})}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          )}

          <TouchableOpacity activeOpacity={0.8} className="mt-4" onPress={handleSignUp} disabled={isSubmitting}>
            <LinearGradient
              colors={['#8199B6', '#112D4E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-[300px] py-3 rounded-3xl items-center justify-center border-2 border-white"
            >
              <Text className="text-white text-lg font-bold">
                {isSubmitting ? 'Registering...' : 'Register'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-300">Already have an account? </Text>
            <TouchableOpacity>
              <Link href="./signIn" className="text-blue-400 underline">Log in</Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isProvinceModalVisible}
        onRequestClose={() => setProvinceModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 10, height: '50%' }}>
            <TouchableOpacity onPress={() => setProvinceModalVisible(false)} style={{alignSelf: 'flex-end', padding: 10}}>
              <Text style={{fontSize: 18, color: '#112D4E'}}>Close</Text>
            </TouchableOpacity>
            <FlatList
              data={canadianProvinces}
              renderItem={renderProvinceItem}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SignUp;