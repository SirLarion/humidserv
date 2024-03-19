import React, { FC } from 'react';
import { LineSvgProps, PointTooltipProps, ResponsiveLine } from '@nivo/line';
import { min, max, clamp } from 'ramda';
import { format } from 'date-fns';
import styled from 'styled-components';

import { theme } from '../theme';
import { TDataKind } from './DataDisplay';
import { Heading2, SmallText } from './Typography';

interface ILineChartProps {
  kind: TDataKind;
  data: Array<{ x: Date; y: number }>;
}

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
  curve: 'monotoneX',
  xScale: { type: 'time' },
  xFormat: x => `${format(x as Date, 'd.M. HH:')}00`,
  axisBottom: {
    format: x => `${format(x as Date, 'EEE')}\n${format(x as Date, 'H')}:00`,
    tickSize: 0,
    tickValues: 'every 6 hours',
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
  width: 7rem;
  padding: 1rem;
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

const CustomTooltip: FC<PointTooltipProps> = ({ point }) => {
  return (
    <TooltipBase>
      <SmallText>{point.data.xFormatted}</SmallText>
      <TooltipValue>
        {Number(point.data.y).toFixed(1)}
        <span>{point.serieId === 'temperature' ? '°C' : '%'}</span>
      </TooltipValue>
    </TooltipBase>
  );
};

export const LineChart: FC<ILineChartProps> = ({
  kind,
  data,
  ...restProps
}) => {
  const { deviation, color } = KIND_SPECIFIC_OPTIONS[kind];
  const [minY, maxY] = getMinMaxY(data, deviation);

  return (
    <Wrapper {...restProps}>
      <ResponsiveLine
        data={[{ id: kind, data }]}
        {...DEFAULT_OPTIONS}
        tooltip={CustomTooltip}
        colors={[color]}
        yScale={{ type: 'linear', min: minY, max: maxY }}
      />
    </Wrapper>
  );
};
