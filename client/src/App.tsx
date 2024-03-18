import axios from 'axios';
import type { Component } from 'solid-js';
import { createResource } from 'solid-js';
import { styled } from 'solid-styled-components';

const StyledApp = styled.div`
  font-size: 6rem;
  font-weight: 800;
`;

const fetchText = async (): Promise<string> =>
  await axios.get('http://localhost:1952').then(res => res.data);

const App: Component = () => {
  const [text] = createResource(fetchText);

  return <StyledApp>{text.loading ? <div>Loading...</div> : text()}</StyledApp>;
};

export default App;
