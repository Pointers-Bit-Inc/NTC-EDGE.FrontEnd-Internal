import React, { FC } from 'react';
import { View } from 'react-native';
import Text from '@atoms/text';
import CheckBox from '@atoms/checkbox';
import styles from './styles';

interface Props {
  style?: any;
  isChecked?: boolean;
  onClick?: any;
  label?: string;
};

const checkbox: FC<Props> = ({
  style = {},
  isChecked = false,
  onClick = () => {},
  label = '',
}) => {
	return (
		<View style={[styles.view, style]}>
      <CheckBox
        style={styles.checkbox}
        isChecked={isChecked}
        onClick={onClick}
      />
      <Text style={styles.text}>
        {label}
      </Text>
    </View>
	)
};

export default checkbox;