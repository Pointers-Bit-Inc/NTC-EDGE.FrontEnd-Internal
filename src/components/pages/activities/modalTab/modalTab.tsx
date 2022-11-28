import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import Payment from "@pages/activities/application/paymentModal/payment";
import React, {memo, useEffect, useMemo, useState} from "react";
import {
    ACCOUNTANT,
    CASHIER,
    CHECKER,
    DIRECTOR,
    EVALUATOR,
    FOREVALUATION
} from "../../../../reducers/activity/initialstate";
import {
    ActivityIndicator,
    Animated,
    I18nManager,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import useApplicant from "@pages/activities/modalTab/useApplicant";
import {infoColor} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import {setEditModalVisible, setFeedVisible, setTabName} from "../../../../reducers/activity/actions";
import useSafeState from "../../../../hooks/useSafeState";
import {setEdit, setSceneIndex} from "../../../../reducers/application/actions";
import {Route, TabBar, TabBarIndicator, TabView} from "react-native-tab-view";
import {Regular, Regular500} from "@styles/font";
import {GetTabWidth} from "react-native-tab-view/lib/typescript/TabBarIndicator";
import SplitIcon from "@assets/svg/SplitIcon";
import hairlineWidth = StyleSheet.hairlineWidth;
import CloseIcon from "@assets/svg/close";
import BasicInfoWebIcon from "@assets/svg/basicInfoWebIcon";
import ApplicationDetailWebIcon from "@assets/svg/applicationDetailWebIcon";
import RequirementWebIcon from "@assets/svg/requirementWebIcon";
import SoaPaymentWebIcon from "@assets/svg/soaPaymentWebIcon";
import {isMobile} from "@pages/activities/isMobile";

const ModalTab = props => {
    const dispatch = useDispatch();
    const applicationItem = useSelector((state: RootStateOrAny) =>  state.application?.applicationItem)
    const user = useSelector((state: RootStateOrAny) => state.user);
    const editModalVisible = useSelector((state: RootStateOrAny) => state.activity.editModalVisible);
    const tabName = useSelector((state: RootStateOrAny) => state.activity.tabName);
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
    const [basicInfoIndex, setBasicInfoIndex] = useSafeState(undefined)
    const [applicationDetailIndex, setApplicationDetailIndex] = useSafeState(undefined)
    const [index, setIndex] = React.useState(([DIRECTOR, ACCOUNTANT, CASHIER].indexOf(user?.role?.key) != -1) && service?.serviceCode != "service-22"  ? 2 : 0);

    useEffect(() => {
        setInitialPage(true)
        setIndex(([DIRECTOR, ACCOUNTANT, CASHIER].indexOf(user?.role?.key) != -1) && service?.serviceCode != "service-22" ? 2 : 0)
    }, [props.details._id, initialPage, tabs,  service, ]);
    const layout = useWindowDimensions();



    const routes = useMemo(() => {
        if([DIRECTOR, ACCOUNTANT, CASHIER].indexOf(user?.role?.key) != -1){
            setIndex(([DIRECTOR, ACCOUNTANT, CASHIER].indexOf(user?.role?.key) != -1) && service?.serviceCode != "service-22" ? 2 : 0)
        }

        return tabs.filter((tab, _index) => {
            return !(service?.applicationType?.isDirectProcess == true && service?.serviceCode == "service-22" && tab?.id === 4) && tab.isShow.indexOf(user?.role?.key) !== -1
        }).map((__tab, __index) => {
            if (__tab.title == 'SOA & Payment') {
                setPaymentIndex(__index)
            }
            if (__tab.title == 'Application Details') {
                setApplicationDetailIndex(__index)
            }
            if (__tab.title == 'Basic Info') {
                setBasicInfoIndex(__index)
            }
            return __tab
        })


    }, [tabs, paymentIndex, applicationDetailIndex, basicInfoIndex, service, props.details?._id, index])
    useEffect(() => {
        console.log(basicInfoIndex , index,applicationDetailIndex )
        dispatch(setEditModalVisible(false))
        if (paymentIndex == index  && !(user?.role?.key==CASHIER || user?.role?.key==ACCOUNTANT)) {
            console.log("setEditModalVisible", true)
            dispatch(setTabName("SOA & Payment"))
            dispatch(setEditModalVisible(true))
        } else if ((basicInfoIndex == index || applicationDetailIndex == index ) && !(user?.role?.key==CASHIER || user?.role?.key==ACCOUNTANT)) {

            dispatch(setTabName('Basic Info'))
            dispatch(setEditModalVisible(true))
        } else if (basicInfoIndex != index && paymentIndex != index && applicationDetailIndex != index ) {
            console.log("setEditModalVisible", false)
            dispatch(setEdit(false))
            dispatch(setEditModalVisible(false))
        }


    }, [tabs, paymentIndex, applicationDetailIndex, basicInfoIndex, service, props.details?._id, index])
    const [isMore, setIsMore] = useSafeState(true)
    const [yPos, setYPos] = useSafeState(undefined)
    const renderScene = useMemo(() => {
        return ({route, jumpTo}) => {
            if (initialPage && Platform?.isPad) {
                jumpTo(([ACCOUNTANT, CASHIER]?.indexOf(user?.role?.key) != -1) && service?.serviceCode != "service-22"   ? 2 : 0)
                setInitialPage(false)
            }


            switch (route.key) {
                case 'Basic Info':
                    return <BasicInfo isMore={isMore} setIsMore={setIsMore} saved={props.saved}
                                      yPos={yPos} setYPos={setYPos}
                                      loading={props.loading}
                                      setEditAlert={props.setEditAlert}
                                      editBtn={props.editBtn}
                                      updateApplication={props.updateApplication}
                                      hasChanges={props.hasChanges}
                                      id={props.details?._id}
                                      edit={props.edit}
                                      setEdit={props.setEdit}
                                      schedule={schedule}
                                      service={service}
                                      paymentMethod={paymentMethod}
                                      assignedPersonnel={assignedPersonnel}
                                      approvalHistory={approvalHistory}
                                      status={props.details.status}
                                      or={props?.details?.officialReceipt}
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
                                               hasChanges={props.hasChanges}
                                               or={props?.details?.officialReceipt}
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
                        applicationTypeLabel={service?.applicationType?.label}
                        id={ props.details?._id}
                        amnesty={props.details.amnesty}
                        serviceCode={service?.serviceCode}
                        setPaymentIndex={setPaymentIndex}
                        saved={props.saved}
                        loading={props.loading}
                        edit={props.edit}
                        setEditAlert={props.setEditAlert}
                        editBtn={props.editBtn}
                        updateApplication={props.updateApplication}
                        hasChanges={props.hasChanges}
                        officialReceipt={props.officialReceipt}
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


        }
    }, [
        props.saved,
        props.loading,
        props.edit,
        index, props.details?._id
    ]);
    const getTranslateX = (
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

    const renderIndicator = indicatorProps => {
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
                height: Platform.OS == "web" ? 7 : 5,
                backgroundColor: infoColor,
                borderRadius: 0,
                padding: 0,

                //left: 24 / 2,
                ...Platform.select({
                    web: {marginBottom:  -15 }
                }),
        }

        return <TabBarIndicator   {...indicatorProps}
                                  style={indicatorStyle}
        />;
    }

    function tabIcon(title, focused) {
        if (title == 'Basic Info') {
            return <BasicInfoWebIcon fill={focused ? "#2863D6" : ""}/>
        } else if (title == "Application Details") {
            return <ApplicationDetailWebIcon fill={focused ? "#2863D6" : ""}/>
        } else if (title == 'Requirements') {
            return <RequirementWebIcon fill={focused ? "#2863D6" : ""}/>
        } else if (title == 'SOA & Payment') {
            return <SoaPaymentWebIcon fill={focused ? "#2863D6" : ""}/>
        }


    }



    const feedVisible = useSelector((state: RootStateOrAny) => state.activity.feedVisible);
    const renderTabBar = (tabProp) =>{
        return isMobile ?  <TabBar
            renderLabel={({route, focused}) => {
                return (
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        { isMobile ? <></> :
                            <View style={{paddingRight: 10}}>
                                {tabIcon(route.title, focused)}
                            </View>
                        }
                        <Text allowFontScaling={false} numberOfLines={Platform.OS == "windows" ? 1 : undefined} style={{
                            color: focused ? infoColor : "#606A80",
                            fontFamily: Regular, // focused ? Bold : Regular
                            fontSize: fontValue(14)
                        }}>{route.title}</Text>
                    </View>
                );
            }}
            {...tabProp}
            indicatorStyle={{ backgroundColor: 'white' }}
            renderIndicator={renderIndicator}
            tabStyle={{width: fontValue(180)}}
            scrollEnabled={true}
            style={[{backgroundColor: 'white'}, isMobile ? {} :{shadowOpacity: 0.0, }]}
        />  :  <View style={{
            borderBottomWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomColor: "#d2d2d2", width: "100%",
            backgroundColor: "#fff"
        }}>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{paddingVertical: 29.5, paddingHorizontal: 10}}>
                    <TouchableOpacity onPress={() => {
                        dispatch(setFeedVisible(!feedVisible))
                    }}>
                        <SplitIcon active={!feedVisible}  width={18} height={18} color={!feedVisible ? "#2863D6" : "#A0A3BD" }/>
                    </TouchableOpacity>

                </View>
                <TabBar

                    renderLabel={({route, focused}) => {
                        return (
                            <View style={{flexDirection: "row", alignItems: "center", }}>
                                <View style={{paddingRight: 10}}>
                                    {tabIcon(route.title, focused)}
                                </View>
                                <Text style={{
                                    color: focused ? infoColor : "#606A80",
                                    fontFamily: Regular, // focused ? Bold : Regular
                                    fontSize: fontValue(12)
                                }}>{route.title}</Text>
                            </View>
                        );
                    }}
                    {...tabProp}
                    renderIndicator={renderIndicator}
                   tabStyle={{width: "auto",paddingHorizontal: 10 }}
                    scrollEnabled={true}

                    style={{shadowOpacity: 0.0, backgroundColor: 'white'}}
                />

            </View>
            { (((applicationItem?.assignedPersonnel?._id == user?._id) || (applicationItem?.assignedPersonnel?.length > 0  ? applicationItem?.assignedPersonnel?.findIndex( assignment => assignment?._id == user?._id) != -1 : false) )  && (applicationItem?.approvalHistory?.action == FOREVALUATION || applicationItem?.approvalHistory?.[0]?.action == FOREVALUATION ))  ?
                <View style={{flexDirection: "row", alignItems: "center",}}>
                    {props.edit ? <TouchableOpacity onPress={() => {
                            props.updateApplication(() => {
                            })
                            console.log("edit updateApplication")
                        }
                        }>
                            {props.loading ? <ActivityIndicator color={infoColor}/> :
                                <Text style={styles.action}>Save</Text>}
                            {/* <EditIcon color="#606A80"/>*/}
                        </TouchableOpacity>

                        : editModalVisible ?

                            <TouchableOpacity onPress={() => {
                                if (paymentIndex == index) {
                                    props.editBtn()
                                } else {
                                    dispatch(setSceneIndex(1))
                                }

                            }
                            }>
                                <Text style={styles.action}>Edit</Text>
                            </TouchableOpacity> :
                            <View style={{opacity: "0%"}}> <Text style={styles.action}>Edit</Text></View>}
                    <View style={{paddingVertical: 29.5, paddingHorizontal: 10}}>
                        <TouchableOpacity onPress={() => {
                            dispatch(setFeedVisible(true))
                            props.dismissed()
                        }}>
                            <CloseIcon width={12} height={12}/>
                        </TouchableOpacity>

                    </View>
                </View>
            : <></>}
        </View>
    }

    return <TabView

        style={{
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            borderTopWidth: 1,
        }}
        renderTabBar={renderTabBar}

        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
    />
}


export default memo(ModalTab)
const styles=StyleSheet.create({
    tabSelected:{
        color:"#2863D6",
        fontFamily:Regular500,
        fontWeight:"500",
        lineHeight:24,
        textAlign:"center"
    },
    tabItem:{
        flexDirection:"row",alignItems:"center"
    },
    tabTextItem:{
        color:"#A0A3BD",
        lineHeight:24,
        textAlign:"center",
        fontFamily:Regular,
        fontSize:14,
    },
    rect6:{
        height:3,
        marginTop:-5
    }, action: {paddingHorizontal: 6,fontFamily: Regular, fontSize: fontValue(16), color: infoColor}

});


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
