import React, { FC, useMemo } from 'react';
import { LineSvgProps, ResponsiveLine } from '@nivo/line';
import { min, max, clamp } from 'ramda';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';

import { TDataKind } from './DataDisplay';
import { theme } from '../theme';

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

const getMinMaxY = (data: ILineChartProps['data'], deviation: number) => {
  const minY = data.reduce((acc, curr) => min(acc, curr.y), Infinity);
  const maxY = data.reduce((acc, curr) => max(acc, curr.y), 0);

  return [clamp(0, minY, minY - deviation), clamp(maxY, 100, maxY + deviation)];
};

export const LineChart: FC<ILineChartProps> = ({
  kind,
  data,
  ...restProps
}) => {
  const { deviation, color } = KIND_SPECIFIC_OPTIONS[kind];
  const id = useMemo(() => uuid(), []);
  const [minY, maxY] = getMinMaxY(data, deviation);

  return (
    <Wrapper {...restProps}>
      <ResponsiveLine
        data={[{ id, data }]}
        {...DEFAULT_OPTIONS}
        colors={[color]}
        yScale={{ type: 'linear', min: minY, max: maxY }}
        xFormat={x => `${format(x as Date, 'd.M. HH:')}00`}
      />
    </Wrapper>
  );
};
