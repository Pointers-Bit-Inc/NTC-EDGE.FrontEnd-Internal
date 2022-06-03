import React from "react";
import {Pressable, View, Text} from "react-native";
import {fontValue} from "@pages/activities/fontValue";
import {DownloadIcon} from "@atoms/icon";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import {useToast} from "../../../../../hooks/useToast";
import {ToastType} from "@atoms/toast/ToastProvider";

const PdfDownloadWeb = (props: { url: string; }) => {
    const {showToast}=useToast();
    return <Pressable onPress={() => {
        showToast(ToastType.Success, "Downloading...")
    }
    }>
        <View style={{flexDirection: "row"}}>
            <View style={{paddingRight: fontValue(10)}}>
                <DownloadIcon color={"#606A80"} height={fontValue(20)} width={fontValue(16)}/>
            </View>
            <Text style={requirementStyles.text}>Download</Text>
        </View>
    </Pressable>;
}

export default PdfDownloadWeb