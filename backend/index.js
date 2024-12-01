const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Para encriptar a senha

const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '28912882',
  database: 'votacao_online',
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

// Login do administrador ou eleitor
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    return res.status(200).json({ message: 'Login bem-sucedido', role: 'admin' });
  }

  if (username === 'eleitor' && password === 'eleitor123') {
    return res.status(200).json({ message: 'Login bem-sucedido', role: 'eleitor' });
  }

  const query = 'SELECT * FROM eleitores WHERE nome = ?';
  connection.query(query, [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const eleitor = results[0];

    // Verifica se já votou
    if (eleitor.votou === 1) {
      return res.status(400).json({ message: 'Eleitor já votou nesta eleição!' });
    }

    // Verifica a senha
    bcrypt.compare(password, eleitor.senha_hash, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      return res.status(200).json({
        message: 'Login bem-sucedido',
        role: 'eleitor',
        segmento: eleitor.segmento, // Retorna o segmento do eleitor após login
      });
    });
  });
});

// Obter todos os candidatos
app.get('/candidatos', (req, res) => {
  const query = 'SELECT * FROM candidatos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar candidatos:', err);
      res.status(500).send('Erro ao buscar candidatos');
    } else {
      res.json(results);
    }
  });
});

// Cadastrar um novo candidato
app.post('/candidatos', (req, res) => {
  const { candidato } = req.body;

  if (!candidato) {
    return res.status(400).send('O nome do candidato é obrigatório.');
  }

  const query = 'INSERT INTO candidatos (nome) VALUES (?)';
  connection.query(query, [candidato], (err, results) => {
    if (err) {
      console.error('Erro ao cadastrar candidato:', err);
      res.status(500).send('Erro ao cadastrar candidato.');
    } else {
      res.status(201).send('Candidato cadastrado com sucesso.');
    }
  });
});

// Obter todos os votos
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

// Registrar um voto
app.post('/votos', (req, res) => {
  const { candidato, votos, segmento } = req.body;

  if (!candidato || !votos || !segmento) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const query = 'INSERT INTO votos (candidato, votos, segmento) VALUES (?, ?, ?)';
  connection.query(query, [candidato, votos, segmento], (err) => {
    if (err) {
      console.error('Erro ao inserir voto:', err);
      res.status(500).send('Erro ao registrar voto');
    } else {
      res.status(201).send('Voto registrado');
    }
  });
});

// Calcular resultados ponderados
app.get('/resultados', (req, res) => {
  // Query para pegar os candidatos
  const queryCandidatos = 'SELECT nome AS candidato FROM candidatos';

  // Query para calcular os votos de cada candidato por segmento
  const queryVotos = `
    SELECT candidato,
      SUM(CASE WHEN segmento = 'servidores' THEN votos ELSE 0 END) AS votos_servidores,
      SUM(CASE WHEN segmento = 'pais' THEN votos ELSE 0 END) AS votos_pais
    FROM votos
    GROUP BY candidato
  `;

  // Query para calcular o total de votos de cada segmento
  const queryTotalVotosServidores = `
    SELECT SUM(votos) AS total_votos_servidores 
    FROM votos 
    WHERE segmento = 'servidores'
  `;
  
  const queryTotalVotosPais = `
    SELECT SUM(votos) AS total_votos_pais 
    FROM votos 
    WHERE segmento = 'pais'
  `;

  // Executando a query para pegar os candidatos
  connection.query(queryCandidatos, (err, candidatos) => {
    if (err) {
      console.error('Erro ao buscar candidatos:', err);
      res.status(500).send('Erro ao buscar candidatos');
      return;
    }

    // Executando a query para pegar os votos de cada candidato
    connection.query(queryVotos, (err, votos) => {
      if (err) {
        console.error('Erro ao buscar votos:', err);
        res.status(500).send('Erro ao buscar votos');
        return;
      }

      // Executando as queries para pegar o total de votos dos segmentos
      connection.query(queryTotalVotosServidores, (err, totalVotosServidores) => {
        if (err) {
          console.error('Erro ao calcular total de votos dos servidores:', err);
          res.status(500).send('Erro ao calcular total de votos dos servidores');
          return;
        }

        connection.query(queryTotalVotosPais, (err, totalVotosPais) => {
          if (err) {
            console.error('Erro ao calcular total de votos dos pais:', err);
            res.status(500).send('Erro ao calcular total de votos dos pais');
            return;
          }

          // Pega o total de votos de cada segmento
          const totalVotosServidoresValue = totalVotosServidores[0]?.total_votos_servidores || 0;
          const totalVotosPaisValue = totalVotosPais[0]?.total_votos_pais || 0;

          // Calcula os resultados de cada candidato
          const resultados = candidatos.map(candidato => {
            const votosCandidato = votos.find(v => v.candidato === candidato.candidato) || {
              votos_servidores: 0,
              votos_pais: 0,
            };

            const votos_servidores = votosCandidato.votos_servidores || 0;
            const votos_pais = votosCandidato.votos_pais || 0;

            // Calculando a ponderação
            const ponderacaoServidores = (votos_servidores / totalVotosServidoresValue) * 50;
            const ponderacaoPais = (votos_pais / totalVotosPaisValue) * 50;

            const votos_ponderados = ponderacaoServidores + ponderacaoPais;

            // Calculando o total bruto
            const total_bruto = votos_servidores + votos_pais;

            return {
              candidato: candidato.candidato,
              votos_servidores,
              votos_pais,
              total_bruto,
              votos_ponderados: votos_ponderados.toFixed(2), // Total ponderado com 2 casas decimais
            };
          });

          // Envia a resposta com os resultados
          res.json(resultados);
        });
      });
    });
  });
});


// Cadastrar novo eleitor
app.post('/eleitores', (req, res) => {
  const { nome, segmento, senha } = req.body;
  
  if (!nome || !segmento || !senha) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  // Gerar um hash da senha
  bcrypt.hash(senha, 10, (err, senha_hash) => {
    if (err) {
      console.error('Erro ao encriptar a senha:', err);
      return res.status(500).send('Erro ao cadastrar eleitor.');
    }

    const query = 'INSERT INTO eleitores (nome, segmento, senha_hash) VALUES (?, ?, ?)';
    connection.query(query, [nome, segmento, senha_hash], (err) => {
      if (err) {
        console.error('Erro ao cadastrar eleitor:', err);
        res.status(500).send('Erro ao cadastrar eleitor.');
      } else {
        res.status(201).send('Eleitor cadastrado com sucesso.');
      }
    });
  });
});

// Obter todos os eleitores
app.get('/eleitores', (req, res) => {
  connection.query('SELECT * FROM eleitores', (err, results) => {
    if (err) {
      console.error('Erro ao buscar eleitores:', err);
      res.status(500).send('Erro ao buscar eleitores');
    } else {
      res.json(results);
    }
  });
});

// Editar um candidato
app.put('/candidatos/:id', (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).send('O nome do candidato é obrigatório.');
  }

  const query = 'UPDATE candidatos SET nome = ? WHERE id = ?';
  connection.query(query, [nome, id], (err, results) => {
    if (err) {
      console.error('Erro ao editar candidato:', err);
      return res.status(500).send('Erro ao editar candidato.');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Candidato não encontrado.');
    }

    res.status(200).send('Candidato atualizado com sucesso.');
  });
});

// Excluir um candidato
app.delete('/candidatos/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM candidatos WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir candidato:', err);
      return res.status(500).send('Erro ao excluir candidato.');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Candidato não encontrado.');
    }

    res.status(200).send('Candidato excluído com sucesso.');
  });
});

// Editar um eleitor
app.put('/eleitores/:id', (req, res) => {
  const { id } = req.params;
  const { nome, segmento, senha } = req.body;

  if (!nome || !segmento || !senha) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const query = 'UPDATE eleitores SET nome = ?, segmento = ?, senha_hash = ? WHERE id = ?';
  bcrypt.hash(senha, 10, (err, senha_hash) => {
    if (err) {
      console.error('Erro ao encriptar a senha:', err);
      return res.status(500).send('Erro ao editar eleitor.');
    }

    connection.query(query, [nome, segmento, senha_hash, id], (err) => {
      if (err) {
        console.error('Erro ao editar eleitor:', err);
        return res.status(500).send('Erro ao editar eleitor.');
      } else {
        res.status(200).send('Eleitor atualizado com sucesso.');
      }
    });
  });
});

// Excluir um eleitor
app.delete('/eleitores/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM eleitores WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Erro ao excluir eleitor:', err);
      res.status(500).send('Erro ao excluir eleitor.');
    } else {
      res.status(200).send('Eleitor excluído com sucesso.');
    }
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
