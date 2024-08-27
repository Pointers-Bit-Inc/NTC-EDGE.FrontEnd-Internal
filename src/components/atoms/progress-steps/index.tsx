import React, { FC } from 'react';
import { LogBox, View, FlatList } from 'react-native';
import * as Progress from 'expo-progress';
import propsStyles from './props-styles';
import styles from './styles';

interface Props {
  values?: number[];
};

const renderItem = ({item, index}: any) => {
  return (
    <Progress.Bar
      key={index}
      progress={item}
      {...propsStyles.progress}
      style={styles.progress}
    />
  )
}

const ProgressSteps: FC<Props> = ({ values = [0] }) => {
  return (
    <View style={styles.flatlist}>
      <FlatList
        horizontal
        data={values}
        renderItem={renderItem}
        keyExtractor={(item, index) => `key-${index}`}
      />
    </View>
  )
};

LogBox.ignoreLogs(['in Reanimated 2']);
export default ProgressSteps;