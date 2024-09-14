import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import useBadge, {BadgeProps} from "../../../hooks/useBadge";
const Badge: FC<BadgeProps> = props => {

    const { isHidden, contentDom } = useBadge(props);
    return (
        <View style={!props.noflex ? {flex: 1 } : {}}>
            <View>
                {props.children}
                {!isHidden && contentDom}
            </View>
        </View>
    );
};

export default Badge;
