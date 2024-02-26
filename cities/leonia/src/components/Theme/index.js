import { createGlobalStyle, css } from 'styled-components';

export const Theme = createGlobalStyle`
:root {
  ${({ isColor }) =>
    isColor
      ? css`
          --accent: #f5d554;
          --darker-accent: #29241d;
          --dark-accent: #52412d;
          --light-accent: #6c6148;
          --lighter-accent: #b39458;
          --glow: rgba(210, 190, 160, 0.25);
          --lightest-accent: rgba(210, 190, 160, 1);
          --lightest-accent-50: rgba(210, 190, 160, 0.5);
          --lightest-accent-70: rgba(210, 190, 160, 0.7);
          --lightest-accent-90: rgba(210, 190, 160, 0.9);
        `
      : css`
          --accent: #efd56d;
          --darker-accent: #29241d;
          --dark-accent: #362f27;
          --light-accent: #5d5142;
          --lighter-accent: #9c8b78;
          --glow: rgba(56, 38, 38, 0.5);
          --lightest-accent: rgba(209, 202, 196, 1);
          --lightest-accent-50: rgba(209, 202, 196, 0.5);
          --lightest-accent-70: rgba(209, 202, 196, 0.7);
          --lightest-accent-90: rgba(209, 202, 196, 0.9);
        `}
}
`;
