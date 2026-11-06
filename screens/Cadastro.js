import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const realizarCadastro = async (tipo_usuario) => {
    if (!nome || !email || !cpf || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos do formulário.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, cpf, senha, tipo_usuario }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", `${tipo_usuario === 'funcionario' ? 'Funcionário' : 'Master'} cadastrado com sucesso!`);
        setNome(''); setEmail(''); setCpf(''); setSenha('');
      } else {
        Alert.alert("Erro", data.erro || "Não foi possível realizar o cadastro.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão com o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardBox}>
        <Text style={styles.title}>Cadastro - Cycle Sown</Text>
        
        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#888" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" value={senha} onChangeText={setSenha} secureTextEntry />
        
        <TouchableOpacity style={styles.btnMaster} onPress={() => realizarCadastro('master')}>
          <Text style={styles.buttonText}>Cadastrar Master</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnFuncionario} onPress={() => realizarCadastro('funcionario')}>
          <Text style={styles.buttonText}>Cadastrar Funcionário</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 20 },
  cardBox: { width: '100%', maxWidth: 450, backgroundColor: '#ffffff', padding: 25, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5, borderWidth: 1, borderColor: '#c8e6c9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', height: 48, borderColor: '#a5d6a7', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#f9fbe7', color: '#333' },
  btnMaster: { width: '100%', height: 48, backgroundColor: '#2e7d32', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 12 },
  btnFuncionario: { width: '100%', height: 48, backgroundColor: '#388e3c', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});