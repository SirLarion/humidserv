import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import Select, { OptionProps } from 'react-select';
import { TTimeframe } from '../../types';
import { TimeframeContext } from '../TimeframeProvider';

const OptionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${p => p.theme.background.secondary};
`;

const StyledControl = styled.div`
  width: 12rem;
  font-family: 'Montserrat';
  font-size: 1.5rem;
  background-color: ${p => p.theme.background.primary};
  border: none;
  padding: 0.5rem;
  border-radius: 0.3rem;
  text-align: center;
`;

const StyledOption = styled.div`
  font-family: 'Montserrat';
  font-size: 1rem;
  padding: 0.5rem;

  &:hover {
    background-color: ${p => p.theme.background.secondary};
  }
`;

const TIMEFRAME_OPTIONS: Array<{ value: TTimeframe; label: string }> = [
  { value: 'd', label: '24 hours' },
  { value: 'w', label: 'Week' },
  { value: 'm', label: 'Month' },
  { value: 'y', label: 'Year' },
];

const Option: FC<OptionProps<(typeof TIMEFRAME_OPTIONS)[number], false>> = ({
  innerProps,
  label,
}) => <StyledOption {...innerProps}>{label}</StyledOption>;

export const OptionSelector: FC = () => {
  const [timeframe, setTimeframe] = useContext(TimeframeContext);
  const getSelected = () =>
    TIMEFRAME_OPTIONS.find(({ value }) => value === timeframe) ||
    TIMEFRAME_OPTIONS[2];

  return (
    <OptionBar>
      <Select
        styles={{
          control: base => ({
            ...base,
            width: '10rem',
            fontFamily: 'Montserrat',
          }),
          menuList: base => ({
            ...base,
            padding: 0,
          }),
        }}
        defaultValue={getSelected()}
        options={TIMEFRAME_OPTIONS}
        isSearchable={false}
        menuPlacement="top"
        onChange={option => option && setTimeframe(option.value)}
        components={{
          Option,
        }}
      />
    </OptionBar>
  );
};
