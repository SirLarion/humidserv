import axios from 'axios';
import { head } from 'ramda';
import type { Component } from 'solid-js';
import { createResource, createMemo } from 'solid-js';
import { styled } from 'solid-styled-components';
import { SERVER_URL } from './config';

const StyledApp = styled.div`
  font-size: 6rem;
  font-weight: 800;
  padding: 2rem;
`;

type Data = Array<{
  value: number;
  timestamp: string;
}>;

const fetchTemperature = async (): Promise<Data> =>
  await axios.get(`${SERVER_URL}/data?kind=Temperature`).then(res => res.data);

const fetchHumidity = async (): Promise<Data> =>
  await axios.get(`${SERVER_URL}/data?kind=Humidity`).then(res => res.data);

const App: Component = () => {
  const [dataTemp] = createResource(fetchTemperature);
  const [dataHum] = createResource(fetchHumidity);

  const latestTemp = createMemo(() => {
    const data = dataTemp() || [];
    return head(data)?.value.toFixed(1) || '--';
  });

  const latestHum = createMemo(() => {
    const data = dataHum() || [];
    return head(data)?.value.toFixed(1) || '--';
  });

  return (
    <StyledApp>
      {dataTemp.loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>{`${latestTemp()}°C`}</p>
          <p>{`${latestHum()}%`}</p>
        </div>
      )}
    </StyledApp>
  );
};

export default App;
