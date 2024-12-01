import axios from 'axios';

// Função para criar as urnas (Servidores e Pais)
export const createUrnas = async (eleicao_id) => {
  try {
    const urnas = [
      { nome: 'Servidores', eleicao_id },
      { nome: 'Pais', eleicao_id }
    ];

    // Criar as urnas
    for (const urna of urnas) {
      await axios.post('http://localhost:3001/urnas', urna);
    }
    return 'Urnas criadas com sucesso!';
  } catch (error) {
    console.error('Erro ao criar urnas:', error);
    throw new Error('Erro ao criar urnas.');
  }
};

// Função para cadastrar eleitores nas urnas
export const cadastrarEleitorNaUrna = async (eleitor_id, urna_id) => {
  try {
    // Atribuindo eleitor à urna
    await axios.post('http://localhost:3001/eleitores/atribuicao', { eleitor_id, urna_id });
    return 'Eleitor cadastrado na urna com sucesso!';
  } catch (error) {
    console.error('Erro ao cadastrar eleitor na urna:', error);
    throw new Error('Erro ao cadastrar eleitor na urna.');
  }
};
