import { useContext, useMemo } from 'react';
import { head, reverse, splitEvery, take } from 'ramda';

import { useAxiosGet } from '../../hooks/useAxiosGet';
import { TDataKind } from '.';
import { TimeframeContext } from '../TimeframeProvider';
import { TTimeframe } from '../../types';

type Data = Array<{
  value: number;
  timestamp: string;
}>;

const BREAKPOINTS = [
  { point: 4380, split: 360, t: 'y' },
  { point: 2140, split: 180, t: 'y' },
  { point: 1080, split: 90, t: 'm' },
  { point: 720, split: 45, t: 'm' },
  { point: 360, split: 24, t: 'm' },
  { point: 168, split: 12, t: 'w' },
  { point: 66, split: 6, t: 'w' },
  { point: 0, split: 1, t: 'd' },
] as const;

export type TBreakpoint = (typeof BREAKPOINTS)[number]['point'];

const getBreakpoint = (
  data: Data,
  timeframe: TTimeframe
): (typeof BREAKPOINTS)[number] => {
  const len = data.length;
  let i = 0;
  const breakpoints = BREAKPOINTS.filter(({ t }) => t === timeframe);
  console.log(breakpoints);

  while (i < breakpoints.length) {
    const bp = breakpoints[i];
    if (len > bp.point) {
      return bp;
    }
    i++;
  }

  // Should never end up here
  return BREAKPOINTS[4];
};

export const useGetParsedData = (kind: TDataKind) => {
  const [timeframe] = useContext(TimeframeContext);
  const { data = [], loading, error } = useAxiosGet<Data>(`/data?kind=${kind}`);

  const { point, split } = useMemo(
    () => getBreakpoint(data, timeframe),
    [data, timeframe]
  );

  const parsedData = useMemo(
    () =>
      reverse(
        take(24)(
          splitEvery(split)(data)
            .map(a => head(a) as Data[number])
            .map(dp => ({
              x: new Date(dp.timestamp),
              y: dp.value,
            }))
        )
      ),
    [data, split]
  );

  const latest = useMemo(() => {
    const dp = head(data);
    return dp ? dp.value.toFixed(1) : '--';
  }, [data]);

  return {
    parsedData,
    breakpoint: point,
    latest,
    loading,
    error,
  };
};
