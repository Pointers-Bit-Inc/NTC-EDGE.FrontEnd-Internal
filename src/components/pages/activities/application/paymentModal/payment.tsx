import React, {useState} from "react";
import {
    Dimensions ,
    Image , Modal ,
    ScrollView ,
    StyleSheet ,
    TouchableOpacity ,
    TouchableWithoutFeedback ,
    View
} from "react-native";
import {Entypo, EvilIcons} from "@expo/vector-icons";
import PaymentModal from "@pages/activities/application/paymentModal/index";
import Text from "@atoms/text";
import {styles as paymentStyles} from "@pages/activities/application/paymentModal/styles"
import {styles} from "@pages/activities/application/requirementModal/styles"
import {requirementStyles} from "@pages/activities/application/requirementModal/styles"
import FileOutlineIcon from "@assets/svg/fileOutline";
import {Bold , Regular , Regular500} from "@styles/font";
import _ from "lodash";
import {capitalize} from "@pages/activities/script";
import {RFValue} from "react-native-responsive-fontsize";
import {RootStateOrAny , useSelector} from "react-redux";
import {ACCOUNTANT} from "../../../../../reducers/activity/initialstate";
import FadeBackground from "@assets/svg/fade-background";
const {width, height} = Dimensions.get("screen")
import AnimatedImage from 'react-native-animated-image-viewer';

class ProofPaymentView extends React.Component<{onPress: () => void, totalFee: any, paymentMethod: any, proofOfPayment: any, onPress1: () => void }> {
    source = { uri : this.props?.proofOfPayment?.medium || "" };
    imageModal = null;
    image = null;
    state = {
        visible : false
    };
    _imageSize = {
        width : 0 ,
        height : 0
    };
    _sourceMeasure = {
        width : 0 ,
        height : 0 ,
        pageX : 0 ,
        pageY : 0
    };
    _showImageModal = () => this.setState({ visible : true });
    _hideImageModal = () => this.setState({ visible : false });
    _requestClose = () => this.imageModal.close();
    _showImage = () => {
        this.image.measure((x , y , width , height , pageX , pageY) => {
            this._sourceMeasure = {
                width ,
                height ,
                pageX ,
                pageY
            };
            this._showImageModal();
        });
    };

    componentDidMount() {
        Image.getSize(this.source.uri , (width , height) => {
            this._imageSize = {
                width : width ,
                height : height
            }
        });
    }
    render() {
        return <><View style={ [requirementStyles.card , { padding : undefined }] }>
            <View style={ requirementStyles.cardContainer }>
                <TouchableOpacity onPress={ this.props.onPress }>
                    <View style={ requirementStyles.cardLabel }>
                        <Text style={ requirementStyles.title }>Payment</Text>
                        <View style={ requirementStyles.cardTitle }>

                            <View style={ { alignItems : "center" } }>

                                <Text style={ requirementStyles.paymentDescription }>Payment received for</Text>
                                <Text style={ requirementStyles.paymentDescription }>NTC-EDGE</Text>
                                <Text style={ requirementStyles.paymentDescription }>the amout of</Text>
                                <Text
                                    style={ [requirementStyles.paymentDescription , { fontFamily : Bold }] }>PHP { this.props.totalFee }</Text>
                                { this.props.paymentMethod && <View style={ { paddingVertical : 10 } }>
                                    <Text>
                                        <Text
                                            style={ [requirementStyles.paymentDescription , { fontFamily : Bold }] }>
                                            Payment
                                            method: { capitalize(this.props.paymentMethod?.replace("-" , " ")) }
                                        </Text>
                                    </Text>
                                </View> }

                            </View>

                        </View>
                        { this.props.proofOfPayment?.small && <View
                            style={ [{ paddingTop : 5 , paddingBottom : 9 } , requirementStyles.cardDocument] }>
                            <View style={ { paddingRight : 10 } }>
                                <FileOutlineIcon height={RFValue(20)} width={RFValue(16)}/>
                            </View>

                        </View> }

                    </View>
                </TouchableOpacity>
                { this.props.proofOfPayment?.small && <View style={ {
                    height : 216 ,
                    backgroundColor : "rgba(220,226,229,1)" ,
                    borderWidth : 1 ,
                    borderColor : "rgba(213,214,214,1)" ,
                    borderStyle : "dashed" ,
                } }>
                    <TouchableOpacity  ref={image => (this.image = image)}
                                       onPress={this._showImage}>

                        <Image
                            style={ { height : 216 } }
                            source={ {
                                uri : this.props.proofOfPayment?.small ,
                            } }
                        />
                    </TouchableOpacity>
                </View> }

            </View>
        </View>

            <Modal visible={ this.state.visible } transparent onRequestClose={ this._requestClose }>
                <View style={ styles.container }>
                    <View style={ styles.rect2 }>
                        <View style={ {  alignSelf :  'flex-end' ,  paddingHorizontal : 15 , paddingVertical : 15 } }>
                            <TouchableOpacity onPress={this._requestClose}>
                                <Text style={ styles.close }>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={ { height : '100%' , width : '100%' } } >
                        <AnimatedImage

                            ref={ imageModal => (
                                this.imageModal = imageModal) }
                            source={ this.source }
                            sourceMeasure={ this._sourceMeasure }
                            imageSize={ this._imageSize }
                            onClose={ this._hideImageModal }
                            animationDuration={ 200 }
                        />
                    </View>

                    </View>
            </Modal>
        </>;
    }
}

const Payment = (props:any) => {
    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleRequireModal, setVisibleRequireModal] = useState(false)
    const [selectImage , setSelectImage] = useState('');
    const user = useSelector((state: RootStateOrAny) => state.user);
    const onDismissed = () =>{

        setVisibleModal(false)
    }

    const onDismissedModal = ()=>{
        setSelectImage("");
        setVisibleRequireModal(false)
    }

    const getTotal = (soa) => {
        let total = 0;
        soa.map(s => total += s.amount);
        return total;
    }

    return <ScrollView style={ { backgroundColor : "#fff" , width : "100%" , paddingTop : 10 } }>
        <View style={ [paymentStyles.container , { marginTop : 12 }] }>

            <View style={ { padding : 5 , alignItems : 'center' } }>
                <Text
                    style={ { fontSize: RFValue(14), fontFamily : Bold } }
                    color="#37405B"
                    
                >
                    Statement of Account
                </Text>
            </View>
            <View style={ { paddingVertical : 10 , marginTop : 20 } }>
                <View
                    style={ { flexDirection : 'row' , justifyContent : 'space-between' } }
                >
                    <Text
                        style={ {fontSize: RFValue(14), fontFamily : Bold } }
                        color="#37405B"
                    >
                        Particular
                    </Text>
                    <Text
                        style={ { fontSize: RFValue(14),fontFamily : Bold } }
                        color="#37405B"
                    >
                        Amount
                    </Text>
                </View>
                {
                    props?.soa?.map(soa => (
                        <View
                            key={ soa._id }
                            style={ paymentStyles.soaItem }
                        >
                            <Text
                                color="#37405B"
                                style={ { fontSize: RFValue(14) } }
                            >
                                { soa.item }
                            </Text>
                            <Text
                                color="#37405B"
                                style={ { fontSize: RFValue(14) } }
                            >
                                P{ soa.amount }
                            </Text>
                        </View>
                    ))
                }
                <View
                    style={ {
                        flexDirection : 'row' ,
                        justifyContent : 'flex-end' ,
                        alignItems : 'center' ,
                        marginTop : 15
                    } }
                >
                    <Text
                        color="#37405B"
                        style={ { fontSize:RFValue(16),  marginRight : 15 , fontFamily : Bold } }
                    >
                        Total
                    </Text>
                    <Text
                        style={ {fontSize:  RFValue(16),  fontFamily : Bold } }
                        color="#37405B"
                    >
                        P{ props.totalFee }
                    </Text>
                </View>
            </View>


            { user?.role?.key !== ACCOUNTANT && <View style={ requirementStyles.container }>
                <ProofPaymentView onPress={ () => {
                    setVisibleModal(true)
                } } totalFee={ props?.totalFee } paymentMethod={ props?.paymentMethod }
                                  proofOfPayment={ props?.proofOfPayment } onPress1={ () => {
                    setSelectImage(props?.proofOfPayment?.large);
                    setVisibleRequireModal(true)
                } }/>
            </View> }


        </View>


        <PaymentModal updatedAt={ props?.updatedAt } paymentMethod={ props?.paymentMethod }
                      applicant={ props?.applicant } totalFee={ props?.totalFee } visible={ visibleModal }
                      onDismissed={ onDismissed }/>
    </ScrollView>

}


export default Payment