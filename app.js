const express = require('express');
const db = require('./database'); 
const path = require('path'); // Adicionado para gerenciar caminhos
const app = express();

// Configurações
app.set('view engine', 'ejs');
// Ajuste importante: garante que o Express ache a pasta 'views' no servidor
app.set('views', path.join(__dirname, 'views')); 

app.use(express.urlencoded({ extended: true }));
// Ajuste importante: garante que o Express ache a pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// --- ROTA HOME (Lista Pessoal) ---
app.get('/', (req, res) => {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const day = today.toLocaleDateString('pt-BR', options);

    db.query('SELECT * FROM items WHERE list = ?', ['Pessoal'], (err, results) => {
        if (err) {
            console.error("Erro no DB:", err);
            // Em vez de travar, renderiza a página com lista vazia se o banco falhar
            return res.render('list', { kindOfDay: day, newListItems: [] });
        }
        res.render('list', { kindOfDay: day, newListItems: results || [] });
    });
});

// --- ROTA TRABALHO ---
app.get('/trabalho', (req, res) => {
    db.query('SELECT * FROM items WHERE list = ?', ['Trabalho'], (err, results) => {
        if (err) {
            console.error(err);
            return res.render('list', { kindOfDay: "Lista de Trabalho", newListItems: [] });
        }
        res.render('list', { 
            kindOfDay: "Lista de Trabalho", 
            newListItems: results || []
        });
    });
});

// --- ROTA POST (Salva no Banco) ---
app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list; 
    let category = (listName === "Lista de Trabalho") ? "Trabalho" : "Pessoal";

    const sql = 'INSERT INTO items (name, list) VALUES (?, ?)';
    db.query(sql, [itemName, category], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao salvar tarefa.");
        }
        res.redirect(category === "Trabalho" ? '/trabalho' : '/');
    });
});

// --- ROTA DELETE ---
app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName; 

    const sql = 'DELETE FROM items WHERE id = ?';
    db.query(sql, [checkedItemId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao excluir tarefa.");
        }
        res.redirect(listName === "Lista de Trabalho" ? '/trabalho' : '/');
    });
});

// AJUSTE DE PORTA: O Back4app define a porta automaticamente.
// Se process.env.PORT não existir, ele usa a 3000 (local).
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});