import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Certifique-se de ter o 'react-router-dom' instalado para navegação

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/login', { username, password })
      .then((response) => {
        setRole(response.data.role); // Armazena o tipo de usuário (admin ou eleitor)
        setError(''); // Limpa a mensagem de erro
      })
      .catch(() => {
        setError('Credenciais inválidas');
      });
  };

  if (role === 'admin') {
    return <Navigate to="/admin" />; // Redireciona para a página do admin
  }

  if (role === 'eleitor') {
    return <Navigate to="/eleitor" />; // Redireciona para a página do eleitor
  }

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box">
        <h2 className="text-center mb-4">Bem-vindo à Votação Online</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Digite seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="text-center">
            <button type="submit" className="btn btn-primary btn-lg w-100">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
