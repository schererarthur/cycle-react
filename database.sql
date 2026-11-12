CREATE DATABASE IF NOT EXISTS db_fazenda;
USE db_fazenda;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'funcionario'
);

CREATE TABLE IF NOT EXISTS rebanho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_animal VARCHAR(50),
    peso DECIMAL(10,2),
    raca VARCHAR(50),
    sexo VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_item VARCHAR(100),
    quantidade DECIMAL(10,2),
    categoria VARCHAR(50)
);