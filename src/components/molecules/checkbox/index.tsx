import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@atoms/text';
import CheckBox from '@atoms/checkbox';
import styles from './styles';
import { text } from '@styles/color';

interface Props {
  size?: number;
  style?: any;
  textStyle?: any;
  isChecked?: boolean;
  onClick?: any;
  label?: string;
  highlightedText?: string;
  type?: string;
};

const checkbox: FC<Props> = ({
  size = 24,
  style = {},
  textStyle = {},
  isChecked = false,
  onClick = () => {},
  label = '',
  highlightedText = '',
  type = '',
}) => {
	return (
    <TouchableOpacity onPress={() => onClick()}>
      <View style={[styles.view, style]}>
        <CheckBox
          size={size}
          style={styles.checkbox}
          isChecked={isChecked}
          onClick={onClick}
          type={type}
        />
        <View style={styles.textContainer}>
          <Text style={[
            !isChecked && {color: text.default},
            textStyle,
          ]}>
            {label} {!!highlightedText && <Text style={styles.highlightedText}>{highlightedText}</Text>}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
	)
};

export default checkbox;