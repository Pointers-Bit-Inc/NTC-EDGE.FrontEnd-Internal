import React, {memo, useEffect, useMemo, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import PaymentModal from "@pages/activities/application/paymentModal/index";
import Text from "@atoms/text";
import {styles as paymentStyles} from "@pages/activities/application/paymentModal/styles"
import {requirementStyles, styles} from "@pages/activities/application/requirementModal/styles"
import FileOutlineIcon from "@assets/svg/fileOutline";
import {Bold, Regular, Regular500} from "@styles/font";
import {capitalize} from "@pages/activities/script";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {ACCOUNTANT, CASHIER} from "../../../../../reducers/activity/initialstate";
import AnimatedImage from 'react-native-animated-image-viewer';
import {fontValue} from "@pages/activities/fontValue";
import BorderPaymentBottom from "@assets/svg/borderPaymentBottom";
import {useComponentLayout} from "../../../../../hooks/useComponentLayout";
import {isMobile} from "@pages/activities/isMobile";
import PdfViewr from "@pages/activities/application/pdf";
import FileIcon from "@assets/svg/file";
import Card from "@pages/activities/application/card";
import useSafeState from "../../../../../hooks/useSafeState";
import CloseIcon from "@assets/svg/close";
import {currency, isNumber, numberBetween1And100} from "../../../../../utils/ntc";
import {infoColor} from "@styles/color";
import {PlusIcon} from "@atoms/icon";
import LoadingModal from "@pages/activities/loading/loadingModal";
import {setUserProfileForm} from "../../../../../reducers/application/actions";
import KeyboardShift from "@molecules/keyboard";
import DelayInput from "@atoms/debounceInput";
import {InputField} from "@molecules/form-fields";
import {setAmnesty} from "../../../../../reducers/soa/actions";

const flatten = require('flat')

class ProofPaymentView extends React.Component<{ proofOfPayment: any }> {


    state = {
        onLoadStart: true,
        onLoad: false,
        onError: false,
        visible: false,
        source: {uri: this.props?.proofOfPayment?.medium || "https://dummyimage.com/350x350/fff/aaa"},
        imageModal: null,
        image: null,
        _imageSize: {
            width: 0,
            height: 0
        },
        _sourceMeasure: {
            width: 0,
            height: 0,
            pageX: 0,
            pageY: 0
        },
        fileName: '',
        extension: ''
    };

    _showImageModal = () => this.setState({visible: true});
    _hideImageModal = () => this.setState({visible: false});
    _requestClose = () => this.state.imageModal?.close();
    _showImage = () => {
        new Promise((resolve, reject) => {
            this.setState({onLoad: true, visible: true})
            setTimeout(() => {
                resolve('');
            }, 1000);
        }).then(() => {
            this.setState({onLoad: false})
            this.state.image?.measure((x, y, width, height, pageX, pageY) => {
                if (width && height) {
                    this.setState({
                        _sourceMeasure: {
                            width: width || 0,
                            height: height || 0,
                            pageX: pageX || 0,
                            pageY: pageY || 0
                        },
                        onLoad: false
                    });
                }
            });
        })
    };

    componentDidUpdate(prevProps, prevState) {

        if (prevProps?.proofOfPayment?.medium != this.props?.proofOfPayment?.medium) {

            this.setImage();

        }
    }

    componentDidMount() {

        this.setImage()
    }

    render() {
        return <>
            {this.props.proofOfPayment?.original &&

                <View style={{
                    ...Platform.select({
                        native: {},
                        default: {}

                    })
                }}>
                    {this.props.proofOfPayment?.original &&
                        <TouchableOpacity
                            disabled={!this?.state?._imageSize?.height && this.state.onLoadStart && !this.state.extension}
                            ref={image => (
                                this.state.image = image)}
                            onPress={this._showImage}>
                            <View style={{

                                alignItems: "center",
                                flex: 1,
                                flexDirection: "row",
                                paddingBottom: 16
                            }}>
                                <View style={{paddingRight: 5}}>
                                    <FileOutlineIcon height={fontValue(20)} width={fontValue(16)}/>
                                </View>

                                <Text
                                    color={"#606A80"}
                                    size={12}
                                    style={{
                                        width: 240
                                    }}>{this.props?.proofOfPayment?.original?.split("/")?.[this.props?.proofOfPayment?.original?.split("/")?.length - 1]}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    <View style={{
                        justifyContent: "center", ...Platform.select({
                            native: {alignItems: "center"},
                            default: {alignItems: "flex-start"}
                        })
                    }}>
                        <TouchableOpacity
                            disabled={!this?.state?._imageSize?.height && this.state.onLoadStart && !this.state.extension}
                            ref={image => (
                                this.state.image = image)}
                            onPress={this._showImage}>
                            {
                                this.state.extension ? <FileIcon
                                    color={"#606A80"}
                                    width={150}
                                    height={150}
                                /> : <Image

                                    style={[styles.pictureContainer]}
                                    source={{
                                        uri: this.props?.proofOfPayment?.original,
                                    }}
                                />
                            }


                        </TouchableOpacity>
                    </View>

                </View>
            }


            <Modal visible={this.state.visible} transparent onRequestClose={this._hideImageModal}>
                <SafeAreaView style={{flex: 1}}>

                    <View style={[styles.container, {
                        backgroundColor: (
                            /(pdf|docx|doc)$/ig.test(this.state.fileName.substr((
                                this.state.fileName.lastIndexOf('.') + 1))) && isMobile) ? "rgba(0,0,0,0.5)" : undefined,
                    }]}>
                        <View style={styles.rect2}>
                            <View style={{alignSelf: 'flex-end', zIndex: 1,}}>
                                <View style={{backgroundColor: "rgba(0,0,0,0.7)", padding: 20}}>
                                    <TouchableOpacity onPress={this._hideImageModal}>
                                        <Text style={styles.close}>Close</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>

                        {!this.state.onLoad ? (
                            /(pdf|docx|doc)$/ig.test(this.state.fileName.substr((
                                this.state.fileName.lastIndexOf('.') + 1))) && isMobile) ?
                            <View style={{width: "100%", height: "80%", top: 80}}>
                                <PdfViewr requirement={this.props?.proofOfPayment}/>
                            </View>
                            :
                            <AnimatedImage

                                ref={imageModal => (
                                    this.state.imageModal = imageModal)}
                                source={this.state.source}
                                sourceMeasure={this.state._sourceMeasure}
                                imageSize={this.state._imageSize}
                                onClose={this._hideImageModal}
                                animationDuration={200}
                            /> : <View style={{flex: 1, justifyContent: "center", alignSelf: "center"}}>
                            <ActivityIndicator color={"#fff"}/>
                        </View>}


                    </View>
                </SafeAreaView>

            </Modal>
        </>;
    }

    private setImage() {
        let _fileName = this.props?.proofOfPayment?.original?.split("/")?.[this.props?.proofOfPayment?.original?.split("/")?.length - 1];

        this.setState({
            onLoadStart: true,
            fileName: _fileName,
            extension: (
                /(pdf|docx|doc)$/ig.test(_fileName?.substr((
                    _fileName?.lastIndexOf('.') + 1)))),
        });
        Image.prefetch(this.props?.proofOfPayment?.medium)
            .then(() => {

                this.setState({onLoadStart: false});
                Image.getSize(this.props?.proofOfPayment?.medium, (width, height) => {

                    this.setState({
                        source: {
                            ...this?.state?.source,
                            uri: this?.props?.proofOfPayment?.medium || "https://dummyimage.com/350x350/fff/aaa"
                        },
                        _imageSize: {
                            width: width || 300,
                            height: height || 300
                        }
                    });


                    this.setState({onLoadStart: false})
                }, error => {
                    console.log("exit image prefetch")
                    this.setState({
                        ...this.state,
                        source: {
                            ...this?.state?.source,
                            uri: "https://dummyimage.com/350x350/fff/aaa"
                        },
                    });
                    this.setState({onLoadStart: true})
                })
            }, error => {
                this.setState({
                    ...this.state,
                    source: {
                        ...this?.state?.source,
                        uri: "https://dummyimage.com/350x350/fff/aaa"
                    },
                });
                this.setState({onLoadStart: true})
            });

    }
}


const Payment = (_props: any) => {

    const props = useMemo(() => _props, [_props])
    useEffect(()=>{
        const isValid = handleValidation([_props?.amnesty]);
        if(isValid || _props?.amnesty){
            dispatch(setAmnesty(_props?.amnesty))
        }
    }, [_props?.id])
    const dispatch = useDispatch();
    const amnesty = useSelector((state: RootStateOrAny) => state.soa.amnesty);
    const userProfileForm = useSelector((state: RootStateOrAny) => state.application.userProfileForm);
    const userOriginalProfileForm = useSelector((state: RootStateOrAny) => state.application.userOriginalProfileForm);

    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleRequireModal, setVisibleRequireModal] = useState(false);
    const [selectImage, setSelectImage] = useState('');
    const user = useSelector((state: RootStateOrAny) => state.user);
    const onDismissed = () => {

        setVisibleModal(false)
    };

    const onDismissedModal = () => {
        setSelectImage("");
        setVisibleRequireModal(false)
    };


    const [soa, setSoa] = useSafeState(props?.soa?.filter(s => !(['delete'].indexOf(s?.type ) > -1))?.map(((s, index) => {
        return {...s, error: false, isEdit: false, id: index}
    })) || [])

    useEffect(() => {
        setSoa(props?.soa?.filter(s => !(['delete'].indexOf(s?.type ) > -1))?.map(((s, index) => {
            return {...s, error: false, isEdit: false, id: index}
        })) || [])
    }, [props.soa, props.edit])

    const getTotal = () => {
        let total = 0;
        soa?.filter(s => !(['delete'].indexOf(s?.type ) > -1))?.map(s => total += isNumber(parseFloat(s.amount)) ? parseFloat(s.amount) : 0);
        return props.totalFee?.toFixed(2);
    };
    const largestNumber = (array) => {
        if (!array.length) return 1
        return Math.max.apply(Math, array.map(function (o) {
            return o?.id;
        })) + 1
    }

    const addSoa = () => {

        const obj = {id: largestNumber(soa), type: 'add', error: false, 'item': "", 'amount': "" + 0,};
        setSoa((s) => {
            return [...s, obj]
        })
    }
    const closeItem = (id, index) => {
        let state = {...userProfileForm};
        let arr = soa.filter((el, i) => {
            return el.id !== id
        });
/*
        delete state?.["soa." + id + ".amount"];
        delete state?.["soa." + id + ".item"];
        delete state?.["soa." + id + ".id"];
        delete state?.["soa." + id + ".isEdit"];
        delete state?.["soa." + id + ".description"];*/
        state["soa." + id + ".type"]  = "delete"
        dispatch(setUserProfileForm(state))
        setSoa(arr);
    }
    const updateSoa = (stateName, value, index) => {

        let hasChanges = false
        let compare = soa?.findIndex(uf => uf.id === index);

        if (value !== props.soa?.[compare]?.[stateName]) {

            hasChanges = true;
            props.hasChanges(hasChanges)
        }
        setSoa(prevState => {
            const newState = prevState.map((obj, i) => {
                if (obj.id === index) {
                    return {...obj, type: "edit",  [stateName]: value};
                }

                return obj;
            });

            return newState;
        });


    }

    /* useEffect(() => {
         if (Platform.OS == "web") {
             props.setPaymentIndex(props.paymentIndex)
             dispatch(setEditModalVisible(true))
         }

     }, [])*/
    const applicantForm = (stateName, value, s?) => {
        let newForm = {...userProfileForm}

        if(s?.id){
            newForm["soa." + s.id + ".type"] = s?.type
        }

        newForm[stateName] = value
        dispatch(setUserProfileForm(newForm))
    }
    const updateApplication = () => {
        props?.updateApplication(() => {

        })

    }
    useEffect(() => {
        hasChanges()

    }, [userProfileForm])
    const hasChanges = () => {
        var hasChanges = false;

        for (const [key, value] of Object.entries(userOriginalProfileForm)) {

            if (userOriginalProfileForm?.[key] != userProfileForm?.[key]) {
                hasChanges = true

                props.hasChanges(hasChanges)
                return
            } else {
                hasChanges = false
                props.hasChanges(hasChanges)
            }
        }
    }
    const [sizeComponent, onLayoutComponent] = useComponentLayout();
    const [value, setValue] = useState()
    const handleValidation = (value) => {
        const pattern  = '^(0|[1-9][0-9]?|100)$'
        if (!pattern) return true;

        // string pattern, one validation rule
        if (typeof pattern === 'string') {
            const condition = new RegExp(pattern, 'g');
            return condition.test(value);
        }

        // array patterns, multiple validation rules
        if (typeof pattern === 'object') {
            const conditions = pattern.map(rule => new RegExp(rule, 'g'));
            return conditions.map(condition => condition.test(value));
        }
    }
    const getOnChange =((e) => {
        const isValid = handleValidation(e?.nativeEvent?.text);
            if(isValid || (e?.nativeEvent?.text == "")){
                dispatch(setAmnesty(e?.nativeEvent?.text))
            }

    })

    return <View style={{flex: 1}}>
        {(props.loading && Platform.OS != "web") && <LoadingModal saved={props?.saved} loading={props.loading}/>}
        <KeyboardShift>
            {() => (


                <ScrollView

                >

                    <View style={styles.containers}>
                        <View onLayout={onLayoutComponent} style={styles.statement}>

                            <View style={{alignItems: 'center', backgroundColor: "#E0E0E0"}}>
                                <Text
                                    style={{paddingVertical: 6, fontSize: fontValue(14), fontFamily: Bold}}
                                    color="#37405B"

                                >
                                    {"Statement of Account".toUpperCase()}
                                </Text>
                            </View>
                            <View style={{marginTop: 20}}>
                                <View
                                    style={{
                                        width: "100%",
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Text
                                        style={{fontSize: fontValue(14), fontFamily: Bold}}
                                        color="#37405B"
                                    >
                                        Particular
                                    </Text>
                                    <Text
                                        style={{fontSize: fontValue(14), fontFamily: Bold}}
                                        color="#37405B"
                                    >
                                        Amount
                                    </Text>
                                </View>
                                {
                                    soa.length ? soa?.filter(s => !(['delete'].indexOf(s?.type ) > -1))?.map((s, index) => {

                                        return <View key={index} style={{
                                                borderBottomColor: "#E5E5E5",
                                                borderBottomWidth: 2,
                                                width: "100%"
                                            }}>

                                                <View
                                                    key={s._id}
                                                    style={paymentStyles.soaItem}
                                                >

                                                    <View style={{flex: 1}}>

                                                        <Card updateApplication={updateApplication}
                                                              updateForm={(stateName, value) => {
                                                                  if (!!soa.filter(s => {
                                                                      return s.item == value
                                                                  }).length) {
                                                                      s.error = true

                                                                  } else {

                                                                      s.error = false
                                                                  }
                                                                  applicantForm(stateName, value, s)
                                                              }}
                                                              error={s.error}
                                                              stateName={"soa." + s.id + ".item"}
                                                              edit={props.edit}
                                                              display={userProfileForm?.["soa." + s.id + ".item"] || "Item"}
                                                              label={"Item:"}
                                                              style={{
                                                                  paddingVertical: 14,
                                                                  color: "#37405B",
                                                                  fontSize: fontValue(12)
                                                              }}
                                                              applicant={userProfileForm?.["soa." + s.id + ".item"]}/>
                                                    </View>
                                                    <View style={{flex: 1, width: "100%", paddingLeft: 3}}>
                                                        <Card updateApplication={updateApplication}

                                                              keyboardType={'decimal-pad'}
                                                              updateForm={(stateName, value) => {
                                                                  updateSoa('amount', parseFloat(value), s.id)
                                                                  applicantForm('totalFee', getTotal(soa))
                                                                  applicantForm(stateName, value, s)
                                                              }}
                                                              touchableStyle={{alignSelf: "flex-end"}}
                                                              stateName={"soa." + s.id + ".amount"}
                                                              edit={props.edit}
                                                              display={userProfileForm?.["soa." + s.id + ".amount"] || "0"}
                                                              label={"Amount:"}
                                                              style={{
                                                                  paddingVertical: 14,
                                                                  color: "#37405B",
                                                                  fontSize: fontValue(14)
                                                              }}
                                                              applicant={userProfileForm?.["soa." + s.id + ".amount"] != undefined ? "" + userProfileForm?.["soa." + s.id + ".amount"] : 0}/>
                                                    </View>
                                                    {props.edit && <View style={{}}>
                                                        <TouchableOpacity onPress={() => {
                                                            closeItem(s.id, index)
                                                        }}
                                                                          style={{paddingHorizontal: 10}}>
                                                            <CloseIcon/>
                                                        </TouchableOpacity>
                                                    </View>}

                                                </View>


                                            </View>
                                        }
                                    ) : <View style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingVertical: 10
                                    }}><Text
                                        style={{fontSize: fontValue(16), fontFamily: Regular500}}>No S.O.A</Text></View>
                                }
                                {props.edit && <TouchableOpacity onPress={addSoa}><View
                                    style={{flexDirection: 'row', alignItems: "center", paddingTop: fontValue(14)}}>
                                    <View style={{marginRight: fontValue(10)}}>
                                        <PlusIcon size={fontValue(12)} color={infoColor}/>
                                    </View>

                                    <Text style={{fontSize: fontValue(15), fontFamily: Regular, color: infoColor}}>Add
                                        Item</Text>
                                </View></TouchableOpacity>}
                                <View style={{paddingTop: 15}}>

                                    <View
                                        style={{
                                            borderTopWidth: 1,
                                            borderTopColor: "#000",
                                            backgroundColor: "#E0E0E0",
                                            flexDirection: 'row',
                                            justifyContent: !props.edit ? "flex-end" : "space-between",
                                            alignItems: 'center',
                                            paddingVertical: fontValue(5)
                                        }}
                                    >
                                        {(props.edit && props?.applicationTypeLabel?.toLowerCase()?.indexOf( "renewal" ) != -1 )? <View style={{  justifyContent: "center", flex: 1, marginHorizontal: 20}}>
                                            <InputField mainContainerStyle={{marginBottom: 0}} value={amnesty} onChange={getOnChange} label={"Amnesty (%)"}  placeholder={"Amnesty"}/>
                                        </View> : <></>}
                                        <View style={{marginRight: 30, flexDirection: "row"}}>
                                            <Text

                                                color="#37405B"
                                                style={{fontSize: fontValue(14), fontFamily: Regular, marginRight: 30}}
                                            >
                                                {"Total".toUpperCase()}
                                            </Text>
                                            <Text
                                                style={{fontSize: fontValue(16), fontFamily: Bold}}
                                                color="#37405B"
                                            >
                                                {currency(getTotal())}
                                            </Text>
                                        </View>


                                    </View>
                                </View>


                            </View>


                        </View>
                        <View style={{overflow: "hidden", zIndex: -1, flexDirection: "row",}}>
                            {
                                !!sizeComponent && Array(Math?.round(sizeComponent?.width / 20))?.fill(0)?.map((bottom, index) =>
                                    <BorderPaymentBottom key={index} style={{marginTop: -2}}/>)
                            }
                        </View>

                        <View style={[paymentStyles.container, {paddingTop: 12}]}>


                            {((user?.role?.key !== ACCOUNTANT) && (user?.role?.key === CASHIER)) &&
                                <View style={requirementStyles.container}>

                                    <View style={[requirementStyles.card, {padding: undefined}]}>
                                        <View style={requirementStyles.cardContainer}>
                                            <TouchableOpacity onPress={() => {
                                                setVisibleModal(true)
                                            }}>
                                                <View>
                                                    <Text style={requirementStyles.title}>Payment</Text>
                                                    <View style={requirementStyles.cardTitle}>

                                                        <View style={{alignItems: "center"}}>

                                                            <Text style={requirementStyles.paymentDescription}>Payment
                                                                received
                                                                for</Text>
                                                            <Text
                                                                style={requirementStyles.paymentDescription}>NTC-EDGE</Text>
                                                            <Text style={requirementStyles.paymentDescription}>the amout
                                                                of</Text>
                                                            <Text
                                                                style={[requirementStyles.paymentDescription, {fontFamily: Bold}]}>PHP {props.totalFee}</Text>
                                                            {props.paymentMethod && <View style={{paddingVertical: 10}}>
                                                                <Text>
                                                                    <Text
                                                                        style={[requirementStyles.paymentDescription, {fontFamily: Bold}]}>
                                                                        Payment
                                                                        method: {capitalize(props.paymentMethod?.replace("-", " "))}
                                                                    </Text>
                                                                </Text>
                                                            </View>}

                                                        </View>

                                                    </View>


                                                </View>
                                            </TouchableOpacity>

                                            {props?.proofOfPayment && <View style={{
                                                ...Platform.select({
                                                    native: {
                                                        padding: 10
                                                    },
                                                    default: {
                                                        padding: 22
                                                    }
                                                })
                                            }}>
                                                <FlatList
                                                    style={{

                                                        padding: 15,
                                                        paddingVertical: 10,
                                                        flex: 1,
                                                        borderColor: "#ECECEC",
                                                        borderWidth: 1,
                                                        backgroundColor: "#FBFBFB",
                                                        borderRadius: 5
                                                    }}
                                                    showsHorizontalScrollIndicator={!isMobile}
                                                    showsVerticalScrollIndicator={isMobile}
                                                    horizontal={isMobile ? false : true}
                                                    data={props.proofOfPayment}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({item, index}) => (
                                                        <ProofPaymentView proofOfPayment={item}/>
                                                    )}
                                                />

                                            </View>}
                                        </View>

                                    </View>
                                </View>

                            }


                        </View>
                    </View>


                    <PaymentModal updatedAt={props?.updatedAt}
                                  paymentMethod={props?.paymentMethod}
                                  applicant={props?.applicant}
                                  totalFee={props?.totalFee}
                                  officialReceipt={props?.officialReceipt}
                                  visible={visibleModal}
                                  onDismissed={onDismissed}/>
                </ScrollView>
            )}
        </KeyboardShift>
    </View>
};


export default memo(Payment)
