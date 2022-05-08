import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import FileOutlineIcon from "@assets/svg/fileOutline";
import {requirementStyles,styles} from "@pages/activities/application/requirementModal/styles";
import AnimatedImage from 'react-native-animated-image-viewer';
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import {RootStateOrAny,useSelector} from "react-redux";
import ImageZoom from 'react-native-image-pan-zoom';
import {OnBackdropPress} from "@pages/activities/modal/onBackdropPress";
import {Card} from "@pages/activities/application/requirementModal/card";
import PdfViewr from "@pages/activities/application/pdf/index";
import FileIcon from "@assets/svg/file";

const {width,height}=Dimensions.get("screen");

class RequirementView extends React.Component<{requirement:any,rightLayoutComponent:any,dimensions:any}>{

    

    state={
        onLoadStart:true,
        zoomed:false,
        scale: false,
        count:1,
        onLoad:false,
        visible:false,
        source:{uri:this.props?.requirement?.original||"https://dummyimage.com/350x350/fff/aaa",},
        _imageSize:{
            width:0,
            height:0
        },
        _sourceMeasure:{
            width:0,
            height:0,
            pageX:0,
            pageY:0
        },
        imageModal:null,
        image:null,
        fileName:"",
        extension:''
    };
    imageZoom=null;

    _showImageModal=()=>this.setState({visible:true});

    _hideImageModal=()=>this.setState({visible:false});

    _requestClose=()=>{
        this.state.imageModal?.close();
        if(!isMobile){
            this._hideImageModal()
        }
    };
    _showImage=()=>{
        new Promise((resolve, reject) => {
            this.setState({onLoad:true, visible: true})
            setTimeout(() => {
                resolve('');
            }, 1000);
        }).then(()=>{
            this.setState({onLoad:false})
            this.state?.image?.measure((x,y,width,height,pageX,pageY)=>{
                this.setState({
                    _sourceMeasure:{
                        width:parseInt(width,10),
                        height:parseInt(height, 10),
                        pageX:parseInt(pageX, 10),
                        pageY:parseInt(pageY, 10)
                    },

                });

            });
        });



    };

    componentDidUpdate(prevProps,prevState){

        if(prevProps?.requirement?.original!=this.props?.requirement?.original){

            this.setImage();

        }
    }

    componentDidMount(){

        this.setImage();
    }

    render(){
        return <>
            <View style={[requirementStyles.cardDocument]}>


                {<TouchableOpacity disabled={!this?.state?._imageSize?.height && this.state.onLoadStart&&!this.state.extension} ref={image=>(
                    this.state.image=image)}
                                   onPress={this._showImage} style={{
                    alignItems:"center",
                    flex:1,
                    flexDirection:"row"
                }}>
                    <View style={{paddingRight:fontValue(10)}}>
                        <FileOutlineIcon height={fontValue(20)} width={fontValue(16)}/>
                    </View>
                    <Text
                        style={requirementStyles.text}>{this.state.fileName}</Text>
                </TouchableOpacity>}
            </View>

            <View style={{alignItems:isMobile ? "center" : undefined}}>
                <TouchableOpacity disabled={!this?.state?._imageSize?.height && !this?.state?._imageSize?.width && this.state.onLoadStart&&!this.state.extension} ref={image=>{
                    this.state.image=image
                }}
                                  onPress={this._showImage}>

                    {
                        this.state.extension ? <FileIcon
                                                 color={"#606A80"}
                                                 width={150}
                                                 height={150}
                                             /> :
                        <View style={{borderStyle:"solid"}}>
                            <Image
                                resizeMode={"cover"}
                                style={{
                                    borderRadius:10,
                                    marginBottom:isMobile ? undefined : 25,
                                    backgroundColor:"rgba(220,226,229,1)",
                                    borderWidth:1,
                                    borderColor:"rgba(213,214,214,1)",

                                    width:isMobile ? width/1.2 : 240,
                                    height:isMobile ? 300 : 160,

                                }}
                                source={{
                                    uri:this.props?.requirement?.small,
                                }}
                            />
                        </View>


                    }


                </TouchableOpacity>
            </View>


            <Modal visible={this.state?.visible} transparent={true} onRequestClose={this._hideImageModal}>

                <View style={[styles.container,isMobile||this.props.dimensions?.width<768 ? {} : {
                    alignItems:"flex-end",
                    top:this.props?.rightLayoutComponent?.top
                }]}>
                    <OnBackdropPress styles={{}} onPressOut={this._hideImageModal}/>
                    <OnBackdropPress styles={isMobile||this.props.dimensions?.width<768 ? {} : {
                        width:this.props?.rightLayoutComponent?.width||undefined,
                        backgroundColor:"rgba(0, 0, 0, 0.5)"
                    }}/>

                    <View style={[styles.rect2,{width:this.props?.rightLayoutComponent?.width}]}>
                        <View style={{alignSelf:'flex-end', zIndex: 1, paddingHorizontal:15,paddingVertical:15}}>
                            <TouchableOpacity onPress={this._hideImageModal}>
                                <Text style={styles.close}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex:1,backgroundColor:"rgba(0, 0, 0, 0.5)"}}>

                        {!this.state.onLoad ? this.state.extension ?

                         <PdfViewr width={this.props?.rightLayoutComponent?.width}
                                   height={this.props?.rightLayoutComponent?.height}
                                   requirement={this.props?.requirement}/> : (
                             isMobile||this.props.dimensions?.width<768 ?<AnimatedImage

                                                                            ref={imageModal=>(
                                                                                this.state.imageModal=imageModal)}
                                                                            source={this?.state?.source}
                                                                            sourceMeasure={this.state?._sourceMeasure}
                                                                            imageSize={this.state?._imageSize||{height:300,width:300}}
                                                                            onClose={this._hideImageModal}
                                                                            animationDuration={200}
                                                                        /> :
                                 //height = height * (this.state._imageSize.height / width)

                             <ImageZoom onSwipeDown={this._hideImageModal} enableSwipeDown={true}
                                        cropWidth={this.props?.rightLayoutComponent?.width}
                                        enableDoubleClickZoom={true}
                                        cropHeight={this.props?.rightLayoutComponent?.height}
                                        imageWidth={this.props?.rightLayoutComponent?.width}
                                        imageHeight={height*(
                                            this.state._imageSize?.height/width)}>
                                 <View style={{...Platform.select({native:{top: -60}, default: {}}), alignItems: "center"}}>
                                     <Image style={{
                                         /* transform:[
                                              {
                                                  scale: 0.5
                                              }
                                          ],*/
                                         width: this.state._imageSize.width/1.5,
                                         height:height*(
                                             this.state._imageSize.height/width)
                                     }}
                                            resizeMode={"contain"}
                                            source={this?.state?.source}/>
                                 </View>

                             </ImageZoom>)
                        : <View style={{flex: 1, justifyContent: "center", alignSelf: "center"}}>
                             <ActivityIndicator color={"#fff"} />
                         </View>}
                    </View>


                </View>
            </Modal>
        </>;
    }

    private setImage(){


        let _fileName=this.props?.requirement?.small?.split("/")?.[this.props?.requirement?.small?.split("/")?.length-1];
        this.setState({
            onLoadStart:true,
            fileName:_fileName,
            extension:(
                /(pdf|docx|doc)$/ig.test(_fileName?.substr((
                    _fileName?.lastIndexOf('.')+1)))),
        });
        Image.prefetch(this.props?.requirement?.original)
        .then(()=>{
            this.setState({onLoadStart:false});
            Image.getSize(this.props?.requirement?.original,(width,height)=>{

                this.setState({
                    ...this.state,
                    source:{
                        ...this?.state?.source,
                        uri:this?.props?.requirement?.original||"https://dummyimage.com/350x350/fff/aaa"
                    },
                });
                this.setState({
                    _imageSize:{
                        width: Platform.select({
                            native: width,
                            web: Dimensions.get("screen").height * width/height,
                        }),
                        height:Platform.select({
                            native:height,
                            web:(height/width)*Dimensions.get("screen").width
                        })
                    }
                });

                this.setState({onLoadStart:false})
            },error=>{
                this.setState({
                    ...this.state,
                    source:{
                        ...this?.state?.source,
                        uri:"https://dummyimage.com/350x350/fff/aaa"
                    },
                });
                this.setState({onLoadStart:true})
            })
        },error=>{
            this.setState({
                ...this.state,
                source:{
                    ...this?.state?.source,
                    uri:"https://dummyimage.com/350x350/fff/aaa"
                },
            });
            this.setState({onLoadStart:true})
        });

    }
}


const Requirement=(props:any)=>{
    const {rightLayoutComponent}=useSelector((state:RootStateOrAny)=>state.application);
    const dimensions=useWindowDimensions();
    return <ScrollView style={{backgroundColor:"#f8f8f8",width:"100%"}}>
        {props?.requirements?.map((requirement:any,index:number)=>{

            return <View key={index} style={{padding:10}}>
                <Card>
                    <View style={[{paddingHorizontal:isMobile ? 20 : 40}]}>
                        <View style={requirementStyles.cardTitle}>
                            <Text style={requirementStyles.title}>{requirement?.title}</Text>
                            <Text
                                style={requirementStyles.description}>{requirement?.description}</Text>
                        </View>


                        <ScrollView style={{flex:1,}}>
                            {
                                /*[{
                                     "original": "https://testedgeaccountstorage.blob.core.windows.net/files/612babc4-6f37-4ac1-8a06-392bf4328087.pdf",
                                     "thumb": "https://testedgeaccountstorage.blob.core.windows.net/files/612babc4-6f37-4ac1-8a06-392bf4328087.pdf",
                                     "small": "https://testedgeaccountstorage.blob.core.windows.net/files/612babc4-6f37-4ac1-8a06-392bf4328087.pdf",
                                     "medium": "https://testedgeaccountstorage.blob.core.windows.net/files/612babc4-6f37-4ac1-8a06-392bf4328087.pdf",
                                     "large": "https://testedgeaccountstorage.blob.core.windows.net/files/612babc4-6f37-4ac1-8a06-392bf4328087.pdf",
                                     "xlarge": "https://testedgeaccountstorage.blob.core.windows.net/files/612babc4-6f37-4ac1-8a06-392bf4328087.pdf"
                                 }]*/
                                requirement?.links?.map((link:any,idx:number)=>{
                                    return <RequirementView dimensions={dimensions}
                                                            rightLayoutComponent={rightLayoutComponent} key={idx}
                                                            requirement={link}/>
                                })
                            }
                        </ScrollView>


                    </View>
                </Card>
            </View>
        })
        }
    </ScrollView>

};
export default Requirement