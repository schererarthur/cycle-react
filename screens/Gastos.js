import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function Gastos() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [lista, setLista] = useState([]);

  const adicionarRegistro = () => {
    if (!descricao || !valor) return;
    const novoItem = { id: Date.now().toString(), descricao, valor: parseFloat(valor), tipo };
    setLista([...lista, novoItem]);
    setDescricao('');
    setValor('');
  };

  const totalEntradas = lista.filter(item => item.tipo === 'entrada').reduce((sum, item) => sum + item.valor, 0);
  const totalSaidas = lista.filter(item => item.tipo === 'saida').reduce((sum, item) => sum + item.valor, 0);
  const saldoFinal = totalEntradas - totalSaidas;
  const statusVermelho = saldoFinal < 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Gastos</Text>
      
      <TextInput style={styles.input} placeholder="Descrição (ex: Ração, Venda de Leite)" placeholderTextColor="#666" value={descricao} onChangeText={setDescricao} />
      <TextInput style={styles.input} placeholder="Valor (R$)" placeholderTextColor="#666" value={valor} onChangeText={setValor} keyboardType="numeric" />
      
      <View style={styles.row}>
        <TouchableOpacity style={[styles.tipoBtn, tipo === 'entrada' && styles.ativoEntrada]} onPress={() => setTipo('entrada')}>
          <Text style={styles.btnText}>Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tipoBtn, tipo === 'saida' && styles.ativoSaida]} onPress={() => setTipo('saida')}>
          <Text style={styles.btnText}>Saída</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={adicionarRegistro}>
        <Text style={styles.buttonText}>Adicionar</Text>
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
        <Text style={[styles.saldoText, { color: statusVermelho ? '#c62828' : '#2e7d32' }]}>
          Saldo: R$ {saldoFinal.toFixed(2)} ({statusVermelho ? 'No Vermelho 🔴' : 'No Verde 🟢'})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 15, textAlign: 'center' },
  input: { width: '100%', height: 45, borderColor: '#81c784', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tipoBtn: { flex: 1, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#81c784', borderRadius: 8, marginHorizontal: 5 },
  ativoEntrada: { backgroundColor: '#81c784' },
  ativoSaida: { backgroundColor: '#ef9a9a' },
  btnText: { fontWeight: 'bold', color: '#333' },
  button: { width: '100%', height: 45, backgroundColor: '#2e7d32', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 15 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee', borderLeftWidth: 5, marginBottom: 5 },
  itemText: { fontSize: 16 },
  itemValor: { fontSize: 16, fontWeight: 'bold' },
  footerSaldo: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saldoText: { fontSize: 16, fontWeight: 'bold' }
});