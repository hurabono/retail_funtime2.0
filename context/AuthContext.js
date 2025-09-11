import React, { createContext, useState, useEffect, useContext } from 'react';
// [수정] Platform과 AsyncStorage를 import 합니다.
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext();

// [수정] 컴퓨터 IP 주소로 변경하여 모바일에서도 접속 가능하게 합니다.
const API_URL = 'http://localhost:4000/api/auth';

// [추가] 플랫폼에 따라 적절한 저장소를 선택하는 헬퍼 객체
const storage = {
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  deleteItem: async (key) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        // [수정] storage 헬퍼 사용
        const storedToken = await storage.getItem('token');
        if (storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);
          // [수정] storage 헬퍼 사용
          const storedUser = await storage.getItem('user');
          if (storedUser) setUser(JSON.parse(storedUser));
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
      // [수정] storage 헬퍼 사용
      await storage.setItem('token', data.token);
      await storage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      console.log(e.response ? e.response.data : e.message);
      throw e;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    // [수정] storage 헬퍼 사용
    await storage.deleteItem('token');
    await storage.deleteItem('user');
  };

  const register = async (username, password, role, province) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, { username, password, role, province });
      return data;
    } catch (e) {
      console.log(e.response ? e.response.data : e.message);
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