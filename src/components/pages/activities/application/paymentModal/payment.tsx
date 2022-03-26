import React , {useState} from "react";
import {FlatList , Image , Modal , ScrollView , TouchableOpacity , View} from "react-native";
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
import {isMobile} from "@pages/activities/isMobile";
import DottedLine from "@assets/svg/dotted";
import PdfViewr from "@pages/activities/application/pdf";
import FileIcon from "@assets/svg/file";
class ProofPaymentView extends React.Component<{ proofOfPayment: any }> {


    state = {
        onLoadStart: true,
       onError: false,
        visible : false ,
        source: { uri : this.props?.proofOfPayment?.medium || "https://dummyimage.com/350x350/fff/aaa" },
        imageModal:  null,
        image:null,
        _imageSize:  {
            width : 0 ,
            height : 0
        },
        _sourceMeasure: {
            width : 0 ,
            height : 0 ,
            pageX : 0 ,
            pageY : 0
        } ,
        fileName: '',
        extension: ''
    };

    _showImageModal = () => this.setState({ visible : true });
    _hideImageModal = () => this.setState({ visible : false });
    _requestClose = () => this.state.imageModal?.close();
    _showImage = () => {
        this.state.image?.measure((x , y , width , height , pageX , pageY) => {
            this.setState({
                _sourceMeasure : {
                    width: width || 0 ,
                    height: height || 0 ,
                    pageX: pageX || 0 ,
                    pageY: pageY || 0
                }
            });
            this._showImageModal();
        });
    };
    componentDidUpdate(prevProps , prevState) {

        if (prevProps?.proofOfPayment?.medium != this.props?.proofOfPayment?.medium) {

            this.setImage();

        }
    }
    private setImage() {
        let _fileName = this.props?.proofOfPayment?.small?.split("/")?.[this.props?.proofOfPayment?.small?.split("/")?.length - 1]
        this.setState({
            ...this.state ,
            source : {
                ...this?.state?.source ,
                uri : this?.props?.proofOfPayment?.medium || "https://dummyimage.com/350x350/fff/aaa"
            },

            fileName : _fileName ,
            extension: (/(pdf|docx|doc)$/ig.test(_fileName.substr((_fileName.lastIndexOf('.') + 1)))),
        });

        Image.getSize(this.props?.proofOfPayment?.medium || "https://dummyimage.com/350x350/fff/aaa" , (width , height) => {
            this.setState({

                _imageSize : {
                    width : width || 300 ,
                    height : height || 300
                }
            });

            this.setState({onLoadStart: false})
        }, error => {
            this.setState({onLoadStart: true})
        })
    }
    componentDidMount() {
        this.setImage()
    }
    render() {
        return <>
            { this.props.proofOfPayment?.small &&

            <View style={ {
                paddingRight : 30 ,
                paddingVertical : 10
            } }>
                { this.props.proofOfPayment?.small &&
                <TouchableOpacity ref={ image => (
                    this.state.image = image) }
                                  onPress={ this._showImage }>
                    <View style={ {
                        justifyContent : "center" , alignItems : "center" ,
                        flex : 1 ,
                        gap : 5 ,
                        flexDirection : "row" , paddingBottom : 16
                    } }>
                        <FileOutlineIcon height={ fontValue(20) } width={ fontValue(16) }/>
                        <Text
                            style={ { width : 240 } }>{ this.props?.proofOfPayment?.small?.split("/")?.[this.props?.proofOfPayment?.small?.split("/")?.length - 1] }</Text>
                    </View>
                </TouchableOpacity>
                }

                <TouchableOpacity disabled={this.state.onLoadStart} ref={ image => (
                    this.state.image = image) }
                                  onPress={ this._showImage }>
                    {
                        this.state.extension ?  <FileIcon
                            color={"#606A80"}
                            width={ 150 }
                            height={ 150}
                        />  : <Image

                            style={ [styles.pictureContainer]}
                            source={ {
                                uri : this.props?.proofOfPayment?.small ,
                            } }
                        />
                     }


                </TouchableOpacity>
            </View>
            }


            <Modal visible={ this.state.visible } transparent onRequestClose={ this._hideImageModal }>
                <View style={ styles.container }>
                    <View style={ styles.rect2 }>
                        <View style={ { alignSelf : 'flex-end' , paddingHorizontal : 15 , paddingVertical : 15 } }>
                            <TouchableOpacity onPress={ this._hideImageModal }>
                                <Text style={ styles.close }>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {(/(pdf|docx|doc)$/ig.test(this.state.fileName.substr((
                        this.state.fileName.lastIndexOf('.') + 1))) && isMobile) ?
                     <PdfViewr   requirement={ this.props?.proofOfPayment }/> : <View style={ { height : '100%' , width : '100%' } }>
                        <AnimatedImage

                            ref={ imageModal => (
                                this.state.imageModal = imageModal) }
                            source={ this.state.source }
                            sourceMeasure={ this.state._sourceMeasure }
                            imageSize={ this.state._imageSize }
                            onClose={ this._hideImageModal }
                            animationDuration={ 200 }
                        />
                    </View> }

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
    } }>
        <View style={ styles.containers }>
            <View onLayout={ onLayoutComponent } style={ styles.statement }>

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
                            <View style={ { width : "100%" } }>
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
                                        ₱{ soa.amount }
                                    </Text>

                                </View>
                                <View style={ { overflow : "hidden" } }>
                                    <DottedLine/>
                                </View>

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
                            ₱{ props.totalFee }
                        </Text>
                    </View>
                </View>


            </View>
            <View style={ { overflow : "hidden" , zIndex : -1 , flexDirection : "row" , } }>
                {
                    !!sizeComponent && Array(Math?.round(sizeComponent?.width / 20))?.fill(0)?.map(() =>
                        <BorderPaymentBottom style={ { marginTop : -2 } }/>)
                }
            </View>

            <View style={ [paymentStyles.container , { paddingTop : 12 }] }>


                { user?.role?.key !== ACCOUNTANT && <View style={ requirementStyles.container }>

                    <View style={ [requirementStyles.card , { padding : undefined }] }>
                        <View style={ requirementStyles.cardContainer }>
                            <TouchableOpacity onPress={ () => {
                                setVisibleModal(true)
                            } }>
                                <View>
                                    <Text style={ requirementStyles.title }>Payment</Text>
                                    <View style={ requirementStyles.cardTitle }>

                                        <View style={ { alignItems : "center" } }>

                                            <Text style={ requirementStyles.paymentDescription }>Payment received
                                                for</Text>
                                            <Text style={ requirementStyles.paymentDescription }>NTC-EDGE</Text>
                                            <Text style={ requirementStyles.paymentDescription }>the amout of</Text>
                                            <Text
                                                style={ [requirementStyles.paymentDescription , { fontFamily : Bold }] }>PHP { props.totalFee }</Text>
                                            { props.paymentMethod && <View style={ { paddingVertical : 10 } }>
                                                <Text>
                                                    <Text
                                                        style={ [requirementStyles.paymentDescription , { fontFamily : Bold }] }>
                                                        Payment
                                                        method: { capitalize(props.paymentMethod?.replace("-" , " ")) }
                                                    </Text>
                                                </Text>
                                            </View> }

                                        </View>

                                    </View>


                                </View>
                            </TouchableOpacity>

                            { props?.proofOfPayment && <View style={ { padding : 22 , } }>
                                <FlatList
                                    style={ {
                                        padding : 25 ,
                                        flex : 1 ,
                                        borderColor : "#ECECEC" ,
                                        borderWidth : 1 ,
                                        backgroundColor : "#FBFBFB" ,
                                        borderRadius : 5
                                    } }
                                    horizontal={ isMobile ? false : true }
                                    data={props?.proofOfPayment}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item, index }) => (
                                        <ProofPaymentView proofOfPayment={ item }/>
                                    )}
                                />

                            </View> }
                        </View>

                    </View>
                </View>

                }


            </View>
        </View>


        <PaymentModal updatedAt={ props?.updatedAt } paymentMethod={ props?.paymentMethod }
                      applicant={ props?.applicant } totalFee={ props?.totalFee } visible={ visibleModal }
                      onDismissed={ onDismissed }/>
    </ScrollView>

};


export default Payment