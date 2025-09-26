import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // ✅ [수정] 보내주신 코드의 포트 번호 4000번을 유지하고,
  // routes/authRoutes.js를 사용하기 위해 baseURL 뒤에 '/auth' 경로를 추가했습니다.
  baseURL: 'https://retail-funtime-backend.onrender.com/api/auth', 
});

// ✅ [수정 없음] 보내주신 코드 그대로 AsyncStorage를 사용합니다.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// [추가] 1단계 구현에 필요한 API 함수들
export const getEmployees = () => api.get('/employees');

export const getMe = () => api.get('/me');

export const updateEmployee = (employeeId: string, data: { retailNumber?: string; hourlyWage?: number }) => {
  return api.put(`/employees/${employeeId}`, data);
};


// ✅ [수정] export default api; 부분은 각 함수를 개별적으로 export 하므로 삭제합니다.