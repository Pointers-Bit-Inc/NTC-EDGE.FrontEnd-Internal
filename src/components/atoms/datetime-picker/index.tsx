import React, { useState } from 'react';
import styled from 'styled-components';

const DateTimeInput = styled.input.attrs(() => ({
  type: 'date'
}))`
  border-radius: 3px;
  border: 1px solid black;
  display: block;
  padding: ${(props) => props.padding};
  ::placeholder {
    color: palevioletred;
  }
`;

const DateTimePicker = ({ value = '' }: any) => {
  const [dateTime, setDateTime] = useState(value);

  return (
    <DateTimeInput
      value={dateTime}
      padding={'10px'}
      onChange={(e: any) => setDateTime(e.target.value)}
    />
  );
};

export default DateTimePicker;
