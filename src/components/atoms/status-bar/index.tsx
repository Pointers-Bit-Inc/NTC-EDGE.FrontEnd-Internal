import React, { FC } from 'react';
import { StatusBar, View } from 'react-native';
import styles from './styles';

interface Props {
  barStyle?: any;
  backgroundColor?: string,
};

const Statusbar: FC<Props> = ({
  barStyle = 'default',
  backgroundColor = ''
}) => {
  return (
    <View style={[styles.view, { backgroundColor }]}>
      <StatusBar barStyle={barStyle} />
    </View>
  )
};

export default Statusbar;