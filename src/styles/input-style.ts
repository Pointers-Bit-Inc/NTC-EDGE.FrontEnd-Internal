import { StyleSheet } from "react-native";
import { text, outline } from './color';

const styles = StyleSheet.create({
  outlineStyle: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderColor: outline.default,
  },
  text: {
    color: text.default,
    fontWeight: '400',
  },
})

export default styles;