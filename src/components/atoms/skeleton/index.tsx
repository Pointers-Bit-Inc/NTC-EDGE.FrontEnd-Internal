import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Animated, Platform } from 'react-native';


type Props = {};
export default class Skeleton extends Component<Props> {
    constructor(props) {
        super(props)
        this.circleAnimatedValue = new Animated.Value(0)
        this.timeoutId = 0

    }
    circleAnimated = () => {
        this.circleAnimatedValue.setValue(0)
        Animated.timing(
            this.circleAnimatedValue,
            {
                toValue: 1,
                duration: 350, useNativeDriver: true
            }
        ).start(() => {
            this.timeoutId  = setTimeout(() => {
                this.circleAnimated()
            }, 1000);
        })
    }
    componentDidMount() {
        this.circleAnimated()
    }
    componentWillUnmount() {
        clearTimeout(this.timeoutId);
    }

    render() {
        const translateX = this.circleAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 100]
        })

        const translateX2 = this.circleAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 200]
        })
        return (
            <View style={styles.container}>
                <View style={[{ marginBottom: 2 }, styles.card]}>
                    <View style={{ width: 100, height: 100, borderRadius: 60, backgroundColor: '#ECEFF1', overflow: 'hidden', marginRight: 16 }}>
                        <Animated.View style={{ width: '30%', opacity: 0.5, height: '100%', backgroundColor: 'white', transform: [{ translateX: translateX }] }}></Animated.View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-evenly', overflow: 'hidden' }}>
                        <Animated.View style={{ backgroundColor: '#ECEFF1', height: 32 }}>
                            <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX2 }] }}></Animated.View>
                        </Animated.View>
                        <View style={{ backgroundColor: '#ECEFF1', height: 32 }}>
                            <Animated.View style={{ width: '20%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX2 }] }}></Animated.View>
                        </View>
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#fff',
        paddingTop: 6,
        paddingHorizontal: 16,
        paddingBottom: 6
    },
    card: {
        padding: 16,
        shadowColor: 'black',
        borderRadius: 4,
        backgroundColor: '#FAFAFA',
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.1,
        flexDirection: 'row'
    }
});
