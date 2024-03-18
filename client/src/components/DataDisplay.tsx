import axios from 'axios';
import { Component, createResource, Show, createMemo } from 'solid-js';

import { SERVER_URL } from '../config';
import { LineChart } from './LineChart';
import { Heading1 } from './Typography';
import { head } from 'ramda';

type TDataKind = 'temperature' | 'humidity';

interface IDataDisplayProps {
  kind: TDataKind;
}

type Data = Array<{
  value: number;
  timestamp: string;
}>;

const fetchData = async (kind: TDataKind): Promise<Data> =>
  await axios.get(`${SERVER_URL}/data?kind=${kind}`).then(res => res.data);

export const DataDisplay: Component<IDataDisplayProps> = props => {
  const [data] = createResource(props.kind, fetchData);
  const parsedData = createMemo(
    () => data()?.map(dp => ({ x: new Date(dp.timestamp), y: dp.value })) || []
  );

  const latest = createMemo(() => {
    const dp = head(data() || []);
    return dp
      ? `${dp.value.toFixed(1)}${props.kind === 'temperature' ? '°C' : '%'}`
      : '--';
  });

  return (
    <>
      <Heading1>{latest()}</Heading1>
      <Show when={data.loading}>Loading...</Show>
      <Show when={data.error}>Error!</Show>
      <Show when={parsedData()}>
        <LineChart data={parsedData()} />
      </Show>
    </>
  );
};
