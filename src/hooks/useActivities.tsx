import React,{createRef,useCallback,useEffect,useMemo,useRef,useState} from "react";
import {useUserRole} from "./useUserRole";
import {RootStateOrAny,useDispatch,useSelector} from "react-redux";
import useSignalr from "./useSignalr";
import {formatDate,getActivityStatus,getFilter,PaymentStatusText,unreadReadApplication} from "@pages/activities/script";
import {
    APPROVED,
    CASHIER,
    DATE_ADDED,
    DECLINED,
    FORAPPROVAL,
    FOREVALUATION,
    FORVERIFICATION,
    PAID,
    PENDING,
    UNVERIFIED,
    VERIFIED
} from "../reducers/activity/initialstate";
import moment from "moment";
import axios from "axios";
import {BASE_URL} from "../services/config";
import {Alert,Animated,FlatList,Image,TouchableOpacity,View} from "react-native";
import {
    handleInfiniteLoad,setactivitySizeComponent,
    setApplications,
    setFilterRect,
    setNotPinnedApplication,
    setPinnedApplication
} from "../reducers/application/actions";
import Loader from "@pages/activities/bottomLoad";
import {useComponentLayout} from "./useComponentLayout";
import lodash from 'lodash';
import {isMobile} from "@pages/activities/isMobile";

function convertStatusText(convertedStatus:any[],item:any){
    let _converted:never[]=[]
    const _status=convertedStatus.map((converted)=>{
        _converted=converted.filter((convert)=>{
            return convert.statusText==item
        })
        return _converted
    })
    const _uniqByStatus=lodash.uniqBy(_converted,'status').map((item)=>item.status)
    return _uniqByStatus.length ? _uniqByStatus.toString() : [item].toString()
}

export function useActivities(props){
    const scrollViewRef = useRef()
    const flatListViewRef = useRef()
    const [yPos, setYPos] = useState(0)
    const [total,setTotal]=useState(0);
    const [page,setPage]=useState(0);
    const [size,setSize]=useState(0);
    const {user,cashier,director,evaluator,checker,accountant}=useUserRole();
    const [updateModal,setUpdateModal]=useState(false);
      const [onTouch, setOnTouch] = useState(true)
    const config={
        headers:{
            Authorization:"Bearer ".concat(user?.sessionToken)
        }
    };


    const {selectedChangeStatus,visible}=useSelector((state:RootStateOrAny)=>state.activity);
    const {
        pinnedApplications,
        notPinnedApplications,
        applicationItem,
        selectedYPos
    }=useSelector((state:RootStateOrAny)=>{
        return state.application
    });
    React.useEffect(() => {
        if(!isMobile) {
           props?.navigation?.addListener('focus', () => {
                if(selectedYPos?.yPos != undefined  ){
                    if(selectedYPos.type){
                        flatListViewRef?.current?.scrollToOffset({ offset:  0 , animated: true });
                        scrollViewRef?.current?.scrollTo({ y: selectedYPos.type ? selectedYPos?.yPos : 0, animated: true });
                    }else{
                        flatListViewRef?.current?.scrollToOffset({ offset: selectedYPos.type ? 0 :selectedYPos?.yPos + 30, animated: true });
                    }
                }
            });
        }
        return {

        }

    }, [props?.navigation, selectedYPos]);
    const dispatch=useDispatch();
    const {getActiveMeetingList,endMeeting,leaveMeeting}=useSignalr();

    function getList(list:any,selectedClone){
        return getFilter({
            list:list,
            user:user,
            selectedClone:selectedClone,
            cashier:cashier,
            director:director,
            checker:checker,
            evaluator:evaluator,
            accountant:accountant
        });
    }

    const ispinnedApplications=(applications:any)=>{
        setTotalPages(Math.ceil(applications?.length/10));
        const selectedClone=selectedChangeStatus?.filter((status:string)=>{
            return status!=DATE_ADDED
        });


        

        const list=getList(applications,selectedClone);
        const groups=list?.reduce((groups:any,activity:any)=>{

            if((
                activity.assignedPersonnel?._id||activity.assignedPersonnel)==user?._id){
                //  isPinned++


            }



            if(!groups[moment(activity.createdAt).format("YYYY-MM-DD")]){
                groups[moment(activity.createdAt).format("YYYY-MM-DD")]=[];
            }

            groups[moment(activity.createdAt).format("YYYY-MM-DD")].push(activity);
            return groups;
        },{});

        const groupArrays=Object.keys(groups).map((date)=>{
            return {
                date,
                readableHuman:moment([date]).fromNow(),
                activity:groups[date],
            };
        });

        let a=[],b=[];
        for(let i=0; i<groupArrays.length; i++){
            for(let j=0; j<groupArrays[i].activity.length; j++){
                b.push(0)
            }
            a.push({parentIndex:0,child:b});

        }
        if(a){
            setNumberCollapsed(a)
        }
        return groupArrays.slice(0,currentPage*25);
    };
    
    const [updateUnReadReadApplication,setUpdateUnReadReadApplication]=useState(false);
    const [searchTerm,setSearchTerm]=useState('');
    const [countRefresh,setCountRefresh]=useState(0);
    const [refreshing,setRefreshing]=React.useState(false);
    const onRefresh=React.useCallback(()=>{
        setRefreshing(true);
        setCountRefresh(countRefresh+1)
    },[countRefresh]);

    const selectedClone=selectedChangeStatus?.filter((status:string)=>{
        return status!=DATE_ADDED
    });

    const checkDateAdded=selectedChangeStatus?.filter((status:string)=>{
        return status==DATE_ADDED
    });
    const query=()=>{

        const convertedStatus = notPnApplications.map((item)=>{
            return item.activity.map((i)=>{
                const props={activity:i};
                const status=[CASHIER].indexOf(user?.role?.key)!= -1 ? PaymentStatusText(props?.activity?.paymentStatus) : props?.activity?.status;
                const getStatus=getActivityStatus({...props,currentUser:user},status);
                return {statusText:getStatus, status:status}
            })
        });


        return {
            ...(
                searchTerm&&{keyword:searchTerm}),
            ...(
                {sort:checkDateAdded.length ? "asc" : "desc"}),
            ...(
                selectedClone.length>0&&{
                    [cashier ? "paymentStatus" : 'status']:selectedClone.map((item:any)=>{
                        if(cashier){
                            if(item==VERIFIED){
                                return [PAID,VERIFIED,APPROVED]
                            } else if(item==UNVERIFIED){
                                return [DECLINED,UNVERIFIED]
                            } else if(item==FORVERIFICATION){
                                return [PENDING,FORVERIFICATION,FOREVALUATION].toString()
                            }
                        } else if(item==FOREVALUATION){
                            return [PENDING,FORVERIFICATION,FOREVALUATION].toString()
                        }

                        return convertStatusText(convertedStatus,item)
                    }).toString()
                })
        }
    };
    let count=0;

    const fnApplications=(isCurrent:boolean,callback:(err:any)=>void)=>{
             
        setRefreshing(true);
        axios.get(BASE_URL+`/applications`,{...config,params:query()}).then((response)=>{

            const cashier = [CASHIER].indexOf(user?.role?.key) != -1;
            const isNotPinned = []
            const isPinned = []
            for (let i = 0; i < response?.data?.docs?.length; i++) {

                if ((
                        (response?.data?.docs[i]?.assignedPersonnel?._id || response?.data.docs[i]?.assignedPersonnel ) == user?._id) &&
                    !(
                        cashier ?
                        (
                            !response?.data?.docs?.[i]?.paymentMethod?.length || response?.data?.docs?.[i]?.paymentStatus == PAID || response?.data?.docs?.[i]?.paymentStatus == APPROVED || response?.data?.docs?.[i]?.paymentStatus == DECLINED) : (
                            response?.data?.docs?.[i]?.status == DECLINED || response?.data?.docs?.[i]?.status == APPROVED))) {

                    isPinned.push(response?.data?.docs[i])
                } else {

                    isNotPinned.push(response?.data?.docs[i])
                }
            }


            if(response?.data?.message) Alert.alert(response.data.message);
            if(isCurrent) setRefreshing(false);



            if(count==0){
                count=1;
                if(count){

                    response?.data?.size ? setSize(response?.data?.size) : setSize(0);
                    response?.data?.total ? setTotal(response?.data?.total) : setTotal(0);
                    response?.data?.page ? setPage(response?.data?.page) : setPage(0);



                    dispatch(setApplications({data:response?.data,user:user}))

                    if(!isNotPinned.length) {
                        setTimeout(()=>{
                            handleLoad(response?.data?.page)
                        }, 3000)
                    }


                }
            }
            if(isCurrent) setRefreshing(false);
        }).catch((err)=>{
            setRefreshing(false);
            Alert.alert('Alert',err?.message||'Something went wrong.');

            callback(false);
            console.warn(err)
        })
    };
    
    useEffect(()=>{
        let isCurrent=true;

        fnApplications(isCurrent,()=>{
        });
        return ()=>{
            isCurrent=false
        }
    },[countRefresh,searchTerm,selectedChangeStatus.length]);


    const [currentPage,setCurrentPage]=useState(1);
    const [perPage,setPerPage]=useState(25);
    const [offset,setOffset]=useState((
        currentPage-1)*perPage);
    const [totalPages,setTotalPages]=useState(0);
    const [numberCollapsed,setNumberCollapsed]=useState<{parentIndex:number,child:number[]}[]>([]);

    const [searchVisible,setSearchVisible]=useState(false);

    const pnApplications=useMemo(()=>{

        setUpdateUnReadReadApplication(false);
        return ispinnedApplications(pinnedApplications)
    },[updateUnReadReadApplication,updateModal,searchTerm,selectedChangeStatus?.length,pinnedApplications?.length,currentPage]);

    const notPnApplications=useMemo(()=>{
        setUpdateUnReadReadApplication(false);
        return ispinnedApplications(notPinnedApplications)
    },[updateUnReadReadApplication,updateModal,searchTerm,selectedChangeStatus?.length,notPinnedApplications?.length,currentPage]);

    const userPress=(index:number)=>{
        let newArr=[...numberCollapsed];
        newArr[index].parentIndex=newArr[index].parentIndex ? 0 : 1;
        setNumberCollapsed(newArr)
    };
    const userPressActivityModal=(index:number,i:number)=>{
        let newArr=[...numberCollapsed];
        newArr[index].child[i]=newArr[index].child[i] ? 0 : 1;
        setNumberCollapsed(newArr)
    };
    const [modalVisible,setModalVisible]=useState(false);
    const [moreModalVisible,setMoreModalVisible]=useState(false);
    const onDismissed=()=>{
        setModalVisible(false)
    };

    const initialMove=new Animated.Value(-400);
    const endMove=400;
    const duration=1000;
    const [loadingAnimation,setLoadingAnimation]=useState(false);
    const loadingAnimate=()=>{

        Animated.timing(initialMove,{
            toValue:endMove,
            duration:duration,
            useNativeDriver:true,
        }).start((o)=>{
            if(o.finished){
                initialMove.setValue(-400);
                if(loadingAnimation){
                    loadingAnimate()
                }

            }
        })
    };
    const [infiniteLoad,setInfiniteLoad]=useState(false);
    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum]=useState(false);
    const bottomLoader=()=>{
        return infiniteLoad ? <Loader/> : <View style={{height: 15}}></View>
    };


    const handleLoad=useCallback((page_)=>{

        let _page:string;
        setInfiniteLoad(true);
        if((
            page*size)<total || page_ ){
            _page="?page="+(
                (page_ || page)+1);

            axios.get(BASE_URL+`/applications${_page}`,{...config,params:query()}).then((response)=>{

                if(response?.data?.message) Alert.alert(response.data.message);
                response?.data?.size ? setSize(response?.data?.size) : setSize(0);
                response?.data?.total ? setTotal(response?.data?.total) : setTotal(0);
                response?.data?.page ? setPage(response?.data?.page) : setPage(0);
                if(response?.data?.docs.length==0){
                    setInfiniteLoad(false);

                } else{
                    dispatch(handleInfiniteLoad({
                        data:getList(response.data.docs,selectedChangeStatus),
                        user:user
                    }));
                    setInfiniteLoad(false);
                }
                setInfiniteLoad(false);
            }).catch((err)=>{
                Alert.alert('Alert',err?.message||'Something went wrong.');
                setInfiniteLoad(false);
                console.warn(err)
            })
        } else{
            _page="?page="+(
                page+1);

            axios.get(BASE_URL+`/applications${_page}`,{...config,params:query()}).then((response)=>{

                if(response?.data?.message) Alert.alert(response.data.message);
                if(response?.data?.size) setSize(response?.data?.size);
                if(response?.data?.total) setTotal(response?.data?.total);
                if(response?.data?.page&&response?.data?.docs.length>1) setPage(response?.data?.page);

                setInfiniteLoad(false);
            }).catch((err)=>{
                Alert.alert('Alert',err?.message||'Something went wrong.');
                setInfiniteLoad(false);
                console.warn(err)
            });
            setInfiniteLoad(false)
        }

    },[size,total,page]);
    const unReadReadApplicationFn=(id,dateRead,unReadBtn,callback:(action:any)=>void)=>{
        unreadReadApplication({
            unReadBtn:unReadBtn,
            dateRead:dateRead,
            id:id,
            config:config,
            dispatch:dispatch,
            setUpdateUnReadReadApplication:setUpdateUnReadReadApplication,
            callback:callback
        });
    };

    const updateModalFn=(bool)=>{
        setUpdateModal(bool)
    };

    const [isOpen,setIsOpen]=useState();
    const [isPrevOpen,setIsPrevOpen]=useState();
    const onMoreModalDismissed=(isOpen)=>{

        setIsOpen(isOpen);
        setMoreModalVisible(false)
    };
    const [sizeComponent,onLayoutComponent]=useComponentLayout();
    const [searchSizeComponent,onSearchLayoutComponent]=useComponentLayout();
        const [activitySizeComponent,onActivityLayoutComponent]=useComponentLayout();

    const [containerHeight,setContainerHeight]=useState(148);
    const [isReady, setIsReady] = useState(false)
    useEffect(()=>{

        dispatch(setFilterRect(sizeComponent));
        dispatch(setactivitySizeComponent(activitySizeComponent));
        if(sizeComponent?.height&&searchSizeComponent?.height){

            setContainerHeight(sizeComponent?.height+searchSizeComponent?.height)
            setIsReady(true);
        }
    },[sizeComponent,searchSizeComponent,activitySizeComponent, isReady]);

    const scrollY=useRef(new Animated.Value(0)).current;
    const offsetAnim=useRef(new Animated.Value(0)).current;
    const clampedScroll=Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange:[0,1],
                outputRange:[0,1],
                extrapolateLeft:'clamp',
            }),
            offsetAnim,
        ),
        0,
        containerHeight
    );

    var _clampedScrollValue=0;
    var _offsetValue=0;
    var _scrollValue=0;
    useEffect(()=>{
        scrollY.addListener(({value})=>{

            const diff=value-_scrollValue;
            _scrollValue=value;
            _clampedScrollValue=Math.min(
                Math.max(_clampedScrollValue+diff,0),
                containerHeight,
            )

        });
        offsetAnim.addListener(({value})=>{
            _offsetValue=value;

        })
    },[]);

    var scrollEndTimer=null;
    const onMomentumScrollBegin=()=>{

        clearTimeout(scrollEndTimer)
    };
    const onMomentumScrollEnd=()=>{

        const toValue=_scrollValue>containerHeight&&
                      _clampedScrollValue>(
            containerHeight)/2
                      ? _offsetValue+containerHeight : _offsetValue-containerHeight;

        Animated.timing(offsetAnim,{
            toValue,
            duration:20,
            useNativeDriver:true,
        }).start();
    };
    const onScrollEndDrag=()=>{
        scrollEndTimer=setTimeout(onMomentumScrollEnd,250);
    };

    const headerTranslate=clampedScroll.interpolate({
        inputRange:[0,containerHeight],
        outputRange:[0,-containerHeight],
        extrapolate:'clamp',
    });
    const opacity=clampedScroll.interpolate({
        inputRange:[0,containerHeight,containerHeight],
        outputRange:[1,0.5,0],
        extrapolate:'clamp',
    });
    return {
        isReady,
        onTouch, setOnTouch,
        setIsOpen,
        size,
        user,
        setUpdateModal,
        config,
        visible,
        applicationItem,
        dispatch,
        getActiveMeetingList,
        endMeeting,
        leaveMeeting,
        searchTerm,
        refreshing,
        onRefresh,
        numberCollapsed,
        searchVisible,
        pnApplications,
        notPnApplications,
        userPress,
        modalVisible,
        setModalVisible,
        moreModalVisible,
        setMoreModalVisible,
        onDismissed,
        activitySizeComponent,
        onEndReachedCalledDuringMomentum,
        setOnEndReachedCalledDuringMomentum,
        bottomLoader,
        handleLoad,
        unReadReadApplicationFn,
        updateModalFn,
        isOpen,
        onMoreModalDismissed,
        sizeComponent,
        onLayoutComponent,
        onSearchLayoutComponent,
        onActivityLayoutComponent,
        containerHeight,
        scrollY,
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        onScrollEndDrag,
        headerTranslate,
        opacity,
        scrollViewRef,
        yPos, setYPos,
        flatListViewRef
    };
}