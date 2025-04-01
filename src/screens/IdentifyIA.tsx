import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface NutritionalValues {
  [key: string]: number;
}

interface Ingredient {
  _id: string;
  Descrip: string;
}

interface Quantity {
  Descrip: string;
  quantity: number;
}

interface Quantities {
  [key: string]: Quantity;
}

const steps = ['Analisar Receita', 'Analisar Calorias', 'Salvar Valores'];

const IdentifyIA: React.FC = () => {
  const [textToProcess, setTextToProcess] = useState('');
  const [result, setResult] = useState<Ingredient[]>([]);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [calculatedValues, setCalculatedValues] = useState<NutritionalValues>({});
  const [activeStep, setActiveStep] = useState(0);
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/process_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text_to_process: textToProcess }),
      });

      const data: Ingredient[] = await response.json();
      setResult(data);

      const initialQuantities: Quantities = {};
      data.forEach((ingredient) => {
        initialQuantities[ingredient._id] = {
          Descrip: ingredient.Descrip,
          quantity: 10,
        };
      });
      setQuantities(initialQuantities);

      Alert.alert('Sucesso', 'A receita foi processada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar receita:', error);
      Alert.alert('Erro', 'Houve um erro ao processar a receita.');
    }
  };

  const handleQuantityChange = (ingredientId: string, newQuantity: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [ingredientId]: {
        ...prevQuantities[ingredientId],
        quantity: parseInt(newQuantity, 10),
      },
    }));
  };

  const handleSendQuantities = async () => {
    try {
      const quantitiesToSend = Object.keys(quantities).map((key) => ({
        _id: key,
        Descrip: quantities[key].Descrip,
        quantity: quantities[key].quantity,
      }));

      const response = await fetch('http://127.0.0.1:5000/send_quantities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quantitiesToSend),
      });

      const data = await response.json();
      setCalculatedValues(data.nutritional_values);

      Alert.alert('Sucesso', 'As quantidades foram enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar quantidades:', error);
      Alert.alert('Erro', 'Houve um erro ao enviar as quantidades.');
    }
  };

  const handleSaveCalculatedValues = async () => {
    try {
      const token = await getToken();
      const response = await api.post('/api/v1/user/nv/', calculatedValues, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response) {
        Alert.alert('Sucesso', 'Os valores nutricionais foram salvos com sucesso!');
        setResult([]);
        setQuantities({});
        setCalculatedValues({});
        setTextToProcess('');
      } else {
        throw new Error('Erro ao salvar valores nutricionais');
      }
    } catch (error) {
      console.error('Erro ao salvar valores nutricionais:', error);
      Alert.alert('Erro', 'Houve um erro ao salvar os valores nutricionais.');
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      await handleSubmit();
    } else if (activeStep === 1) {
      await handleSendQuantities();
    } else if (activeStep === steps.length - 1) {
      await handleSaveCalculatedValues();
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <View>
            <Text style={styles.label}>Escreva a receita:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Digite os ingredientes ou receita..."
              value={textToProcess}
              onChangeText={setTextToProcess}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Processar Receita</Text>
            </TouchableOpacity>
          </View>
        );
      case 1:
        return (
          <ScrollView>
            <Text style={styles.label}>Ingredientes encontrados:</Text>
            {result.map((item) => (
              <View key={item._id} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{item.Descrip}</Text>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={quantities[item._id]?.quantity.toString() || ''}
                  onChangeText={(value) => handleQuantityChange(item._id, value)}
                />
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleSendQuantities}>
              <Text style={styles.buttonText}>Analisar Calorias</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView>
            <Text style={styles.label}>Valores Nutricionais:</Text>
            {Object.keys(calculatedValues).map((key) => (
              <View key={key} style={styles.nutritionalRow}>
                <Text style={styles.nutrientName}>{key}</Text>
                <Text style={styles.nutrientValue}>{calculatedValues[key]}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleSaveCalculatedValues}>
              <Text style={styles.buttonText}>Salvar Valores</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      default:
        return <Text>Etapa desconhecida</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Identify IA</Text>
      {renderStepContent()}
      <View style={styles.navigationButtons}>
        {activeStep > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={handleBack}>
            <Text style={styles.navButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        {activeStep < steps.length - 1 && (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Próximo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  textInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16, height: 100 },
  button: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  ingredientRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ingredientName: { fontSize: 16 },
  quantityInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, width: 80 },
  nutritionalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  nutrientName: { fontSize: 16 },
  nutrientValue: { fontSize: 16, fontWeight: 'bold' },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  navButton: { padding: 12, backgroundColor: '#ccc', borderRadius: 8 },
  navButtonText: { fontSize: 16 },
});

export default IdentifyIA;