import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EleitorDashboard.css';

const EleitorDashboard = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [votou, setVotou] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // Buscar candidatos
    axios
      .get('http://localhost:3001/candidatos')
      .then((response) => {
        const candidatosOrdenados = response.data.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena os candidatos por nome
        setCandidatos(candidatosOrdenados);
      })
      .catch((error) => console.error('Erro ao buscar candidatos:', error));
  }, []);

  const handleVote = () => {
    if (!candidatoSelecionado) {
      setMensagem('Por favor, selecione um candidato.');
      return;
    }

    axios
      .post('http://localhost:3001/votos', {
        candidato: candidatoSelecionado.nome,
        votos: 1,
        segmento: 'servidores', // O segmento é atribuído ao eleitor
        eleicao_id: 1, // Exemplo, defina conforme a lógica
        urna_id: 1, // Também defina conforme a lógica
      })
      .then(() => {
        setMensagem('Voto registrado com sucesso!');
        setVotou(true);

        // Redireciona para a tela de login após 5 segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
      })
      .catch((error) => {
        console.error('Erro ao registrar voto:', error);
        setMensagem('Erro ao registrar voto.');
      });
  };

  if (votou) {
    return (
      <div className="container text-center mt-5">
        <h1>Voto registrado com sucesso!</h1>
        <p>Você será redirecionado para a tela de login em breve...</p>
      </div>
    );
  }

  return (
    <div className="eleitor-container">
      <div className="eleitor-box">
        <h2 className="system-name">Democracia Digital na Escola</h2>

        <h2 className="election-name">ELEIÇÃO: Diretor Escolar 2024</h2>

        <h2>Selecione um Candidato</h2>
        {mensagem && <p className="alert alert-info">{mensagem}</p>}

        <div className="candidate-box">
          {candidatos.map((candidato) => (
            <div
              key={candidato.id}
              className={`candidate-card ${candidatoSelecionado?.id === candidato.id ? 'selected' : ''}`} // Classe adicionada para o candidato selecionado
            >
              <img
                src={candidato.foto_url || 'default-image.jpg'} // Foto carregada ou uma imagem padrão
                alt={candidato.nome}
                className="candidate-image"
              />
              <p>{candidato.nome}</p>
              <button
                className={`btn btn-primary ${candidatoSelecionado?.id === candidato.id ? 'btn-selected' : ''}`}
                onClick={() => setCandidatoSelecionado(candidato)} // Seleciona o candidato ao clicar
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>

        <button
          className="vote-btn"
          onClick={handleVote}
          disabled={!candidatoSelecionado}
        >
          Votar
        </button>
      </div>
    </div>
  );
};

export default EleitorDashboard;
