import styled from 'styled-components';

export const Heading1 = styled.h1`
  font-family: 'Montserrat';
  font-size: 3rem;
  color: ${p => p.theme.foreground.primary};
`;

export const Heading2 = styled.h2`
  font-family: 'Montserrat';
  font-size: 1.5rem;
  color: ${p => p.theme.foreground.primary};
`;

export const Body = styled.p`
  font-family: 'Montserrat';
  color: ${p => p.theme.foreground.primary};
`;

export const SmallText = styled.span`
  font-family: 'Montserrat';
  font-size: 0.8rem;
  color: ${p => p.theme.foreground.primary};
`;

export const SmallTextStrong = styled.b`
  font-family: 'Montserrat';
  font-size: 0.8rem;
  color: ${p => p.theme.foreground.primary};
`;
