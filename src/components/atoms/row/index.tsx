import React, { ReactNode, FC } from 'react';

interface Props {
  children: ReactNode;
  style?: any;
}

const Row: FC<Props> = ({ children, style }) => {
  return <Container style={style}>{children}</Container>;
};

export default Row;
