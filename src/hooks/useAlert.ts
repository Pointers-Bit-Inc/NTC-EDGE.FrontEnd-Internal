import {Animated} from "react-native";
import {useEffect , useRef , useState} from "react";

export  function useAlert(show:boolean,dismissed?:any) {
    const springValue = useRef(new Animated.Value(0.1)).current;

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
            useNativeDriver: true,
        }).start();
    }

    useEffect(() => {

        if (show) {
            _springShow(show);
        }
    }, [show, springValue, ])

    const _springHide = () => {
        Animated.spring(springValue, {
            toValue: 0,
            tension: 10,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
           _toggleAlert(false);
            dismissed()
        }, 70);
    };
    const _springCollapse = () => {
        Animated.spring(springValue, {
            toValue: 0,
            tension: 10,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
         _toggleAlert(false);
        }, 70);
    };

    
    return {springValue, _springHide, _springCollapse};
}
