import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importando o plugin
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

function AdminDashboard() {
  const [candidatos, setCandidatos] = useState([]);
  const [eleitores, setEleitores] = useState([]);
  const [novoCandidato, setNovoCandidato] = useState('');
  const [novoEleitorNome, setNovoEleitorNome] = useState('');
  const [novoEleitorSegmento, setNovoEleitorSegmento] = useState('servidores');
  const [novoEleitorSenha, setNovoEleitorSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [votos, setVotos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [mostrarListaCandidatos, setMostrarListaCandidatos] = useState(false);
  const [mostrarCadastroCandidato, setMostrarCadastroCandidato] = useState(false);
  const [mostrarListaEleitores, setMostrarListaEleitores] = useState(false);
  const [mostrarCadastroEleitor, setMostrarCadastroEleitor] = useState(false);
  const [mostrarVotosRegistrados, setMostrarVotosRegistrados] = useState(false);
  const [totalVotosServidores, setTotalVotosServidores] = useState(0);
  const [totalVotosPais, setTotalVotosPais] = useState(0);
  const [totalVotosBrutos, setTotalVotosBrutos] = useState(0);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    fetchCandidatos();
    fetchEleitores();
    fetchVotos();
    fetchResultados();
  }, []);

  const fetchCandidatos = () => {
    axios
      .get('http://localhost:3001/candidatos')
      .then((response) => setCandidatos(response.data))
      .catch((error) => console.error('Erro ao buscar candidatos:', error));
  };

  const fetchEleitores = () => {
    axios
      .get('http://localhost:3001/eleitores')
      .then((response) => setEleitores(response.data))
      .catch((error) => console.error('Erro ao buscar eleitores:', error));
  };

  const fetchVotos = () => {
    axios
      .get('http://localhost:3001/votos')
      .then((response) => setVotos(response.data.reverse())) // Ordem do último para o primeiro
      .catch((error) => console.error('Erro ao buscar votos:', error));
  };

  const fetchResultados = () => {
    axios
      .get('http://localhost:3001/resultados')
      .then((response) => {
        const resultadosAtualizados = response.data.map((resultado) => ({
          ...resultado,
          votos_servidores: Number(resultado.votos_servidores) || 0, // Garantir que seja número
          votos_pais: Number(resultado.votos_pais) || 0,           // Garantir que seja número
          total_bruto: Number(resultado.votos_servidores || 0) + Number(resultado.votos_pais || 0),
        }));
  
        // Calcular totais dos segmentos
        const totalVotosServidores = resultadosAtualizados.reduce((acc, resultado) => acc + resultado.votos_servidores, 0);
        const totalVotosPais = resultadosAtualizados.reduce((acc, resultado) => acc + resultado.votos_pais, 0);
        const totalVotosBrutos = totalVotosServidores + totalVotosPais;
  
        // Adicionar totais ao estado
        setTotalVotosServidores(totalVotosServidores);
        setTotalVotosPais(totalVotosPais);
        setTotalVotosBrutos(totalVotosBrutos);
  
        // Ordenar os resultados e marcar o vencedor
        resultadosAtualizados.sort((a, b) => b.votos_ponderados - a.votos_ponderados);
        if (resultadosAtualizados.length > 0) {
          resultadosAtualizados[0].eleito = 'Eleito';
        }
  
        setResultados(resultadosAtualizados);
      })
      .catch((error) => console.error('Erro ao buscar resultados:', error));
  };

  const handleAddCandidato = (e) => {
    e.preventDefault();
    if (!novoCandidato) {
      setMensagem('O nome do candidato é obrigatório.');
      return;
    }

    axios
      .post('http://localhost:3001/candidatos', { candidato: novoCandidato })
      .then(() => {
        setNovoCandidato('');
        setMensagem('Candidato cadastrado com sucesso.');
        fetchCandidatos();
      })
      .catch((error) => {
        console.error('Erro ao cadastrar candidato:', error);
        setMensagem('Erro ao cadastrar candidato.');
      });
  };

  const handleAddEleitor = (e) => {
    e.preventDefault();
    if (!novoEleitorNome || !novoEleitorSegmento || !novoEleitorSenha) {
      setMensagem('Todos os campos são obrigatórios.');
      return;
    }

    axios
      .post('http://localhost:3001/eleitores', {
        nome: novoEleitorNome,
        segmento: novoEleitorSegmento,
        senha: novoEleitorSenha,
      })
      .then(() => {
        setNovoEleitorNome('');
        setNovoEleitorSegmento('servidores');
        setNovoEleitorSenha('');
        setMensagem('Eleitor cadastrado com sucesso.');
        fetchEleitores();
      })
      .catch((error) => {
        console.error('Erro ao cadastrar eleitor:', error);
        setMensagem('Erro ao cadastrar eleitor.');
      });
  };

  const handleEditCandidato = (id, nome) => {
    const novoNome = prompt('Digite o novo nome do candidato', nome);
    if (novoNome) {
      axios
        .put(`http://localhost:3001/candidatos/${id}`, { nome: novoNome })
        .then(() => {
          setMensagem('Candidato atualizado com sucesso.');
          fetchCandidatos();
        })
        .catch((error) => {
          console.error('Erro ao editar candidato:', error);
          setMensagem('Erro ao editar candidato.');
        });
    }
  };

  const handleDeleteCandidato = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este candidato?');
    if (confirmDelete) {
      axios
        .delete(`http://localhost:3001/candidatos/${id}`)
        .then(() => {
          setMensagem('Candidato excluído com sucesso.');
          fetchCandidatos();
        })
        .catch((error) => {
          console.error('Erro ao excluir candidato:', error);
          setMensagem('Erro ao excluir candidato.');
        });
    }
  };

  const handleEditEleitor = (id, nome, segmento) => {
    const novoNome = prompt('Digite o novo nome do eleitor', nome);
    const novoSegmento = prompt('Digite o novo segmento do eleitor', segmento);
    const novaSenha = prompt('Digite a nova senha do eleitor', '');
  
    if (novoNome && novoSegmento && novaSenha) {
      axios
        .put(`http://localhost:3001/eleitores/${id}`, { nome: novoNome, segmento: novoSegmento, senha: novaSenha })
        .then(() => {
          setMensagem('Eleitor atualizado com sucesso.');
          fetchEleitores();  // Recarregar a lista de eleitores
        })
        .catch((error) => {
          console.error('Erro ao editar eleitor:', error);
          setMensagem('Erro ao editar eleitor.');
        });
    }
  };
  
  const handleDeleteEleitor = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este eleitor?');
    if (confirmDelete) {
      axios
        .delete(`http://localhost:3001/eleitores/${id}`)
        .then(() => {
          setMensagem('Eleitor excluído com sucesso.');
          fetchEleitores();  // Recarregar a lista de eleitores
        })
        .catch((error) => {
          console.error('Erro ao excluir eleitor:', error);
          setMensagem('Erro ao excluir eleitor.');
        });
    }
  };
  

  const exportarPDF = () => {
    const doc = new jsPDF();
  
    // Definir a fonte como Arial, normal, e tamanho 18 para o título
    doc.setFont('Arial', 'normal');
    doc.setFontSize(18);
    doc.text('Relatório de Resultado da Eleição', 14, 20);
  
    const tabelaDados = resultados.map((r) => [
      r.candidato,
      r.votos_servidores,
      r.votos_pais,
      r.total_bruto,
      r.votos_ponderados,
      r.eleito || '',
    ]);
  
    // Inserir a tabela no PDF
    doc.autoTable({
      head: [['Candidato', 'Votos Servidores', 'Votos Pais', 'Total Bruto', 'Total Ponderado', 'Status']],
      body: tabelaDados,
      startY: 30,
    });
  
    // Adicionar o gráfico ao PDF
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, doc.autoTable.previous.finalY + 10, 180, 80);
    }
  
    // Resumo da Eleição
    doc.setFontSize(14); // Fonte normal para o resumo
    const yOffset = doc.autoTable.previous.finalY + 110; // Ajustar Y para pular uma linha
  
    // Resumo com a porcentagem
    if (resultados.length > 0) {
      const vencedor = resultados[0].candidato;
      const votosPonderados = resultados[0].votos_ponderados.replace('.', ',') + '%';
  
      // Texto do resumo
      const resumo = [
        `O(A) ${vencedor} foi eleito(a) com ${votosPonderados} dos votos ponderados.`,
        'Esta eleição contou com a participação de eleitores dos segmentos servidores e pais, com os votos sendo ponderados igualmente entre os segmentos, sendo 50% para a urna do segmento servidores e 50% para a urna do segmento pais.'
      ];
  
      // Para evitar que o texto ultrapasse o limite da página, usamos splitTextToSize
      const textoResumido = doc.splitTextToSize(resumo.join("\n"), 180);
  
      // Centralizar o título "Resultado da Eleição"
      doc.setFont('Arial', 'bold'); // Fonte em negrito para o título
      doc.text('RESULTADO DA ELEIÇÃO', doc.internal.pageSize.getWidth() / 2, yOffset - 10, { align: 'center' });
  
      // Adicionar as linhas do resumo no PDF
      doc.setFont('Arial', 'normal'); // Voltar para fonte normal para o resumo
      doc.text(textoResumido, 14, yOffset);
    }
  
    // Salvar o PDF
    doc.save('resultado-eleicao.pdf');
  };
  
  
  

  const chartData = {
    labels: resultados.map((r) => r.candidato),
    datasets: [
      {
        label: 'Votos Servidores',
        data: resultados.map((r) => r.votos_servidores),
        backgroundColor: 'rgba(0, 51, 32, 0.6)', // Cor das barras para servidores
      },
      {
        label: 'Votos Pais',
        data: resultados.map((r) => r.votos_pais),
        backgroundColor: 'rgba(255, 159, 64, 0.6)', // Cor das barras para pais
      },
      {
        label: 'Total Ponderado',
      data: resultados.map((r) => parseFloat(r.votos_ponderados)),
      backgroundColor: 'rgba(153, 51, 255, 0.9)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      },
    ],
  };

  // Configuração do gráfico com as labels sobre as barras incluindo o total ponderado
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: true, // Exibir labels
        color: 'black',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, context) => {
          // Mostrar o total ponderado como porcentagem dentro da barra
          if (context.dataset.label === 'Total Ponderado') {
            return `${value.toFixed(2)}%`; // Exibe como porcentagem
          }
          return `${value}`; // Para outras barras, exibe o valor normal
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Candidatos',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Votos',
        },
      },
    },
  };



  // Paginação - Calcular votos exibidos na página atual
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const votosPaginaAtual = votos.slice(indexPrimeiroItem, indexUltimoItem);

  const mudarPagina = (novaPagina) => setPaginaAtual(novaPagina);

  // Calculando o candidato vencedor para exibir o resumo
const candidatoVencedor = resultados[0]; // O primeiro item será o vencedor com a maior porcentagem

// Texto de resumo
const resumoEleicao = candidatoVencedor ? 
  `Resultado da Eleição: O candidato ${candidatoVencedor.candidato} foi eleito com ${candidatoVencedor.votos_ponderados}% dos votos ponderados.` : 
  "Resultado da Eleição: Nenhum vencedor foi encontrado.";

  return (
    <div className="container">
      <h1 className="my-4">Painel do Administrador</h1>

      {/* Botões principais */}
      <div className="mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setMostrarCadastroCandidato(!mostrarCadastroCandidato)}
        >
          Cadastrar Novo Candidato
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={() => setMostrarListaCandidatos(!mostrarListaCandidatos)}
        >
          Mostrar Lista de Candidatos
        </button>
        <button
          className="btn btn-success me-2"
          onClick={() => setMostrarVotosRegistrados(!mostrarVotosRegistrados)}
        >
          Mostrar Votos Registrados
        </button>
        <button
          className="btn btn-warning me-2"
          onClick={() => setMostrarListaEleitores(!mostrarListaEleitores)}
        >
          Mostrar Lista de Eleitores
        </button>
        <button
          className="btn btn-info me-2"
          onClick={() => setMostrarCadastroEleitor(!mostrarCadastroEleitor)}
        >
          Cadastrar Novo Eleitor
        </button>
      </div>

      {/* Cadastro de Candidatos */}
      {mostrarCadastroCandidato && (
        <section className="mb-5">
          <h2>Cadastrar Novo Candidato</h2>
          <form onSubmit={handleAddCandidato}>
            <div className="mb-3">
              <label className="form-label">Nome do Candidato</label>
              <input
                type="text"
                className="form-control"
                value={novoCandidato}
                onChange={(e) => setNovoCandidato(e.target.value)}
                placeholder="Digite o nome do candidato"
              />
            </div>
            <button type="submit" className="btn btn-primary">Cadastrar</button>
          </form>
          {mensagem && <p className="alert alert-info mt-3">{mensagem}</p>}
        </section>
      )}

      {/* Lista de Candidatos */}
      {mostrarListaCandidatos && (
        <section className="mb-5">
          <h2>Lista de Candidatos</h2>
          <ul className="list-group">
            {candidatos.map((candidato) => (
              <li key={candidato.id} className="list-group-item">
                {candidato.nome}
                <button
                  className="btn btn-warning btn-sm ms-2"
                  onClick={() => handleEditCandidato(candidato.id, candidato.nome)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteCandidato(candidato.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cadastro de Eleitores */}
      {mostrarCadastroEleitor && (
        <section className="mb-5">
          <h2>Cadastrar Novo Eleitor</h2>
          <form onSubmit={handleAddEleitor}>
            <div className="mb-3">
              <label className="form-label">Nome do Eleitor</label>
              <input
                type="text"
                className="form-control"
                value={novoEleitorNome}
                onChange={(e) => setNovoEleitorNome(e.target.value)}
                placeholder="Digite o nome do eleitor"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Segmento</label>
              <select
                className="form-control"
                value={novoEleitorSegmento}
                onChange={(e) => setNovoEleitorSegmento(e.target.value)}
              >
                <option value="servidores">Servidores</option>
                <option value="pais">Pais</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={novoEleitorSenha}
                onChange={(e) => setNovoEleitorSenha(e.target.value)}
                placeholder="Digite a senha"
              />
            </div>
            <button type="submit" className="btn btn-primary">Cadastrar</button>
          </form>
          {mensagem && <p className="alert alert-info mt-3">{mensagem}</p>}
        </section>
      )}

      {/* Lista de Eleitores */}
      {mostrarListaEleitores && (
        <section className="mb-5">
          <h2>Lista de Eleitores</h2>
          <ul className="list-group">
            {eleitores.map((eleitor) => (
              <li key={eleitor.id} className="list-group-item">
                {eleitor.nome} ({eleitor.segmento}) - Status: {eleitor.votou === 1 ? 'Votou' : 'Não Votou'}
                <button
                  className="btn btn-warning btn-sm ms-2"
                  onClick={() => handleEditEleitor(eleitor.id, eleitor.nome, eleitor.segmento)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteEleitor(eleitor.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Votos Registrados com Paginação */}
      {mostrarVotosRegistrados && (
        <section className="mb-5">
          <h2>Votos Registrados</h2>
          <ul className="list-group mb-4">
            {votosPaginaAtual.map((voto) => (
              <li key={voto.id} className="list-group-item">
                {voto.candidato}: {voto.votos} votos ({voto.segmento})
              </li>
            ))}
          </ul>

          {/* Paginação */}
          <nav>
            <ul className="pagination">
              {[...Array(Math.ceil(votos.length / itensPorPagina)).keys()].map((num) => (
                <li
                  key={num + 1}
                  className={`page-item ${paginaAtual === num + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => mudarPagina(num + 1)}>
                    {num + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      )}

      {/* Resultados da Eleição */}
      <section>
        <h2>Resultado da Eleição</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Candidato</th>
              <th>Votos Servidores</th>
              <th>Votos Pais</th>
              <th>Total Bruto</th>
              <th>Total Ponderado</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado) => (
              <tr key={resultado.candidato}>
                <td>{resultado.candidato}</td>
                <td>{resultado.votos_servidores}</td>
                <td>{resultado.votos_pais}</td>
                <td>{resultado.total_bruto}</td>
                <td>{resultado.votos_ponderados.replace('.', ',')}%</td>
                <td>{resultado.eleito || ''}</td>
              </tr>
            ))}
            {/* Linha com os totais dos segmentos e total bruto */}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{totalVotosServidores}</strong></td>
              <td><strong>{totalVotosPais}</strong></td>
              <td><strong>{totalVotosBrutos}</strong></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <h2>Gráfico de Resultado da Eleição</h2>
        <Bar data={chartData} options={chartOptions} />
        <button className="btn btn-success mt-3" onClick={exportarPDF}>
          Exportar Resultado da Eleição
        </button>
      </section>
    </div>
  );
}



export default AdminDashboard;
