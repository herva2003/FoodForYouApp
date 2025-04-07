import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAsyncStorage} from '../Hooks/useAsyncStorage';
import api from '../services/api';
import { UserProps } from "../interfaces/UserProps"

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  userData: UserProps | null;
  handleSetToken: (token: string, refreshToken: string) => void;
  getToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  handleLogout: () => void;
  fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const {getItem, setItem, removeItem} = useAsyncStorage();
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserProps | null>(null);

  const handleSetToken = async (
    tokenData: string,
    refreshTokenData: string,
  ) => {
    if (tokenData && refreshTokenData) {
      await setItem('token', tokenData);
      await setItem('refreshToken', refreshTokenData);
      setToken(tokenData);
      setRefreshToken(refreshTokenData);
      setIsLoggedIn(true)
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
    } else {
      await removeItem('token');
      await removeItem('refreshToken');
      setToken(null);
      setRefreshToken(null);
      setIsLoggedIn(false);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/v1/user/me");

      const user: UserProps = {
        id: response.data.id,
        login: response.data.login,
        fullName: response.data.fullName,
        height: response.data.height,
        weight: response.data.weight,
        diets: response.data.diets || "",
        allergies: response.data.allergies || "",
        intolerances: response.data.intolerances || "",
      };

      setUserData(user)
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  const getToken = async () => {
    const data = await getItem('token');
    setToken(data);
    setIsLoggedIn(!!data);
    if (data) {
      api.defaults.headers.common['Authorization'] = `Bearer ${data}`;
    }
    return data;
  };

  const getRefreshToken = async () => {
    const data = await getItem('refreshToken');
    setRefreshToken(data);
    return data;
  };

  const handleLogout = async () => {
    await removeItem('token');
    await removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      getRefreshToken();
      const token = await getToken();
      if (token) {
        await fetchUserData();
      }
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        isLoggedIn,
        userData,
        handleSetToken,
        getToken,
        getRefreshToken,
        handleLogout,
        fetchUserData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const authState = useContext(AuthContext);
  if (!authState) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return authState;
};