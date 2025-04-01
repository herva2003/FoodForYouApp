import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import api from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

interface FormData {
  fullName: string;
  email: string;
  password: string;
  height: string;
  weight: string;
}

const SignUp: React.FC = () => {
  const { control, handleSubmit } = useForm<FormData>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post('/api/v1/auth/signup', data); // Enviar os dados para a API

      if (response.status === 201) {
        Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'), // Navegar para a tela de login
          },
        ]);
      } else {
        Alert.alert('Erro!', 'Ocorreu um problema ao criar sua conta.');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      Alert.alert('Erro!', 'Ocorreu um erro ao criar sua conta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      {/* Campo: Nome Completo */}
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Campo: Email */}
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

      {/* Campo: Senha */}
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

      {/* Campo: Altura */}
      <Controller
        control={control}
        name="height"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Altura (em cm)"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Campo: Peso */}
      <Controller
        control={control}
        name="weight"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Peso (em kg)"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Botão de Cadastro */}
      <Button title="Cadastrar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 16, borderRadius: 8 },
});

export default SignUp;