import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    applicationContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        marginTop: 10
    },
    applicationTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})