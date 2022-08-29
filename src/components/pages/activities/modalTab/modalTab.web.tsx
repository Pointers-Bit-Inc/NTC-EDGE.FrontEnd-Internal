import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import React, {memo, useEffect, useState} from "react";
import {ACCOUNTANT,CASHIER,CHECKER,DIRECTOR,EVALUATOR} from "../../../../reducers/activity/initialstate";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Regular,Regular500} from "@styles/font";
import {ViewPaged} from 'react-scroll-paged-view'
import TabBar from 'react-underline-tabbar'
import BasicInfoWebIcon from "@assets/svg/basicInfoWebIcon";
import ApplicationDetailWebIcon from "@assets/svg/applicationDetailWebIcon";
import RequirementWebIcon from "@assets/svg/requirementWebIcon";
import SoaPaymentWebIcon from "@assets/svg/soaPaymentWebIcon";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import Payment from "@pages/activities/application/paymentModal/payment";
import {getRole} from "@pages/activities/script";
import {Hoverable} from "react-native-web-hooks";
import CloseIcon from "@assets/svg/close";
import useApplicant from "@pages/activities/modalTab/useApplicant";
import hairlineWidth=StyleSheet.hairlineWidth;
import EditIcon from "@assets/svg/editIcon";
import {infoColor} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import LoadingModal from "@pages/activities/loading/loadingModal";
import useSafeState from "../../../../hooks/useSafeState";
import {setEditModalVisible} from "../../../../reducers/activity/actions";
import {setEdit} from "../../../../reducers/application/actions";


const ModalTab=props=>{
    const dispatch=useDispatch();
    const editModalVisible = useSelector((state: RootStateOrAny) => state.activity.editModalVisible);
    const user=useSelector((state:RootStateOrAny)=>state.user);

    const [tabs,setTabs]=useState([
        {
            id:1,
            name:'Basic Info',
            active:true,
            isShow:[CHECKER,ACCOUNTANT,CASHIER,DIRECTOR,EVALUATOR],
            label:<View style={[styles.tabItem,{gap:5}]}><BasicInfoWebIcon/>
                <Text style={styles.tabTextItem}>Basic Info</Text>
            </View>
        },
        {
            id:2,
            name:'Application Details',
            active:false,
            isShow:[CHECKER,ACCOUNTANT,CASHIER,DIRECTOR,EVALUATOR],
            label:<View style={[styles.tabItem,{gap:5}]}><ApplicationDetailWebIcon/><Text
                style={styles.tabTextItem}> Application Details</Text></View>
        },
        {
            id:3,
            name:'Requirements',
            active:false,
            isShow:[CHECKER,DIRECTOR,EVALUATOR],
            label:<View style={[styles.tabItem,{gap:5}]}><RequirementWebIcon/><Text
                style={styles.tabTextItem}> Requirements</Text></View>
        },
        {
            id:4,
            name:'SOA & Payment',
            active:false,
            isShow:[CASHIER,ACCOUNTANT, EVALUATOR],
            label:<View style={[styles.tabItem,{gap:5}]}><SoaPaymentWebIcon/><Text
                style={styles.tabTextItem}> SOA & Payment</Text></View>
        },
    ]);
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
        proofOfPayment,
        documents,
        remarks,
        paymentHistory,
        paymentStatus,
    }=useApplicant(props.details);
    const [paymentIndex, setPaymentIndex] = useSafeState()
    const [initialPage,setInitialPage]=useState(true);
    const [basicInfoIndex, setBasicInfoIndex] = useSafeState(undefined)
    useEffect(()=>{
        dispatch(setEditModalVisible(true))
        setInitialPage(true)
    },[props.details._id]);
    const [isMore, setIsMore] = useSafeState(true)
    const [yPos, setYPos] = useSafeState(undefined)
    return <>
        {props.loading && <LoadingModal saved={props?.saved} loading={props.loading}/>}
        <ViewPaged

            onChange={(pageIndex)=>{
                if(paymentIndex == pageIndex && !editModalVisible && user?.role?.key != CASHIER){
                    props?.setTabName("SOA & Payment")
                    dispatch(setEditModalVisible(true))
                }else if(basicInfoIndex == pageIndex && !editModalVisible && user?.role?.key != CASHIER){
                    props?.setTabName('Basic Info')
                    dispatch(setEditModalVisible(true))
                }else if(basicInfoIndex != pageIndex && paymentIndex != pageIndex && editModalVisible){
                    dispatch(setEdit(false))
                    dispatch(setEditModalVisible(false))
                }
            }
            }
            isMovingRender
            render
            vertical={false}
            renderPosition='top'
            renderHeader={(params)=>{
                if(initialPage){
                    params.goToPage(0);
                    setInitialPage(false)
                }

                const _tabs=[...tabs];

                _tabs[0].label=
                    <View style={[styles.tabItem,{gap:5}]}><BasicInfoWebIcon/><Text style={[styles.tabTextItem]}>Basic
                        Info</Text></View>;
                _tabs[1].label=<View style={[styles.tabItem,{gap:5}]}><ApplicationDetailWebIcon/><Text
                    style={[styles.tabTextItem]}>Application Details</Text></View>;
                _tabs[2].label=<View style={[styles.tabItem,{gap:5}]}><RequirementWebIcon/><Text
                    style={[styles.tabTextItem]}>Requirements</Text></View>;
                _tabs[3].label=<View style={[styles.tabItem,{gap:5}]}><SoaPaymentWebIcon/><Text
                    style={[styles.tabTextItem]}> SOA & Payment</Text></View>;
                if(params.activeTab==0){
                    _tabs.find(a=>a.id==1).label=
                        <View style={[styles.tabItem,{gap:5}]}><BasicInfoWebIcon fill={"#2863D6"}/><Text
                            style={[styles.tabTextItem,styles.tabSelected]}>Basic Info</Text></View>
                }
                if(params.activeTab==1){
                    _tabs.find(a=>a.id==2).label=
                        <View style={[styles.tabItem,{gap:5}]}><ApplicationDetailWebIcon fill={"#2863D6"}/><Text
                            style={[styles.tabTextItem,styles.tabSelected]}>Application Details</Text></View>
                }
                if(params.activeTab==2){
                    if(getRole(user,[ACCOUNTANT,CASHIER])){
                        _tabs.find(a=>a.id==4).label=
                            <View style={[styles.tabItem,{gap:5}]}><SoaPaymentWebIcon fill={"#2863D6"}/><Text
                                style={[styles.tabTextItem,styles.tabSelected]}> SOA & Payment</Text></View>
                    } else{
                        _tabs.find(a=>a.id==3).label=
                            <View style={[styles.tabItem,{gap:5}]}><RequirementWebIcon fill={"#2863D6"}/><Text
                                style={[styles.tabTextItem,styles.tabSelected]}>Requirements</Text></View>
                    }
                }

                function renderTab({onPress,onLayout,tab:{label}}){
                    return (

                        <TouchableOpacity onPress={onPress}>
                            <Hoverable>
                                {isHovered=>(
                                    <View style={{
                                        backgroundColor:isHovered ? "#DFE5F1" : undefined,
                                        paddingVertical:25
                                    }}>
                                        <Text>{label}</Text>
                                    </View>
                                )}
                            </Hoverable>

                        </TouchableOpacity>

                    )
                }

                return (
                    <View style={{
                        borderBottomWidth:hairlineWidth,
                        borderBottomColor:"#d2d2d2",

                        flexDirection:"row",
                        alignItems:"center",
                        justifyContent:"center",
                        backgroundColor:"#fff"
                    }}>

                        <TabBar
                            style={{borderBottomWidth:0,borderBottomColor:"transparent",width:"100%"}}
                            renderTab={renderTab}
                            scrollViewStyle={{paddingLeft:60,flex:1,justifyContent:"flex-start",gap:35}}
                            underlineStyle={{backgroundColor:"#2863D6",paddingHorizontal:25,height:7}}
                            tabs={tabs.filter((tab,index)=> !(service?.serviceCode == "service-22" && tab?.id===4) && tab.isShow.indexOf(user?.role?.key)!== -1)}
                            {...params}
                            vertical={false}
                        />

                        {props.edit ? <TouchableOpacity  onPress={() => {
                                props.updateApplication(() => {})
                            }
                            }>
                                {props.loading ? <ActivityIndicator color={infoColor}/> :
                                    <Text style={styles.action}>Save</Text>}
                                {/* <EditIcon color="#606A80"/>*/}
                            </TouchableOpacity>

                            : editModalVisible ?
                            <TouchableOpacity onPress={props.editBtn}>
                                <Text style={styles.action}>Edit</Text>
                            </TouchableOpacity> : <></>}
                        <View style={{paddingVertical:29.5,paddingHorizontal:25}}>
                            <TouchableOpacity onPress={props.dismissed}>
                                <CloseIcon width={12} height={12}/>
                            </TouchableOpacity>

                        </View>


                    </View>

                )
            }}
        >
            {

                tabs.filter((tab,_index)=> {
                    return !(service?.serviceCode == "service-22" && tab?.id===4) && tab.isShow.indexOf(user?.role?.key)!== -1
                }).map((tab,index)=>{
                    const isShow=tab.isShow.indexOf(user?.role?.key)!== -1;
                    if(isShow&&tab.id===1){


                        return <BasicInfo basicInfoIndex={index}  setBasicInfoIndex={setBasicInfoIndex}    isMore={isMore} setIsMore={setIsMore} yPos={yPos} setYPos={setYPos} saved={props.saved} loading={props.loading}
                                          setEditAlert={props.setEditAlert}
                                          editBtn={props.editBtn}
                                          updateApplication={props.updateApplication}
                                          setEdit={props.setEdit}
                                          hasChanges={props.hasChanges}
                                          id={props.details?._id}
                                          edit={props.edit}
                                          tabLabel={{label:tab.name}} label={tab.name}
                                          paymentMethod={paymentMethod}
                                          service={ service }
                                          schedule={ schedule }
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
                                          key={index}/>
                    } else if(isShow&&tab.id===2){

                        return <ApplicationDetails saved={props.saved} loading={props.loading}
                                                   edit={props.edit}
                                                   setEditAlert={props.setEditAlert}
                                                   editBtn={props.editBtn}
                                                   updateApplication={props.updateApplication}
                                                   hasChanges={props.hasChanges}
                                                   tabLabel={{label:tab.name}} label={tab.name}
                                                   service={service}
                                                   documents={documents}
                                                   selectedType={selectedTypes}
                                                   applicantType={applicationType}
                                                   key={index}/>
                    } else if(isShow&&tab.id===3){
                        return <Requirement saved={props.saved} loading={props.loading}  tabLabel={{label:tab.name}} label={tab.name}
                                            requirements={requirements} key={index}/>
                    } else if(isShow&&tab.id===4 && service?.serviceCode !== "service-22" ){
                        return <Payment paymentIndex={index}  setPaymentIndex={setPaymentIndex} saved={props.saved} loading={props.loading} edit={props.edit}
                                        setEditAlert={props.setEditAlert}
                                        officialReceipt={props.officialReceipt}
                                        editBtn={props.editBtn}
                                        updateApplication={props.updateApplication}
                                        hasChanges={props.hasChanges}
                                        tabLabel={{label:tab.name}} label={tab.name}
                                        proofOfPayment={proofOfPayment}
                                        paymentStatus={paymentStatus}
                                        updatedAt={updatedAt}
                                        paymentMethod={paymentMethod}
                                        applicant={applicant}
                                        totalFee={totalFee}
                                        soa={soa}
                                        paymentHistory={paymentHistory}
                                        key={index}/>
                    }
                })
            }
        </ViewPaged>
    </>


};
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
        fontSize:16,
    },
    rect6:{
        height:3,
        marginTop:-5
    }, action: {paddingHorizontal: 6,fontFamily: Regular, fontSize: fontValue(16), color: infoColor}

});
