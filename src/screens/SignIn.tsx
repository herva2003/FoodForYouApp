import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  SignUp: undefined;
};

interface SignInRequest {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { handleSetToken } = useAuth();
  const { control, handleSubmit } = useForm<SignInRequest>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignIn = async (data: SignInRequest) => {
    const { email, password } = data;

    try {
      const response = await api.post('/api/v1/auth/login', {
        login: email,
        password: password,
      });

      const responseData = response.data;
      const { accessToken, refreshToken } = responseData.data;

      if (accessToken && refreshToken) {
        handleSetToken(accessToken, refreshToken);
      } else {
        Alert.alert('Erro!', 'Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro durante a solicitação de login:', error);
      Alert.alert('Erro!', 'Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Button title="Entrar" onPress={handleSubmit(handleSignIn)} />

      {/* Botão ou texto para navegar para a tela de cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.registerLink}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 16, borderRadius: 8 },
  registerLink: { marginTop: 16, color: 'blue', textAlign: 'center', fontSize: 16 },
});

export default SignIn;