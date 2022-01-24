import {Text, TouchableOpacity, View} from "react-native";
import CheckMarkIcon from "@assets/svg/checkmark";
import CloseIcon from "@assets/svg/close";
import ErrorIcon from "@assets/svg/erroricon";
import React from "react";
import ProfileImage from "@components/atoms/image/profile";
import dayjs from "dayjs";
import {styles} from "@pages/barcode/styles";
export function Response(props: { verifiedInfo: any, verified: boolean, onPress: () => void, error: boolean, onPress1: () => void }) {
    return <>
        {props.verified && <View style={[styles.group32, { paddingHorizontal: 15 }]}>
            <View style={styles.rect13}>
                <View style={styles.group31}>
                    <View style={styles.group30}>
                        <View style={styles.rect14}>
                            <View style={styles.group33}>
                                <View style={{width: "33.33%"}}>
                                    <View style={styles.group12}>
                                        <View style={styles.rect15}>
                                            <CheckMarkIcon></CheckMarkIcon>
                                        </View>
                                        <Text style={styles.verified}>Verified</Text>
                                    </View>
                                </View>


                                <TouchableOpacity onPress={props.onPress} style={styles.rect18}>
                                    <CloseIcon style={{alignSelf: "flex-end"}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <ProfileImage
                        style={{ borderRadius: 5 }}
                        size={150}
                        textSize={50}
                        image={props.verifiedInfo?.applicant?.user?.profilePicture?.small}
                        name={`${props.verifiedInfo?.applicant?.user?.firstName} ${props.verifiedInfo?.applicant?.user?.lastName}`}
                    />
                    <View style={[styles.group29, { paddingHorizontal: 10 }]}>
                        <View style={styles.group17}>
                            <Text style={styles.examDetails}>BASIC INFO</Text>
                            <View style={styles.group18}>
                                <View style={styles.group19}>
                                    <Text style={styles.name2}>Name:</Text>
                                    <Text style={styles.address2}>Address:</Text>
                                </View>
                                <View style={styles.group20}>
                                    <Text style={styles.name3}>{props.verifiedInfo?.applicant?.user?.firstName}</Text>
                                    <Text style={styles.address3}>{props.verifiedInfo?.applicant?.street}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.group17}>
                            <Text style={styles.examDetails}>EXAM DETAILS</Text>
                            <View style={styles.group18}>
                                <View style={styles.group19}>
                                    <Text style={styles.name2}>Venue:</Text>
                                    <Text style={styles.address2}>Date:</Text>
                                    <Text style={styles.address2}>Time:</Text>
                                </View>
                                <View style={styles.group20}>
                                    <Text style={styles.name3}>{props?.verifiedInfo?.examDetails?.venue}</Text>
                                    <Text style={styles.address3}>{props?.verifiedInfo?.examDetails?.examDate}</Text>
                                    <Text style={styles.address3}>{props?.verifiedInfo?.examDetails?.examTime}:</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.group17}>
                            <Text style={styles.examDetails}>PAYMENT DETAILS</Text>
                            <View style={styles.group18}>
                                <View style={styles.group19}>
                                    <Text style={styles.name2}>O.R. No.:</Text>
                                    <Text style={styles.address2}>Amount::</Text>
                                    <Text style={styles.address2}>Date:</Text>
                                </View>
                                <View style={styles.group20}>
                                    <Text style={styles.name3}>{props?.verifiedInfo?.ORNumber}</Text>
                                    <Text style={styles.address3}>PHP {parseFloat(props?.verifiedInfo?.totalFee || 0).toFixed(2)}</Text>
                                    <Text style={styles.address3}>{props?.verifiedInfo?.approvalHistory?.status === 'Approved' ?  dayjs(props?.verifiedInfo?.approvalHistory?.time).format('MM/DD/YY') : null}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>}
        {props.error && <View style={styles.group11}>
            <View style={styles.group10}>
                <View style={styles.rect6}>
                    <ErrorIcon></ErrorIcon>
                </View>
                <Text style={styles.invalidQrCode}>Invalid QR Code</Text>
                <View style={styles.group9}>
                    <View style={styles.rect9}>
                        <Text style={styles.pleaseTryAgain}>Please try again</Text>
                    </View>
                </View>
                <View style={styles.group8}>
                    <View style={styles.rect11}></View>
                    <TouchableOpacity onPress={props.onPress1} style={styles.rect12}>
                        <Text style={styles.close}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>}
    </>;
}