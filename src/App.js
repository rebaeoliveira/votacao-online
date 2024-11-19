import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [votos, setVotos] = useState([]);
  const [candidato, setCandidato] = useState('');
  const [numeroVotos, setNumeroVotos] = useState('');
  const [idAtualizando, setIdAtualizando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [erro, setErro] = useState('');
  const [ordenarAsc, setOrdenarAsc] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/votos')
      .then(response => {
        setVotos(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os votos!', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (candidato === '' || numeroVotos === '') {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    axios.post('http://localhost:3001/votos', { candidato, votos: parseInt(numeroVotos), username, password })
      .then(() => {
        setCandidato('');
        setNumeroVotos('');
        setErro('');
        return axios.get('http://localhost:3001/votos');
      })
      .then(response => {
        setVotos(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao registrar o voto!', error);
        setErro('Houve um erro ao registrar o voto.');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/votos/${id}`, { data: { username, password } })
      .then(() => {
        return axios.get('http://localhost:3001/votos');
      })
      .then(response => {
        setVotos(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao excluir o voto!', error);
        setErro('Houve um erro ao excluir o voto.');
      });
  };

  const handleUpdate = (id) => {
    if (numeroVotos === '') {
      setErro('Por favor, insira um número de votos válido.');
      return;
    }
    axios.put(`http://localhost:3001/votos/${id}`, { votos: parseInt(numeroVotos), username, password })
      .then(() => {
        setNumeroVotos('');
        setIdAtualizando(null);
        setErro('');
        return axios.get('http://localhost:3001/votos');
      })
      .then(response => {
        setVotos(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao atualizar o voto!', error);
        setErro('Houve um erro ao atualizar o voto.');
      });
  };

  const filteredVotos = votos.filter(voto => 
    voto.candidato.toLowerCase().includes(filtro.toLowerCase())
  );

  const sortedVotos = [...filteredVotos].sort((a, b) => 
    ordenarAsc ? a.votos - b.votos : b.votos - a.votos
  );

  const toggleOrdenacao = () => {
    setOrdenarAsc(!ordenarAsc);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setErro('');
    } else {
      setErro('Credenciais inválidas.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Votação Online</h1>
        {erro && <p className="error">{erro}</p>}
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <input
              type="text"
              placeholder="Filtrar candidatos"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <button onClick={toggleOrdenacao}>
              Ordenar por votos {ordenarAsc ? 'descendente' : 'ascendente'}
            </button>
            <ul>
              {sortedVotos.map(voto => (
                <li key={voto.id}>
                  {voto.candidato}: {voto.votos} votos
                  <div>
                    <button onClick={() => handleDelete(voto.id)}>Excluir</button>
                    <input
                      type="number"
                      value={idAtualizando === voto.id ? numeroVotos : ''}
                      onChange={(e) => {
                        if (idAtualizando === voto.id) {
                          setNumeroVotos(e.target.value);
                        }
                      }}
                      onFocus={() => setIdAtualizando(voto.id)}
                    />
                    <button onClick={() => handleUpdate(voto.id)}>Atualizar Votos</button>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Candidato"
                value={candidato}
                onChange={(e) => setCandidato(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Número de votos"
                value={numeroVotos}
                onChange={(e) => setNumeroVotos(e.target.value)}
                required
              />
              <button type="submit">Registrar Voto</button>
            </form>
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        )}
      </header>
    </div>
  );
}

export default App;
