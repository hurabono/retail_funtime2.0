import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext'; // AuthContext import

// API 기본 URL
const API_URL = 'http://localhost:4000/api/auth';

// 직원 정보 타입
interface Employee {
  _id: string;
  username: string;
  employeeNumber: string;
  retailNumber: string;
  hourlyWage: number;
  address?: string; // ✅ address 필드 추가
}

const Employees = () => {
  const { token } = useAuth();
  
  const [manager, setManager] = useState<Employee | null>(null); // 🔹 매니저 정보 상태 추가
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // ✅ editForm에 address 추가
  const [editForm, setEditForm] = useState({ retailNumber: '', hourlyWage: '', address: '' });
  
  const fetchEmployees = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      // 🔹 매니저 본인 정보 가져오기
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManager({
        _id: data._id,
        username: data.username,
        employeeNumber: data.employeeNumber,
        retailNumber: data.retailNumber || '',
        hourlyWage: data.hourlyWage,
        address: data.address || ''
      });

      // 🔹 직원들 정보 가져오기
      const { data: empData } = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(empData);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [token])
  );

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      retailNumber: employee.retailNumber || '',
      hourlyWage: employee.hourlyWage.toString(),
      address: employee.address || ''
    });
    setModalVisible(true);
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const { data } = await axios.put(
        `${API_URL}/employees/${selectedEmployee._id}`,
        {
          retailNumber: editForm.retailNumber,
          hourlyWage: parseFloat(editForm.hourlyWage) || 0,
          address: editForm.address // ✅ address 같이 전송
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await fetchEmployees();

      setEmployees(prev =>
        prev.map(emp => (emp._id === data._id ? { ...emp, ...data } : emp))
      );

      setModalVisible(false);
      setSelectedEmployee(null);
      Alert.alert('Success', 'Employee information updated.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update employee information.');
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#112D4E', '#8199B6']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }

  const renderItem = ({ item }: { item: Employee }) => (
    <TouchableOpacity onPress={() => handleSelectEmployee(item)}>
      <View className="bg-white rounded-xl p-5 mb-4 shadow-md border-4 border-[#3F72AF]">
        <Text className="text-[#112D4E] text-lg font-bold">{item.username}</Text>
        <Text className="text-gray-500 mt-1">Employee #: {item.employeeNumber}</Text>
        <Text className="text-gray-500 mt-1">Retail #: {item.retailNumber || 'N/A'}</Text>
        <Text className="text-gray-500 mt-1">Hourly Wage: ${item.hourlyWage.toFixed(2)}</Text>
        <Text className="text-gray-500 mt-1">Address: {item.address || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView className="mt-5" style={{ flex: 1 }}>
        <View className="px-5">
          <Text className="text-white text-3xl font-bold text-center my-6">My Employees</Text>

          {/* 🔹 Manager 고정 카드 */}
          <Text className="text-white text-xl font-bold mb-2">🔹 Manager</Text>
          {manager && (
            <TouchableOpacity onPress={() => handleSelectEmployee(manager)}>
              <View className="bg-white rounded-xl p-5 mb-4 shadow-md border-4 border-[#3F72AF]">
                <Text className="text-[#112D4E] text-lg font-bold">{manager.username}</Text>
                <Text className="text-gray-500 mt-1">Employee #: {manager.employeeNumber}</Text>
                <Text className="text-gray-500 mt-1">Retail #: {manager.retailNumber || 'N/A'}</Text>
                <Text className="text-gray-500 mt-1">Hourly Wage: ${manager.hourlyWage.toFixed(2)}</Text>
                <Text className="text-gray-500 mt-1">Address: {manager.address || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* 🔹 Employees 타이틀 */}
          <Text className="text-white text-xl font-bold mb-2 mt-4">🔹 Employees</Text>

          {employees.length === 0 ? (
            <Text className="text-white text-center text-lg mt-10">
              No employees assigned to you.
            </Text>
          ) : (
            <FlatList
              data={employees}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              contentContainerStyle={{ paddingBottom: 120 }}
              extraData={employees}
            />
          )}
        </View>

        {/* 모달 (편집 기능 동일) */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <ScrollView>
                <Text className="text-xl font-bold text-center text-[#112D4E] mb-5">
                  Edit {selectedEmployee?.username}
                </Text>

                <Text className="text-gray-500 mb-1">Retail Number</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg mb-4"
                  placeholder="Enter Retail Number"
                  value={editForm.retailNumber}
                  onChangeText={text => setEditForm(prev => ({ ...prev, retailNumber: text }))}
                />

                <Text className="text-gray-500 mb-1">Hourly Wage</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg mb-6"
                  placeholder="Enter Hourly Wage"
                  keyboardType="numeric"
                  value={editForm.hourlyWage}
                  onChangeText={text => setEditForm(prev => ({ ...prev, hourlyWage: text }))}
                />

                <Text className="text-gray-500 mb-1">Store Address</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg mb-6"
                  placeholder="Enter store address"
                  value={editForm.address}
                  onChangeText={text => setEditForm(prev => ({ ...prev, address: text }))}
                />

                <TouchableOpacity activeOpacity={0.8} className="mb-2" onPress={handleUpdateEmployee}>
                  <LinearGradient
                    colors={['#8199B6', '#112D4E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-full py-3 rounded-3xl items-center justify-center border-2 border-white"
                  >
                    <Text className="text-white text-lg font-bold">Save Changes</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={() => setModalVisible(false)}>
                  <View className="w-full py-3 rounded-3xl items-center justify-center border-2 border-gray-400">
                    <Text className="text-gray-500 text-lg font-bold">Cancel</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});

export default Employees;
