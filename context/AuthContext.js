// 디렉토리: context/AuthContext.js

import { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext();


const API_URL = 'http://localhost:4000/api/auth';

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
          setToken(storedToken);
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
      console.log(e.response ? e.response.data : e.message);
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