import React, { FC, useRef } from 'react';
import { LineSvgProps, PointTooltipProps, ResponsiveLine } from '@nivo/line';
import { min, max, clamp, mergeDeepLeft } from 'ramda';
import { format, addHours } from 'date-fns';
import styled from 'styled-components';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import { theme } from '../theme';
import { TDataKind } from './DataDisplay';
import { Heading2, SmallText } from './Typography';
import { TBreakpoint } from './DataDisplay/useGetParsedData';

interface ILineChartProps {
  kind: TDataKind;
  data: Array<{ x: Date; y: number }>;
  breakpoint: TBreakpoint;
}

const TICK_VALUES_BY_BREAKPOINT: Record<TBreakpoint, string> = {
  4380: 'every 2 months',
  2140: 'every month',
  1080: 'every 2 weeks',
  720: 'every week',
  360: 'every 4 days',
  168: 'every 2 days',
  66: 'every day',
  0: 'every 8 hours',
};

const DEFAULT_OPTIONS: Omit<LineSvgProps, 'data'> = {
  enableGridX: false,
  isInteractive: true,
  useMesh: true,
  margin: {
    top: 8,
    right: 40,
    bottom: 60,
    left: 40,
  },
  pointSize: 8,
  crosshairType: 'left',
  curve: 'monotoneX',
  xScale: { type: 'time' },
  // Convert UTC to UTC+2 :D
  xFormat: x => `${format(addHours(x as Date, 2), 'd.M. HH:')}00`,
  axisBottom: {
    format: x =>
      `${format(addHours(x as Date, 2), 'EEE')}\n${format(x as Date, 'H')}:00`,
    tickSize: 0,
  },
  axisLeft: {
    tickValues: 6,
  },
  gridYValues: 6,
};

const KIND_SPECIFIC_OPTIONS = {
  temperature: {
    deviation: 1,
    color: theme.accent.red,
  },
  humidity: {
    deviation: 5,
    color: theme.accent.blue,
  },
};

const Wrapper = styled.div`
  height: 16rem;
`;

const TooltipBase = styled.div`
  width: 6.5rem;
  padding: 0.3rem 1rem;
  border-radius: 0.4rem;
  background-color: ${p => p.theme.background.primary};
  border: 1px solid ${p => p.theme.background.secondary};
`;

const TooltipValue = styled(Heading2)`
  > :last-child {
    margin-left: 0.15rem;
    font-size: 1rem;
    opacity: 0.5;
  }
`;

const getMinMaxY = (data: ILineChartProps['data'], deviation: number) => {
  const minY = data.reduce((acc, curr) => min(acc, curr.y), Infinity);
  const maxY = data.reduce((acc, curr) => max(acc, curr.y), 0);

  return [clamp(0, minY, minY - deviation), clamp(maxY, 100, maxY + deviation)];
};

const CustomTooltip: FC<PointTooltipProps> = ({ point }) => (
  <TooltipBase>
    <SmallText>{point.data.xFormatted}</SmallText>
    <TooltipValue>
      {Number(point.data.y).toFixed(1)}
      <span>{point.serieId === 'temperature' ? '°C' : '%'}</span>
    </TooltipValue>
  </TooltipBase>
);

export const LineChart: FC<ILineChartProps> = ({
  kind,
  data,
  breakpoint,
  ...restProps
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ResponsiveLine | null>(null);
  const { deviation, color } = KIND_SPECIFIC_OPTIONS[kind];
  const [minY, maxY] = getMinMaxY(data, deviation);

  const overrides: Omit<LineSvgProps, 'data'> = {
    tooltip: CustomTooltip,
    colors: [color],
    yScale: { type: 'linear', min: minY, max: maxY },
    axisBottom: {
      tickValues: TICK_VALUES_BY_BREAKPOINT[breakpoint],
    },
  };

  const options = mergeDeepLeft(DEFAULT_OPTIONS, overrides) as Omit<
    LineSvgProps,
    'data'
  >;

  return (
    <Wrapper
      ref={ref}
      onTouchStart={() => ref?.current && disableBodyScroll(ref.current)}
      onTouchEnd={() => ref?.current && enableBodyScroll(ref.current)}
      {...restProps}
    >
      <ResponsiveLine ref={chartRef} data={[{ id: kind, data }]} {...options} />
    </Wrapper>
  );
};
