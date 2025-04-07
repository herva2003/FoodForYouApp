import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Button } from 'react-native';
import Modal from 'react-native-modal';
import api from '../services/api';
import {useAuth} from '../context/AuthContext';

const availableColumns = [
  'energy_kcal',
  'protein_g',
  'saturated_fats_g',
  'fat_g',
  'carb_g',
  'fiber_g',
  'sugar_g',
  'calcium_mg',
  'iron_mg',
  'magnesium_mg',
  'phosphorus_mg',
  'potassium_mg',
  'sodium_mg',
  'zinc_mg',
  'copper_mcg',
  'manganese_mg',
  'selenium_mcg',
  'vitC_mg',
  'thiamin_mg',
  'riboflavin_mg',
  'niacin_mg',
  'vitB6_mg',
  'folate_mcg',
  'vitB12_mcg',
  'vitA_mcg',
  'vitE_mg',
  'vitD2_mcg',
];

const columnLabels: { [key: string]: string } = {
  energy_kcal: 'Calorias (kcal)',
  protein_g: 'Proteína (g)',
  saturated_fats_g: 'Gordura Saturada (g)',
  fat_g: 'Gordura (g)',
  carb_g: 'Carboidratos (g)',
  fiber_g: 'Fibra (g)',
  sugar_g: 'Açúcar (g)',
  calcium_mg: 'Cálcio (mg)',
  iron_mg: 'Ferro (mg)',
  magnesium_mg: 'Magnésio (mg)',
  phosphorus_mg: 'Fósforo (mg)',
  potassium_mg: 'Potássio (mg)',
  sodium_mg: 'Sódio (mg)',
  zinc_mg: 'Zinco (mg)',
  copper_mcg: 'Cobre (mcg)',
  manganese_mg: 'Manganês (mg)',
  selenium_mcg: 'Selênio (mcg)',
  vitC_mg: 'Vitamina C (mg)',
  thiamin_mg: 'Tiamina (mg)',
  riboflavin_mg: 'Riboflavina (mg)',
  niacin_mg: 'Niacina (mg)',
  vitB6_mg: 'Vitamina B6 (mg)',
  folate_mcg: 'Folato (mcg)',
  vitB12_mcg: 'Vitamina B12 (mcg)',
  vitA_mcg: 'Vitamina A (mcg)',
  vitE_mg: 'Vitamina E (mg)',
  vitD2_mcg: 'Vitamina D2 (mcg)',
};

const Dashboard: React.FC = () => {
  const {userData} = useAuth();
  const [nutritionalData, setNutritionalData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  
  useEffect(() => {
    fetchNutritionalData();
  }, []);

  const fetchNutritionalData = async () => {
    try {
      const response = await api.get('/api/v1/user/nv');
      setNutritionalData(response.data.data);
    } catch (error) {
      console.error('Error fetching nutritional data:', error);
    }
  };

  const handleColumnSelection = (column: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((col) => col !== column);
      } else if (prev.length < 7) {
        return [...prev, column];
      } else {
        Alert.alert('Atenção', 'Você pode selecionar no máximo 7 valores.');
        return prev;
      }
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Informações do Paciente */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{userData?.fullName ?? 'N/A'}</Text>
        <Text>Altura: {userData?.height ?? 'N/A'} cm</Text>
        <Text>Peso: {userData?.weight ?? 'N/A'} kg</Text>
        <Text>Dietas: {userData?.diets ?? 'N/A'}</Text>
        <Text>Alergias: {userData?.allergies ?? 'N/A'}</Text>
        <Text>Intolerâncias: {userData?.intolerances ?? 'N/A'}</Text>
      </View>
      
      {/* Seleção de Data */}
      <View style={styles.datePickerContainer}>

      </View>

      {/* Botão para abrir modal */}
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>Selecionar Colunas</Text>
      </TouchableOpacity>

      {/* Modal para seleção de colunas */}
      <Modal isVisible={isModalVisible}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecione até 7 valores</Text>
          {availableColumns.map((column) => (
            <TouchableOpacity
              key={column}
              onPress={() => handleColumnSelection(column)}
              style={[
                styles.columnButton,
                selectedColumns.includes(column) && styles.columnButtonSelected,
              ]}
            >
              <Text>{columnLabels[column]}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Fechar" onPress={toggleModal} />
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePicker: {
    width: '45%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  columnButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  columnButtonSelected: {
    backgroundColor: '#007BFF',
    color: '#fff',
  },
});

export default Dashboard;