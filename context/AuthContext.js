import { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext();

// [수정] YOUR_COMPUTER_IP를 실제 컴퓨터 IP 주소로 변경하세요.
const API_URL = 'https://retail-funtime-backend.onrender.com/api/auth';

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
        const storedToken = await storage.getItem('token');
        if (storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);
          const storedUser = await storage.getItem('user');
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

    const loggedInUser = {
      _id: data._id,
      username: data.username,
      role: data.role,
    };

    setUser(loggedInUser);
    setToken(data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    await storage.setItem('token', data.token);
    await storage.setItem('user', JSON.stringify(loggedInUser));

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
    await storage.deleteItem('token');
    await storage.deleteItem('user');
  };

  // -- 수정된 부분: register 함수에 storeNumber와 managerEmployeeNumber 파라미터를 추가했습니다. -- //
  const register = async (username, password, role, province, employeeNumber, storeNumber, managerEmployeeNumber) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, { 
        username, 
        password, 
        role, 
        province, 
        employeeNumber,
        storeNumber, 
        managerEmployeeNumber 
      });
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