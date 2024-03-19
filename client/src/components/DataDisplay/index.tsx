import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { LineChart } from '../LineChart';
import { Heading1 } from '../Typography';
import { useGetParsedData } from './useGetParsedData';
import { useSpring, animated } from '@react-spring/web';

import { SPRING_CONFIG as config } from '../../config';

import { ReactComponent as Arrow } from '../../assets/arrow_button.svg';
import { ReactComponent as Thermometer } from '../../assets/thermometer.svg';
import { ReactComponent as Droplet } from '../../assets/droplet.svg';

export type TDataKind = 'temperature' | 'humidity';

interface IDataDisplayProps {
  kind: TDataKind;
}

const DisplayCard = styled(animated.div)`
  padding: 1.5rem;
  border-bottom: 4px solid ${p => p.theme.background.secondary};
`;

const Header = styled.button`
  all: unset;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    position: relative;
    top: 0.5rem;
    margin-right: 1rem;
    height: 3rem;
    width: 2.5rem;
  }
}`;

const Latest = styled.span`
  > :last-child {
    margin-left: 0.25rem;
    font-size: 2.5rem;
    opacity: 0.5;
  }
`;

const CaretButton = styled(animated.div)<{ $hovered: boolean }>`
  padding: 1.5rem;

  > svg {
    transition: opacity ease-in-out 150ms;
    opacity: ${p => (p.$hovered ? 0.9 : 0.3)};
    height: 2rem;
    width: 1rem;
  }
}`;

const CollapsibleChart = styled(animated(LineChart))`
  transform-origin: top;
`;

const Caret = animated(Arrow);

export const DataDisplay: FC<IDataDisplayProps> = ({ kind }) => {
  const { latest, parsedData, loading, error } = useGetParsedData(kind);

  const [chartOpen, setChartOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cardSpring = useSpring({
    maxHeight: chartOpen ? '24.5rem' : '8rem',
    config,
  });

  const caretSpring = useSpring({
    transform: chartOpen ? 'rotate(90deg)' : 'rotate(0deg)',
    config,
  });

  const chartSpring = useSpring({
    transform: chartOpen ? 'scaleY(1)' : 'scaleY(0)',
    opacity: chartOpen ? 1 : 0,
    config,
  });

  if (loading || error) {
    return null;
  }

  return (
    <DisplayCard style={cardSpring}>
      <Header
        onMouseEnter={() => setHovered(true)}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setTimeout(() => setHovered(false), 150)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setChartOpen(v => !v)}
      >
        <Heading1>
          {kind === 'temperature' ? <Thermometer /> : <Droplet />}
          <Latest>
            {latest}
            <span>{kind === 'temperature' ? '°C' : '%'}</span>
          </Latest>
        </Heading1>
        <CaretButton $hovered={hovered}>
          <Caret style={caretSpring} />
        </CaretButton>
      </Header>
      <CollapsibleChart style={chartSpring} kind={kind} data={parsedData} />
    </DisplayCard>
  );
};
