import React, { FC } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { DataDisplay } from './components/DataDisplay';
import { theme } from './theme';
import { OptionSelector } from './components/OptionSelector';
import { TimeframeProvider } from './components/TimeframeProvider';

const StyledApp = styled.section`
  position: relative;
  height: 120vh;
  width: 100vw;
  max-width: 100vw;
  background-color: ${p => p.theme.background.primary};
  overflow-x: hidden;
`;

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <TimeframeProvider>
      <StyledApp>
        <DataDisplay kind="temperature" />
        <DataDisplay kind="humidity" />
        <OptionSelector />
      </StyledApp>
    </TimeframeProvider>
  </ThemeProvider>
);

export default App;
