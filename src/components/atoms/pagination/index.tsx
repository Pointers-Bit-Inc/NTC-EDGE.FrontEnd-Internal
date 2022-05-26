import {StyleSheet,Text,TouchableOpacity,View} from "react-native";
import ChevronLeft from "@assets/svg/chevron-left";
import {Regular500} from "@styles/font";
import ChevronRight from "@assets/svg/chevron-right";
import React from "react";
const style=StyleSheet.create({
    pagination:{
        paddingHorizontal:45,
        paddingVertical:15,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end"
    },
    paginationText:{
        marginHorizontal:6,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:4,

        paddingVertical:6,
        paddingHorizontal:12
    },
    paginateText:{

        fontSize:16,
        fontWeight:"500",
        fontFamily:Regular500
    }
})
const Pagination = (props: { size: number, page: number; fetch: (arg0: number) => void; total: number; }) => {
    const pageNumbers=(count,current)=>{
        var shownPages=3;
        var result=[];
        if(current>count-shownPages){
            if(count-2 >= 1){
                result.push(count-2)
            }
            if(count-1 >= 1) {
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

    return  <View style={style.pagination}>
        <TouchableOpacity onPress={()=> {
            if(props.page-1 > 0){
                props.fetch(props.page-1 )
            }

        }}>
            <ChevronLeft/>
        </TouchableOpacity>

        {pageNumbers(Math.floor(props.size < props.total ? (props.total/props.size) : 1),props.page).map(number=>{
            return <TouchableOpacity onPress={() => {

                props.fetch(number)
            }}>
                <View style={[style.paginationText, {backgroundColor:props.page == number ? "#041B6E" : "rgba(0,0,0,0)",}]}>
                    <Text style={[style.paginateText, { color:props.page == number ? "#fff" :  "#041B6E" ,}]}>{number}</Text>
                </View>
            </TouchableOpacity>

        })}
        <TouchableOpacity onPress={()=>{
            if(props.page+1 > 0){
                props.fetch(props.page+1 )
            }
        }}>
            <ChevronRight/>
        </TouchableOpacity>

    </View>
}

export default Pagination