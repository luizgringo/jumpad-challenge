import { useState, useEffect } from 'react';

/**
 * Interface que define o estado do hook useFetch.
 * 
 * @template T - O tipo de dados que será retornado pela função de busca.
 * @property {T | null} data - Os dados retornados pela função de busca, ou null se ainda não houver dados.
 * @property {boolean} loading - Indica se a busca está em andamento.
 * @property {Error | null} error - O erro ocorrido durante a busca, ou null se não houver erro.
 */
interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(fetchFunction: () => Promise<T>) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        const data = await fetchFunction();
        
        if (isMounted) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Ocorreu um erro desconhecido'),
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFunction]);

  return state;
} 