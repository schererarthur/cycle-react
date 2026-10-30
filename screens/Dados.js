import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Dados() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Dados da Fazenda</Text>
      <Text style={styles.subtitle}>Área em desenvolvimento...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10 }
});