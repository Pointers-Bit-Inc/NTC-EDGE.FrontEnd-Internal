import React, { Component } from 'react';
import {
    Text,
    Animated,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    BackHandler,
    Modal,
    Platform,
    StyleSheet
} from 'react-native';

import PropTypes from 'prop-types';
import { alertStyle } from './styles';
import {Bold} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import CloseModal from "@assets/svg/closeModal";
import {APPROVED, DECLINED, FOREVALUATION} from "../../../../reducers/activity/initialstate";
import EndorseToIcon from "@assets/svg/endorseTo";
import ApplicationApproved from "@assets/svg/application-approved";



const HwBackHandler = BackHandler;
const HW_BACK_EVENT = 'hardwareBackPress';

const { OS } = Platform;

export default class AwesomeAlert extends Component {
    constructor(props) {
        super(props);
        const { show } = this.props;
        this.springValue = new Animated.Value(props.animatedValue);

        this.state = {
            showSelf: false,
        };

        if (show) this._springShow(true);
    }

    componentDidMount() {
        HwBackHandler.addEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
    }

    _springShow = (fromConstructor) => {
        const { useNativeDriver = true } = this.props;

        this._toggleAlert(fromConstructor);
        Animated.spring(this.springValue, {
            toValue: 1,
            bounciness: 10,
            useNativeDriver,
        }).start();
    };

    _springHide = () => {
        const { useNativeDriver = true } = this.props;

        if (this.state.showSelf === true) {
            Animated.spring(this.springValue, {
                toValue: 0,
                tension: 10,
                useNativeDriver,
            }).start();
            this._toggleAlert();
            this._onDismiss();
        }
    };

    _toggleAlert = (fromConstructor) => {
        if (fromConstructor) this.state = { showSelf: true };
        else this.setState({ showSelf: !this.state.showSelf });
    };

    _handleHwBackEvent = () => {
        const { closeOnHardwareBackPress } = this.props;
        if (this.state.showSelf && closeOnHardwareBackPress) {
            this._springHide();
            return true;
        } else if (!closeOnHardwareBackPress && this.state.showSelf) {
            return true;
        }

        return false;
    };

    _onTapOutside = () => {
        const { closeOnTouchOutside } = this.props;
        if (closeOnTouchOutside) this._springHide();
    };

    _onDismiss = () => {
        const { onDismiss } = this.props;
        onDismiss && onDismiss();
    };

    _renderButton = (data) => {
        const {
            testID,
            text,
            backgroundColor,
            buttonStyle,
            buttonTextStyle,
            onPress,
        } = data;

        return (
            <TouchableOpacity  style={[alertStyle.button, { backgroundColor }, buttonStyle]} testID={testID} onPress={onPress}>
                <Text style={[alertStyle.buttonText, buttonTextStyle]}>{text}</Text>
            </TouchableOpacity>
        );
    };

    _renderAlert = () => {
        const animation = { transform: [{ scale: this.springValue }] };

        const { showProgress } = this.props;
        const { title, message, customView = null } = this.props;

        const {
            showCancelButton,
            cancelText,
            cancelButtonColor,
            cancelButtonStyle,
            cancelButtonTextStyle,
            onCancelPressed,
            cancelButtonTestID
        } = this.props;

        const {
            showConfirmButton,
            confirmText,
            confirmButtonColor,
            confirmButtonStyle,
            confirmButtonTextStyle,
            onConfirmPressed,
            confirmButtonTestID
        } = this.props;

        const {
            alertContainerStyle,
            overlayStyle,
            progressSize,
            progressColor,
            contentContainerStyle,
            contentStyle,
            titleStyle,
            messageStyle,
            actionContainerStyle,
        } = this.props;

        const cancelButtonData = {
            testID: cancelButtonTestID,
            text: cancelText,
            backgroundColor: cancelButtonColor,
            buttonStyle: cancelButtonStyle,
            buttonTextStyle: cancelButtonTextStyle,
            onPress: onCancelPressed,
        };

        const confirmButtonData = {
            testID: confirmButtonTestID,
            text: confirmText,
            backgroundColor: confirmButtonColor,
            buttonStyle: confirmButtonStyle,
            buttonTextStyle: confirmButtonTextStyle,
            onPress: onConfirmPressed,
        };

        return (
            <View style={{width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute', }}>
                <View style={[alertStyle.container, alertContainerStyle]}>
                    <TouchableWithoutFeedback >
                        <View style={[alertStyle.overlay, {  backgroundColor: Platform.OS == "web" ? undefined : 'rgba(52,52,52,0.5)'},  overlayStyle]} />
                    </TouchableWithoutFeedback>
                    <Animated.View
                        style={[alertStyle.contentContainer, animation, contentContainerStyle]}
                    >
                        <View style={styles.group}>
                            <View style={[styles.container___, styles.shadow]}>
                                <View style={styles.container__}>

                                    <View style={[styles.container_, {padding: "5%", paddingHorizontal: 48,}]}>
                                        {
                                            this.props?.type == DECLINED && <View>
                                                <CloseModal></CloseModal>
                                            </View>

                                        }
                                        {
                                            this.props?.type == FOREVALUATION && <View style={{paddingBottom: 10}}>
                                                <EndorseToIcon height_={fontValue(60)} width_={fontValue(60)} color={"#2863D6"}></EndorseToIcon>
                                            </View>
                                        }
                                        {
                                            this.props?.type == APPROVED && <View>
                                                <ApplicationApproved/>
                                            </View>
                                        }
                                        <Text style={[styles.title, alertStyle.titleStyle]}>{this.props?.title}</Text>
                                        <Text style={styles.description_}>
                                            {this.props?.message ? this.props?.message : "Are you sure you want to approve this application?"}

                                        </Text>

                                    </View>


                                </View>
                                <View style={[styles.action, {alignItems: "flex-end", paddingVertical: 15}]}>
                                    {

                                        this.props?.showClose == false && <>
                                            {this.props.onLoading ?  <ActivityIndicator style={{alignSelf: "center"}}
                                                                                        color={"rgba(40,99,214,1)"}/> :
                                                <TouchableOpacity onPress={this.props.onConfirmPressed}>

                                                    <Text
                                                        style={[alertStyle.confirmButtonTextStyle]}>{this.props?.confirmButton || 'Yes'}</Text>

                                                </TouchableOpacity>
                                            }
                                            <TouchableOpacity onPress={() => {
                                                if(!this.props.onLoading){
                                                    this.props.onDismissed()
                                                }
                                            }}>
                                                <Text style={[this.props.onLoading ?alertStyle.disableButtonTextStyle :  alertStyle.cancelButtonTextStyle  ]}>Close</Text>
                                            </TouchableOpacity>

                                        </>

                                    }

                                    {this.props?.showClose == true &&
                                        <TouchableOpacity onPress={() => {

                                            this.props.onCancelPressed()
                                        }}>
                                            <Text style={[alertStyle.confirmButtonTextStyle]}>Close</Text>
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </View>


        );
    };

    render() {
        const { show, showSelf } = this.state;
        const { modalProps = {}, closeOnHardwareBackPress } = this.props;

        const wrapInModal = OS === 'android' || OS === 'ios';

        return showSelf ?
            wrapInModal ? (
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={show}
                    onRequestClose={() => {
                        if (showSelf && closeOnHardwareBackPress) {
                            this._springHide();
                        }
                    }}
                    {...modalProps}
                >
                    {this._renderAlert()}
                </Modal>
            ) : this._renderAlert()
            : null;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { show } = nextProps;
        const { showSelf } = this.state;

        if (show && !showSelf) this._springShow();
        else if (show === false && showSelf) this._springHide();
    }

    componentWillUnmount() {
        HwBackHandler.removeEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
    }
}
const styles = StyleSheet.create({
    group: {
        alignSelf: "center"
    },
    shadow: {shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 60,
        shadowOpacity: 0.25,
        shadowRadius: 20,},
    container___: {

        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "rgba(255,255,255,1)",
        zIndex: 4,
        borderRadius: 14,
        borderWidth: 0,
        borderColor: "#000000"
    },
    container__: {


        //paddingVertical: 15

    },
    container_: {

        width: "100%",
        alignItems: "center",
    },
    title: {
        fontFamily: Bold,
        fontSize: fontValue(14),
        color: "#121212",
        textAlign: "center"
    },
    description_: {

        padding: 10,
        color: "#121212",
        textAlign: "center"
    },

    action: {
        borderTopWidth: 1,
        borderTopColor: "rgba(217,219,233,1)",

        flexDirection: "row",
        justifyContent: "space-around"
    },
});
AwesomeAlert.propTypes = {
    show: PropTypes.bool,
    animatedValue: PropTypes.number,
    useNativeDriver: PropTypes.bool,
    showProgress: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    closeOnTouchOutside: PropTypes.bool,
    closeOnHardwareBackPress: PropTypes.bool,
    showCancelButton: PropTypes.bool,
    showConfirmButton: PropTypes.bool,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    cancelButtonColor: PropTypes.string,
    confirmButtonColor: PropTypes.string,
    onCancelPressed: PropTypes.func,
    onConfirmPressed: PropTypes.func,
    customView: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.node,
        PropTypes.func,
    ]),
    modalProps: PropTypes.object,
    cancelButtonTestID: PropTypes.string,
    confirmButtonTestID: PropTypes.string
};

AwesomeAlert.defaultProps = {
    show: false,
    animatedValue: 0.3,
    useNativeDriver: true,
    showProgress: false,
    closeOnTouchOutside: true,
    closeOnHardwareBackPress: true,
    showCancelButton: false,
    showConfirmButton: false,
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    cancelButtonColor: '#D0D0D0',
    confirmButtonColor: '#AEDEF4',
    customView: null,
    modalProps: {},
    cancelButtonTestID: 'awesome-alert-cancel-btn',
    confirmButtonTestID: 'awesome-alert-confirm-btn'
};
