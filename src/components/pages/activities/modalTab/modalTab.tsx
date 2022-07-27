import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import Payment from "@pages/activities/application/paymentModal/payment";
import React, {memo, useEffect, useMemo, useState} from "react";
import {ACCOUNTANT , CASHIER , CHECKER , DIRECTOR , EVALUATOR} from "../../../../reducers/activity/initialstate";
import {
    Text,
    Alert,
    Animated,
    InteractionManager,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
    View, Dimensions, I18nManager
} from "react-native";
import ScrollableTabBar from "@pages/activities/tabs/ScrollableTabBar";
import ScrollableTabView from "@pages/activities/tabs";
import Tab from "@pages/activities/tabs/Tab";
import useApplicant from "@pages/activities/modalTab/useApplicant";
import {infoColor} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {setEditModalVisible} from "../../../../reducers/activity/actions";
import useSafeState from "../../../../hooks/useSafeState";
import {setEdit} from "../../../../reducers/application/actions";
import {Route, TabBar, TabBarIndicator, TabView} from "react-native-tab-view";
import {Bold, Regular} from "@styles/font";
import {GetTabWidth} from "react-native-tab-view/lib/typescript/TabBarIndicator";
import {isTablet} from "react-native-device-info";

const ModalTab = props => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const editModalVisible = useSelector((state: RootStateOrAny) => state.activity.editModalVisible);
    const edit = useSelector((state: RootStateOrAny) => state.application.edit);
    const [_scrollX, set_scrollX] = useState(new Animated.Value(0));
    // 6 is a quantity of tabs
    const [interpolators, setInterpolators] = useState(Array.from({length: 6}, (_, i) => i).map(idx => (
        {
            scale: _scrollX.interpolate({
                inputRange: [idx - 1, idx, idx + 1],
                outputRange: [1, 1.03, 1],
                extrapolate: 'clamp',
            }),

        })));
    const [tabs, setTabs] = useState([
        {
            id: 1,
            title: 'Basic Info',
            key: 'Basic Info',
            active: true,
            isShow: [CHECKER, ACCOUNTANT, CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 2,
            title: 'Application Details',
            key: 'Application Details',
            active: false,
            isShow: [CHECKER, ACCOUNTANT, CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 3,
            title: 'Requirements',
            key: 'Requirements',
            active: false,
            isShow: [CHECKER, DIRECTOR, EVALUATOR]
        },
        {
            id: 4,
            title: 'SOA & Payment',
            key: 'SOA & Payment',
            active: false,
            isShow: [CASHIER, ACCOUNTANT, EVALUATOR]
        },
    ]);
    const loading = useMemo(() => props.loading, [props.loading])

    const {
        schedule,
        applicant,
        selectedTypes,
        applicationType,
        service,
        soa,
        totalFee,
        paymentMethod,
        requirements,
        updatedAt,
        approvalHistory,
        assignedPersonnel,
        createdAt,
        documents,
        proofOfPayment,
        remarks,
        paymentStatus,
        paymentHistory,

    } = useApplicant(props.details)
    const [initialPage, setInitialPage] = useState(true);
    const [paymentIndex, setPaymentIndex] = useSafeState(undefined)
    useEffect(() => {
        dispatch(setEditModalVisible(false))
        setInitialPage(true)
    }, [props.details._id]);
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    useEffect(() => {

        if(paymentIndex == index && !editModalVisible){

            dispatch(setEditModalVisible(true))
        }else if(paymentIndex != index && editModalVisible){

            dispatch(setEdit(false))
            dispatch(setEditModalVisible(false))
        }
    }, [index])
    const routes = useMemo(() => {
        return tabs.filter((tab,_index)=> {
            if(tab.title == 'SOA & Payment'){
                setPaymentIndex(_index)
            }
            return !(service?.serviceCode == "service-22" && tab?.id===4) && tab.isShow.indexOf(user?.role?.key)!== -1
        })
    }, [tabs])
    const renderScene = ({route, jumpTo}) => {
        if(initialPage && Platform?.isPad ){
            jumpTo(0)
            setInitialPage(false)
        }
        switch (route.key) {
            case 'Basic Info':
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
                                  schedule={schedule}
                                  service={service}
                                  paymentMethod={paymentMethod}
                                  assignedPersonnel={assignedPersonnel}
                                  approvalHistory={approvalHistory}
                                  status={props.details.status}
                                  paymentHistory={props?.details?.paymentHistory}
                                  paymentStatus={props?.details?.paymentStatus}
                                  detailsStatus={props?.details?.status}
                                  user={user}
                                  remarks={remarks}
                                  createdAt={createdAt}
                                  applicant={applicant}
                                  key={index}/>;

            case 'Application Details':
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
                                           createdAt={createdAt}
                                           service={service}
                                           documents={documents}
                                           selectedType={selectedTypes}
                                           applicantType={applicationType}
                                           key={index}/>;
            case 'Requirements':
                return <Requirement saved={props.saved}
                                    requirements={requirements}
                                    key={index}/>
            case 'SOA & Payment':
                return <Payment
                                setPaymentIndex={setPaymentIndex}
                                saved={props.saved}
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
                                proofOfPayment={proofOfPayment}
                                updatedAt={updatedAt}
                                paymentHistory={paymentHistory}
                                paymentMethod={paymentMethod}
                                applicant={applicant}
                                totalFee={totalFee}
                                soa={soa}
                                key={index}/>
            default:
                return null;
        }


    };
const  getTranslateX = (
        position: Animated.AnimatedInterpolation,
        routes: Route[],
        getTabWidth: GetTabWidth
    ) => {
        const inputRange = routes.map((_, i) => i);

        // every index contains widths at all previous indices
        const outputRange = routes.reduce<number[]>((acc, _, i) => {
            if (i === 0) return [0];
            return [...acc, acc[i - 1] + getTabWidth(i - 1)];
        }, []);

        const translateX = position.interpolate({
            inputRange,
            outputRange,
            extrapolate: 'clamp',
        });

        return Animated.multiply(translateX, I18nManager.isRTL ? -1 : 1);
    };
    return <TabView

        style={{borderTopColor: 'rgba(0, 0, 0, 0.1)',
            borderTopWidth: 1,}}
        renderTabBar={props => (
            <TabBar

                renderLabel={({route, focused}) => {
                    return (
                        <View  >
                            <Text style={ {
                                color : focused ? infoColor : "#606A80" ,
                                fontFamily : Regular , // focused ? Bold : Regular
                                fontSize : fontValue(12)
                            } }>{  route.title }</Text>
                        </View>
                    );
                }}
                {...props}
                renderIndicator={indicatorProps => {
                    const {
                        navigationState: {routes},
                        getTabWidth,
                        position,
                    } = indicatorProps;
                    /*const translateX =
                        routes.length > 1 ? getTranslateX( position, routes, getTabWidth) : 0;

                    ;*/
                    const indicatorStyle = {
                       // transform: [{translateX}] as any,
                        height: 4,
                        backgroundColor: infoColor,
                        borderRadius: 4,
                        padding: 0,
                        left: 24 / 2,
                    }
                    const width = getTabWidth(index) - 24
                    return <TabBarIndicator {...indicatorProps} width={width}
                                             style={indicatorStyle}
                    />;
                }}

                tabStyle={{width: fontValue(136)}}
                scrollEnabled={true}
                style={{  backgroundColor: 'white' }}
            />
        )}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
    />
}



export default memo(ModalTab)




/*
 <ScrollableTabView
        onChangeTab={(props)=>{
            if(paymentIndex == props.i && !editModalVisible){

                dispatch(setEditModalVisible(true))
            }else if(paymentIndex != props.i && editModalVisible){

                dispatch(setEdit(false))
                dispatch(setEditModalVisible(false))
            }


        }
        }
        renderTabBar={ (props) => {
            if(initialPage && Platform?.isPad ){
                props?.goToPage(0);
                setInitialPage(false)
            }
            //console.log(editModalVisible, edit, loading)

            return <CustomTabBar tabNames={[]}/>
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

                    return <Payment paymentIndex={index}
                                    setPaymentIndex={setPaymentIndex}
                                    saved={props.saved}
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
*/