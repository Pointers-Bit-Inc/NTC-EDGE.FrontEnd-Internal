import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import Payment from "@pages/activities/application/paymentModal/payment";
import React, {memo, useEffect, useState} from "react";
import {ACCOUNTANT , CASHIER , CHECKER , DIRECTOR , EVALUATOR} from "../../../../reducers/activity/initialstate";
import {Alert, Animated, InteractionManager, KeyboardAvoidingView, Platform, View} from "react-native";
import TabBar from "@pages/activities/tabs/tabbar";
import ScrollableTabView from "@pages/activities/tabs";
import Tab from "@pages/activities/tabs/Tab";
import useApplicant from "@pages/activities/modalTab/useApplicant";
import {infoColor} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {setEditModalVisible} from "../../../../reducers/activity/actions";
import useSafeState from "../../../../hooks/useSafeState";

const ModalTab = props => {
    const dispatch=useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const editModalVisible = useSelector((state: RootStateOrAny) => state.activity.editModalVisible);
    const [_scrollX , set_scrollX] = useState(new Animated.Value(0));
    // 6 is a quantity of tabs
    const [interpolators , setInterpolators] = useState(Array.from({ length : 6 } , (_ , i) => i).map(idx => (
        {
            scale : _scrollX.interpolate({
                inputRange : [idx - 1 , idx , idx + 1] ,
                outputRange : [1 , 1.03 , 1] ,
                extrapolate : 'clamp' ,
            }) ,

        })));
    const [tabs , setTabs] = useState([
        {
            id : 1 ,
            name : 'Basic Info' ,
            active : true ,
            isShow : [CHECKER , ACCOUNTANT , CASHIER , DIRECTOR , EVALUATOR]
        } ,
        {
            id : 2 ,
            name : 'Application Details' ,
            active : false ,
            isShow : [CHECKER , ACCOUNTANT , CASHIER , DIRECTOR , EVALUATOR]
        } ,
        {
            id : 3 ,
            name : 'Requirements' ,
            active : false ,
            isShow : [CHECKER , DIRECTOR , EVALUATOR]
        } ,
        {
            id : 4 ,
            name : 'SOA & Payment' ,
            active : false ,
            isShow : [CASHIER , ACCOUNTANT,EVALUATOR]
        } ,
    ]);


    const {
        schedule,
        applicant ,
        selectedTypes ,
        applicationType ,
        service ,
        soa ,
        totalFee ,
        paymentMethod ,
        requirements ,
        updatedAt ,
        approvalHistory ,
        assignedPersonnel ,
        createdAt ,
        documents,
        proofOfPayment,
        remarks,
        paymentStatus,
        paymentHistory
    } = useApplicant(props.details)
    const [initialPage,setInitialPage]=useState(true);
    const [paymentIndex, setPaymentIndex] = useSafeState()
    useEffect(()=>{
        dispatch(setEditModalVisible(false))
        setInitialPage(true)
    },[props.details._id]);
    return <ScrollableTabView
        onChangeTab={(props)=>{
            if(paymentIndex == props.i && !editModalVisible){
                dispatch(setEditModalVisible(true))
            }else if(paymentIndex != props.i && editModalVisible){
                dispatch(setEditModalVisible(false))
            }
        }
        }
        renderTabBar={ (props) => {
            if(initialPage && Platform?.isPad ){
                props?.goToPage(0);
                setInitialPage(false)
            }
            return <TabBar
                underlineColor={infoColor}
                underlineHeight={fontValue(3)}
                renderTab={ (tab , page , isTabActive , onPressHandler , onTabLayout) => (
                    <Tab
                        key={ page }
                        tab={ tab }
                        page={ page }
                        isTabActive={ isTabActive }
                        onPressHandler={ onPressHandler }
                        onTabLayout={ onTabLayout }
                        styles={ interpolators[page] }
                    />
                ) }
                tabBarStyle={ { paddingTop : 10 , borderTopColor : '#d2d2d2' , borderTopWidth : 1 } }/>
        } }

    >

        {

            tabs.map((tab , index) => {
                const isShow = tab.isShow.indexOf(user?.role?.key) !== -1;
                if (isShow && tab.id === 1) {
                    return <BasicInfo saved={props.saved}
                        loading={props.loading}
                        setEditAlert={props.setEditAlert}
                        editBtn={props.editBtn}
                        updateApplication={props.updateApplication}
                        setUserOriginalProfileForm={props.setUserOriginalProfileForm}
                        userOriginalProfileForm={props.userOriginalProfileForm}
                        userProfileForm={props.userProfileForm}
                        hasChanges={props.hasChanges}
                        setUserProfileForm={props.setUserProfileForm}
                        id={props.details?._id}
                        edit={props.edit}
                        setEdit={props.setEdit}
                        schedule={ schedule }
                        service={ service }
                        tabLabel={ { label : tab.name } }
                        label={ tab.name }
                        paymentMethod={ paymentMethod }
                        assignedPersonnel={ assignedPersonnel }
                        approvalHistory={ approvalHistory }
                        status={ props.details.status }
                        paymentHistory={ props?.details?.paymentHistory }
                        paymentStatus={ props?.details?.paymentStatus }
                        detailsStatus={ props?.details?.status }
                        user={ user }
                        remarks={remarks}
                        createdAt={ createdAt }
                        applicant={ applicant }
                        key={ index }/>
                } else if (isShow && tab.id === 2) {
                    return <ApplicationDetails saved={props.saved}
                        loading={props.loading}
                        edit={props.edit}
                        setEditAlert={props.setEditAlert}
                        editBtn={props.editBtn}
                        updateApplication={props.updateApplication}
                        setUserOriginalProfileForm={props.setUserOriginalProfileForm}
                        userOriginalProfileForm={props.userOriginalProfileForm}
                        userProfileForm={props.userProfileForm}
                        hasChanges={props.hasChanges}
                        setUserProfileForm={props.setUserProfileForm}
                        paymentStatus={paymentStatus}
                        tabLabel={ { label : tab.name } }
                        label={ tab.name }
                        createdAt={createdAt}
                        service={ service }
                        documents={documents}
                        selectedType={ selectedTypes }
                        applicantType={ applicationType }
                        key={ index }/>
                } else if (isShow && tab.id === 3) {
                    return <Requirement saved={props.saved} tabLabel={ { label : tab.name } }
                                        label={ tab.name }
                                        requirements={ requirements }
                                        key={ index }/>
                } else if (isShow && tab.id === 4  && service?.serviceCode !== "service-22" ) {

                    return <Payment paymentIndex={index}  setPaymentIndex={setPaymentIndex} saved={props.saved} loading={props.loading} edit={props.edit}
                                    setEditAlert={props.setEditAlert}
                                    editBtn={props.editBtn}
                                    updateApplication={props.updateApplication}
                                    setUserOriginalProfileForm={props.setUserOriginalProfileForm}
                                    userOriginalProfileForm={props.userOriginalProfileForm}
                                    userProfileForm={props.userProfileForm}
                                    hasChanges={props.hasChanges}
                                    setUserProfileForm={props.setUserProfileForm}
                                    tabLabel={ { label : tab.name } }
                                    label={ tab.name }
                                    paymentStatus={paymentStatus}
                                    proofOfPayment={ proofOfPayment }
                                    updatedAt={ updatedAt }
                                    paymentHistory={paymentHistory}
                                    paymentMethod={ paymentMethod }
                                    applicant={ applicant }
                                    totalFee={ totalFee }
                                    soa={ soa }
                                    key={ index }/>
                }
            })
        }

    </ScrollableTabView>

};

export default memo(ModalTab)
