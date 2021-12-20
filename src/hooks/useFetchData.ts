import {useEffect, useState} from 'react';
import {useIsMountedRef} from './useIsMountedRef';

export function useFetchData<T>(
  fetchData: () => Promise<T>,
  emptyData: T,
): [T, boolean, null | any] {
  const isMountedRef = useIsMountedRef();

  const [data, setData] = useState<T>(emptyData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      if (isMountedRef.current) setLoading(true);
      try {
        const loadedData = await fetchData();
        if (isMountedRef.current) setData(loadedData);
      } catch (e) {
        if (isMountedRef.current) setError(e);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    }
    getData();
  }, [fetchData, isMountedRef]);

  return [data, loading, error];
}
