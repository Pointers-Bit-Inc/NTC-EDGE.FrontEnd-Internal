import {Animated} from "react-native";
import {useEffect, useState} from "react";

export  function useAlert(show:boolean,dismissed?:any) {
    const springValue = new Animated.Value(0.3);
    const [showSelf, setShowSelf] = useState(false)
    const _toggleAlert = (fromConstructor?: boolean) => {
        if (fromConstructor) setShowSelf(true)
        else setShowSelf(show => !show);
    };
    const _springShow = (fromConstructor: boolean) => {
        _toggleAlert(fromConstructor);
        Animated.spring(springValue, {
            toValue: 1,
            bounciness: 10,
            useNativeDriver: false,
        }).start();
    }

    useEffect(() => {
        if (show) {
            _springShow(show);
        }
    }, [show, springValue])

    const _springHide = () => {
        Animated.spring(springValue, {
            toValue: 0,
            tension: 10,
            useNativeDriver: false,
        }).start();

        setTimeout(() => {
            _toggleAlert(false);
            dismissed()
        }, 70);
    };
    return {springValue, _springHide, showSelf};
}
