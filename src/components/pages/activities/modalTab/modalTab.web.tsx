import {RootStateOrAny,useSelector} from "react-redux";
import React,{useEffect,useState} from "react";
import {ACCOUNTANT,CASHIER,CHECKER,DIRECTOR,EVALUATOR} from "../../../../reducers/activity/initialstate";
import {StyleSheet,Text,TouchableOpacity,View} from "react-native";
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


const ModalTab=props=>{
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
            isShow:[CASHIER,ACCOUNTANT],
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
        remarks
    }=useApplicant(props.details);
    const [initialPage,setInitialPage]=useState(true);
    useEffect(()=>{
        setInitialPage(true)
    },[props.details._id]);
    return <ViewPaged

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

            tabs.map((tab,index)=>{
                const isShow=tab.isShow.indexOf(user?.role?.key)!== -1;
                if(isShow&&tab.id===1){


                    return <BasicInfo
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

                    return <ApplicationDetails
                        tabLabel={{label:tab.name}} label={tab.name}
                        service={service}
                        documents={documents}
                        selectedType={selectedTypes}
                        applicantType={applicationType}
                        key={index}/>
                } else if(isShow&&tab.id===3){
                    return <Requirement tabLabel={{label:tab.name}} label={tab.name}
                                        requirements={requirements} key={index}/>
                } else if(isShow&&tab.id===4 && service?.serviceCode !== "service-22" ){
                    return <Payment tabLabel={{label:tab.name}} label={tab.name}
                                    proofOfPayment={proofOfPayment}
                                    updatedAt={updatedAt}
                                    paymentMethod={paymentMethod}
                                    applicant={applicant}
                                    totalFee={totalFee}
                                    soa={soa}
                                    key={index}/>
                }
            })
        }
    </ViewPaged>

};
export default ModalTab
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
    },
});