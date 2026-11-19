require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET;

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'db_fazenda'
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar no MySQL:", err.message);
        return;
    }
    console.log("Conectado ao MySQL com sucesso!");
});

// ==========================================
// CADASTRO COM HASH DE SENHA E LOG DE ERRO
// ==========================================
app.post('/cadastro', async (req, res) => {
    const { nome, email, cpf, senha } = req.body;
    const tipo_usuario = 'funcionario'; // Impede autocadastro com perfil Master

    if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const query = "INSERT INTO usuarios (nome, email, cpf, senha, tipo_usuario) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [nome, email, cpf, senhaHash, tipo_usuario], (err, result) => {
            if (err) {
                console.error("Erro no MySQL:", err.sqlMessage || err.message);
                return res.status(500).json({ erro: "Erro MySQL: " + (err.sqlMessage || err.message) });
            }
            res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
        });
    } catch (error) {
        console.error("Erro no hash:", error.message);
        res.status(500).json({ erro: "Erro interno: " + error.message });
    }
});

// ==========================================
// LOGIN COM GERAÇÃO DE JWT
// ==========================================
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Informe e-mail e senha." });
    }

    const query = "SELECT * FROM usuarios WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ erro: "E-mail ou senha inválidos." });
        }

        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: "E-mail ou senha inválidos." });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, tipo_usuario: usuario.tipo_usuario },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        res.json({
            mensagem: "Login realizado com sucesso!",
            token: token,
            tipo_usuario: usuario.tipo_usuario,
            nome: usuario.nome
        });
    });
});

// ==========================================
// MIDDLEWARES DE AUTENTICAÇÃO E PERFIS
// ==========================================
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ erro: "Token não fornecido." });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: "Token mal formatado." });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ erro: "Token inválido ou expirado." });
        req.usuario = decoded;
        next();
    });
}

function verificarMaster(req, res, next) {
    if (req.usuario && req.usuario.tipo_usuario === 'master') {
        next();
    } else {
        return res.status(403).json({ erro: "Acesso negado. Apenas administradores Master podem realizar esta operação." });
    }
}

// ==========================================
// ROTAS PROTEGIDAS DO REBANHO
// ==========================================
app.get('/animais', verificarToken, (req, res) => {
    db.query("SELECT * FROM rebanho", (err, results) => {
        if (err) return res.status(500).json({ erro: "Erro ao buscar rebanho." });
        res.json(results);
    });
});

app.post('/animais', verificarToken, verificarMaster, (req, res) => {
    const { id_animal, peso, raca, sexo } = req.body;
    db.query("INSERT INTO rebanho (id_animal, peso, raca, sexo) VALUES (?, ?, ?, ?)", [id_animal, peso, raca, sexo], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao cadastrar animal." });
        res.status(201).json({ mensagem: "Animal cadastrado!" });
    });
});

app.put('/animais/:id', verificarToken, verificarMaster, (req, res) => {
    const { id } = req.params;
    const { id_animal, peso, raca, sexo } = req.body;
    db.query("UPDATE rebanho SET id_animal = ?, peso = ?, raca = ?, sexo = ? WHERE id = ?", [id_animal, peso, raca, sexo, id], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao atualizar animal." });
        res.json({ mensagem: "Animal atualizado!" });
    });
});

app.delete('/animais/:id', verificarToken, verificarMaster, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM rebanho WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao excluir animal." });
        res.json({ mensagem: "Animal excluído!" });
    });
});

// ==========================================
// ROTAS PROTEGIDAS DO ESTOQUE
// ==========================================
app.get('/estoque', verificarToken, (req, res) => {
    db.query("SELECT * FROM estoque", (err, results) => {
        if (err) return res.status(500).json({ erro: "Erro ao buscar estoque." });
        res.json(results);
    });
});

app.post('/estoque', verificarToken, verificarMaster, (req, res) => {
    const { nome_item, quantidade, categoria } = req.body;
    db.query("INSERT INTO estoque (nome_item, quantidade, categoria) VALUES (?, ?, ?)", [nome_item, quantidade, categoria], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao adicionar item." });
        res.status(201).json({ mensagem: "Item adicionado!" });
    });
});

app.put('/estoque/:id', verificarToken, verificarMaster, (req, res) => {
    const { id } = req.params;
    const { nome_item, quantidade, categoria } = req.body;
    db.query("UPDATE estoque SET nome_item = ?, quantidade = ?, categoria = ? WHERE id = ?", [nome_item, quantidade, categoria, id], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao atualizar item." });
        res.json({ mensagem: "Item atualizado!" });
    });
});

app.delete('/estoque/:id', verificarToken, verificarMaster, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM estoque WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao excluir item." });
        return res.json({ mensagem: "Item excluído com sucesso!" });
    });
});

// ==========================================
// ROTAS DE PRODUÇÃO AGRÍCOLA (Atualizadas com Log de Erro)
// ==========================================
app.get('/producao', verificarToken, (req, res) => {
    db.query("SELECT * FROM producao ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ erro: "Erro ao buscar produção." });
        res.json(results);
    });
});

app.post('/producao', verificarToken, (req, res) => {
    const { cultura, hectares, sacas, data_colheita } = req.body;
    
    if (!cultura || !hectares || !sacas || !data_colheita) {
        return res.status(400).json({ erro: "Preencha todos os campos de produção." });
    }

    db.query(
        "INSERT INTO producao (cultura, hectares, sacas, data_colheita) VALUES (?, ?, ?, ?)", 
        [cultura, hectares, sacas, data_colheita], 
        (err) => {
            if (err) {
                console.error("ERRO MYSQL DETALHADO EM /producao:", err); // <-- Imprime o erro exato no terminal
                return res.status(500).json({ erro: "Erro ao registar produção: " + err.message });
            }
            res.status(201).json({ mensagem: "Produção registada com sucesso!" });
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor API rodando na porta ${PORT} com autenticação JWT e Hash!`);
});