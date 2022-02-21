import React , {useState} from "react";
import {Dimensions , Image , ScrollView , Text , TouchableOpacity , View} from "react-native";
import RequirementModal from "@pages/activities/application/requirementModal/index";
import FileOutlineIcon from "@assets/svg/fileOutline";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import {RFValue} from "react-native-responsive-fontsize";

const { width , height } = Dimensions.get("screen");
const Requirement = (props: any) => {
    const [visibleModal , setVisibleModal] = useState(false);
    const [selectImage , setSelectImage] = useState('');
    const [selectName , setSelectName] = useState('');
    const onDismissed = () => {
        setSelectImage("");
        setVisibleModal(false)
    };
    return <ScrollView style={ { backgroundColor : "#fff" , width : "100%" } }>
        { props?.requirements?.map((requirement: any , index: number) => {
            return <View key={ index } style={ requirementStyles.container }>
                <View style={ requirementStyles.card }>
                    <View style={ requirementStyles.cardContainer }>
                        <View style={ requirementStyles.cardLabel }>
                            <View style={ requirementStyles.cardTitle }>
                                <Text style={ requirementStyles.title }>{ requirement?.title }</Text>
                                <Text style={ requirementStyles.description }>{ requirement?.description }</Text>
                            </View>
                            <View style={ [{ paddingTop : 30 , paddingBottom : 9 } , requirementStyles.cardDocument] }>
                                <View style={ { paddingRight : 10 } }>
                                    <FileOutlineIcon/>
                                </View>

                                <Text style={ requirementStyles.text }>{ requirement?.file?.name }</Text>
                            </View>

                        </View>
                        <View style={ {
                            height : RFValue(300) ,
                            backgroundColor : "rgba(220,226,229,1)" ,
                            borderWidth : 1 ,
                            borderColor : "rgba(213,214,214,1)" ,
                            borderStyle : "dashed" ,
                        } }>
                            <TouchableOpacity onPress={ () => {
                                setSelectImage(requirement?.links?.large);
                                setSelectName( requirement?.file?.name)
                                setVisibleModal(true)
                            }
                            }>
                                <Image

                                    style={ { width : undefined , height : RFValue(300) } }
                                    source={ {
                                        uri : requirement?.links?.medium ,
                                    } }
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        })
        }
        <RequirementModal
            fileName={selectName}
            image={ selectImage }
            visible={ visibleModal }
            onDismissed={ onDismissed }/>
    </ScrollView>

};
export default Requirement
