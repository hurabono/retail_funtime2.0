// 디렉토리: context/AuthContext.js

import { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext();

// ⚠️ 중요: YOUR_BACKEND_API_URL을 실제 백엔드 주소로 변경하세요.
const API_URL = 'http://YOUR_BACKEND_API_URL/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          // 여기서 토큰으로 사용자 정보를 다시 불러오는 API를 호출할 수 있습니다.
          // 예: const { data } = await axios.get(`${API_URL}/me`); setUser(data);
          // 지금은 단순화를 위해 토큰만 불러옵니다.
          setToken(storedToken);
          // 임시로 user 객체를 설정합니다. 실제 앱에서는 API 호출로 정보를 가져오세요.
          const storedUser = await SecureStore.getItemAsync('user');
          if(storedUser) setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setInitialized(true);
      }
    };

    loadStorageData();
  }, []);
  
  const login = async (username, password, role) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { username, password, role });
      setUser(data.user);
      setToken(data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      console.log(e.response.data);
      throw e;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  };

  const register = async (username, password, role, province) => {
     try {
       const { data } = await axios.post(`${API_URL}/register`, { username, password, role, province });
       // 회원가입 후 자동 로그인을 원하면 아래 주석을 해제하세요.
       // setUser(data.user);
       // setToken(data.token);
       // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
       // await SecureStore.setItemAsync('token', data.token);
       // await SecureStore.setItemAsync('user', JSON.stringify(data.user));
       return data;
     } catch (e) {
       console.log(e.response.data);
       throw e;
     }
  };

  return (
    <AuthContext.Provider value={{ user, token, initialized, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);