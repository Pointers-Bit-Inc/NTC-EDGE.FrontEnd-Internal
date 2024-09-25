import React, { FC, useState } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import Text from '@atoms/text';
import Box from '@atoms/box';
import UploadFile from '@molecules/upload-file';
import DropdownCard from '@organisms/dropdown-card';
import List from './list';
import styles from './styles';

const { height } = Dimensions.get('window');

interface Props {
  requirements?: any;
  onUpload?: any;
  onRemove?: any;
  disabled?: boolean;
};

const Requirements: FC<Props> = ({
  requirements = [],
  onUpload = () => {},
  onRemove = () => {},
  disabled = false,
}) => {
  const UploadItem = ({item, index}: any) => {
    return (
      <View style={styles.uploadContainer}>
        <View>
          <Text style={styles.uploadLabelText}>{index+1}. {item?.title}<Text style={styles?.requiredText}>{item?.required ? '*' : ''}</Text></Text>
        </View>
        {
          !!item?.description &&
          <Text style={styles.uploadContentText}>{item?.description}</Text>
        }
        {ItemSeparatorComponent}
        <UploadFile
          onUpload={(file: any) => onUpload({...file, index})}
          onRemove={(_index: number) => onRemove(index, _index)}
          defaultFiles={item?.files}
          disabled={disabled}
        />
      </View>
    )
  };
  const renderItem = ({item, index}: any) => (
    <UploadItem
      index={index}
      item={item}
      key={`${index}`}
    />
  )
  const ItemSeparatorComponent = <View style={styles.separator} />;
  const ListFooterComponent = <View style={{height: height * .15}} />;
  return (
    <FlatList
      showsVerticalScrollIndicator={true}
      keyExtractor={(item, index) => `${index}`}
      data={requirements}
      renderItem={renderItem}
      ItemSeparatorComponent={() => ItemSeparatorComponent}
      ListFooterComponent={() => ListFooterComponent}
    />
  )
}

export default Requirements;
