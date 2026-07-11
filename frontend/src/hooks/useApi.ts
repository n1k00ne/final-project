// frontend/src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(fetchFn: () => Promise<T>, dependencies: any[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const result = await fetchFn();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Ошибка загрузки данных',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFn, ...dependencies]);  // ← оставляем как есть, это предупреждение не критично

  return state;
}