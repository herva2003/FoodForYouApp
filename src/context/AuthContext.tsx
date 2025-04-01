import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAsyncStorage } from '../Hooks/useAsyncStorage'
import api from '../services/api'

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  token: string | null;
  refreshToken: string | null;
  handleSetToken: (token: string, refreshToken: string) => void;
  getToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { getItem, setItem } = useAsyncStorage(); // Usando o hook de AsyncStorage
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const handleSetToken = (tokenData: string, refreshTokenData: string) => {
    setItem('token', tokenData);
    setToken(tokenData);
    setItem('refreshToken', refreshTokenData);
    setRefreshToken(refreshTokenData);
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`; // Configurar cabeçalho de autorização
  };

  const getToken = async () => {
    const data = await getItem('token');
    setToken(data);
    if (data) {
      api.defaults.headers.common['Authorization'] = `Bearer ${data}`; // Configurar cabeçalho de autorização
    }
    return data;
  };

  const getRefreshToken = async () => {
    const data = await getItem('refreshToken');
    setRefreshToken(data);
    return data;
  };

  useEffect(() => {
    getToken();
    getRefreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, refreshToken, handleSetToken, getToken, getRefreshToken }}>
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