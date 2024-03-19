import styled from 'styled-components';

export const Heading1 = styled.h1`
  font-family: 'Montserrat';
  font-size: 3rem;
  color: ${p => p.theme.foreground.primary};
`;

export const Body = styled.p`
  font-family: 'Montserrat';
  color: ${p => p.theme.foreground.primary};
`;
