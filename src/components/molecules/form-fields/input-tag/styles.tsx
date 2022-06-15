import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center"
  },

  textInputContainer: {
    flex: 1,
    minWidth: 100,
    borderRadius: 16,
    backgroundColor: "#ccc"
  },

  textInput: {
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.87)",
    ...Platform.select({
      web: {
        outlineStyle: 'none'
      }
    }),
  },

  tag: {
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 12,
    margin: 4
  },
  tagLabel: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.87)"
  }
});
