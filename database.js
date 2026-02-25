const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Se der erro de senha, tente deixar ''
    database: 'todolist_db'
});

connection.connect((err) => {
    if (err) {
        console.error('ERRO AO CONECTAR: ' + err.message);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

module.exports = connection;