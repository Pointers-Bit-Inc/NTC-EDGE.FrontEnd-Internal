import React, {Component, memo} from 'react';
import { StyleSheet, View, Dimensions, Animated, Platform } from 'react-native';
import {fontValue} from "@pages/activities/fontValue";


type Props = {};
class Skeleton extends Component<Props> {
    constructor(props) {
        super(props)
        this.circleAnimatedValue = new Animated.Value(0)
        this.timeoutId = 0

    }
    state = {
        isMounted: false
    }
    circleAnimated = () => {
        this.circleAnimatedValue.setValue(0)
        Animated.timing(
            this.circleAnimatedValue,
            {
                useNativeDriver: true,
                toValue: 1,
                duration: 350
            }
        ).start(() => {

                if(this.state.isMounted)this.circleAnimated()
        })
    }
    componentWillUnmount() {
        this.setState({
            isMounted: false
        })
    }

    componentDidMount() {
        this.setState({
            isMounted: true
        })
        this.circleAnimated()
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
                    <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#ECEFF1', overflow: 'hidden', marginRight: 20 }}>
                        <Animated.View style={{ width: '35%', opacity: 0.5, height: '100%', backgroundColor: 'white', transform: [{ translateX: translateX }] }}></Animated.View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-evenly', overflow: 'hidden' }}>
                        <Animated.View style={{ backgroundColor: '#ECEFF1', height: 32/2 }}>
                            <Animated.View style={{ width: '10%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX2 }] }}></Animated.View>
                        </Animated.View>
                        <View style={{ backgroundColor: '#ECEFF1', height: 32/2 }}>
                            <Animated.View style={{ width: '10%', height: '100%', backgroundColor: 'white', opacity: 0.5, transform: [{ translateX: translateX2 }] }}></Animated.View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
export default memo(Skeleton)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 6,
        paddingHorizontal: 16,
        paddingBottom: 6,
        borderRadius: 10,
    },
    card: {
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: '#Fff',
        shadowOpacity: 0.1,
        flexDirection: 'row'
    }
});
