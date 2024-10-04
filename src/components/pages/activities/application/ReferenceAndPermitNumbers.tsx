import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import { fontValue } from "@pages/activities/fontValue";
import { Regular, Regular500 } from "@styles/font";
import InputField from "@molecules/form-fields/input-field";
import useSafeState from "../../../../hooks/useSafeState";
import { infoColor } from "@styles/color";
import axios from "axios";
import useApi from '@/src/services/api';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';  // Import axios

const styles = StyleSheet.create({
  group2: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
    paddingHorizontal: 10,
    fontSize: fontValue(12),
  },
  detail: {
    fontSize: fontValue(14),
    fontFamily: Regular,
    paddingRight: 0,
    textAlign: "left",
    flex: 1,
    alignSelf: "flex-start",
  },
  detailInput: {
    fontSize: fontValue(14),
    fontFamily: Regular500,
    color: "#121212",
    flex: 1,
    textAlign: "left",
  },
});

const ReferenceNumbers = (_props: { handleSave?: any; display?: string; label: string; applicant?: any }) => {
  const props = useMemo(() => _props, [_props]);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(props.display || props.applicant || "");
  const [error, setError] = useState(false);
  const [description, setDescription] = useState("");

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };


  return (
    <>
      {props.display || props.applicant ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 10,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>{props.label}</Text>
          </View>

          <View
            style={{
              flex: 1,
              marginTop: 10,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
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
              <Text style={styles.detailInput}>{value}</Text>
            )}
            <TouchableOpacity onPress={(e) => {
              if(isEditing) {
                setError(false)
                props.handleSave(value, isEditing, setIsEditing, (callback, message) => {

                  if(callback){
                    setError(false)
                    setDescription("")
                  }else{
                    setDescription(message)
                    setError(true)
                  }
                }, )
              } else{
                handleEdit()
              }}}>
              <Text
                style={{
                  fontFamily: Regular,
                  fontSize: fontValue(16),
                  color: infoColor,
                }}
              >
                {isEditing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

ReferenceNumbers.defaultProps = {
  editable: true,
  show: true,
  showEdit: true,
  handleSave: (e) => {}
};

export default ReferenceNumbers;
