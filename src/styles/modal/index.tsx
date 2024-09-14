import {
    StyleSheet,
} from "react-native";
const modalStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'tomato',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrap: {
        borderRadius: 8,
        backgroundColor: '#FFF',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 24,
    },
    regularText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 16,
    },
    button: {
        backgroundColor: '#007ffe',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 16,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonCancel: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default modalStyle
