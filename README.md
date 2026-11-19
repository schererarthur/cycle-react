# 🌱 Cycle Sown - ERP de Gestão Agrícola

## 📋 Histórico de Alterações Recentes
- **Segurança & Criptografia (`server.js`):** Implementação de hash de senhas com `bcryptjs` e autenticação via tokens JWT (`jsonwebtoken`).
- **Tratamento de Erros de Banco (`server.js` & `App.js`):** Adicionado tratamento detalhado de requisições SQL, resolvendo divergências de tamanho de campo (como CPF `VARCHAR(20)`), tipagem de colunas e formatação correta de datas (`AAAA-MM-DD`).
- **Níveis de Acesso e Permissões (RBAC):** Seletor e tratamento para perfis **Master** (acesso total às telas administrativas, financeiras e operacionais) e **Funcionário** (permissão para registos de produção diária e consulta operacional).
- **Módulo de Produção Agrícola (`screens/Producao.js`):** Registo e histórico em tempo real de colheitas (Cultura, Hectares plantados, Sacas produzidas e Data da colheita) acessível tanto por perfis Master quanto por Funcionários[cite: 3].
- **Módulo de Rebanho (`screens/Dados.js`):** Formulário interativo para cadastro individual de animais (ID, Peso, Raça e Sexo), alteração, exclusão e listagem em tempo real com autenticação Bearer Token[cite: 3].
- **Controle de Estoque (`screens/Dados.js`):** Gestão de insumos agrícolas com criação, atualização e exclusão persistentes no banco de dados[cite: 3].
- **Mapeamento de Terra:** Estrutura e área de visualização integrada para delimitação geográfica de talhões e áreas produtivas.
- **Módulo Financeiro (`screens/Gastos.js`):** Registro de entradas e saídas com cálculo automático de saldo em tempo real e sinalização visual.

---

## 📄 Relatório de Definição do Sistema

- **Problema atual identificado:** Dificuldade na gestão centralizada de finanças, controle de rebanho, acompanhamento de estoque em tempo real e registo descentralizado de produções agrícolas em pequenas e médias propriedades rurais.
- **Contexto e público afetado:** Produtores rurais, administradores de fazendas e operadores que dependem de controle manual ou planilhas descentralizadas.
- **Justificativa:** Centralizar as operações agrícolas em uma aplicação leve baseada em React Native (Expo), Node.js e MySQL, facilitando a tomada de decisões no campo com autenticação segura[cite: 3].
- **Proposta de solução:** ERP web/mobile contendo módulos de controle financeiro, controle de rebanho detalhado, gestão de estoque de insumos, registo de produção agrícola e visualização de mapas.
- **Nome da aplicação:** Cycle Sown - Fazenda
- **Tipos de usuário:** 
  1. *Master (Administrador):* Acesso total aos cadastros, relatórios financeiros (`Gastos`), gestão operacional e exclusão/edição de rebanho/estoque.
  2. *Funcionário:* Acesso operacional focado no registo de colheitas (`Producao`) e consulta de dados no campo.
- **Telas da aplicação:** `TelaAutenticao` (Login/Criar Conta), `Producao` (Registo Agrícola), `Dados` (Rebanho, Estoque e Mapa), `Cadastro` e `Gastos`.
- **Navegação:** Menu lateral (*Drawer Navigator*) condicionado ao perfil do usuário após validação do token JWT.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React Native com Expo (Web & Mobile) e AsyncStorage para persistência de sessão.
- **Backend:** Node.js com Express e CORS.
- **Banco de Dados:** MySQL Workbench (`db_fazenda`) via driver `mysql2`.
- **Segurança:** `bcryptjs` (hash de senhas) e `jsonwebtoken` (tokens de sessão Bearer)[cite: 3].

---

## 🗄️ Estrutura do Banco de Dados (`MySQL`)

Para o correto funcionamento do sistema, execute o script SQL abaixo no **MySQL Workbench**:

```sql
CREATE DATABASE IF NOT EXISTS db_fazenda;
USE db_fazenda;

DROP TABLE IF EXISTS producao;
DROP TABLE IF EXISTS estoque;
DROP TABLE IF EXISTS rebanho;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'funcionario'
);

CREATE TABLE rebanho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_animal VARCHAR(50),
    peso DECIMAL(10,2),
    raca VARCHAR(50),
    sexo VARCHAR(20)
);

CREATE TABLE estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_item VARCHAR(100),
    quantidade DECIMAL(10,2),
    categoria VARCHAR(50)
);

CREATE TABLE producao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cultura VARCHAR(100) NOT NULL,
    hectares DECIMAL(10,2) NOT NULL,
    sacas INT NOT NULL,
    data_colheita DATE NOT NULL
);