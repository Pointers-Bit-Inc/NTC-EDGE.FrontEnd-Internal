import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import React,{useCallback,useEffect,useRef,useState} from "react";
import {RootStateOrAny,useSelector} from "react-redux";
import axios from "axios";
import Highlighter from "@pages/activities/search/highlighter";
import DotHorizontalIcon from "@assets/svg/dotHorizontal";
import {styles} from "@pages/activities/styles";
import SearchIcon from "@assets/svg/search";
import FilterOutlineIcon from "@assets/svg/FilterOutline";
import AddParticipantOutlineIcon from "@assets/svg/addParticipantOutline";
import Pagination from "@atoms/pagination";
import {Bold,Regular500} from "@styles/font";
import {Menu,MenuOption,MenuOptions,MenuTrigger} from "react-native-popup-menu";
import ProfileImage from "@atoms/image/profile";
import {fontValue} from "@pages/activities/fontValue";
import {primaryColor} from "@styles/color";
import FormField from "@organisms/forms/form";
import {validateEmail,validatePassword,validatePhone,validateText} from "../../../utils/form-validations";
import useKeyboard from "../../../hooks/useKeyboard";
import {BASE_URL} from "../../../services/config";
import CloseIcon from "@assets/svg/close";
import {removeEmpty} from "@pages/activities/script";
import {ToastType} from "@atoms/toast/ToastProvider";
import {useToast} from "../../../hooks/useToast";
import {Toast} from "@atoms/toast/Toast";
import EmployeeIcon from "@assets/svg/employeeIcon";
import {EMPLOYEES, USERS} from "../../../reducers/activity/initialstate";
import UserIcon from "@assets/svg/userIcon";

const style=StyleSheet.create({
    row:{
        color:"#606A80",
        fontSize:16,
        fontFamily:Regular500,
        fontWeight:"500"
    },
    rowStyle:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-around",
    },
    cellStyle:{
        flex:1,
        margin:10,
    },
    tableHeader:{
        fontSize:16,
        fontFamily:Regular500,
        fontWeight:"500",
        color:"#606A80"
    },
    container:{
        backgroundColor:"#F8F8F8",
        flex:1,
        flexDirection:"row"
    },
    title:{
        backgroundColor:"#fff",
        paddingHorizontal:46,
        paddingTop:22,
        paddingBottom:22,
    },
    text:{
        color:"#113196",
        fontWeight:"600",
        fontSize:24,
        fontFamily:Bold,

    },
    search:{
        paddingTop:20,
        paddingBottom:7,
        alignItems:"center",
        justifyContent:"space-between",
        flexDirection:"row",
        flex:1
    },
    rightrow:{
        flexDirection:"row"
    },
    filter:{
        borderRadius:8,
        paddingHorizontal:22,
        paddingVertical:9,
        backgroundColor:"#041B6E"
    },
    addParticipant:{
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        borderRadius:8,
        paddingHorizontal:22,
        paddingVertical:11,
        backgroundColor:"#041B6E"
    },
    shadow:{
        flex:1,
        shadowColor:"rgba(0,0,0,0.1)",
        shadowOffset:{width:0,height:4},
        elevation:30,
        shadowOpacity:1,
        shadowRadius:10
    },
    headerTable:{
        marginTop:35,
        borderTopRightRadius:8,
        borderTopLeftRadius:8,
        marginHorizontal:45,
        backgroundColor:"#fff",
    },
    headerTextContainer:{
        paddingVertical:16,
        paddingHorizontal:23
    },
    flatlist:{
        marginBottom:5,
        borderBottomRightRadius:8,
        borderBottomLeftRadius:8,
        marginHorizontal:45,
        flex:1,
        backgroundColor:"#fff",
    },
    textTable:{
        fontFamily:Bold,
        color:"#606A80",
        fontSize:20,
        fontWeight:"600"
    },
    contentContainer:{
        borderBottomColor:"#F0F0F0",
        borderBottomWidth:1
    },
    pagination:{
        paddingHorizontal:45,
        paddingVertical:15,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end"
    },
    modal:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"rgba(0,0,0,0.5)",
    },
});
const DataTable=(props)=>{
    const dimensions=useWindowDimensions();
    const [value,setValue]=useState('');
    const [page,setPage]=useState(1);
    const [size,setSize]=useState(12);
    const [total,setTotal]=useState(10);
    const [docs,setDocs]=useState([]);
    const [loading,setLoading]=useState([]);
    const [role,setRole]=useState('');
    const flatListRef=useRef();
    const [alert,setAlert]=useState();
    const originalForm=[
        {
            stateName:'_id',
            id:0,
            key:0,
            required:false,
            label:'Id',
            type:'input',
            placeholder:'Id',
            value:'',
            error:false,
            description:false,
            hasValidation:true,
            hidden:true
        },{
            stateName:'firstName',
            id:1,
            key:1,
            required:true,
            label:'First Name',
            type:'input',
            placeholder:'First Name',
            value:'',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'middleName',
            id:2,
            key:2,
            required:true,
            label:'Middle Name',
            type:'input',
            placeholder:'Middle Name',
            value:'',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'lastName',
            id:3,
            key:3,
            required:true,
            label:'Last Name',
            type:'input',
            placeholder:'Last Name',
            value:'',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'email',
            id:4,
            key:4,
            required:true,
            label:'Email',
            type:'input',
            placeholder:'Email',
            value:'',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'suffix',
            id:5,
            key:5,
            required:true,
            label:'Suffix',
            type:'input',
            placeholder:'Suffix',
            value:'',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'role',
            id:6,
            key:6,
            required:true,
            data:props.filter,
            label:'Role',
            type:'select',
            placeholder:'Role',
            value:'admin',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'address',
            id:7,
            key:7,
            required:true,
            label:'Address',
            type:'input',
            placeholder:'Address',
            value:'',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'contactNumber',
            id:8,
            key:8,
            required:true,
            label:'Contact Number',
            type:'input',
            placeholder:'Contact Number',
            value:'',
            error:false,
            description:false,
            hasValidation:true
        },
        {
            stateName:'password',
            id:9,
            key:9,
            required:true,
            label:'Password',
            type:'input',
            placeholder:'Password',
            value:'',
            secureTextEntry:true,
            description:false,
            hasValidation:true
        },
        {

            stateName:'profilePicture',
            id:11,
            file:{},
        },

    ];
    const [userProfileForm,setUserProfileForm]=useState(originalForm);
    const [state,setState]=useState('add');
    const user=useSelector((state:RootStateOrAny)=>state.user);
    const {showToast}=useToast();
    const config={
        headers:{
            Authorization:"Bearer ".concat(user?.sessionToken)
        }
    };


    const fetch=useCallback((_page?:number,text?:string)=>{
        setLoading(true);
        flatListRef?.current?.scrollToEnd({animated:true});
        const search=async()=>{
            const response=await axios.get(props.url,{
                ...config,params:{
                    page:_page ? _page : page,pageSize:size,...(
                        text&&{keyword:text}),...(
                        (
                            role||props.role)&&{
                            role:(
                                role||props.role)
                        }),
                }
            }).catch((error)=>{
                let _err='';
                for(const err in error?.response?.data?.errors){

                    _err+=error?.response?.data?.errors?.[err]?.toString()+"\n";

                }
                showToast(ToastType.Error,_err)
            });
            setLoading(false);
            flatListRef?.current?.scrollToOffset({offset:0,animated:true});

            if(response){
                setPage(response?.data?.page);
                setSize(response?.data?.size);
                setTotal(response?.data?.total);
                setDocs(response?.data?.docs)
            }

        };
        const timerId=setTimeout(()=>{
            search();
        },1000);

        return ()=>{
            clearTimeout(timerId);
        };
    },[]);

    useEffect(()=>{
        setLoading(true);
        const search=async()=>{
            const {data}=await axios.get(props.url,{
                ...config,params:{
                    page:1,pageSize:size,...(
                        value&&{keyword:value}),...(
                        (
                            !role||role||props.role)&&{
                            role:(
                                role||props.role)
                        }),
                }
            });
            setLoading(false);
            setPage(data?.page);
            setSize(data?.size);
            setTotal(data?.total);
            setDocs(data?.docs)
        };
        const timerId=setTimeout(()=>{
            search();
        },1000);

        return ()=>{
            clearTimeout(timerId);
        };

    },[value,role]);
    useEffect(()=>{
        setLoading(true);
        fetch()
    },[]);

    const renderItems=({item})=>{
        return <View style={{paddingLeft:24,borderTopWidth:1,borderTopColor:"#f0f0f0"}}>
            <View style={style.rowStyle}>
                <View style={style.cellStyle}>
                    <Text style={[style.tableHeader,{color:"#000000"}]}>{item._id}</Text>
                </View>
                <View style={style.cellStyle}>
                    <View style={{flexDirection:"row",alignItems:"center",}}>
                        <View style={{paddingRight:15}}>
                            <ProfileImage
                                size={fontValue(45)}
                                image={item?.profilePicture?.thumb ? item?.profilePicture?.thumb.match(/[^/]+(jpg|jpeg|png|gif)$/i) ? item?.profilePicture?.thumb : item?.profilePicture?.thumb+".png" : null}
                                name={item?.firstName ? `${item?.firstName} ${item?.lastName}` : (
                                    item?.applicantName ? item?.applicantName : "")}
                            />
                        </View>

                        <View style={{flex:1}}>
                            <Text numberOfLines={1} style={[style.tableHeader,{color:"#000000"}]}><Highlighter
                                highlightStyle={{backgroundColor:'#BFD6FF'}}
                                searchWords={[value]}
                                textToHighlight={`${item.firstName} ${item.lastName}`}
                            /></Text>
                            <Text numberOfLines={1}
                                  style={[style.tableHeader,{fontSize:10,color:"#2863D6"}]}><Highlighter
                                highlightStyle={{backgroundColor:'#BFD6FF'}}
                                searchWords={[value]}
                                textToHighlight={item.email}
                            /></Text>
                        </View>

                    </View>

                </View>
                <View style={[style.cellStyle,{flex:0.5}]}>
                    <Text style={[style.tableHeader,{color:"#000000"}]}>{item?.role?.name}</Text>
                </View>
                <View style={[style.cellStyle,{flex:0.5}]}>
                    <Menu onClose={()=>{

                    }} onSelect={value=>{
                        if(value=="edit"){
                            let newArr=[...userProfileForm];

                            setState('edit');
                            userProfileForm.map((e,index)=>{
                                for(const props in item){
                                    if(newArr[index]['stateName']===props&&props==='role'){
                                        newArr[index]['value']=item?.[props]?.key;
                                    } else if(newArr[index]['stateName']===props){
                                        newArr[index]['value']=item[props];
                                    }
                                }

                            });
                            setUserProfileForm(newArr);
                            setModalClose(true)
                        } else if(value=="delete"){
                            axios.delete(BASE_URL+`/users/${item._id}`).then((response)=>{
                                showToast(ToastType.Success,"Successfully deleted!")
                            }).catch((error)=>{
                                console.log(error.response);
                                let _err='';
                                for(const err in error?.response?.data?.errors){
                                    _err+=error?.response?.data?.errors?.[err]?.toString()+"\n";
                                }
                                showToast(ToastType.Error,error?.response?.data.trim()||error?.response?.statusText)
                            })
                        }

                    }}>

                        <MenuTrigger text={

                            <DotHorizontalIcon/>
                        }>

                        </MenuTrigger>

                        <MenuOptions optionsContainerStyle={{
                            marginTop:30,
                            shadowColor:"rgba(0,0,0,1)",
                            paddingVertical:10,
                            borderRadius:8,
                            shadowOffset:{
                                width:0,
                                height:0
                            },
                            elevation:45,
                            shadowOpacity:0.1,
                            shadowRadius:15,
                        }}>
                            <MenuOption value={'edit'}>
                                <View>
                                    <Text>{'Edit'}</Text>
                                </View>
                            </MenuOption>
                            <MenuOption value={'delete'}>
                                <View>
                                    <Text>{'Delete'}</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>

                    </Menu>
                </View>
            </View>
        </View>

    };

    const cleanForm=()=>{
        let newArr=[...userProfileForm];
        userProfileForm.map((e,index)=>{
            if(e.type!="select"){
                newArr[index].value=''
            }

            newArr[index].error=false;
            newArr[index].description=false;
            newArr[index].hasValidation=false;

        });
        setUserProfileForm(newArr);
    };

    const onUpdateForm=(id:number,text:any,element?:string,_key?:string)=>{
        let index=userProfileForm?.findIndex(app=>app?.id==id);
        let newArr=[...userProfileForm];
        newArr[index]['value']=text;
        newArr[index]['hasValidation']=false;
        newArr[index]['error']=false;
        if(_key=='password') newArr[index]['error']= !validatePassword(text)?.isValid;
        else if(_key==='email') newArr[index]['error']= !validateEmail(text);
        else if(_key==='contactNumber') newArr[index]['error']= !validatePhone(text);
        else newArr[index]['error']= !validateText(text);
        setUserProfileForm(newArr);
    };
    const onPress=async(id?:number,type?:string|number)=>{
        var updatedUser={},formData={};
        userProfileForm?.forEach(async(up:any)=>{
            return updatedUser={...updatedUser,[up?.stateName]:up?.value};
        });
        setLoading(true);
        axios[updatedUser?._id ? "patch" : "post"](BASE_URL+`/users/`+updatedUser?._id||"",updatedUser,config).then((response)=>{
            cleanForm();
            showToast(ToastType.Success,updatedUser?._id ? "Successfully updated!" : "Successfully created!");
            if(updatedUser?._id){
                let newArr=[...docs];
                let index=newArr?.findIndex(app=>app?._id==response.data.doc._id);
                newArr[index]={...newArr[index],...removeEmpty(response.data.doc)};
                setDocs(newArr)
            } else{
                setDocs(docs=>[response.data,...docs])
            }
            setModalClose(false)
            setLoading(false);
        }).catch((err)=>{
            setLoading(false);
            var _err=err;
            if(_err?.response?.data?.message){
                showToast(ToastType.Error,_err?.response?.data?.message)
            }
            if(err.response.data.error=='The email address already exists. Please select another email address.'){
                _err={
                    response:{
                        data:{
                            errors:{
                                Email:[err.response.data.error]
                            }
                        }
                    }
                }
            }
            let newArr=[...userProfileForm];


            userProfileForm.map(e=>{
                for(const error in _err?.response?.data?.errors){
                    if(e.stateName.toLowerCase()==error.toLowerCase()){
                        let index=newArr?.findIndex(app=>app?.id==e?.id);
                        newArr[index]['error']=true;
                        newArr[index]['description']=_err?.response?.data?.errors?.[error].toString();
                        newArr[index]['hasValidation']=true;
                    }
                }
            });

            if(_err?.response?.data?.title){
                showToast(ToastType.Error,_err?.response?.data?.title)
            }

            setUserProfileForm(newArr);


        });
    };


    const scrollView=useRef();
    const isKeyboardVisible=useKeyboard();
    const [modalClose,setModalClose]=useState(false);

    const DrawerIcon = () => {
        let Icon:any=null;
        switch (props.name) {
            case EMPLOYEES:
                Icon = <EmployeeIcon width={5 * 30} height={5 * 31} color={ "rgba(128, 129, 150,1)"}/>
                break;
            case USERS:
                Icon = <UserIcon width={5 * 30} height={5 * 31} color={ "rgba(128, 129, 150,1)"}/>
                break;
            default:
                Icon = <UserIcon width={5 * 30} height={5 * 31} color={ "rgba(128, 129, 150,1)"}/>
                break;

        }
        return Icon
    }

    return (
        <>
            <View style={style.container}>
                <View style={[styles.container,styles.shadow,{
                    flex:1,
                }]}>
                    <View style={style.title}>
                        <Text style={style.text}>
                            {props.title}
                        </Text>
                        <View style={style.search}>
                            <View style={{flex:0.90,paddingRight:15}}>
                                <TextInput value={value} onChangeText={text=>{
                                    setValue(text)

                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>
                            <View style={style.rightrow}>
                                <View style={{paddingRight:10}}>
                                    <View style={style.filter}>
                                        <Menu onClose={()=>{

                                        }} onSelect={value=>{
                                            setRole(role=>role==value ? "" : value)
                                        }}>

                                            <MenuTrigger text={
                                                <FilterOutlineIcon/>}>

                                            </MenuTrigger>

                                            <MenuOptions optionsContainerStyle={{
                                                marginTop:50,
                                                shadowColor:"rgba(0,0,0,1)",
                                                paddingVertical:10,
                                                borderRadius:8,
                                                shadowOffset:{
                                                    width:0,
                                                    height:0
                                                },
                                                elevation:45,
                                                shadowOpacity:0.1,
                                                shadowRadius:15,
                                            }}>
                                                {
                                                    props.filter.map((option)=>{
                                                        return <MenuOption value={option?.value}>
                                                            <View>
                                                                <Text>{option?.label}</Text>
                                                            </View>
                                                        </MenuOption>
                                                    })
                                                }

                                            </MenuOptions>

                                        </Menu>

                                    </View>
                                </View>
                                <TouchableOpacity onPress={()=>{
                                    setState('add');
                                    setModalClose(true)
                                }}>
                                    <View style={style.addParticipant}>
                                        <View style={{paddingRight:10}}>
                                            <AddParticipantOutlineIcon color={"#fff"}/>
                                        </View>

                                        <Text style={{color:"#fff"}}>{props.addButtonTitle}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>
                    <View style={style.shadow}>


                        <View style={style.headerTable}>

                            <View style={style.headerTextContainer}>

                                <Text
                                    style={style.textTable}>{props.title}</Text>

                            </View>
                        </View>
                        <View style={{marginHorizontal:45,backgroundColor:"#fff",}}>

                            <View style={{paddingLeft:24,}}>
                                <View style={style.rowStyle}>
                                    <View style={style.cellStyle}>
                                        <Text style={style.tableHeader}>ID</Text>
                                    </View>
                                    <View style={style.cellStyle}>
                                        <Text style={style.tableHeader}>NAME</Text>
                                    </View>
                                    <View style={style.cellStyle}>
                                        <Text style={style.tableHeader}>DEPARTMENT ROLE</Text>
                                    </View>

                                    <View>
                                        <View style={{width:24}}/>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={style.flatlist}>
                            {loading&&
                            <View style={{zIndex: 2, height:"90%",justifyContent:"center",alignSelf:"center",position:"absolute"}}>
                                {!docs.length && <View>
                                    <DrawerIcon/>
                                </View>}
                                <View style={{padding: 20}}>
                                    <ActivityIndicator color={"#808196"}/>
                                </View>

                            </View>}
                            {/*<TouchableOpacity onPress={()=> flatListRef?.current?.scrollToOffset({offset: 0, animated: true})}>
                                <View style={{justifyContent: "center", alignItems: "center"}}>
                                    <ChevronUpIcon/>
                                </View>
                            </TouchableOpacity>*/}
                            <FlatList
                                ref={flatListRef}
                                contentContainerStyle={style.contentContainer}
                                data={docs}
                                keyExtractor={item=>item._id}
                                renderItem={renderItems}
                            />
                            {/*<TouchableOpacity onPress={()=> flatListRef?.current?.scrollToEnd({animated: true})}>
                                <View style={{justifyContent: "center", alignItems: "center"}}>
                                    <ChevronDownIcon/>
                                </View>
                            </TouchableOpacity>*/}


                        </View>
                        <Pagination size={size} page={page} total={total} fetch={fetch}/>
                    </View>
                </View>
            </View>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalClose}
                onRequestClose={()=>{
                    console.log("Modal has been closed.")
                }}>
                <View style={style.modal}>

                    <View style={{backgroundColor:"#fff",padding:20,borderRadius:8,}}>
                        <View style={{height:dimensions.height*0.90,width:dimensions.width*0.5,}}>


                            <View style={{paddingBottom:20}}>
                                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",}}>
                                    <Text style={style.text}>
                                        {state=='edit' ? props.editTitle : props.addTitle}
                                    </Text>
                                    <TouchableOpacity onPress={()=>{
                                        cleanForm();
                                        setModalClose(false)
                                    }}>
                                        <CloseIcon/>
                                    </TouchableOpacity>

                                </View>
                            </View>


                            <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
                                <FormField
                                    formElements={userProfileForm}
                                    onChange={onUpdateForm}
                                    onSubmit={onPress}
                                    handleEvent={(event)=>{
                                        if(isKeyboardVisible){
                                            scrollView?.current?.scrollTo({
                                                x:0,
                                                y:event?.y,
                                                animated:true,
                                            })
                                        }
                                    }}
                                />


                            </ScrollView>
                            <Toast/>
                            <TouchableOpacity onPress={loading ? null : onPress}>
                                <View style={{
                                    borderRadius:8,
                                    padding:12,
                                    justifyContent:"center",
                                    alignItems:"center",
                                    backgroundColor:primaryColor
                                }}>
                                    {loading ? <ActivityIndicator color={"#fff"}/> :
                                     <Text style={{
                                         color:"white",
                                         fontFamily:Regular500,
                                         fontWeight:500,
                                     }}>{state=='edit' ? props?.editButtonTitle : props?.addButtonTitle}</Text>}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>
            </Modal>
        </>

    )
};

export default DataTable