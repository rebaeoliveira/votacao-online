import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import EleitorDashboard from './EleitorDashboard';
import LoginScreen from './LoginScreen'; // Verifique se está no caminho correto
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', { username, password })
      .then((response) => {
        setRole(response.data.role);
        setError('');
      })
      .catch(() => {
        setError('Credenciais inválidas');
      });
  };

  if (role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (role === 'eleitor') {
    return <Navigate to="/eleitor" />;
  }

  return (
    <LoginScreen />
  );
}

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/eleitor" element={<EleitorDashboard />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
