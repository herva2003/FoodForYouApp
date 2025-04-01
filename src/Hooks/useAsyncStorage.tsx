import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = () => {
  const setItem = async (key: string, value: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no AsyncStorage:', error);
    }
  };

  const getItem = async (key: string) => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao recuperar do AsyncStorage:', error);
    }
  };

  const removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do AsyncStorage:', error);
    }
  };

  return { setItem, getItem, removeItem };
};