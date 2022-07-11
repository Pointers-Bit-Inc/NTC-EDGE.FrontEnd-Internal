import React from 'react';
import {StyleSheet, Text, Animated, View, Platform, Dimensions, TouchableOpacity} from 'react-native';
import {infoColor, primaryColor} from "@styles/color";
import {Bold, Regular} from "@styles/font";


const { width, height } = Dimensions.get('window');
export interface FloatingButtonProps {
    /**
     * Whether the button is visible
     */
    visible?: boolean;
    /**
     * Button element (all Button's component's props)
     */
    button?: any;
    /**
     * Secondary button element (all Button's component's props)
     */
    secondaryButton?: any;
    /**
     * The bottom margin of the button, or secondary button if passed
     */
    bottomMargin?: number;
    /**
     * The duration of the button's animations (show/hide)
     */
    duration?: number;
    /**
     * Whether to show/hide the button without animation
     */
    withoutAnimation?: boolean;
    /**
     * Whether to show background overlay
     */
    hideBackgroundOverlay?: boolean;
    /**
     * Used as testing identifier
     * <TestID> - the floatingButton container
     * <TestID>.button - the floatingButton main button
     * <TestID>.secondaryButton - the floatingButton secondaryButton
     */
    testID?: string;
}

class FloatingButton extends React.Component{
    static displayName = 'FloatingButton';

    static defaultProps = {
        duration: 300
    };

    initialVisibility?: boolean;
    firstLoad: boolean;
    visibleAnimated: Animated.Value;

    constructor(props: FloatingButtonProps) {
        super(props);

        this.initialVisibility = props.visible;
        this.firstLoad = true;
        this.visibleAnimated = new Animated.Value(Number(!!props.visible));
    }

    componentDidUpdate(prevProps: FloatingButtonProps) {
        const {visible, duration} = this.props;

        if (prevProps.visible !== visible) {
            Animated.timing(this.visibleAnimated, {
                toValue: Number(!!visible),
                duration,
                useNativeDriver: true
            }).start();
        }
    }

    getAnimatedStyle = () => {
        return {
            opacity: this.visibleAnimated,
            transform: [{translateY: this.visibleAnimated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height / 2, 0]
                })}]
        };
    }
    renderButton() {
        const {bottomMargin, button, secondaryButton, testID} = this.props;
        const bottom = secondaryButton ? 8: bottomMargin || 16;

        return (
            <View style={[styles.shadow, {padding: 20, marginTop: 16, marginBottom: bottom}]}>
                <TouchableOpacity onPress={button.onPress} style={{backgroundColor: infoColor, padding: 20,   borderRadius: 40,  justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "#fff", fontFamily: Bold}}>{button?.label}</Text>
                </TouchableOpacity>
            </View>
        );
    }




    render() {
        const {withoutAnimation, secondaryButton, visible, testID} = this.props;
        // NOTE: keep this.firstLoad as true as long as the visibility changed to true
        this.firstLoad && !visible ? this.firstLoad = true : this.firstLoad = false;

        // NOTE: On first load, don't show if it should not be visible
        if (this.firstLoad === true && !this.initialVisibility) {
            return false;
        }
        if (!visible && withoutAnimation) {
            return false;
        }

        return (
            <Animated.View
        style={[styles.container, this.getAnimatedStyle()]}
            >
        {this.renderButton()}
        </Animated.View>
    );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        top: undefined,

        alignItems: 'center',
        zIndex: Platform.OS == "android"?  99 : undefined
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%'
    },
    shadow: {

        elevation: 2
    }
});

export default FloatingButton;
