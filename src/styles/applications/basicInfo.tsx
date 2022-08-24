import {StyleSheet} from "react-native";
import {fontValue} from "@pages/activities/fontValue";
import {Bold, Regular, Regular500} from "@styles/font";

const styles=StyleSheet.create({
    remarksContainer: {
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 7.5,
        //marginBottom: 15,

    },
    remarksTitle: {
        fontSize: fontValue(12),
        fontFamily: Bold,
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        marginTop: -10,
        marginLeft: 15,
    },
    remarksContent: {
        fontStyle: "italic",
        fontSize: fontValue(12),

    },
    elevation:{

        marginVertical:20,
        borderRadius:5,
        alignSelf:"center",
        width:"90%",
        backgroundColor:"#fff",
        shadowColor:"rgba(0,0,0,1)",
        shadowOffset:{
            height:0,
            width:0
        },
        elevation:6,
        shadowOpacity:0.2,
        shadowRadius:2,
    },
    icon2:{
        color:"rgba(248,170,55,1)",
        fontSize:fontValue(10)
    },
    role:{

        fontFamily:Bold,
        fontSize:fontValue(14),
        textAlign:"left",
        paddingHorizontal:fontValue(10)
    },
    submitted:{
        color:"rgba(105,114,135,1)",
        textAlign:"right",
        fontSize:fontValue(10)
    },
    container:{
        flex:1,
    },
    group4:{},
    group3:{
        paddingRight:fontValue(10),
        paddingLeft:fontValue(10),
    },
    group:{

    },
    rect:{
        backgroundColor:"#EFF0F6",
    },
    header:{

        textTransform:'uppercase',
        fontSize:fontValue(12),
        fontFamily:Regular500,
        color:"#565961",
        padding:5,
        marginLeft:5
    },
    group2:{
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        marginTop:8,
        paddingHorizontal:10,
        fontSize:fontValue(12)
    },
    detail:{
        fontSize:fontValue(14),
        fontFamily:Regular,
        paddingRight:0,
        textAlign:"left",
        flex:1,
        alignSelf:"flex-start"
    },
    detailInput:{
        fontSize:fontValue(14),
        fontFamily:Regular500,
        color:"#121212",
        flex:1,
        textAlign:"left"
    },
    divider:{
        padding:2,
        paddingBottom:5
    },
    status:{

        flexDirection:'row',
        flexWrap:"wrap",
        alignItems:"center",
        //paddingLeft:10
    }
});


export default styles
