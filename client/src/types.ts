export const TIMEFRAMES = ['d', 'w', 'm', 'y'] as const;
export type TTimeframe = (typeof TIMEFRAMES)[number];
