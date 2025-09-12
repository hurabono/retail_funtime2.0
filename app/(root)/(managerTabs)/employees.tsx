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
}

const Employees = () => {
  const { token } = useAuth(); // AuthContext에서 token 가져오기
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState({ retailNumber: '', hourlyWage: '' });
  
  const fetchEmployees = async () => {
    if (!token) {
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      // -- 수정된 부분: API 요청 시 Authorization 헤더에 토큰 추가 -- //
      const { data } = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(data);
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
    }, [token]) // token이 있을 때만 실행
  );
  
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      retailNumber: employee.retailNumber || '',
      hourlyWage: employee.hourlyWage.toString()
    });
    setModalVisible(true);
  };
  
  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      // -- 수정된 부분: API 요청 시 Authorization 헤더에 토큰 추가 -- //
      const { data } = await axios.put(`${API_URL}/employees/${selectedEmployee._id}`, {
        retailNumber: editForm.retailNumber,
        hourlyWage: parseFloat(editForm.hourlyWage) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEmployees(prev => prev.map(emp => emp._id === data._id ? data : emp));
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
      <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} style={{ flex: 1 }}>
      <SafeAreaView className='mt-5' style={{ flex: 1 }}>
        <View className="px-5">
            <Text className="text-white text-3xl font-bold text-center my-6">My Employees</Text>
            {employees.length === 0 ? (
                <Text className="text-white text-center text-lg mt-10">No employees assigned to you.</Text>
            ) : (
                <FlatList
                data={employees}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 120 }}
                />
            )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
                <ScrollView>
                    <Text className="text-xl font-bold text-center text-[#112D4E] mb-5">Edit {selectedEmployee?.username}</Text>
                    
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