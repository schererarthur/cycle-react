import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Dados() {
  const route = useRoute();
  const token = route.params?.token;

  const [exibirFormRebanho, setExibirFormRebanho] = useState(false);
  const [idAnimal, setIdAnimal] = useState('');
  const [peso, setPeso] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState('');
  const [editandoAnimalId, setEditandoAnimalId] = useState(null);
  const [rebanho, setRebanho] = useState([]);

  const [nomeItem, setNomeItem] = useState('');
  const [qtdItem, setQtdItem] = useState('');
  const [catItem, setCatItem] = useState('Rações');
  const [editandoEstoqueId, setEditandoEstoqueId] = useState(null);
  const [estoque, setEstoque] = useState([]);

  const categoriasEstoque = ['Fertilizantes', 'Sementes', 'Rações', 'Gasolina', 'Remédios'];

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const resR = await fetch('http://localhost:3000/animais', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resR.ok) setRebanho(await resR.json());

      const resE = await fetch('http://localhost:3000/estoque', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resE.ok) setEstoque(await resE.json());
    } catch (e) {
      console.log("Erro ao carregar dados autenticados.");
    }
  };

  const salvarAnimal = async () => {
    if (!idAnimal || !peso || !raca || !sexo) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    const url = editandoAnimalId ? `http://localhost:3000/animais/${editandoAnimalId}` : 'http://localhost:3000/animais';
    const method = editandoAnimalId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id_animal: idAnimal, peso, raca, sexo })
    });

    setIdAnimal(''); setPeso(''); setRaca(''); setSexo(''); setEditandoAnimalId(null); setExibirFormRebanho(false);
    buscarDados();
  };

  const prepararEdicaoAnimal = (item) => {
    setIdAnimal(item.id_animal);
    setPeso(String(item.peso));
    setRaca(item.raca);
    setSexo(item.sexo);
    setEditandoAnimalId(item.id);
    setExibirFormRebanho(true);
  };

  const excluirAnimal = async (id) => {
    await fetch(`http://localhost:3000/animais/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    buscarDados();
  };

  const salvarEstoque = async () => {
    if (!nomeItem || !qtdItem) {
      Alert.alert("Atenção", "Preencha o nome e a quantidade.");
      return;
    }
    const url = editandoEstoqueId ? `http://localhost:3000/estoque/${editandoEstoqueId}` : 'http://localhost:3000/estoque';
    const method = editandoEstoqueId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome_item: nomeItem, quantidade: qtdItem, categoria: catItem })
    });

    setNomeItem(''); setQtdItem(''); setCatItem('Rações'); setEditandoEstoqueId(null);
    buscarDados();
  };

  const prepararEdicaoEstoque = (item) => {
    setNomeItem(item.nome_item);
    setQtdItem(String(item.quantidade));
    setCatItem(item.categoria);
    setEditandoEstoqueId(item.id);
  };

  const excluirEstoque = async (id) => {
    await fetch(`http://localhost:3000/estoque/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    buscarDados();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel de Gestão - Cycle Sown</Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>1. Controle de Rebanho</Text>
        <TouchableOpacity style={styles.btnSecundario} onPress={() => { setExibirFormRebanho(!exibirFormRebanho); setEditandoAnimalId(null); }}>
          <Text style={styles.btnSecundarioText}>{exibirFormRebanho ? "Fechar Formulário" : "+ Adicionar Animal"}</Text>
        </TouchableOpacity>

        {exibirFormRebanho && (
          <View style={styles.formBox}>
            <TextInput style={styles.input} placeholder="ID do Animal" placeholderTextColor="#888" value={idAnimal} onChangeText={setIdAnimal} />
            <TextInput style={styles.input} placeholder="Peso (kg)" placeholderTextColor="#888" value={peso} onChangeText={setPeso} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Raça" placeholderTextColor="#888" value={raca} onChangeText={setRaca} />
            <TextInput style={styles.input} placeholder="Sexo (Macho/Fêmea)" placeholderTextColor="#888" value={sexo} onChangeText={setSexo} />
            <TouchableOpacity style={styles.btnPrincipal} onPress={salvarAnimal}>
              <Text style={styles.btnText}>{editandoAnimalId ? "Atualizar Animal" : "Salvar Animal"}</Text>
            </TouchableOpacity>
          </View>
        )}

        {rebanho.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Text style={styles.listText}>ID: {item.id_animal} | {item.raca} | {item.peso}kg | {item.sexo}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => prepararEdicaoAnimal(item)}><Text style={styles.editText}>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => excluirAnimal(item.id)}><Text style={styles.deleteText}>Excluir</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>2. Controle de Estoque</Text>
        <TextInput style={styles.input} placeholder="Nome do Item" placeholderTextColor="#888" value={nomeItem} onChangeText={setNomeItem} />
        <TextInput style={styles.input} placeholder="Quantidade" placeholderTextColor="#888" value={qtdItem} onChangeText={setQtdItem} keyboardType="numeric" />
        
        <Text style={styles.labelCategoria}>Categoria:</Text>
        <View style={styles.catContainer}>
          {categoriasEstoque.map((cat) => (
            <TouchableOpacity key={cat} style={[styles.catBtn, catItem === cat && styles.catBtnAtivo]} onPress={() => setCatItem(cat)}>
              <Text style={[styles.catText, catItem === cat && styles.catTextAtivo]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btnPrincipal} onPress={salvarEstoque}>
          <Text style={styles.btnText}>{editandoEstoqueId ? "Atualizar Item" : "Adicionar ao Estoque"}</Text>
        </TouchableOpacity>

        {estoque.map((item) => (
          <View key={item.id} style={styles.stockItem}>
            <Text style={styles.listText}>{item.nome_item} - Qtd: {item.quantidade} ({item.categoria})</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => prepararEdicaoEstoque(item)}><Text style={styles.editText}>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => excluirEstoque(item.id)}><Text style={styles.deleteText}>Excluir</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>3. Mapeamento de Terra (Satélite)</Text>
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              title="Mapa da Fazenda"
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-51.1,-29.8,-50.9,-29.6&amp;layer=mapnik"
              style={{ border: 0, borderRadius: 6 }}
            />
          ) : (
            <Text style={styles.mapPlaceholder}>[ Mapa interativo disponível via web ]</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#e8f5e9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', textAlign: 'center', marginBottom: 20 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 10, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: '#c8e6c9', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginBottom: 12 },
  input: { height: 45, borderColor: '#a5d6a7', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 10, backgroundColor: '#f9fbe7' },
  labelCategoria: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  catContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  catBtn: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#81c784', borderRadius: 6, marginRight: 6, marginBottom: 6, backgroundColor: '#f1f8e9' },
  catBtnAtivo: { backgroundColor: '#2e7d32', borderColor: '#1b5e20' },
  catText: { fontSize: 12, color: '#333' },
  catTextAtivo: { color: '#fff', fontWeight: 'bold' },
  btnPrincipal: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  btnSecundario: { backgroundColor: '#4caf50', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnSecundarioText: { color: '#fff', fontWeight: 'bold' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  formBox: { backgroundColor: '#f1f8e9', padding: 12, borderRadius: 8, marginBottom: 12 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  stockItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  listText: { fontSize: 14, color: '#333', flex: 1 },
  actionRow: { flexDirection: 'row' },
  editText: { color: '#f57c00', fontWeight: 'bold', marginRight: 15 },
  deleteText: { color: '#d32f2f', fontWeight: 'bold' },
  mapContainer: { height: 220, backgroundColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' },
  mapPlaceholder: { color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: 90 }
});