import {useCallback, useState} from 'react';
import {useIsMountedRef} from './useIsMountedRef';

export function useLoadingFlag<T>(
  fetchData: () => Promise<T>,
  initialLoading = true,
): [() => Promise<T>, boolean] {
  const [loading, setLoading] = useState(initialLoading);

  const isMountedRef = useIsMountedRef();

  const onFetchData = useCallback(async () => {
    if (isMountedRef.current) setLoading(true);
    try {
      return await fetchData();
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [fetchData, isMountedRef]);

  return [onFetchData, loading];
}
