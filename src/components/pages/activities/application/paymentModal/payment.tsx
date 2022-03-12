import React , {useState} from "react";
import {Image , Modal , ScrollView , TouchableOpacity , View} from "react-native";
import PaymentModal from "@pages/activities/application/paymentModal/index";
import Text from "@atoms/text";
import {styles as paymentStyles} from "@pages/activities/application/paymentModal/styles"
import {requirementStyles , styles} from "@pages/activities/application/requirementModal/styles"
import FileOutlineIcon from "@assets/svg/fileOutline";
import {Bold} from "@styles/font";
import {capitalize} from "@pages/activities/script";
import {RootStateOrAny , useSelector} from "react-redux";
import {ACCOUNTANT} from "../../../../../reducers/activity/initialstate";
import AnimatedImage from 'react-native-animated-image-viewer';
import {fontValue} from "@pages/activities/fontValue";
import BorderPaymentBottom from "@assets/svg/borderPaymentBottom";
import {useComponentLayout} from "../../../../../hooks/useComponentLayout";

class ProofPaymentView extends React.Component<{ onPress: () => void, totalFee: any, paymentMethod: any, proofOfPayment: any, onPress1: () => void }> {
    source = { uri : this.props?.proofOfPayment?.medium || "https://dummyimage.com/350x350/fff/aaa" };
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
        Image.getSize(this?.source?.uri , (width , height) => {
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


                    </View>
                </TouchableOpacity>
                {this.props.proofOfPayment?.small && <View style={ { padding : 22 , } }>
                    <ScrollView style={ {
                        padding : 25 ,
                        flex : 1 ,
                        borderColor : "#ECECEC" ,
                        borderWidth : 1 ,
                        backgroundColor : "#FBFBFB" ,
                        borderRadius : 5
                    } } horizontal={ true }>
                        { this.props.proofOfPayment?.small && <View style={ {
                            paddingRight : 30

                        } }>
                            { this.props.proofOfPayment?.small && <View style={ { paddingBottom : 16 } }>
                                <FileOutlineIcon height={ fontValue(20) } width={ fontValue(16) }/>
                            </View> }
                            <TouchableOpacity  ref={image => (this.image = image)}
                                               onPress={this._showImage}>
                            <Image

                                style={ {
                                    width : 240 , height : 200 , borderRadius : 5 , borderWidth : 4 ,
                                    borderColor : "#fff"
                                } }
                                source={ {
                                    uri : this.props?.proofOfPayment?.small ,
                                } }
                            />
                            </TouchableOpacity>
                        </View> }
                        
                    </ScrollView>
                </View>}


            </View>
        </View>

            <Modal visible={ this.state.visible } transparent onRequestClose={ this._requestClose }>
                <View style={ styles.container }>
                    <View style={ styles.rect2 }>
                        <View style={ { alignSelf : 'flex-end' , paddingHorizontal : 15 , paddingVertical : 15 } }>
                            <TouchableOpacity onPress={ this._requestClose }>
                                <Text style={ styles.close }>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={ { height : '100%' , width : '100%' } }>
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

const Payment = (props: any) => {
    const [visibleModal , setVisibleModal] = useState(false);
    const [visibleRequireModal , setVisibleRequireModal] = useState(false);
    const [selectImage , setSelectImage] = useState('');
    const user = useSelector((state: RootStateOrAny) => state.user);
    const onDismissed = () => {

        setVisibleModal(false)
    };

    const onDismissedModal = () => {
        setSelectImage("");
        setVisibleRequireModal(false)
    };

    const getTotal = (soa) => {
        let total = 0;
        soa.map(s => total += s.amount);
        return total;
    };
    const [sizeComponent , onLayoutComponent] = useComponentLayout();
    return <ScrollView style={ {
        backgroundColor : "#F8F8F8" ,
        width : "100%" ,
        paddingHorizontal : 64 ,
        paddingTop : 34 ,
        paddingBottom : 45
    } }>
        <View onLayout={ onLayoutComponent } style={ {
            borderRadius : 10 ,
            borderBottomStartRadius : 0 ,
            borderBottomEndRadius : 0 ,
            paddingHorizontal : 17 ,
            paddingVertical : 36 ,
            borderBottomWidth : 0 ,
            backgroundColor : "#fff" ,
            borderWidth : 1 ,
            borderColor : "#E5E5E5" ,
        } }>
            <View style={ { alignItems : 'center' , backgroundColor : "#EFF0F6" } }>
                <Text
                    style={ { paddingVertical : 6 , fontSize : fontValue(14) , fontFamily : Bold } }
                    color="#37405B"

                >
                    Statement of Account
                </Text>
            </View>
            <View style={ { marginTop : 20 } }>
                <View
                    style={ {
                        paddingHorizontal : 15 ,
                        paddingVertical : 10 ,
                        width : "100%" ,
                        backgroundColor : "#EFF0F6" ,
                        flexDirection : 'row' ,
                        justifyContent : 'space-between'
                    } }
                >
                    <Text
                        style={ { fontSize : fontValue(14) , fontFamily : Bold } }
                        color="#37405B"
                    >
                        Particular
                    </Text>
                    <Text
                        style={ { fontSize : fontValue(14) , fontFamily : Bold } }
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
                                style={ { fontSize : fontValue(14) } }
                            >
                                { soa.item }
                            </Text>
                            <Text
                                color="#37405B"
                                style={ { fontSize : fontValue(14) } }
                            >
                                P{ soa.amount }
                            </Text>
                        </View>
                    ))
                }
                <View
                    style={ {
                        backgroundColor : "#EFF0F6" ,
                        flexDirection : 'row' ,
                        justifyContent : 'flex-end' ,
                        alignItems : 'center' ,
                        marginTop : 15
                    } }
                >
                    <Text

                        color="#37405B"
                        style={ { fontSize : fontValue(16) , fontFamily : Bold } }
                    >
                        Total
                    </Text>
                </View>
                <View
                    style={ {
                        flexDirection : 'row' ,
                        justifyContent : 'flex-end' ,
                        alignItems : 'center' ,
                        marginTop : 15
                    } }
                >
                    <Text
                        style={ { fontSize : fontValue(16) , fontFamily : Bold } }
                        color="#37405B"
                    >
                        P{ props.totalFee }
                    </Text>
                </View>
            </View>


        </View>
        <View style={ { zIndex : -1 , flexDirection : "row" , } }>
            {
                !!sizeComponent && Array(Math?.round(sizeComponent?.width / 20))?.fill(0)?.map(() =>
                    <BorderPaymentBottom style={ { borderWidth : 1 , borderColor : "#E5E5E5" , marginTop : -1 } }/>)
            }
        </View>

        <View style={ [paymentStyles.container , { marginTop : 12 }] }>


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

};


export default Payment