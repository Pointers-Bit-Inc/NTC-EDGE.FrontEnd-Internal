import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { RNValue as RFValue } from "@utils/formatting";

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const PDF: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <AntDesign
      name='pdffile1'
      size={RFValue(size)}
      color={color}
      {...otherProps}
    />
  );
};

export default PDF;