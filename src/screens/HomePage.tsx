import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomePage: React.FC = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 16, borderRadius: 8 },
  registerLink: { marginTop: 16, color: 'blue', textAlign: 'center', fontSize: 16 },
});

export default HomePage