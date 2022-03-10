import React , {useEffect , useState} from "react";
import {Dimensions , Image , Modal , ScrollView , StyleSheet , Text , TouchableOpacity , View} from "react-native";
import RequirementModal from "@pages/activities/application/requirementModal/index";
import FileOutlineIcon from "@assets/svg/fileOutline";
import {requirementStyles, styles} from "@pages/activities/application/requirementModal/styles";

import AnimatedImage from 'react-native-animated-image-viewer';
import FadeBackground from "@assets/svg/fade-background";
import Loader from "@pages/activities/bottomLoad";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
const { width  } = Dimensions.get("screen");
class RequirementView extends React.Component<{ requirement: any }> {





    state = {
        onLoad: false,
        visible : false ,
        source: { uri : this.props?.requirement?.links?.medium || "https://dummyimage.com/350x350/fff/aaa" }  ,
        _imageSize:  {
            width : 0 ,
            height : 0
        },
        _sourceMeasure:{
            width : 0 ,
            height : 0 ,
            pageX : 0 ,
            pageY : 0
        },
        imageModal:null,
        image:null
    };

    _showImageModal = () => this.setState({ visible : true });
    _hideImageModal = () => this.setState({ visible : false });
    _requestClose = () => {
        this.state.imageModal?.close();
        
    }
    _showImage = () => {
        this.state.image.measure((x , y , width , height , pageX , pageY) => {
            this.setState({_sourceMeasure : {
                width  ,
                height ,
                pageX ,
                pageY
            }});
            this._showImageModal();
        });
    };
    componentDidUpdate(prevProps, prevState) {
           if(prevProps?.requirement?.links?.medium != this.props?.requirement?.links?.medium) {

               this.setImage();

           }
    }

    private setImage() {

        this.setState({
            ...this.state,
            source : { ...this?.state?.source,  uri: this?.props?.requirement?.links?.medium || "https://dummyimage.com/350x350/fff/aaa" } })

        Image.getSize(this.props?.requirement?.links?.medium|| "https://dummyimage.com/350x350/fff/aaa", (width , height) => {
            this.setState({
                _imageSize : {
                    width : width || 300 ,
                    height : height || 300
                }
            });
        })
    }

    componentDidMount() {
        this.setImage();
    }
    render() {
        return <><View style={{padding: 10}}>
            <View style={ requirementStyles.container }>
                <View style={ requirementStyles.card }>
                    <View style={ requirementStyles.cardContainer }>
                        <View style={ [{  paddingHorizontal : isMobile ? 30 : 40  } , requirementStyles.cardLabel ]}>
                            <View style={ requirementStyles.cardTitle }>
                                <Text style={ requirementStyles.title }>{ this.props?.requirement?.title }</Text>
                                <Text
                                    style={ requirementStyles.description }>{ this.props?.requirement?.description }</Text>
                            </View>
                            <View style={ [requirementStyles.cardDocument] }>


                                <TouchableOpacity ref={ image => (
                                    this.state.image = image) }
                                                  onPress={ this._showImage } style={ {
                                    alignItems : "center" ,
                                    flex : 1 ,
                                    flexDirection : "row"
                                } }>
                                    <View style={ { paddingRight : fontValue(10) } }>
                                        <FileOutlineIcon height={fontValue(20)} width={fontValue(16)}/>
                                    </View>
                                    <Text style={ requirementStyles.text }>{ this.props?.requirement?.file?.name }</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={ {
                            marginHorizontal: isMobile ? undefined :46,
                            marginBottom: isMobile ? undefined :25,
                            width: isMobile ? undefined : 240,
                            height : isMobile ? 300 : 160 ,
                            backgroundColor : "rgba(220,226,229,1)" ,
                            borderWidth : 1 ,
                            borderColor : "rgba(213,214,214,1)" ,
                            borderStyle : "dashed" ,
                        } }>
                            <TouchableOpacity disabled={this.state.onLoad} ref={ image => (
                                this.state.image = image) }
                                              onPress={ this._showImage }>

                                <Image
                                    resizeMode={"cover"}
                                    style={ {  width : isMobile ? undefined : 240 , height : isMobile ? 300 : 160, borderRadius: isMobile ? undefined : 10} }
                                    source={ {
                                        uri : this.props?.requirement?.links?.small ,
                                    } }
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>

            <Modal visible={ this.state.visible } transparent  onRequestClose={ this._requestClose }>
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
                                        this.state.imageModal = imageModal) }
                                    source={ this?.state?.source }
                                    sourceMeasure={ this.state._sourceMeasure }
                                    imageSize={ this.state._imageSize }
                                    onClose={ this._hideImageModal }
                                    animationDuration={ 200 }
                                />
                    </View>
                </View>
            </Modal>
        </View></>;
    }
}


const Requirement = (props: any) => {
    
    return <ScrollView style={ { backgroundColor : "#f8f8f8" , width : "100%" } }>
        { props?.requirements?.map((requirement: any , index: number) => {
            return <RequirementView key={ index } requirement={ requirement }/>
        })
        }
    </ScrollView>

};
export default Requirement
