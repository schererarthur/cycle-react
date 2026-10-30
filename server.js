const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexão com o banco de dados MySQL Workbench
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin', // Substiua pela sua senha do MySQL
    database: 'db_fazenda'
});

// Testar conexão
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar no MySQL:", err.message);
        return;
    }
    console.log("Conectado ao MySQL com sucesso!");
});

// Rota para cadastrar usuários
app.post('/cadastro', (req, res) => {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    const query = "INSERT INTO usuarios (nome, email, cpf, senha) VALUES (?, ?, ?, ?)";
    
    db.query(query, [nome, email, cpf, senha], (err, result) => {
        if (err) {
            console.error("Erro ao inserir no banco:", err.message);
            return res.status(500).json({ erro: "Erro ao salvar no banco de dados." });
        }
        
        console.log("Usuário cadastrado com ID:", result.insertId);
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    });
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor API rodando na porta 3000");
});