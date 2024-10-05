import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import { fontValue } from "@pages/activities/fontValue";
import { Regular, Regular500 } from "@styles/font";
import InputField from "@molecules/form-fields/input-field";
import useSafeState from "../../../../hooks/useSafeState";
import { infoColor, borderColor, backgroundColor } from "@styles/color";
import axios from "axios";
import useApi from '@/src/services/api';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: backgroundColor || "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: fontValue(14),
    fontFamily: Regular500,
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detail: {
    fontSize: fontValue(16),
    fontFamily: Regular,
    paddingVertical: 4,
    textAlign: "left",
    flex: 1,
    color: "#333",
  },
  detailInput: {
    fontSize: fontValue(14),
    fontFamily: Regular500,
    color: "#121212",
    flex: 1,
    textAlign: "left",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  buttonText: {
    fontFamily: Regular500,
    fontSize: fontValue(16),
    color: infoColor || "#007AFF",
    marginLeft: 12,
  },
});

const ReferenceNumbers = ({ handleSave, display, label, applicant }) => {
  const props = useMemo(() => ({ handleSave, display, label, applicant }), [handleSave, display, label, applicant]);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(display || applicant || "");
  const [error, setError] = useState(false);
  const [description, setDescription] = useState("");

  const handleEdit = () => setIsEditing(!isEditing);

  const saveHandler = () => {
    setError(false);
    handleSave(value, isEditing, setIsEditing, (callback, message) => {
      if (callback) {
        setError(false);
        setDescription("");
      } else {
        setDescription(message);
        setError(true);
      }
    });
  };

  return (
    <View style={styles.container}>
      {(display || applicant) && (
        <>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputWrapper}>
            {isEditing ? (
              <InputField
                hasValidation={error}
                error={error}
                description={description}
                value={value}
                onChangeText={setValue}
                style={styles.detailInput}
              />
            ) : (
              <Text style={styles.detail}>{value}</Text>
            )}
            <TouchableOpacity onPress={isEditing ? saveHandler : handleEdit}>
              <Text style={styles.buttonText}>
                {isEditing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

ReferenceNumbers.defaultProps = {
  editable: true,
  show: true,
  showEdit: true,
  handleSave: () => {},
};

export default ReferenceNumbers;
