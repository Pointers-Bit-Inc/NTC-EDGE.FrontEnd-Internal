import React from 'react';
import { View, Text } from 'react-native';
import NTC101 from "@organisms/forms/ntc-1-01";

export default () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <NTC101 onSubmit={(value) =>  {
        //setOnNext(!onNext)
      }} />
    </View>
  )
};