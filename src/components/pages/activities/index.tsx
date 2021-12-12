import React, {useEffect, useMemo, useState} from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {EvilIcons, Feather, FontAwesome, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import ActivityModal from "@pages/activities/modal";
import {styles} from "@pages/activities/styles";
import axios from "axios";

export default function ActivitiesPage() {
    const FOREVALUATION = 'For Evaluation',
        APPROVED = "Approved",
        DECLINED = "Decline"


    interface ActivityDetails {
        applicant: string;
        applicationType: string;
        dateTime: string;
        description: string;
        status: string;
        subject: string;
    }

    interface Activities {
        activityDetails: ActivityDetails;
        activityType: string;
        createdAt: string;
        id: string;
        thumbnails: string;
    }


    const [customNavigation, setCustomNavigation] = useState(0)
    const [mockList, setMockList] = useState<Activities[]>([
        {
            "id": "4e93edac-f0b8-4048-98b1-b89085336e15",
            "activityType": "Activity Type",
            "activityDetails": {
                "applicant": "Jun Mark Grills",
                "subject": "Activity Subject",
                "dateTime": "2021-12-010T08:40:51.620Z",
                "description": "Activity description",
                "applicationType": "Application Type",
                "status": "For Evaluation"
            },
            "thumbnails": "thumbnails",
            "createdAt": "2021-12-010T08:40:51.620Z"
        },
        {
            "id": "5e93edac-f0b8-4048-98b1-b89085336e15",
            "activityType": "Activity Type",
            "activityDetails": {
                "applicant": "Jane Copper",
                "subject": "Activity Subject",
                "dateTime": "2021-12-010T08:40:51.620Z",
                "description": "Activity description",
                "applicationType": "Application Type",
                "status": "Approved"
            },
            "thumbnails": "thumbnails",
            "createdAt": "2021-12-010T08:40:51.620Z"
        },
        {
            "id": "1e93edac-f0b8-4048-98b1-b89085336e15",
            "activityType": "Activity Type",
            "activityDetails": {
                "applicant": "Wade Warren",
                "subject": "Activity Subject",
                "dateTime": "2021-12-010T08:40:51.620Z",
                "description": "Activity description",
                "applicationType": "Application Type",
                "status": "Approved"
            },
            "thumbnails": "thumbnails",
            "createdAt": "2021-12-010T08:40:51.620Z"
        },
        {
            "id": "2e93edac-f0b8-4048-98b1-b89085336e15",
            "activityType": "Activity Type",
            "activityDetails": {
                "applicant": "Ralph Edwards",
                "subject": "Activity Subject",
                "dateTime": "2021-12-010T08:40:51.620Z",
                "description": "Activity description",
                "applicationType": "Application Type",
                "status": "Decline"
            },
            "thumbnails": "thumbnails",
            "createdAt": "2021-12-010T08:40:51.620Z"
        },
    ])

    useEffect(() => {
        // axios.get('https://private-anon-3f439e7212-ntcedgeustp.apiary-mock.com/activities').then((response) => {
        //     let res = [...response.data]
        //     setMockList(res)
        // })
    }, [])
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatusCode, setSelectedStatusCode] = useState<string[]>([])
    const [visible, setVisible] = useState(false)
    const [statusCode, setStatusCode] = useState([
        {
            id: 1,
            checked: false,
            status: FOREVALUATION
        },
        {
            id: 2,
            checked: false,
            status: APPROVED
        },
        {
            id: 3,
            checked: false,
            status: DECLINED
        },
    ])

    const usersList = useMemo(() => {
        if (selectedStatusCode.length === 0 && searchTerm.length === 0) {
            return mockList;
        }
        const list = mockList.filter((item: Activities) => {
            return item.activityDetails.applicant.includes(searchTerm) &&
                (selectedStatusCode.length ? selectedStatusCode.indexOf(item.activityDetails.status) != -1 : true)
        });

        return list;
    }, [searchTerm, selectedStatusCode.length, mockList.length])


    const statusColor = (status: string) => {
        if (status == FOREVALUATION) {
            return {color: "#f79e1b"}
        } else if (status == APPROVED) {
            return {color: "#34c759"}
        } else if (status == DECLINED) {
            return {color: "#cf0327"}
        }
    }

    const statusIcon = (status: string) => {

        if (status == FOREVALUATION) {
            return <FontAwesome name="circle-o" ></FontAwesome>
        } else if (status == APPROVED) {
            return <Feather  name="check" ></Feather>
        } else if (status == DECLINED) {
            return <Ionicons  name="md-close" s></Ionicons>
        }
    }
    const onDismissed = () => {
        setVisible(false)
    }
    const onChecked = (status: any) => {
        let newArr = [...statusCode];
        const index = newArr.findIndex(app => app.id == status.id)
        newArr[index].checked = !newArr[index].checked
        setStatusCode(newArr)

        let selectChangeStatus = []
        for (let i = 0; i < statusCode.length; i++) {
            if (statusCode[i].checked) {
                selectChangeStatus.push(statusCode[i].status)
            }
        }
        setSelectedStatusCode(selectChangeStatus)


    }
    const formatDate = (date: string) => {
        let isoStringSplit = date.split("T")[0].split("-")
        let checkIfCorrectMonth = isoStringSplit[2],
            checkIfCorrectDay = isoStringSplit[1]

        if (checkIfCorrectMonth.length == 3) {
            isoStringSplit[2] = checkIfCorrectMonth.substr(1, 2)
        }
        if (checkIfCorrectDay.length == 3) {
            isoStringSplit[1] = checkIfCorrectMonth.substr(1, 2)
        }
        let newDate = ""
        for (let i = 0; i < isoStringSplit.length; i++) {
           newDate += isoStringSplit[i] + (i != isoStringSplit.length-1 ? "/": "")
        }
        date = newDate
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    }
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                    <View style={styles.groupColumn}>
                        <View style={styles.group}>
                            <View style={styles.rect7RowRow}>
                                <View style={styles.rect7Row}>
                                    <View style={styles.rect7}>
                                        <Image source={require('./../../../../assets/favicon.png')}/>
                                    </View>
                                    <Text
                                        style={styles.textInput}
                                    >{"ACTIVITY"}</Text>
                                </View>

                                <View style={styles.rect7RowFiller}></View>
                                <TouchableOpacity onPress={() => setVisible(true)}>
                                    <Feather name="filter" style={styles.icon}></Feather>
                                </TouchableOpacity>

                            </View>

                            <View style={styles.rect13}>
                                <View style={styles.rect}>
                                    <View style={styles.icon20Row}>
                                        <EvilIcons
                                            name="search"
                                            style={styles.icon20}
                                        ></EvilIcons>
                                        <TextInput
                                            placeholder="search"
                                            style={styles.textInput2}
                                            onChange={(event) => setSearchTerm(event.nativeEvent.text)}
                                        ></TextInput>
                                    </View>
                                </View>
                            </View>


                            <View style={styles.rect2}></View>
                        </View>


                    </View>

                    <ScrollView style={{paddingLeft: 10}}>
                        {usersList.map((item, index: number) => {
                            return <View key={index}>
                                <View style={styles.ellipse2StackRow}>
                                    <View style={styles.ellipse2Stack}>
                                        <View style={styles.rect6}>

                                        </View>
                                    </View>
                                    <View style={styles.ellipse2StackFiller}></View>
                                    <View style={styles.nameRowColumn}>
                                        <View style={styles.nameRow}>
                                            <Text style={styles.name}>{item.activityDetails.applicant}</Text>
                                            <Text
                                                style={styles.submitted999999}>Submitted:{formatDate(item.activityDetails.dateTime)}</Text>
                                        </View>
                                        <View style={styles.rect5Row}>
                                            <View style={styles.container1}>
                                                <View style={styles.rect5}>
                                                    <MaterialCommunityIcons name="file-document"
                                                                            style={styles.icon7}></MaterialCommunityIcons>
                                                    <Text style={styles.loremIpsum}>APPLICATION</Text>
                                                </View>
                                            </View>
                                            <View style={styles.rect5Filler}></View>


                                            <Text style={[styles.forEvaluation, statusColor(item.activityDetails.status)]}>

                                                    {
                                                        statusIcon(item.activityDetails.status)
                                                    }



                                                   {" " + item.activityDetails.status}

                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.rect9}></View>
                            </View>
                        })}
                    </ScrollView>

            </View>

            <ActivityModal
                visible={visible}
                onChecked={onChecked}
                onDismissed={onDismissed}
                ActivitiesStatus={statusCode}
            />
        </View>
    );
}


