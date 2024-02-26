import { Book } from '../Book';
import styled from 'styled-components';
import { useState } from 'react';

const Container = styled.div``;

const Row = styled.div`
  margin: 10px 0;
`;

const Textarea = styled.textarea`
  width: 300px;
  height: 100px;
  resize: none;
  padding: 10px;
  font-size: 1rem;
  background: #e2d7cd;
  color: #675446;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #a99381;
    font-family: 'Sinapius';
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  background: #e2d7cd;
  color: #675446;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #a99381;
    font-family: 'Sinapius';
  }
`;

const Button = styled.button`
  padding: 10px;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #598063;
  border: 1px solid currentColor;
  transition: color 200ms ease-in;

  &:hover {
    color: #709b7d;
  }
`;

const Error = styled.div`
  margin: 30px 0;
  color: #99563b;
  width: 300px;
  line-height: 1.4;
`;

const Ordered = styled.div`
  margin: 30px 0;
  color: #598063;
  width: 300px;
  line-height: 1.4;
`;

const H1 = styled.h1`
  font-size: 1rem;
  width: 300px;
  line-height: 1.4;
  margin: 30px 0;

  em {
    font-style: normal;
    color: #598063;
  }
`;

export const OrderForm = ({ book, onOrdered, onClose }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [isOrdered, setIsOrdered] = useState(null);

  const onOrder = async () => {
    const response = await fetch('/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        address,
      }),
    });
    if (response.ok) {
      setIsOrdered(true);
      onOrdered();
    } else {
      setIsOrdered(false);
    }
    if (response.status === 500) {
      return setError('This is not possible without a name and address.');
    }
    if (response.status === 418) {
      return setError('Book appears to be sold out.');
    }
    if (!response.ok) {
      return setError('Sorry, an unexpected error occurred.');
    } else {
      setError(null);
    }
  };

  return (
    <Container>
      <div style={{ width: 150 }}>
        <Book book={book} />
      </div>
      {isOrdered ? (
        <>
          <Ordered>
            Thank you, the cormorants will deliver your book as soon as they are
            able.
          </Ordered>
          <Button onClick={onClose}>Back to books</Button>
        </>
      ) : (
        <>
          <H1>
            To acquire <em>{book.title}</em>, please provide your details below.
          </H1>
          <Row>
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Your name"
              type="text"
            />
          </Row>
          <Row>
            <Textarea
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder="Your address"
            />
          </Row>
          <Button onClick={() => onOrder()}>Acquire</Button>
          {error && <Error>{error}</Error>}
        </>
      )}
    </Container>
  );
};
