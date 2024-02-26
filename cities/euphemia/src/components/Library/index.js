import { Book } from '../Book';
import styled from 'styled-components';

const Button = styled.button`
  padding: 10px;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #598063;
  border: 1px solid currentColor;
  transition: color 200ms ease-in;

  &:not(:disabled):hover {
    color: #709b7d;
  }

  &:disabled {
    color: #99563b;
    cursor: default;
  }
`;

const Link = styled.a`
  padding: 10px;
  display: inline-block;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #598063;
  border: 1px solid currentColor;
  transition: color 200ms ease-in;
  text-decoration: none;

  &:hover {
    color: #709b7d;
  }
`;

const LibraryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const Library = ({ books }) => {
  return (
    <LibraryContainer>
      {books.map((book) => {
        const { url, id } = book;
        const stockInfo = url ? (
          <Link href={url} target="_blank">
            Available
          </Link>
        ) : (
          <Button disabled>Not available</Button>
        );
        return (
          <Book book={book} key={id}>
            {stockInfo}
          </Book>
        );
      })}
    </LibraryContainer>
  );
};
