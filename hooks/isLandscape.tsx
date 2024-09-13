import {useEffect, useState} from "react";
import {Dimensions} from "react-native";

/**
 * Custom hook to determine if the device is in landscape orientation.
 * @returns {boolean} True if the device is in landscape mode, false otherwise.
 */
export const useIsLandscape = () => {
    const [isLandscape, setIsLandscape] = useState(
        Dimensions.get('window').width > Dimensions.get('window').height
    );

    useEffect(() => {
        const handleOrientationChange = () => {
            const { width, height } = Dimensions.get('window');
            setIsLandscape(width > height);
        };
        handleOrientationChange();

        const subscription = Dimensions.addEventListener('change', handleOrientationChange);

        return () => {
            if (subscription?.remove) {
                subscription.remove();
            } else {
                subscription?.remove();
            }
        };
    }, []);

    return isLandscape;
};