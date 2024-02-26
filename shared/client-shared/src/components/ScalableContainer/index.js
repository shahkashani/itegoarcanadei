import styled from 'styled-components';
import { useImageScale } from '../../hooks';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
`;

export const ScalableContainer = ({
  className,
  children,
  width,
  height,
  isCover = true,
  isCenter = false,
  padding = 0,
}) => {
  const { scale, left, top } = useImageScale({
    width,
    height,
    isCover,
    isCenter,
    padding,
  });

  if (!scale) {
    return null;
  }

  return (
    <Container
      className={className}
      style={{
        width,
        left,
        top,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </Container>
  );
};
