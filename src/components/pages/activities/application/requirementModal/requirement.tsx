import React , {useState} from "react";
import {Dimensions , Image , Modal , ScrollView , StyleSheet , Text , TouchableOpacity , View} from "react-native";
import RequirementModal from "@pages/activities/application/requirementModal/index";
import FileOutlineIcon from "@assets/svg/fileOutline";
import {requirementStyles, styles} from "@pages/activities/application/requirementModal/styles";
import {RFValue} from "react-native-responsive-fontsize";
import AnimatedImage from 'react-native-animated-image-viewer';
import FadeBackground from "@assets/svg/fade-background";
const { width  } = Dimensions.get("screen");

class RequirementView extends React.Component<{ requirement: any }> {
    source = { uri : this.props?.requirement?.links?.medium || "https://dummyimage.com/350x350/fff/aaa" };
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
        return <>
            <View style={ requirementStyles.container }>
                <View style={ requirementStyles.card }>
                    <View style={ requirementStyles.cardContainer }>
                        <View style={ requirementStyles.cardLabel }>
                            <View style={ requirementStyles.cardTitle }>
                                <Text style={ requirementStyles.title }>{ this.props?.requirement?.title }</Text>
                                <Text
                                    style={ requirementStyles.description }>{ this.props?.requirement?.description }</Text>
                            </View>
                            <View style={ [{ paddingTop : 30 , paddingBottom : 9 } , requirementStyles.cardDocument] }>


                                <TouchableOpacity ref={ image => (
                                    this.image = image) }
                                                  onPress={ this._showImage } style={ {
                                    alignItems : "center" ,
                                    flex : 1 ,
                                    flexDirection : "row"
                                } }>
                                    <View style={ { paddingRight : RFValue(10) } }>
                                        <FileOutlineIcon height={RFValue(20)} width={RFValue(16)}/>
                                    </View>
                                    <Text style={ requirementStyles.text }>{ this.props?.requirement?.file?.name }</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={ {
                            height : RFValue(300) ,
                            backgroundColor : "rgba(220,226,229,1)" ,
                            borderWidth : 1 ,
                            borderColor : "rgba(213,214,214,1)" ,
                            borderStyle : "dashed" ,
                        } }>
                            <TouchableOpacity ref={ image => (
                                this.image = image) }
                                              onPress={ this._showImage }>
                                <Image

                                    style={ { width : undefined , height : RFValue(300) } }
                                    source={ {
                                        uri : this.props?.requirement?.links?.small ,
                                    } }
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>

            <Modal visible={ this.state.visible } transparent onRequestClose={ this._requestClose }>
                <View style={ styles.container}>
                    <View style={ styles.rect2 }>
                        <View style={ {  alignSelf :  'flex-end' ,  paddingHorizontal : 15 , paddingVertical : 15 } }>
                            <TouchableOpacity onPress={this._requestClose}>
                                <Text style={ styles.close }>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View   >



                        <Text style={ styles.fileName }>{ this.props?.requirement?.file?.name }</Text>
                        { this.props?.requirement?.file?.name &&
                        <FadeBackground style={ {  position : "absolute" , zIndex : 1 } }
                                        width={ width }></FadeBackground> }

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


const Requirement = (props: any) => {
    return <ScrollView style={ { backgroundColor : "#fff" , width : "100%" } }>
        { props?.requirements?.map((requirement: any , index: number) => {
            return <RequirementView key={ index } requirement={ requirement }/>
        })
        }
    </ScrollView>

};
export default Requirement
