import {FlatList, Text, View} from "react-native";
import Row from "@pages/activities/application/Row";
import React from "react";
import styles from "@styles/applications/basicInfo"
import {transformText} from "../../../utils/ntc";
import _ from "lodash";
import NavBar from "@molecules/navbar";
import ProfileImage from "@components/atoms/image/profile";
import {fontValue} from "@pages/activities/fontValue";

const ProfileData = (props) => {

    return <View style={[styles.elevation]}>

        <View style={[styles.container, {marginVertical: 20}]}>
            <View style={styles.group3}>
                <View style={{alignItems: "center", justifyContent: "center", paddingVertical: 15 }}>
                    <ProfileImage
                        size={fontValue(150)}
                        style={{borderRadius:4}}

                        textSize={22}
                        image={props.data?.profilePicture?.small.match(/[^/]+(jpeg|jpg|png|gif)$/i) ? props.data?.profilePicture?.small : props.data?.profilePicture?.small+".png"}
                        name={props.data?.firstName  && props.data?.lastName ? props.data?.firstName+(props.data?.middleName ? " "+props.data?.middleName?.charAt()+"." : "")+" "+props.data?.lastName : props.data?.applicantName ? props.data?.applicantName : ""}
                    />
                </View>

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