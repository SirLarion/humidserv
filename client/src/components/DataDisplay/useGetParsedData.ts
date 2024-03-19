import { useMemo } from 'react';
import { head, take, reverse } from 'ramda';

import { useAxiosGet } from '../../hooks/useAxiosGet';
import { TDataKind } from '.';

type Data = Array<{
  value: number;
  timestamp: string;
}>;

export const useGetParsedData = (kind: TDataKind) => {
  const { data, loading, error } = useAxiosGet<Data>(`/data?kind=${kind}`);

  const parsedData = useMemo(
    () =>
      reverse(
        take(
          24,
          data?.map(dp => ({ x: new Date(dp.timestamp), y: dp.value })) || []
        )
      ),
    [data]
  );
  console.log(parsedData.length);

  const latest = useMemo(() => {
    const dp = head(data || []);
    return dp ? dp.value.toFixed(1) : '--';
  }, [data]);

  return {
    parsedData,
    latest,
    loading,
    error,
  };
};
