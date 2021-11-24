import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  &::before, &::after {
    content: "",
    clear: both,
    display: table,
  }
`;

const Row = ({ children, style }) => {
  return (
    <Container style={style}>
      {children}
    </Container>
  );
}

export default Row;