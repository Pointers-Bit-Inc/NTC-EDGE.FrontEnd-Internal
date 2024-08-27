import React from 'react';
import { View, Image } from 'react-native';
import Text from '@atoms/text';
import styles from './styles';

export default () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('@assets/plane.png')}
      />
      <Text style={styles.messageOne}>
        Your application has been submitted.
      </Text>
      <Text style={styles.messageTwo}>
        {`We will notify you\nonce validation is done.\nThank you!`}
      </Text>
    </View>
  )
};