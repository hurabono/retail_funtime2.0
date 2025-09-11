import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // 🚨 중요: 백엔드 서버의 IP 주소 또는 도메인을 정확하게 입력해주세요.
  // 예: http://192.168.1.5:5000/api
  baseURL: 'http://localhost:4000/api/auth', 
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;