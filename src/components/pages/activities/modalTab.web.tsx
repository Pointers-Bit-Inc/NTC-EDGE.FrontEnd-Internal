import {RootStateOrAny, useSelector} from "react-redux";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import Payment from "@pages/activities/application/paymentModal/payment";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ACCOUNTANT, CASHIER, CHECKER, DIRECTOR, EVALUATOR} from "../../../reducers/activity/initialstate";
import {primaryColor, text} from "@styles/color";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Poppins_400Regular , Poppins_500Medium} from "@expo-google-fonts/poppins";
import {Bold , Regular , Regular500} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/script";

let initial = {};


export const ModalTab = props => {

    const user = useSelector((state: RootStateOrAny) => state.user);
    const Tab = createMaterialTopTabNavigator();
    const [tabs, setTabs] = useState([
        {
            id: 1,
            name: 'Basic Info',
            active: true,
            isShow: [CHECKER, ACCOUNTANT, CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 2,
            name: 'Application Details',
            active: false,
            isShow: [CHECKER, ACCOUNTANT, CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 3,
            name: 'Requirements',
            active: false,
            isShow: [CHECKER, DIRECTOR, EVALUATOR]
        },
        {
            id: 4,
            name: 'SOA & Payment',
            active: false,
            isShow: [CASHIER, ACCOUNTANT]
        },
    ]);
    const applicant = props?.details?.applicant,
        selectedTypes = props?.details?.selectedTypes,
        applicationType = props?.details?.applicationType,
        service = props?.details?.service,
        soa = props?.details?.soa,
        totalFee = props?.details?.totalFee,
        paymentMethod = props?.details?.paymentMethod,
        requirements = props?.details?.requirements,
        updatedAt = props?.details?.updatedAt,
        approvalHistory = props?.details?.approvalHistory,
        assignedPersonnel = props?.details?.assignedPersonnel,
        createdAt = props?.details?.createdAt,
        proofOfPayment = props?.details?.proofOfPayment;
    return <Tab.Navigator   >

        {

            tabs.map((tab, index) => {
                const isShow = tab.isShow.indexOf(user?.role?.key) !== -1;
                if (isShow && tab.id === 1) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <BasicInfo
                            paymentMethod={paymentMethod}
                            assignedPersonnel={assignedPersonnel}
                            approvalHistory={approvalHistory}
                            status={props.details.status}
                            paymentHistory={props?.details?.paymentHistory}
                            paymentStatus={props?.details?.paymentStatus}
                            detailsStatus={props?.details?.status}
                            user={user}
                            createdAt={createdAt}
                            applicant={applicant}
                            key={index}/>
                        }
                    </Tab.Screen>
                } else if (isShow && tab.id === 2) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <ApplicationDetails
                            service={service}
                            selectedType={selectedTypes}
                            applicantType={applicationType}
                            key={index}/>}
                    </Tab.Screen>
                } else if (isShow && tab.id === 3) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <Requirement requirements={requirements} key={index}/>}
                    </Tab.Screen>
                } else if (isShow && tab.id === 4) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <Payment proofOfPayment={proofOfPayment}
                                        updatedAt={updatedAt}
                                        paymentMethod={paymentMethod}
                                        applicant={applicant}
                                        totalFee={totalFee}
                                        soa={soa}
                                        key={index}/>}
                    </Tab.Screen>
                }
            })
        }
    </Tab.Navigator>
};

const styles = StyleSheet.create({
    group5: {
        height: fontValue(28)
    },
    rect6: {
        height: fontValue(3),
        marginTop: fontValue(-5)
    },
});