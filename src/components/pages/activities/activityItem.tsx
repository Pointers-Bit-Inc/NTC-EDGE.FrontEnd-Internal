import React from "react";
import { Swipeable } from "react-native-gesture-handler";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "@components/atoms/text";
import ProfileImage from "@components/atoms/image/profile";
import Svg, {Ellipse} from "react-native-svg";
import FileIcon from "@assets/svg/file";
import {formatDate, statusBackgroundColor, statusColor, statusDimension, statusIcon} from "@pages/activities/script";
import { text, outline } from 'src/styles/color';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        paddingBottom: 10,
        borderBottomColor: outline.default,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft: 5,
        paddingTop: 15
    },
    name: {
        marginBottom: 8,
    },
    date: {

    },
    application: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
        marginLeft: 0,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#163776',
    },
    status: {
        paddingHorizontal: 15,
        paddingVertical: 2,
        borderRadius: 5,
        marginLeft: 15
    },
    circle: {
        width: 8,
        height: 8,
        backgroundColor: 'rgba(26,89,211,1)',
        borderRadius: 8,
        marginLeft: -8,
        marginRight: 5,
    }
})

const RenderStatus = ({ status }:any) => {
    return (
        <View
            style={[
                styles.horizontal,
                statusBackgroundColor(status),
                styles.status
            ]}
        >
            {statusIcon(status, { marginRight: 3 })}
            <Text
                style={statusColor(status)}
                size={12}
                numberOfLines={1}
            >
                {StatusText(status)}
            </Text>
        </View>
    )
}

const StatusText = (status) => {
    switch(status) {
        case 'Paid':
            return 'Verified'
        case 'Pending':
            return 'For Verification'
        default:
            return status
    }
}

const RenderApplication = ({ applicationType }:any) => {
    return (
        <View
            style={[
                styles.horizontal,
                styles.application
            ]}
        >
            <FileIcon
                width={13}
                height={13}
                style={{ color: '#163776' }}
            />
            <Text
                style={{ marginLeft: 3, marginRight: 5 }}
                color="#163776"
                size={10}
                numberOfLines={1}
            >
                {applicationType}
            </Text>
        </View>
    )
}

export function ActivityItem(props:any) {
    const userActivity = props.activity.activityDetails.application.applicant.user
    
    return (
        <Swipeable
            key={props.index}
            renderRightActions={
                (progress, dragX) => props.swiper(props.index, progress, dragX)
            }
        >
            <TouchableOpacity onPress={props.onPressUser}>
                <View style={styles.container}>
                    <View style={styles.circle} />
                    <ProfileImage
                        size={45}
                        image={userActivity.image}
                        name={`${userActivity.firstName} ${userActivity.lastName}`}
                    />
                    <View style={styles.content}>
                        <View style={styles.section}>
                            <View style={styles.name}>
                                <Text
                                    color={'#1F2022'}
                                    weight="bold"
                                    size={14}
                                    numberOfLines={1}
                                >
                                    {`${userActivity?.firstName} ${userActivity.lastName}`}
                                </Text>
                            </View>
                            <View style={styles.date}>
                                <Text
                                    color={'#1F2022'}
                                    size={10}
                                    numberOfLines={1}
                                >
                                    {formatDate(props.activity.activityDetails.dateTime)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <RenderApplication applicationType={props.activity.activityDetails.applicationType} />
                            </View>
                            <RenderStatus
                                status={
                                    props?.currentUser?.role?.key === 'cashier' ? 
                                        props?.activity?.activityDetails?.application?.paymentStatus :
                                        props?.activity?.activityDetails?.status
                                }
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}