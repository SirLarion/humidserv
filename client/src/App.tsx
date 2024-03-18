import type { Component } from 'solid-js';
import { styled } from 'solid-styled-components';
import { DataDisplay } from './components/DataDisplay';

const StyledApp = styled.section`
  width: 100vw;
  padding: 1rem;
`;

const App: Component = () => (
  <StyledApp>
    <DataDisplay kind="temperature" />
    <DataDisplay kind="humidity" />
  </StyledApp>
);

export default App;
