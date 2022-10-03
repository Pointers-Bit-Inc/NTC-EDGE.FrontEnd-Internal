import modalStyle from '@styles/modal';
import React, {useState} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';

export default function App() {
    const [animation] = useState(() => new Animated.Value(0));

    const background = animation.interpolate({
        inputRange: [0, 0.2, 1.8, 2],
        outputRange: [
            'rgba(255,255,255,0)',
            'rgba(255,255,255,.3)',
            'rgba(255,255,255,.3)',
            'rgba(255,255,255,0)',
        ],
        extrapolate: 'clamp',
    });

    const display = animation.interpolate({
        inputRange: [0.2, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const {height} = Dimensions.get('window');

    const success = animation.interpolate({
        inputRange: [1.1, 2],
        outputRange: [0, -height],
        extrapolate: 'clamp',
    });

    return (
        <View style={modalStyle.container}>
            <TouchableOpacity
                onPress={() => {
                    Animated.spring(animation, {
                        toValue: 1,
                        useNativeDriver: false,
                    }).start();
                }}>
                <Text>Open</Text>
            </TouchableOpacity>
            <Animated.View
                pointerEvents="box-none"
                style={[
                    modalStyle.background,
                    {
                        backgroundColor: background,
                    },
                ]}>
                <Animated.View
                    style={[
                        modalStyle.background,
                        {
                            transform: [{scale: display}, {translateY: success}],
                        },
                    ]}>
                    <View style={modalStyle.wrap}>
                        <View style={modalStyle.modalHeader} />
                        <Text style={modalStyle.headerText}>Hello!</Text>
                        <Text style={modalStyle.regularText}>
                            This modal is wonderful ain't it!
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={[modalStyle.button, modalStyle.buttonCancel]}
                                onPress={() => {
                                    Animated.spring(animation, {
                                        toValue: 0,
                                        useNativeDriver: false,
                                    }).start();
                                }}>
                                <Text style={modalStyle.buttonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={modalStyle.button}
                                onPress={() => {
                                    Animated.spring(animation, {
                                        toValue: 2,
                                        useNativeDriver: false,
                                    }).start(() => {
                                        animation.setValue(0);
                                    });
                                }}>
                                <Text style={modalStyle.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

