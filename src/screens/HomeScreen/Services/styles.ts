import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    serviceContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        marginTop: 10
    },
    serviceTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    subServiceTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
    }
})