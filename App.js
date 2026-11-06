import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

import Cadastro from './screens/Cadastro';
import Dados from './screens/Dados';
import Gastos from './screens/Gastos';

const Drawer = createDrawerNavigator();

function TelaAutenticao({ onLoginSucesso }) {
  const [isCadastrando, setIsCadastrando] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const lidarComLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await response.json();

      if (response.ok) {
        onLoginSucesso(data.token, data.tipo_usuario);
        Alert.alert("Sucesso", `Bem-vindo, ${data.nome}! (${data.tipo_usuario.toUpperCase()})`);
      } else {
        Alert.alert("Erro", data.erro || "Credenciais inválidas.");
      }
    } catch (e) {
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor na porta 3000.");
    }
  };

  const lidarComCadastro = async (tipo_usuario) => {
    if (!nome || !email || !cpf || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos do formulário.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, cpf, senha, tipo_usuario })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso!", "Usuário cadastrado com sucesso. Faça o login agora.");
        setIsCadastrando(false);
        setNome(''); setEmail(''); setCpf(''); setSenha('');
      } else {
        Alert.alert("Erro no Servidor", data.erro || "Falha ao realizar o cadastro.");
      }
    } catch (e) {
      Alert.alert("Erro de Conexão", "Falha de comunicação com o servidor backend.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.loginContainer}>
      <View style={styles.loginCard}>
        <Text style={styles.loginTitle}>
          {isCadastrando ? "Cycle Sown - Criar Conta" : "Cycle Sown - Entrar"}
        </Text>

        {isCadastrando && (
          <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        )}

        <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        
        {isCadastrando && (
          <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#888" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
        )}

        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" value={senha} onChangeText={setSenha} secureTextEntry />

        {!isCadastrando ? (
          <>
            <TouchableOpacity style={styles.buttonLogin} onPress={lidarComLogin}>
              <Text style={styles.buttonLoginText}>Autenticar com JWT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonTrocar} onPress={() => setIsCadastrando(true)}>
              <Text style={styles.buttonTrocarText}>Não tem conta? Cadastre-se aqui</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.buttonLogin} onPress={() => lidarComCadastro('master')}>
              <Text style={styles.buttonLoginText}>Cadastrar como Master</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buttonLogin, { backgroundColor: '#388e3c' }]} onPress={() => lidarComCadastro('funcionario')}>
              <Text style={styles.buttonLoginText}>Cadastrar como Funcionário</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonTrocar} onPress={() => setIsCadastrando(false)}>
              <Text style={styles.buttonTrocarText}>Já tem conta? Voltar para o Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  if (!token) {
    return <TelaAutenticao onLoginSucesso={(tk, tipo) => { setToken(tk); setTipoUsuario(tipo); }} />;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator 
        screenOptions={{
          drawerActiveTintColor: '#1b5e20',
          drawerInactiveTintColor: '#555',
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Drawer.Screen 
          name="Dados (Rebanho/Estoque)" 
          component={Dados} 
          initialParams={{ token }} 
        />
        {tipoUsuario === 'master' && (
          <>
            <Drawer.Screen 
              name="Cadastro" 
              component={Cadastro} 
              initialParams={{ token }} 
            />
            <Drawer.Screen 
              name="Gastos" 
              component={Gastos} 
              initialParams={{ token }} 
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 20 },
  loginCard: { width: '100%', maxWidth: 400, backgroundColor: '#ffffff', padding: 25, borderRadius: 12, borderWidth: 1, borderColor: '#a5d6a7', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5 },
  loginTitle: { fontSize: 22, fontWeight: 'bold', color: '#1b5e20', marginBottom: 20, textAlign: 'center' },
  input: { height: 48, borderColor: '#a5d6a7', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 12, backgroundColor: '#f9fbe7' },
  buttonLogin: { height: 48, backgroundColor: '#2e7d32', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 5 },
  buttonLoginText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  buttonTrocar: { marginTop: 15, alignItems: 'center' },
  buttonTrocarText: { color: '#2e7d32', fontWeight: 'bold', fontSize: 14 }
});