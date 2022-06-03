import React from "react";
import {Pressable, View, Text} from "react-native";
import {fontValue} from "@pages/activities/fontValue";
import {DownloadIcon} from "@atoms/icon";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import {ToastType} from "@atoms/toast/ToastProvider";
import {useToast} from "../../../../../hooks/useToast";

const PdfDownload = (props: { url: string; }) => {
    const {showToast}=useToast();
    return <Pressable onPress={() => {
        showToast(ToastType.Success, "Downloading...")
        const a = document.createElement('a')
        a.href = props.url
        a.download = props.url.split('/').pop()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
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

export default PdfDownload


