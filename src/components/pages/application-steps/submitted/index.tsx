import React from 'react';
import {View, Image, Platform} from 'react-native';
import Text from '@atoms/text';
import styles from './styles';

export default () => {
  return (
    <View style={[styles.container, {...Platform.select({web: {
                backgroundColor: "#fff"
            } }) }]}>
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
