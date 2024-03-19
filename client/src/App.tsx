import React, { FC } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { DataDisplay } from './components/DataDisplay';
import { theme } from './theme';

const StyledApp = styled.section`
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
`;

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <StyledApp>
      <DataDisplay kind="temperature" />
      <DataDisplay kind="humidity" />
    </StyledApp>
  </ThemeProvider>
);

export default App;
