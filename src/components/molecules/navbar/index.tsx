import React, { FC, ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import StatusBar from '@atoms/status-bar';
import Text from '@atoms/text';
import styles from './styles';

interface Props {
  title?: string,
  titleStyle?: any,
  leftIcon?: ReactNode,
  rightIcon?: ReactNode,
  onLeft?: any,
  onRight?: any,
};

const Navbar: FC<Props> = ({
  title = '',
  titleStyle = {},
  leftIcon = <View />,
  rightIcon = <View />,
  onLeft = () => {},
  onRight = () => {},
}) => {
  return (
    <>

      <StatusBar {...styles.statusBar} />

      <View style={styles.container}>

        <TouchableOpacity onPress={onLeft}>
          {leftIcon}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text numberOfLines={3} style={[styles.title, titleStyle]}>
            {title}
          </Text>
        </View>

        <TouchableOpacity onPress={onRight}>
          {rightIcon}
        </TouchableOpacity>

      </View>

    </>
  )
};

export default Navbar;