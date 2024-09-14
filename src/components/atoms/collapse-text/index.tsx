import React, {FC, memo, useMemo} from 'react';
import {StyleProp, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import Text from '../text';
import {px} from "../../../utils/normalized";
import useBoolean from "../../../hooks/useBoolean";

export interface CollapseTextProps {
    text: string;
    defaultNumberOfLines?: number;
    lineHeight?: number;
    textStyle?: StyleProp<TextStyle>;
    textContainerStyle?: StyleProp<ViewStyle>;
    expandText?: string;
    unExpandText?: string;
    expandStyle?: StyleProp<TextStyle>;
    isOverflowStyle?:StyleProp<TextStyle>;
}

const CollapseText: FC<CollapseTextProps> = ({
                                                 isOverflowStyle,
                                                 text,
                                                 defaultNumberOfLines = 2,
                                                 lineHeight = px(18),
                                                 textStyle,
                                                 textContainerStyle,
                                                 expandText = 'See More',
                                                 unExpandText = 'See Less',
                                                 expandStyle,
                                             }) => {
    const [isOverflow, { set: setOverflow }] = useBoolean(false);
    const [hidden, { toggle: toggleHidden }] = useBoolean(true);
   const isOverflowMemo = useMemo(() => isOverflow, [isOverflow])
   const hiddenMemo = useMemo(() => hidden, [hidden])
    return (
        <>
            <View style={[textContainerStyle, { position: 'relative', paddingVertical: 3 }]}>
                <Text
                    numberOfLines={hiddenMemo ? defaultNumberOfLines : undefined}
                    ellipsizeMode="tail"
                    fontSize={px(14)}
                    lineHeight={lineHeight}
                    style={[textStyle,{marginBottom: isOverflow ? 3 : 15}]}
                >
                    {text}
                </Text>
                {isOverflowMemo && (
                    <View style={[isOverflowStyle, {flex: 1, justifyContent: "flex-end"}]} >
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                toggleHidden();
                            }}
                        >
                            <Text fontSize={px(12)} color="gray500" style={expandStyle}>
                                {hiddenMemo ? expandText : unExpandText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Text
                    fontSize={px(14)}
                    lineHeight={lineHeight}
                    onLayout={e => {
                        const { height } = e.nativeEvent.layout;
                        if (height - 1 < lineHeight * defaultNumberOfLines) {
                            setOverflow(false);
                        } else {
                            setOverflow(true);
                        }
                    }}
                    style={[
                        {
                            position: 'absolute',
                            zIndex: -99999,
                            opacity: 0,
                        },
                        textStyle,
                    ]}
                >
                    {text}
                </Text>
            </View>
        </>
    );
};

export default memo(CollapseText);
