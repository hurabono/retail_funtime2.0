import { Platform, View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://localhost:4000/api/auth';

interface Employee { _id: string; username: string; }
interface Shift { startTime: string; endTime: string; position: string; workHours: number; break?: string; }

const ManagerSchedule = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [employeeShifts, setEmployeeShifts] = useState<{ [key: string]: Shift[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [newShift, setNewShift] = useState({ position: '' });

  // AM/PM Picker
  const [startHour, setStartHour] = useState<number>(12);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [startAMPM, setStartAMPM] = useState<'AM' | 'PM'>('AM');
  const [endHour, setEndHour] = useState<number>(12);
  const [endMinute, setEndMinute] = useState<number>(0);
  const [endAMPM, setEndAMPM] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    setWeekDates(Array.from({ length: 7 }, (_, i) => { const d = new Date(sunday); d.setDate(sunday.getDate() + i); return d; }));
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmployee) {
      setEmployeeShifts({});
      return;
    }
    fetchEmployeeSchedule(selectedEmployee);
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employees`, { headers: { Authorization: `Bearer ${token}` } });
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployeeSchedule = async (employeeId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/getSchedule/${employeeId}`, { headers: { Authorization: `Bearer ${token}` } });
      const shiftsByDay: { [key: string]: Shift[] } = {};
      (data.shifts || []).forEach((s: any) => {
        const dayKey = new Date(s.date).toDateString();
        shiftsByDay[dayKey] = shiftsByDay[dayKey] || [];
        shiftsByDay[dayKey].push({
          startTime: s.startTime,
          endTime: s.endTime,
          position: s.position ?? '',
          workHours: s.workHours,
          break: s.workHours >= 4 ? '1 hr' : undefined,
        });
      });
      setEmployeeShifts(shiftsByDay);
    } catch (err) {
      console.error(err);
    }
  };

  const openShiftModal = (date: Date) => {
    setModalDate(date);
    setNewShift({ position: '' });
    setStartHour(12); setStartMinute(0); setStartAMPM('AM');
    setEndHour(12); setEndMinute(0); setEndAMPM('AM');
    setModalVisible(true);
  };

  const getHourNumber = (hour: number, minute: number, ampm: 'AM' | 'PM') => {
    let h = hour % 12;
    if (ampm === 'PM') h += 12;
    return h + minute / 60;
  };
  const formatTimeAMPM = (hour: number, minute: number, ampm: 'AM' | 'PM') => `${hour}:${String(minute).padStart(2, '0')} ${ampm}`;

  const addShift = async () => {
    if (!modalDate || !newShift.position) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const startHourNum = getHourNumber(startHour, startMinute, startAMPM);
    const endHourNum = getHourNumber(endHour, endMinute, endAMPM);
    let workHours = endHourNum - startHourNum;
    if (workHours <= 0) workHours += 24;

    const shiftToSend: Shift = {
      startTime: formatTimeAMPM(startHour, startMinute, startAMPM),
      endTime: formatTimeAMPM(endHour, endMinute, endAMPM),
      position: newShift.position,
      workHours,
      break: workHours >= 4 ? '1 hr' : undefined,
    };

    if (!selectedEmployee) {
      Alert.alert('Error', 'Please select an employee before adding a shift');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/employees/${selectedEmployee}/schedule`,
        {
          date: modalDate.toISOString(),
          startTime: shiftToSend.startTime,
          endTime: shiftToSend.endTime,
          workHours: shiftToSend.workHours,
          position: shiftToSend.position,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dayKey = modalDate.toDateString();
      setEmployeeShifts(prev => ({
        ...prev,
        [dayKey]: [...(prev[dayKey] || []), shiftToSend],
      }));

      Alert.alert('Shift Added', `This shift is ${workHours.toFixed(2)} hours`);
      setModalVisible(false);
    } catch (err: any) {
      console.error('Failed to add shift:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to add shift');
    }
  };

  const deleteShift = async (dayKey: string, idx: number) => {
  const shifts = [...(employeeShifts[dayKey] || [])];
  const shiftToDelete = shifts[idx];

  if (!selectedEmployee) return;

  try {
    await axios.request({
      method: 'DELETE',
      url: `${API_URL}/employees/${selectedEmployee}/schedule`,
      headers: { Authorization: `Bearer ${token}` },
      data: { 
        date: new Date(dayKey).toISOString(),
        startTime: shiftToDelete.startTime,
        endTime: shiftToDelete.endTime,
      },
    });

    shifts.splice(idx, 1);
    setEmployeeShifts(prev => ({ ...prev, [dayKey]: shifts }));

    Alert.alert('Success', 'Shift deleted successfully');
  } catch (err: any) {
    console.error('Failed to delete shift:', err);
    Alert.alert('Error', err.response?.data?.message || 'Failed to delete shift');
  }
};


  const formatDate = (date: Date) => date.getDate();
  const formatWeekday = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <LinearGradient colors={['#112D4E', '#8199B6']} className="flex-1">
      <SafeAreaView className="flex-1 mt-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}>
          <Text className="text-white text-3xl font-bold mt-5">Manager Schedule</Text>

          <View className="mt-4 bg-white rounded-lg p-2">
            <Picker
              selectedValue={selectedEmployee}
              onValueChange={(value) => { setSelectedEmployee(value); setEmployeeShifts({}); }}>
              <Picker.Item label="Select Employee" value="" />
              {employees.map(emp => <Picker.Item key={emp._id} label={emp.username} value={emp._id} />)}
            </Picker>
          </View>

          <View className="mt-4 flex-row items-center">
            <View className="bg-white px-3 py-1 rounded-lg">
              <Text className="text-[#3F72AF] font-bold text-sm">This Week</Text>
            </View>
            <View className="flex-row ml-4">
              {weekDates.map((d, idx) => <Text key={idx} className="text-white text-base mx-2">{formatDate(d)}</Text>)}
            </View>
          </View>

          <View className="w-full bg-[#fafafa] h-[0.5px] my-5 "></View>

          {weekDates.map((dayDate, index) => {
            const shifts = employeeShifts[dayDate.toDateString()] || [];
            return (
              <View key={index} className="bg-white rounded-xl px-5 py-3 mt-6 shadow-md border-4 border-[#3F72AF]">
                <View className="absolute -top-4 left-2 bg-white px-3 py-1 rounded-lg shadow-md">
                  <Text className="text-[#3F72AF] font-bold text-sm text-center">{formatWeekday(dayDate)}</Text>
                  <Text className="text-black font-bold text-lg text-center">{formatDate(dayDate)}</Text>
                </View>

                {shifts.length === 0 && <Text className="text-[#3F72AF] font-bold mt-[35px]">Not Scheduled</Text>}

                {shifts.map((s, idx) => (
                  <View key={idx} className="mt-2 bg-gray-100 p-2 rounded-lg -z-10 flex justify-center items-center">
                    <Text className='text-[#3F72AF] font-bold'>{s.startTime} - {s.endTime} | {s.position} | {s.workHours.toFixed(2)} hrs</Text>
                    {s.break && <Text>🍽 Break: {s.break}</Text>}
                    <TouchableOpacity onPress={() => deleteShift(dayDate.toDateString(), idx)}>
                      <Text className="text-red-500 underline">Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity onPress={() => openShiftModal(dayDate)}>
                  <Text className="text-[#3F72AF] font-bold underline mt-2">+ Add Shift</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <Modal visible={modalVisible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <View className="bg-white w-[90%] p-5 rounded-xl">
                <Text className="text-lg font-bold mb-3">Add Shift</Text>

                <Text className="mb-1">Start Time</Text>
                <View className="flex-row mb-2 justify-between">
                  <PickerBox value={startHour} onChange={setStartHour} labelArray={Array.from({ length: 12 }, (_, i) => i + 1)} />
                  <PickerBox value={startMinute} onChange={setStartMinute} labelArray={Array.from({ length: 60 }, (_, i) => i)} />
                  <PickerBox value={startAMPM} onChange={setStartAMPM} labelArray={['AM','PM']} />
                </View>

                <Text className="mb-1">End Time</Text>
                <View className="flex-row mb-2 justify-between">
                  <PickerBox value={endHour} onChange={setEndHour} labelArray={Array.from({ length: 12 }, (_, i) => i + 1)} />
                  <PickerBox value={endMinute} onChange={setEndMinute} labelArray={Array.from({ length: 60 }, (_, i) => i)} />
                  <PickerBox value={endAMPM} onChange={setEndAMPM} labelArray={['AM','PM']} />
                </View>

                <TextInput placeholder="Position" className="border p-2 mb-2 rounded"
                  value={newShift.position} onChangeText={(text) => setNewShift(prev => ({ ...prev, position: text }))} />

                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity onPress={() => setModalVisible(false)} className="px-4 py-2 bg-gray-300 rounded"><Text>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity onPress={addShift} className="px-4 py-2 bg-[#3F72AF] rounded"><Text className="text-white font-bold">Add</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const PickerBox = ({ value, onChange, labelArray }: any) => (
  <View className="flex-1 mx-1 bg-gray-200 rounded-xl overflow-hidden">
    <Picker selectedValue={value} style={{ height: 40 }} onValueChange={onChange}>
      {labelArray.map((l: any, i: number) => <Picker.Item key={i} label={String(l)} value={l} />)}
    </Picker>
  </View>
);

export default ManagerSchedule;
