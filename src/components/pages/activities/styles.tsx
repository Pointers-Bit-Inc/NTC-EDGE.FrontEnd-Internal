import {Platform , StyleSheet} from "react-native";
import {Bold, Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import hairlineWidth = StyleSheet.hairlineWidth;

export const styles = StyleSheet.create({
    pinnedActivityContainer:{

        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: {
            width: 0,
            height: 4
        },
        elevation: 30,
        shadowOpacity: 1,
        shadowRadius: 10,

    },
    noContent:{
        fontFamily:Regular,
        textAlign:"center",alignSelf:"center",color:"#A0A3BD",fontSize:fontValue(24)
    },
    shadow: {
        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: {
            width: 0,
            height: 4
        },
        elevation: 30,
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    container: {
        zIndex: 2,
        backgroundColor: "rgba(230, 230, 230,1)"
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    group: {

        width: "100%",
        zIndex: 10,
        elevation: 10
    },
    rect: {
        ...Platform.select({
            native: {
                paddingTop : 0,
                padding : 30 ,
            },
            default: {
                paddingTop: 10,
                paddingHorizontal : 24 ,
            }
        }),
        paddingVertical:15,

        flexDirection: "row"
    },
    rect4: {
        borderRadius: 25,
        width: 40,
        height: 40,
        backgroundColor: "#fff"
    },
    activity: {

        fontSize: fontValue(Platform.OS == "web" ? 20 :20) ,
        marginLeft: 15,
        fontFamily: Bold,
    },
    rect4Row: {
        height: 40,
        flexDirection: "row",
        marginLeft: 18,
        marginTop: 40
    },
    rect4RowFiller: {
        flex: 1,
        flexDirection: "row"
    },
    rect5: {
        marginRight: 24,
        marginTop: 50
    },
    group9: {

    },
    searcg: {
        zIndex: 0,
        left: 0,
        right: 0,
    },
    rect26: {
        backgroundColor: "rgba(255,255,255,1)",
        ...Platform.select({
            native: {
                height: undefined,
                paddingHorizontal: 30,
                paddingVertical: 10
            },
            default: {

                height: undefined,
                paddingHorizontal: 30,
                paddingBottom: 21,
                borderBottomWidth: hairlineWidth,
                borderBottomColor: "#EFEFEF"
            }
        }),


    },
    rect7: {

        width: "90%",
        backgroundColor: "#EFF0F7",
        borderRadius: 12,
        flexDirection: "row",
        paddingTop: fontValue(5),
        paddingLeft: fontValue(10),
        paddingBottom: fontValue(5)
    },
    icon: {
        color: "rgba(190,199,218,1)",
        fontSize: fontValue(26),
        alignSelf: "center"

    },
    textInput: {
        padding: 10,
        color: "rgba(149,157,175,1)",
        justifyContent: "center"
    },
    iconRow: {
        height: fontValue(40),
        flexDirection: "row",
        flex: 1,
        marginRight: 17,
        marginLeft: 12
    },
    rect27: {
        width: "100%",
        height: 10,
        //backgroundColor: "#E6E6E6"
    },
    group26: {
        marginTop: 6
    },
    group27:{
        height: 60,
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 32
    },
    group25: {
        paddingHorizontal: 20,

        backgroundColor: "rgba(255,255,255,1)"
    },
    rect34: {
        paddingVertical: 20,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },

    pinnedgroup: {
        width: "100%",
        height: 16,
    },
    pinnedcontainer: {
        backgroundColor: "rgba(255,255,255,1)"
    },
    pinnedActivity: {
        fontSize: fontValue(16),
        ...Platform.select({
            native: {
                color: "#000",
            },
            default: {
                color: "#4E4B66",
            }
        }),
        fontFamily: Bold,
        textAlign: "left",
        marginLeft: 20
    },
    date: {
        alignItems: "center",
        flexDirection:'row',

    },
    dot:{
        height: 6,
        width: 6,
        backgroundColor:  "#000",
        borderRadius: 3
    },
    dateText:{
        color: "#606A80",
        fontFamily: Bold,
        fontSize: fontValue(14),
    },
    rect36: {
        top: 0,
        left: 0,
        width: 58,
        height: 57,
        position: "absolute"
    },
    dateStack: {
    },
    group24Filler: {
        flex: 1,
        flexDirection: "row"
    },
    group23: {
        flexDirection: "row"
    },
    stackFiller: {
        flex: 1,
        flexDirection: "row"
    },
    icon4: {
        top: 22,
        position: "absolute",
        color: "rgba(128,128,128,1)",
        fontSize: fontValue(12),
        right: 20
    },
    rect35: {
        top: 0,
        width: 32,
        height: 57,
        position: "absolute",
        right: 0
    },
    icon4Stack: {
    },
    group17: {
        height: 80
    },
    group8: {
        height: 80,
        backgroundColor: "rgba(255,255,255,1)"
    },
    rect8: {
        backgroundColor: "#fff",
        flexDirection: "row"
    },
    active: {
        width: 40,
        height: 80
    },
    rect12: {
        width: 40,
        height: 80
    },
    rect13: {
        flex: 1,
        justifyContent: "center",

        width: 40,
        height: 40,
        marginTop: 27
    },
    ellipse: {
        position: "absolute",
        width: 10,
        height: 10,
        marginTop: 15,
        marginLeft: 15
    },
    profile: {
        width: 40,
        height: 80
    },
    rect11: {
        alignSelf: "center", justifyContent: "center",
        borderRadius: 25,
        top: 27,
        left: 0,
        width: 40,
        height: 40,


    },
    rect14: {
        top: 0,
        left: 0,
        width: 40,
        height: 80,
        position: "absolute"
    },
    rect11Stack: {
        width: 40,
        height: 80
    },
    activeRow: {
        height: 80,
        flexDirection: "row"
    },
    activeRowFiller: {
        flex: 1,
        flexDirection: "row"
    },
    group4: {
        top: 0,
        left: 3,
        width: 135,
        height: 80,
        position: "absolute"
    },
    rect16: {
        width: 135,
        height: 80
    },
    group3: {
        width: 135,
        height: 41,
        marginTop: 26
    },
    name: {
        fontFamily: Bold,
        color: "#121212",
        fontSize: fontValue(12)
    },
    group2: {
        width: 135,
        height: 20,
        marginTop: 7
    },
    rect18: {
        top: 0,
        left: 0,
        width: 135,
        height: 20,
        position: "absolute",
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(28,61,121,1)",
        borderRadius: 4
    },
    group21: {
        width: 113,
        height: 18,
        marginTop: 1,
        marginLeft: 21
    },
    rect32: {
        width: 113,
        height: 18
    },
    application: {
        color: "rgba(28,61,121,1)",
        fontSize: fontValue(9),
        marginTop: 3
    },
    group20: {
        top: 0,
        left: 0,
        width: 22,
        height: 21,
        position: "absolute"
    },
    rect31: {
        width: 22,
        height: 21
    },
    icon2: {
        color: "rgba(28,61,121,1)",
        fontSize: fontValue(13),
        height: 15,
        width: 10,
        marginTop: 3,
        marginLeft: 7
    },
    rect18Stack: {
        width: 135,
        height: 21
    },
    rect28: {
        top: 79,
        left: 0,
        width: 273,
        height: 1,
        position: "absolute",
        backgroundColor: "#E6E6E6"
    },
    group4Stack: {
        top: 0,
        left: 0,
        width: 273,
        height: 80,
        position: "absolute"
    },
    group5: {
        top: 0,
        width: 147,
        height: 40,
        position: "absolute",
        right: 0
    },
    group22: {
        top: 0,
        left: 1,
        width: 125,
        height: 43,
        position: "absolute"
    },
    rect33: {
        width: 125,
        height: 43,
        flexDirection: "row"
    },
    loremIpsumFiller: {
        flex: 1,
        flexDirection: "row"
    },
    loremIpsum: {
        color: "rgba(133,141,158,1)",
        textAlign: "right",
        fontSize: fontValue(10),
        marginTop: 25
    },
    rect24: {
        top: 0,
        left: 0,
        width: 147,
        height: 40,
        position: "absolute"
    },
    group22Stack: {
        width: 147,
        height: 43
    },

    group7: {
        top: 42,
        width: 147,
        height: 38,
        position: "absolute",
        right: 0,
        flexDirection: "row"
    },
    group6: {
        top: 0,
        width: 126,
        height: 28,
        position: "absolute",
        right: 21
    },
    rect10:{
        height: 100,
        backgroundColor: "rgba(255,255,255,1)",
        borderWidth: 1,
        borderColor: "rgba(229,229,229,1)"
    },
    group7Filler:{
        flex: 1
    },
    rect23: {
        width: 126,
        height: 28,

        borderRadius: 7
    },
    group19: {
        width: 126,
        height: 28,
        flexDirection: "row"
    },
    group18: {
        width: 43,
        height: 26,
        marginTop: 1
    },
    icon3: {

        top: 4,
        left: 25,
        position: "absolute",

        fontSize: fontValue(16)
    },
    rect29: {
        top: 0,
        left: 0,
        width: 43,
        height: 26,
    },
    icon3Stack: {
        width: 43,
        height: 26
    },
    rect30: {
    },
    approved: {
        top: 8,

        fontSize: fontValue(10)
    },
    rect30Stack: {
        width: 81,
        height: 27
    },
    group18Row: {

        flexDirection: "row",
        flex: 1,
        marginRight: 1,
        marginLeft: 1
    },
    rect25: {
        top: 0,
        width: 147,
        height: 38,
        position: "absolute",
        left: 0
    },
    group6Stack: {
        width: 147,
        height: 38
    },
    group4StackStack: {
        width: 292,
        height: 80
    },
    header:{
        borderBottomWidth:hairlineWidth,
        borderBottomColor:"#EFEFEF",
        paddingBottom: 26,
    },
    headerContent:{
        justifyContent:"center",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:"#fff",
        paddingTop:15,
        paddingBottom: 13.5,
        paddingHorizontal:26
    },
    titleContainer:{
        flex:1
    },
    search:{
        fontSize: Platform.isPad ? 24 :16,
        paddingLeft:fontValue(35 ),
        borderRadius:10,
        padding:12,
        backgroundColor:"#F0F0F0"
    },
    searchIcon:{

        justifyContent:"center",
        alignItems:"center",
        height:"100%",
        marginLeft:fontValue(15),
        position:"absolute",
    },
});