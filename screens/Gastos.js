import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';

export default function Gastos() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [lista, setLista] = useState([]);

  const adicionarRegistro = () => {
    const valorNumerico = parseFloat(valor);
    if (!descricao || isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Atenção", "Insira uma descrição válida e um valor numérico positivo.");
      return;
    }
    
    const novoItem = { id: Date.now().toString(), descricao, valor: valorNumerico, tipo };
    setLista([...lista, novoItem]);
    setDescricao(''); setValor('');
  };

  const totalEntradas = lista.filter(item => item.tipo === 'entrada').reduce((sum, item) => sum + item.valor, 0);
  const totalSaidas = lista.filter(item => item.tipo === 'saida').reduce((sum, item) => sum + item.valor, 0);
  const saldoFinal = totalEntradas - totalSaidas;
  const statusVermelho = saldoFinal < 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle Financeiro da Fazenda</Text>
      
      <TextInput style={styles.input} placeholder="Descrição (ex: Venda de Leite)" placeholderTextColor="#888" value={descricao} onChangeText={setDescricao} />
      <TextInput style={styles.input} placeholder="Valor (R$)" placeholderTextColor="#888" value={valor} onChangeText={setValor} keyboardType="numeric" />
      
      <View style={styles.row}>
        <TouchableOpacity style={[styles.tipoBtn, tipo === 'entrada' && styles.ativoEntrada]} onPress={() => setTipo('entrada')}>
          <Text style={styles.btnText}>Entrada (+)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tipoBtn, tipo === 'saida' && styles.ativoSaida]} onPress={() => setTipo('saida')}>
          <Text style={styles.btnText}>Saída (-)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={adicionarRegistro}>
        <Text style={styles.buttonText}>Adicionar Transação</Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderLeftColor: item.tipo === 'entrada' ? '#2e7d32' : '#d32f2f' }]}>
            <Text style={styles.itemText}>{item.descricao}</Text>
            <Text style={[styles.itemValor, { color: item.tipo === 'entrada' ? '#2e7d32' : '#d32f2f' }]}>
              {item.tipo === 'entrada' ? '+' : '-'} R$ {item.valor.toFixed(2)}
            </Text>
          </View>
        )}
      />

      <View style={[styles.footerSaldo, { backgroundColor: statusVermelho ? '#ffcdd2' : '#c8e6c9' }]}>
        <Text style={[styles.saldoText, { color: statusVermelho ? '#c62828' : '#1b5e20' }]}>
          Saldo Total: R$ {saldoFinal.toFixed(2)} ({statusVermelho ? 'No Vermelho 🔴' : 'No Verde 🟢'})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1b5e20', marginBottom: 15, textAlign: 'center' },
  input: { width: '100%', height: 45, borderColor: '#a5d6a7', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 10, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tipoBtn: { flex: 1, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#a5d6a7', borderRadius: 8, marginHorizontal: 5 },
  ativoEntrada: { backgroundColor: '#a5d6a7' },
  ativoSaida: { backgroundColor: '#ef9a9a' },
  btnText: { fontWeight: 'bold', color: '#333' },
  button: { width: '100%', height: 45, backgroundColor: '#2e7d32', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 15 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderRadius: 6, borderLeftWidth: 5, marginBottom: 8 },
  itemText: { fontSize: 15 },
  itemValor: { fontSize: 15, fontWeight: 'bold' },
  footerSaldo: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saldoText: { fontSize: 16, fontWeight: 'bold' }
});