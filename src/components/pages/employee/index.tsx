import {styles} from "@pages/activities/styles";
import {FlatList,StyleSheet,Text,TextInput,TouchableOpacity,useWindowDimensions,View} from "react-native";

import React,{useCallback,useEffect,useMemo,useState} from "react";
import {Bold,Regular500} from "@styles/font";
import SearchIcon from "@assets/svg/search";
import FilterOutlineIcon from "@assets/svg/FilterOutline";
import AddParticipantOutlineIcon from "@assets/svg/addParticipantOutline";
import DotHorizontalIcon from "@assets/svg/dotHorizontal";
import ChevronLeft from "@assets/svg/chevron-left";
import ChevronRight from "@assets/svg/chevron-right";
import {RootStateOrAny,useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import _ from "lodash";
import Highlighter from "@pages/activities/search/highlighter";

const style=StyleSheet.create({
    row:{color:"#606A80",fontSize:16,fontFamily:Regular500,fontWeight:"500"},
    rowStyle:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-around",
    },
    cellStyle:{
        flex:1,
        margin:10,
    },
    tableHeader:{fontSize:16,fontFamily:Regular500,fontWeight:"500",color:"#606A80"}
});
export default function EmployeePage(props:any){
    const dimensions=useWindowDimensions();
    const [value,setValue]=useState('');
    const [page,setPage]=useState(1);
    const [size,setSize]=useState(12);
    const [total,setTotal]=useState(10);
    const [docs,setDocs]=useState([]);

    const user = useSelector((state: RootStateOrAny) => state.user);
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken)
        }
    }
    const fetch = useCallback((_page?:number) => {
        axios.get(BASE_URL + '/users', {...config, params: {
                page: _page ? _page :page, pageSize: size,  ...(value&&{keyword:value}),
            }}).then((response)=>{
            setPage(response?.data?.page)
            setSize(response?.data?.size)
            setTotal(response?.data?.total)
            setDocs(response?.data?.docs)
        })
    }, [page, size, total, value]);
     useEffect(()=>{
         fetch()
     }, [])
     
    const renderItems=({item})=>{
        return <View style={{paddingLeft:24,borderTopWidth:1,borderTopColor:"#f0f0f0"}}>
            <View style={style.rowStyle}>
                <View style={style.cellStyle}>
                    <Text style={[style.tableHeader,{color:"#000000"}]}>{item._id}</Text>
                </View>
                <View style={style.cellStyle}>
                    <Text style={[style.tableHeader,{color:"#000000"}]}><Highlighter
                        highlightStyle={{backgroundColor:'#BFD6FF'}}
                        searchWords={[value]}
                        textToHighlight={`${item.firstName} ${item.lastName}`}
                    /></Text>
                    <Text style={[style.tableHeader,{fontSize:10,color:"#2863D6"}]}>{item.email}</Text>
                </View>
                <View style={[style.cellStyle,{flex:0.5}]}>
                    <Text style={[style.tableHeader,{color:"#000000"}]}>{item?.role?.name}</Text>
                </View>
                
                <View style={[style.cellStyle,{flex:0.5}]}>
                    <DotHorizontalIcon/>
                </View>
            </View>
        </View>

    };

    const pageNumbers=(count,current)=>{
        var shownPages=3;
        var result=[];
        if(current>count-shownPages){
            if(count-2 > 1){
                result.push(count-2)
            }
            if(count-1 > 1) {
                result.push(count-1)
            }
            if(count >= 1) {
                result.push(count);
            }

        } else{
            if(current-1 > 0) {
                result.push(current-1, current,current+1,'...',count)
            }else{
                result.push( current,current+1,current+2,'...',count);
            }

        }
        return result;
    };

    const textInputSearch = _.debounce( (text, ) => {
        fetch()

    }, 1000);
    return (
        <View style={{backgroundColor:"#F8F8F8",flex:1,flexDirection:"row"}}>
            <View style={[styles.container,styles.shadow,{
                flex:1,
            }]}>
                <View style={{backgroundColor:"#fff",paddingHorizontal:46,paddingTop:22,paddingBottom:22,}}>
                    <Text style={{color:"#113196",fontWeight:"600",fontSize:24,fontFamily:Bold}}>
                        Employees
                    </Text>
                    <View style={{
                        paddingTop:20,
                        paddingBottom:7,
                        alignItems:"center",
                        justifyContent:"space-between",
                        flexDirection:"row",
                        flex:1
                    }}>
                        <View style={{flex:0.90,paddingRight:15}}>
                            <TextInput value={value} onChangeText={text=>{
                                setValue(text)
                                textInputSearch(text)

                            }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                            <View style={styles.searchIcon}>
                                <SearchIcon/>
                            </View>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <View style={{paddingRight:10}}>
                                <View style={{
                                    borderRadius:8,
                                    paddingHorizontal:22,
                                    paddingVertical:9,
                                    backgroundColor:"#041B6E"
                                }}>
                                    <FilterOutlineIcon/>
                                </View>
                            </View>

                            <View style={{
                                justifyContent:"center",
                                alignItems:"center",
                                flexDirection:"row",
                                borderRadius:8,
                                paddingHorizontal:22,
                                paddingVertical:9,
                                backgroundColor:"#041B6E"
                            }}>
                                <View style={{paddingRight:10}}>
                                    <AddParticipantOutlineIcon color={"#fff"}/>
                                </View>

                                <Text style={{color:"#fff"}}>New employee</Text>
                            </View>
                        </View>

                    </View>

                </View>
                <View style={{
                    flex:1,
                    shadowColor:"rgba(0,0,0,0.1)",
                    shadowOffset:{width:0,height:4},
                    elevation:30,
                    shadowOpacity:1,
                    shadowRadius:10
                }}>
                    <View style={{
                        marginTop:35,
                        borderTopRightRadius:8,
                        borderTopLeftRadius:8,
                        marginHorizontal:45,
                        backgroundColor:"#fff",
                    }}>

                        <View style={{paddingVertical:16,paddingHorizontal:23}}>

                            <Text
                                style={{fontFamily:Bold,color:"#606A80",fontSize:20,fontWeight:"600"}}>Employees</Text>

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

                    <View style={{
                        marginBottom:5,
                        borderBottomRightRadius:8,
                        borderBottomLeftRadius:8,
                        marginHorizontal:45,
                        flex:1,
                        backgroundColor:"#fff",
                    }}>

                        <FlatList
                            contentContainerStyle={{borderBottomColor:"#F0F0F0",borderBottomWidth:1}}
                            data={docs}
                            keyExtractor={item=>item._id}
                            renderItem={renderItems}
                        />


                    </View>
                    <View style={{
                        paddingHorizontal:45,
                        paddingVertical:15,
                        flexDirection:"row",
                        alignItems:"center",
                        justifyContent:"flex-end"
                    }}>
                        <TouchableOpacity onPress={()=> {
                            if(page-1 > 0){
                                fetch(page-1 )
                            }

                        }}>
                            <ChevronLeft/>
                        </TouchableOpacity>

                        {pageNumbers(Math.floor((total/page)),page).map(number=>{
                            return <TouchableOpacity onPress={() => {

                                fetch(number)
                            }}>
                                <View style={{
                                    marginHorizontal:6,
                                    alignItems:"center",
                                    justifyContent:"center",
                                    borderRadius:4,
                                    backgroundColor:page == number ? "#041B6E" : "rgba(0,0,0,0)",
                                    paddingVertical:6,
                                    paddingHorizontal:12
                                }}>
                                    <Text style={{
                                        color:page == number ? "#fff" :  "#041B6E" ,
                                        fontSize:16,
                                        fontWeight:"500",
                                        fontFamily:Regular500
                                    }}>{number}</Text>
                                </View>
                            </TouchableOpacity>

                        })}
                        <TouchableOpacity onPress={()=>{
                            if(page+1 > 0){
                                fetch(page+1 )
                            }
                        }}>
                            <ChevronRight/>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </View>
    )
}