import {Swipeable} from "react-native-gesture-handler";
import {Text, TouchableOpacity, View} from "react-native";
import {styles} from "@pages/activities/styles";
import Svg, {Ellipse} from "react-native-svg";
import FileIcon from "@assets/svg/file";
import {formatDate, statusBackgroundColor, statusColor, statusDimension, statusIcon} from "@pages/activities/script";
import React from "react";
import {RootStateOrAny, useSelector} from "react-redux";

export function ActivityItem(props:any) {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const isCashier =  user?.role?.key == 'cashier' ? props.activity.activityDetails.application.status : props.activity.activityDetails.status
    const userActivity = props.activity.activityDetails.application.applicant.user
    return <Swipeable key={props.index}
                      renderRightActions={(progress, dragX) => props.swiper(props.index, progress, dragX)}>
        <View style={styles.group17}>
            <View style={styles.group8}>
                <View style={styles.rect8}>
                    <View style={styles.activeRow}>
                        <View style={styles.active}>
                            <View style={styles.rect12}>
                                <View style={styles.rect13}>
                                    <Svg viewBox="0 0 10 9.5"
                                         style={styles.ellipse}>
                                        <Ellipse
                                            strokeWidth={0}
                                            fill="rgba(26,89,211,1)"
                                            cx={5}
                                            cy={5}
                                            rx={5}
                                            ry={5}
                                        />
                                    </Svg>
                                </View>
                            </View>
                        </View>
                        <View style={styles.profile}>
                            <View style={styles.rect11Stack}>
                                <View style={styles.rect11}/>
                                <View style={styles.rect14}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.activeRowFiller}/>
                    <View style={styles.group4StackStack}>
                        <View style={styles.group4Stack}>
                            <View style={styles.group4}>
                                <View style={styles.rect16}>
                                    <View style={styles.group3}>
                                        <TouchableOpacity onPress={props.onPressUser}>
                                            <Text
                                                style={styles.name}>{(userActivity?.firstName + " " + userActivity?.lastName).length > 20 ? (userActivity?.firstName + " " + userActivity?.lastName).slice(0, 25).concat('...') : (userActivity?.firstName + " " + userActivity?.lastName)}</Text>
                                        </TouchableOpacity>

                                        <View style={styles.group2}>
                                            <View style={styles.rect18Stack}>
                                                <View style={styles.rect18}>
                                                    <View style={styles.group21}>
                                                        <View style={styles.rect32}>
                                                            <Text
                                                                style={styles.application}>
                                                                {props.activity.activityDetails.applicationType.length > 25 ? props.activity.activityDetails.applicationType.slice(0, 25).concat('...') : props.activity.activityDetails.applicationType}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.group20}>
                                                    <View style={styles.rect31}>
                                                        <FileIcon width={13} height={13}
                                                                  style={styles.icon2}></FileIcon>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rect28}/>
                        </View>
                        <View style={styles.group5}>
                            <View style={styles.group22Stack}>
                                <View style={styles.group22}>
                                    <View style={styles.rect33}>
                                        <View style={styles.loremIpsumFiller}/>
                                        <Text
                                            style={styles.loremIpsum}>{formatDate(props.activity.activityDetails.dateTime)}</Text>
                                    </View>
                                </View>
                                <View style={styles.rect24}/>
                            </View>
                        </View>
                        <View style={styles.group7}>
                            <View style={styles.stackFiller}/>
                            <View style={styles.group6Stack}>
                                <View style={styles.group6}>
                                    <View
                                        style={[styles.rect23, statusBackgroundColor(props.activity.activityDetails.status)]}>
                                        <View style={styles.group19}>
                                            <View style={styles.group18Row}>
                                                <View style={styles.group18}>
                                                    <View style={styles.icon3Stack}>
                                                        {statusIcon(props.activity.activityDetails.status)}

                                                        <View
                                                            style={styles.rect29}/>
                                                    </View>
                                                </View>
                                                <View
                                                    style={[styles.rect30Stack, statusDimension(props.activity.activityDetails.status)]}>
                                                    <View style={styles.rect30}/>
                                                    <Text
                                                        style={[styles.approved, {fontWeight: "bold"},  statusColor(isCashier)]}>  {user?.role?.key == 'cashier' ? props.activity.activityDetails.application.status : props.activity.activityDetails.status}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.rect25}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    </Swipeable>

}