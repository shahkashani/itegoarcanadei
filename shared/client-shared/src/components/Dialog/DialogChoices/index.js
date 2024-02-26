import { BREAKPOINT_MEDIUM, BREAKPOINT_SMALL } from '../../../styles/variables';
import styled, { keyframes } from 'styled-components';

import { getFilteredDialog } from '../../../utils/getFilteredDialog';

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Button = styled.button`
  margin: 0;
  display: inline-block;
  padding: 0;
  background: none;
  border: 0;
  color: #edead3;
  transition: color 250ms;
  cursor: pointer;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.9);
  text-align: left;
  line-height: 1.5;
  font-size: inherit;
  user-select: none;

  &:hover {
    color: #efdf74;
  }
`;

const Choices = styled.ul`
  padding: 0 15px;
  margin: 0;
`;

const Choice = styled.li`
  list-style-type: '* ';
  list-style-position: outside;
  font-size: 1.4rem;
  animation: ${fade} 1000ms ease-out both;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 1.2rem;
  }

  & + & {
    margin-top: 10px;

    @media (max-width: ${BREAKPOINT_MEDIUM}px) {
      margin-top: 5px;
    }
  }
`;

export const DialogChoices = ({ config, state, onSelect }) => {
  if (!config) {
    return null;
  }
  const list = getFilteredDialog(config, state);
  return (
    <Choices>
      {list.map((line, i) => (
        <Choice
          key={`{line-${line.text}}`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <Button onClick={() => onSelect?.(line)}>{line.text}</Button>
        </Choice>
      ))}
    </Choices>
  );
};
