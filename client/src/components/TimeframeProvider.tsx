import React, { FC, ReactNode, createContext, useState } from 'react';

import { TIMEFRAMES, TTimeframe } from '../types';

type TTimeframeState = [TTimeframe, (t: TTimeframe) => void];

const getLocalStorageTimeframe = (): TTimeframe => {
  const t = window.localStorage.getItem('timeframe') as TTimeframe;
  if (TIMEFRAMES.includes(t)) {
    return t;
  }
  return 'm';
};

const setLocalStorageTimeframe = (t: TTimeframe) =>
  window.localStorage.setItem('timeframe', t);

export const TimeframeContext = createContext<TTimeframeState>(
  null as unknown as TTimeframeState
);

export const TimeframeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timeframe, setTimeframe] = useState<TTimeframe>(
    getLocalStorageTimeframe()
  );

  const handleChangeTimeframe = (t: TTimeframe) => {
    setLocalStorageTimeframe(t);
    setTimeframe(t);
  };

  return (
    <TimeframeContext.Provider value={[timeframe, handleChangeTimeframe]}>
      {children}
    </TimeframeContext.Provider>
  );
};
