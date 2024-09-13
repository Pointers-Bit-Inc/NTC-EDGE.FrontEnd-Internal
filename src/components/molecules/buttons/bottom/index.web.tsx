import React, { FC } from 'react';
import { View } from 'react-native';
import Text from '@atoms/text';
import Button from '@atoms/button';
import Ellipsis from '@atoms/ellipsis';
import styles from './styles';
import { button, text } from '@styles/color';

interface Props {
  label?: string;
  onBack?:any,
  onPress?: any;
    onDisableBack?:any,
  disabled?: boolean;
  loading?: boolean;
  noShadow?: boolean;
  block?: boolean;
    containerStyles?: any
icon?:any
    buttonStyles?:any
};

const Bottom: FC<Props> = ({
    children,
  label = '',
                               containerStyles,
  onPress = () => {},
buttonStyles,
  disabled,
  loading,
  noShadow,
  block = true,
    icon
}) => {
  return (
    <View style={[
      styles.container,
      !noShadow && styles.containerShadow,
        containerStyles
    ]}>
        {children}

      <Button
        style={[
          styles.button,
          disabled && {backgroundColor: button.disabled},
          loading && {backgroundColor: button.info},
          !block && styles.buttonNotBlock,
            buttonStyles
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {
          !!loading
            ? <Ellipsis color='#fff' size={10} />
            : <Text style={[
                styles.buttonTxt,
                disabled && {color: text.disabled}
              ]}>
                {label}
              </Text>

        }
          {icon}
      </Button>
    </View>
  )
};

export default Bottom;