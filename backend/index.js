// backend/index.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const authenticate = require('./authMiddleware');

const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '28912882',
  database: 'votacao_online'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados');
  }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/votos', (req, res) => {
  connection.query('SELECT * FROM votos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar votos:', err);
      res.status(500).send('Erro ao buscar votos');
    } else {
      res.json(results);
    }
  });
});

app.post('/votos', 
  authenticate,
  body('candidato').notEmpty().withMessage('O campo candidato é obrigatório'),
  body('votos').isInt({ min: 0 }).withMessage('O campo votos deve ser um número inteiro não negativo'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { candidato, votos } = req.body;
    connection.query('INSERT INTO votos (candidato, votos) VALUES (?, ?)', [candidato, votos], (err, results) => {
      if (err) {
        console.error('Erro ao inserir voto:', err);
        res.status(500).send('Erro ao inserir voto');
      } else {
        res.status(201).send('Voto registrado');
      }
    });
  }
);

app.delete('/votos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM votos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir voto:', err);
      res.status(500).send('Erro ao excluir voto');
    } else {
      res.send('Voto excluído');
    }
  });
});

app.put('/votos/:id', 
  authenticate,
  body('votos').isInt({ min: 0 }).withMessage('O campo votos deve ser um número inteiro não negativo'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { votos } = req.body;
    connection.query('UPDATE votos SET votos = ? WHERE id = ?', [votos, id], (err, results) => {
      if (err) {
        console.error('Erro ao atualizar voto:', err);
        res.status(500).send('Erro ao atualizar voto');
      } else {
        res.send('Voto atualizado');
      }
    });
  }
);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
