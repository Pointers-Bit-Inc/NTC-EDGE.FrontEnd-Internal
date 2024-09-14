import React, { FC } from 'react';
import { View } from 'react-native';
import Text from '@atoms/text';
import Button from '@atoms/button';
import Ellipsis from '@atoms/ellipsis';
import styles from './styles';
import { button, text } from '@styles/color';

interface Props {

  label?: string;
  onPress?: any;
  disabled?: boolean;
  loading?: boolean;
  icon?: any;

  /**will find another solution but for now 2 is still ideal */
  label2?: string;
  onPress2?: any;
  disabled2?: boolean;
  loading2?: boolean;
  icon2?: any;

  noShadow?: boolean;
  block?: boolean;
};

const Bottom: FC<Props> = ({
  label = '',
  onPress = () => {},
  disabled,
  loading,
  icon,
  label2 = '',
  onPress2 = () => {},
  disabled2,
  loading2,
  icon2,
  noShadow,
  block = true,
}) => {
  const iconProps = {
    size: 20,
    style: styles?.icon,
  };
  return (
    <View style={[
      styles.container,
      !noShadow && styles.containerShadow,
      !!label2 && styles?.container2
    ]}>
      <Button
        style={[
          styles.button,
          disabled && {backgroundColor: button.disabled},
          loading && {backgroundColor: button.info},
          !block && styles.buttonNotBlock,
          !!label2 && styles?.button2,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {
          !!loading
            ? <Ellipsis color='#fff' size={10} />
            : <View style={styles?.container2}>
                {
                  !!icon &&
                  icon(iconProps)
                }
                <Text style={[
                  styles.buttonTxt,
                  disabled && {color: text.disabled}
                ]}>
                  {label}
                </Text>
              </View>
        }
      </Button>
      {
        !!label2 &&
        <Button
          style={[
            styles.button,
            disabled2 && {backgroundColor: button.disabled},
            loading2 && {backgroundColor: button.info},
            !block && styles.buttonNotBlock,
            styles?.button2,
          ]}
          onPress={onPress2}
          disabled={disabled2 || loading2}
        >
          {
            !!loading2
              ? <Ellipsis color='#fff' size={10} />
              : <View style={styles?.container2}>
                  {
                    !!icon2 &&
                    icon2(iconProps)
                  }
                  <Text style={[
                    styles.buttonTxt,
                    disabled2 && {color: text.disabled}
                  ]}>
                    {label2}
                  </Text>
                </View>
          }
        </Button>
      }
    </View>
  )
};

export default Bottom;