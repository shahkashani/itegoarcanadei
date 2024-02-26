import styled, { css, keyframes } from 'styled-components';
import { BREAKPOINT_SMALL } from '../../../styles';

const fade = keyframes`
  0% { opacity: 0 };
`;

const BORDER_RADIUS = 10;
const OFFSET = 10;

const TriggerButton = styled.button`
  position: fixed;
  animation: ${fade} 5s ease-in-out;
  z-index: 10;
  background: #222;
  padding: 0;
  font-size: 0;
  line-height: 1;
  border: none;
  outline: none;
  cursor: pointer;

  ${({ $background }) =>
    $background &&
    css`
      background: ${$background};
    `};

  ${({ $position }) =>
    $position === 'topLeft' &&
    css`
      border-radius: 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0;
      top: ${OFFSET}px;
      left: 0;
    `};

  ${({ $position }) =>
    $position === 'topRight' &&
    css`
      border-radius: ${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px;
      top: ${OFFSET}px;
      right: 0;
    `};

  ${({ $position }) =>
    $position === 'bottomLeft' &&
    css`
      border-radius: 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0;
      bottom: ${OFFSET}px;
      left: 0;
    `};

  ${({ $position }) =>
    $position === 'bottomRight' &&
    css`
      border-radius: ${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px;
      bottom: ${OFFSET}px;
      right: 0;
    `};
`;

const Svg = styled.svg`
  ${({ $size }) =>
    $size &&
    css`
      width: ${$size}px;
    `};


    ${({ $sizeMobile }) =>
    $sizeMobile &&
    css`
      @media (max-width: ${BREAKPOINT_SMALL}px) {
        width: ${$sizeMobile}px;
      }
    `};
`;

const Icon = (props) => (
  <Svg viewBox="0 0 100 100" {...props}>
  <path d="M81 48.78a26.17 26.17 0 0 0-9.66-19.22 28.71 28.71 0 0 0-22.45-6.18 35.07 35.07 0 0 0-29.6 30.31A2.88 2.88 0 0 0 20 56a3 3 0 0 0 2.27 1 3 3 0 0 0 3-2.62 29.23 29.23 0 0 1 25.64-25.22 22.41 22.41 0 0 1 16.71 5A20.4 20.4 0 0 1 75 48.56a21.11 21.11 0 0 1-19.24 22.37 14.06 14.06 0 0 1-10.43-3.42A12.57 12.57 0 0 1 41 58.56 13 13 0 0 1 53.79 45a5.21 5.21 0 0 1 5.13 4.14A5 5 0 0 1 54 55h-.35A2.65 2.65 0 0 0 51 57.65v.7A2.65 2.65 0 0 0 53.65 61a11.27 11.27 0 0 0 11.2-9.16A11 11 0 0 0 54 39a19 19 0 0 0-19 19.09 18.36 18.36 0 0 0 6.33 13.82 20.42 20.42 0 0 0 15.89 4.9A27.12 27.12 0 0 0 81 48.78"/>
</Svg>
);

export const GodTrigger = ({
  fill = '#eee',
  size = 50,
  sizeMobile = 30,
  background = '#222',
  position = 'topLeft',
}) => {
  return (
    <TriggerButton $background={background} $position={position}>
      <Icon fill={fill} $size={size} $sizeMobile={sizeMobile} />
    </TriggerButton>
  );
};
