import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Alert, 
  SafeAreaView 
} from 'react-native';

export default function Producao({ route }) {
  const { token } = route.params || {};
  const [cultura, setCultura] = useState('');
  const [hectares, setHectares] = useState('');
  const [sacas, setSacas] = useState('');
  const [dataColheita, setDataColheita] = useState('');
  const [listaProducao, setListaProducao] = useState([]);

  // URL base da API
  const API_URL = 'http://localhost:3000';

  // Buscar registros ao carregar a tela
  useEffect(() => {
    if (token) {
      buscarProducao();
    }
  }, [token]);

  const buscarProducao = async () => {
    try {
      const response = await fetch(`${API_URL}/producao`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setListaProducao(data);
      } else {
        console.error("Erro ao buscar dados:", data.erro);
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar produção:", error);
    }
  };

  const handleCadastrarProducao = async () => {
    if (!cultura || !hectares || !sacas || !dataColheita) {
      Alert.alert("Atenção", "Preencha todos os campos do registo de produção.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/producao`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          cultura: cultura.trim(), 
          hectares: parseFloat(hectares), 
          sacas: parseInt(sacas, 10), 
          data_colheita: dataColheita.trim() 
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Produção registada com sucesso!");
        setCultura('');
        setHectares('');
        setSacas('');
        setDataColheita('');
        buscarProducao(); // Atualiza a lista na hora
      } else {
        Alert.alert("Erro", data.erro || "Não foi possível registar a produção.");
      }
    } catch (error) {
      Alert.alert("Erro de Conexão", "Falha de comunicação com o servidor.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Registo de Produção Agrícola</Text>

      <View style={styles.formContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Cultura (ex: Soja, Milho)" 
          placeholderTextColor="#888"
          value={cultura} 
          onChangeText={setCultura} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Hectares Plantados (ex: 50)" 
          placeholderTextColor="#888"
          value={hectares} 
          onChangeText={setHectares} 
          keyboardType="numeric" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Total de Sacas Produzidas" 
          placeholderTextColor="#888"
          value={sacas} 
          onChangeText={setSacas} 
          keyboardType="numeric" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Data da Colheita (AAAA-MM-DD)" 
          placeholderTextColor="#888"
          value={dataColheita} 
          onChangeText={setDataColheita} 
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastrarProducao}>
          <Text style={styles.buttonText}>Registar Colheita</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Histórico de Produção</Text>

      <FlatList
        data={listaProducao}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌱 {item.cultura}</Text>
            <Text style={styles.cardText}>Área: {item.hectares} ha | Sacas: {item.sacas}</Text>
            <Text style={styles.cardDate}>Data: {item.data_colheita}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum registo encontrado.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 15, textAlign: 'center' },
  formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2 },
  input: { height: 45, borderColor: '#a5d6a7', borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, marginBottom: 10, backgroundColor: '#f9fbe7' },
  button: { backgroundColor: '#2e7d32', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#2e7d32', elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20' },
  cardText: { fontSize: 14, color: '#555', marginTop: 4 },
  cardDate: { fontSize: 12, color: '#888', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 }
});