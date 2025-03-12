import axios from 'axios';
import type { AxiosError } from 'axios';

/**
 * Função auxiliar para tratar erros de requisição da API.
 * 
 * Esta função analisa diferentes tipos de erros que podem ocorrer durante
 * requisições HTTP e lança exceções com mensagens amigáveis para o usuário.
 * 
 * @param {unknown} error - O erro capturado.
 * @returns {never} - Lança um erro com mensagem apropriada.
 * @throws {Error} Com mensagem específica para o tipo de erro encontrado.
 */
export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // O servidor respondeu com um status de erro
      const status = axiosError.response.status;
      
      if (status === 404) {
        throw new Error('Recurso não encontrado.');
      } 
      
      if (status >= 400 && status < 500) {
        throw new Error(`Erro na requisição: ${axiosError.message}`);
      } 
      
      if (status >= 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      }
    } 
    
    if (axiosError.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error('Sem resposta do servidor. Verifique sua conexão com a internet.');
    }
    
    // Erro na configuração da requisição
    throw new Error(`Erro ao configurar requisição: ${axiosError.message}`);
  }
  
  // Erro desconhecido
  throw new Error('Ocorreu um erro desconhecido.');
}; 