import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function App() {
  const [resultados, setResultados] = useState([]);
  const [votos, setVotos] = useState([]);

  useEffect(() => {
    fetchResultados();
    fetchVotos();
  }, []);

  const fetchResultados = () => {
    axios
      .get('http://localhost:3001/resultados')
      .then((response) => {
        const resultadosAtualizados = response.data.map((resultado) => ({
          ...resultado,
          total_bruto: Number(resultado.votos_servidores || 0) + Number(resultado.votos_pais || 0),
        }));

        resultadosAtualizados.sort((a, b) => b.votos_ponderados - a.votos_ponderados);

        if (resultadosAtualizados.length > 0) {
          resultadosAtualizados[0].eleito = 'Eleito';
        }

        setResultados(resultadosAtualizados);
      })
      .catch((error) => console.error('Erro ao buscar resultados:', error));
  };

  const fetchVotos = () => {
    axios
      .get('http://localhost:3001/votos')
      .then((response) => setVotos(response.data))
      .catch((error) => console.error('Erro ao buscar votos:', error));
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
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

    doc.autoTable({
      head: [['Candidato', 'Votos Servidores', 'Votos Pais', 'Total Bruto', 'Total Ponderado', 'Status']],
      body: tabelaDados,
      startY: 30,
    });

    const canvas = document.querySelector('canvas');
    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, doc.autoTable.previous.finalY + 10, 180, 80);
    }

    doc.save('resultado-eleicao.pdf');
  };

  const chartData = {
    labels: resultados.map((r) => r.candidato),
    datasets: [
      {
        label: 'Total Ponderado',
        data: resultados.map((r) => parseFloat(r.votos_ponderados)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {
        title: { display: true, text: 'Candidatos' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Total Ponderado' },
      },
    },
  };

  return (
    <div className="container">
      <header className="my-5">
        <h1 className="text-center">Democracia Digital na Escola</h1>

        <h2>Votos Registrados</h2>
        <ul className="list-group mb-4">
          {votos.map((voto) => (
            <li key={voto.id} className="list-group-item">
              {voto.candidato}: {voto.votos} votos ({voto.segmento})
            </li>
          ))}
        </ul>

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
                <td>{resultado.votos_ponderados}</td>
                <td>{resultado.eleito || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Resultado da Eleição</h2>
        <Bar data={chartData} options={chartOptions} />
        <button className="btn btn-success mt-3" onClick={exportarPDF}>
          Exportar Resultado da Eleição
        </button>
      </header>
    </div>
  );
}

export default App;