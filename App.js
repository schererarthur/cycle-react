import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

import Cadastro from './screens/Cadastro';
import Dados from './screens/Dados';
import Gastos from './screens/Gastos';

const Drawer = createDrawerNavigator();

function CustomHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Cycle Sown - Fazenda</Text>
    </View>
  );
}

function CustomFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2026 Cycle Sown - Todos os direitos reservados</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <CustomHeader />
        <Drawer.Navigator 
          screenOptions={{
            drawerActiveTintColor: '#2e7d32',
            drawerInactiveTintColor: '#666',
            headerShown: true
          }}
        >
          <Drawer.Screen name="Cadastro" component={Cadastro} />
          <Drawer.Screen name="Dados" component={Dados} />
          <Drawer.Screen name="Gastos" component={Gastos} />
        </Drawer.Navigator>
        <CustomFooter />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: { 
    height: 60, 
    backgroundColor: '#2e7d32', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 15 
  },
  headerText: { 
    color: '#ffffff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  footer: { 
    height: 40, 
    backgroundColor: '#81c784', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  footerText: { 
    color: '#ffffff', 
    fontSize: 12 
  }
});