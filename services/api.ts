import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // ✅ [수정] 백엔드 포트 번호를 4000번에서 5000번으로 변경했습니다.
  // 이 주소는 사용자님의 백엔드 server.js 파일에 명시된 포트와 일치합니다.
  baseURL: 'http://localhost:4000/api', 
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;