import { createRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const d =
  'M190.66 219.044c0 5.605 7.706 2.803 9.808-.7 4.203-7.707-2.803-16.815-10.51-18.916-13.31-3.503-25.921 7.706-28.023 21.018-2.803 18.916 12.61 35.03 30.826 37.131 24.52 2.803 44.838-17.515 46.24-41.335 2.101-29.425-22.42-53.946-51.144-55.347-35.03-2.102-63.054 27.323-64.455 61.652-1.401 39.934 32.227 72.862 71.46 73.563 45.54 1.401 81.97-37.132 83.372-81.97.7-50.443-42.036-91.778-91.778-92.479-56.048-.7-100.886 46.94-101.587 102.288-.7 60.951 51.844 110.694 112.096 110.694 66.556 0 119.802-56.749 119.802-122.605 0-71.46-61.653-129.61-133.114-128.91-77.065.701-138.718 66.557-138.017 142.922.7 82.67 71.46 148.527 152.73 147.826C285.94 372.475 356 296.811 354.599 210.637c-1.401-93.18-81.27-167.442-173.048-166.041C83.468 45.997 5.001 130.769 6.402 228.152 8.504 331.84 97.48 414.511 200.468 412.41c108.592-2.102 195.466-95.982 193.364-203.874C391.03 94.338 292.246 3.261 179.45 6.063c10.509 129.737 7.006 419.474 7.006 440.697 0 21.223-16.139 22.379-21.27 14.19-5.133-8.19 2.479-12.354 6.749-12.354 2.846 0 3.351 2.784 1.515 8.353';

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const AnimatedPath = styled.path`
  transition: stroke-dashoffset 2s ease-in-out;
  opacity: 0;
  animation: ${fade} 5s 3s forwards;
`;

const StyledSpiral = styled.svg`
  width: 80px;
  stroke-width: 8px;
`;

export const Spiral = ({
  ratio = 1,
  fill = '#eee',
  backFill = '#888',
  style,
}) => {
  const pathRef = createRef();
  const [length, setLength] = useState(-1);

  useEffect(() => {
    const { current } = pathRef;
    if (!current) {
      return;
    }
    setLength(Math.round(current.getTotalLength()));
  }, [pathRef.current]);

  const svgStyles = {
    d,
    strokeDasharray: length,
    fillRule: 'evenodd',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  return (
    <StyledSpiral
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 472"
      style={style}
      fill="none"
    >
      {length >= 0 && (
        <path strokeDashoffset={length} stroke={backFill} {...svgStyles}>
          <animate
            attributeName="stroke-dashoffset"
            values={`${length};0`}
            dur="3s"
            fill="freeze"
          />
        </path>
      )}
      <AnimatedPath
        ref={pathRef}
        stroke={fill}
        strokeDashoffset={length * (1 - ratio)}
        {...svgStyles}
      />
    </StyledSpiral>
  );
};
