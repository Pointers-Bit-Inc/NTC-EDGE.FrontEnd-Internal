import {FlatList, Text, View} from "react-native";
import Row from "@pages/activities/application/Row";
import React from "react";
import styles from "@styles/applications/basicInfo"
import {transformText} from "../../../utils/ntc";
import _ from "lodash";
import NavBar from "@molecules/navbar";

const ProfileData = (props) => {

    return <View style={[styles.elevation]}>
        <View style={[styles.container, {marginVertical: 20}]}>
            <View style={styles.group3}>
                <View style={styles.group3}>
                    <View style={styles.group}>
                        <View style={styles.rect}>
                            <Text style={styles.header}>Basic Information</Text>
                        </View>
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={styles.group3}
                        data={Object.keys(_.omit(props.data, ['_id', 'role', 'profilePicture', 'createdAt'] ))}
                        renderItem={(a) => {
                        return  <Row label={`${transformText(a?.item)}:`} applicant={props.data?.[a?.item]}/>
                        }
                        }
                        keyExtractor={(item,index)=>`${index}`}
                        scrollEnabled={false}
                    />
                </View>
            </View>
        </View>
    </View>
}

export default ProfileData