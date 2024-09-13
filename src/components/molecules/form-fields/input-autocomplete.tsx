import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@atoms/text';
import Dropdown from '@atoms/dropdown';
import styles from '@styles/input-style';
import { input } from '@styles/color';

interface Props {
  containerStyle?: StyleSheet;
  data?: Array<object>;
  hideResults?: boolean;
  inputContainerStyle?: StyleSheet,
  keyboardShouldPersistTaps?: string | boolean;
  listContainerStyle?: StyleSheet,
  listStyle?: StyleSheet,
  onShowResults?: Function;
  onStartShouldSetResponderCapture?: Function;
  renderItem?: Function;
  keyExtractor?: Function;
  renderSeparator?: Function;
  renderTextInput?: Function;
  flatListProps?: object;
  [x: string]: any;
}

const AutoCompleteTag: FC<Props> = ({
  containerStyle = {},
  data = [],
  hideResults = false,
  inputContainerStyle = {},
  keyboardShouldPersistTaps = 'always',
  listContainerStyle = {},
  listStyle = {},
  onShowResults = () => {},
  onStartShouldSetResponderCapture = () => {},
  renderItem = ({ item }) => <Text>{item}</Text>,
  keyExtractor = () => {},
  renderSeparator = () => <View style={{height: 1,width: "86%",backgroundColor: "#CED0CE", marginLeft: "14%" }} />,
  renderTextInput = props => <input {...props} />,
  flatListProps = {},
  ...otherProps
}) => {

  return (
    <View />
  );
};

export default AutoCompleteTag;
