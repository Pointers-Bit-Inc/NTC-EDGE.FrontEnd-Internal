import {View} from "react-native";
import {requirementStyles} from "@pages/activities/application/requirementModal/styles";
import React from "react";

export function Card(props: any) {
    return <View style={ requirementStyles.container }>
        <View style={ requirementStyles.card }>
            <View style={ requirementStyles.cardContainer }>
                { props.children }

            </View>
        </View>
    </View>;
}