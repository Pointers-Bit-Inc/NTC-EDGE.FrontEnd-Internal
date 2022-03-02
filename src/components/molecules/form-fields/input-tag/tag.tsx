import React, { FC } from "react";
import {
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import styles from "./styles";

interface Props {
  label: string;
  onPress: () => any;
  tagContainerStyle: StyleProp<ViewStyle>;
  tagTextStyle: StyleProp<TextStyle>;
}

const Tag: FC<Props> = ({
  label,
  onPress,
  tagContainerStyle,
  tagTextStyle
}) => (
  <TouchableOpacity style={[styles.tag, tagContainerStyle]} onPress={onPress}>
    <Text style={[styles.tagLabel, tagTextStyle]}>{label}</Text>
  </TouchableOpacity>
);

export default Tag;