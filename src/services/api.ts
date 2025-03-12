import axios from 'axios';
import type { Post, Comment, User } from '../types';
import { handleApiError } from './errorHandler';

/**
 * Instância do Axios configurada com a URL base da API JSONPlaceholder.
 * Esta instância é usada para todas as requisições HTTP.
 */
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

/**
 * Busca todos os posts do blog.
 * 
 * @returns {Promise<Post[]>} Uma promessa que resolve para um array de posts.
 * @throws {Error} Se ocorrer um erro na requisição.
 */
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>('/posts');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca um post específico pelo seu ID.
 * 
 * @param {number} id - O ID do post a ser buscado.
 * @returns {Promise<Post>} Uma promessa que resolve para um único post.
 * @throws {Error} Se ocorrer um erro na requisição ou se o post não for encontrado.
 */
export const getPost = async (id: number): Promise<Post> => {
  try {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca todos os comentários associados a um post específico.
 * 
 * @param {number} postId - O ID do post para o qual buscar comentários.
 * @returns {Promise<Comment[]>} Uma promessa que resolve para um array de comentários.
 * @throws {Error} Se ocorrer um erro na requisição.
 */
export const getPostComments = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca todos os usuários do blog.
 * 
 * @returns {Promise<User[]>} Uma promessa que resolve para um array de usuários.
 * @throws {Error} Se ocorrer um erro na requisição.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/users');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca um usuário específico pelo seu ID.
 * 
 * @param {number} userId - O ID do usuário a ser buscado.
 * @returns {Promise<User>} Uma promessa que resolve para um único usuário.
 * @throws {Error} Se ocorrer um erro na requisição ou se o usuário não for encontrado.
 */
export const getUser = async (userId: number): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default api; 