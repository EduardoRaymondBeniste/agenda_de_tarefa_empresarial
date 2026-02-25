const express = require('express');
const db = require('./database'); 
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- ROTA HOME (Lista Pessoal) ---
app.get('/', (req, res) => {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const day = today.toLocaleDateString('pt-BR', options);

    db.query('SELECT * FROM items WHERE list = ?', ['Pessoal'], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao buscar tarefas.");
        }
        res.render('list', { kindOfDay: day, newListItems: results });
    });
});

// --- ROTA TRABALHO ---
app.get('/trabalho', (req, res) => {
    db.query('SELECT * FROM items WHERE list = ?', ['Trabalho'], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao buscar tarefas de trabalho.");
        }
        res.render('list', { 
            kindOfDay: "Lista de Trabalho", 
            newListItems: results 
        });
    });
});

// --- ROTA POST (Salva no Banco) ---
app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list; 

    // Lógica para definir a categoria
    let category = (listName === "Lista de Trabalho") ? "Trabalho" : "Pessoal";

    const sql = 'INSERT INTO items (name, list) VALUES (?, ?)';
    db.query(sql, [itemName, category], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao salvar tarefa.");
        }
        
        if (category === "Trabalho") {
            res.redirect('/trabalho');
        } else {
            res.redirect('/');
        }
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

        if (listName === "Lista de Trabalho") {
            res.redirect('/trabalho');
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});