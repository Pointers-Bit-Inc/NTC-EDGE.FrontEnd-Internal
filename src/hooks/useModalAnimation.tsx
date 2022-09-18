import {useState} from "react";
import {Animated, Dimensions} from "react-native";

function useModalAnimation() {
    const [animation] = useState(() => new Animated.Value(0));

    const background = animation.interpolate({
        inputRange: [0, 0.2, 1.8, 2],
        outputRange: [
            'rgba(0,0,0,0)',
            'rgba(0,0,0,.3)',
            'rgba(0,0,0,.3)',
            'rgba(0,0,0,0)',
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
    return {animation, background, display, success};
}

export default useModalAnimation
