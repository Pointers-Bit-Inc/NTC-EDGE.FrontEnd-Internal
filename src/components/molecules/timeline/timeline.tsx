import React, {FC, ReactElement} from 'react';
import {ScrollView, View} from 'react-native';
import SvgIcon, {IconNames} from "@molecules/timeline/SvgIcon";
import {primaryColor} from "@styles/color";
import Text from "@atoms/text"
import {fontValue} from "@pages/activities/fontValue";
const iconType: Record<string, IconNames> = {
    wait: 'clockcircleo',
    error: 'closecircleo',
    finish: 'checkcircleo',
    process: 'checkcircleo',
};

export interface TimelineStepProps {
    title?: string;
    description?: string;
    status?: keyof typeof iconType;
    date?: string;
    time?: string;
    iconRender?: ReactElement;
    contentRender?: ReactElement;
    leftRender?: ReactElement;
}

export interface TimelineProps {
    steps: Array<TimelineStepProps>;
    minHeight?: number;
    direction?: 'down' | 'up';
}

const Timeline: FC<TimelineProps> = ({ steps = [], minHeight = 20, direction = 'up' }) => {


    const circleRender = (isFirst: boolean, isLast: boolean, status?: string) => {
        if (status) {
            return <SvgIcon name={iconType[status]} color={primaryColor}/>;
        }
        return (direction === 'up' && isFirst) || (direction === 'down' && isLast) ? (
            <SvgIcon name="checkcircle" color={primaryColor} />
        ) : (
            <View style={{width: 8, height: 8, backgroundColor: primaryColor, borderRadius: 4}}/>
        );
    };

    const circleAndLineVerticalRender = (
        isFirst: boolean,
        isLast: boolean,
        iconRender?: ReactElement,
        status?: string
    ) => {
        return (
            <View style={{alignItems: 'center', flex: 1, width: (16)}}>
                <View style={{marginTop: 1}}>{iconRender ? iconRender : circleRender(isFirst, isLast, status)}</View>
                {!isLast && <View style={{width: 1, minHeight, flex: 1, backgroundColor: primaryColor}}/>}
            </View>
        );
    };

    const itemRender = ({item, index}: { item: TimelineStepProps; index: number }) => {
        return (
            <View style={{flex: 1,}} key={index}>
                <View style={{flexDirection: "row"}}>
                    {item.leftRender ? (
                        <View style={{width: 60, borderRadius: 4}}>
                            {item.leftRender}
                        </View>
                    ) : (
                        <View style={{paddingRight: 4, width: 60, alignItems: "center"}} >
                            <Text size={fontValue(14)} >
                                {item.date}
                            </Text>
                            <Text size={fontValue(14)}>
                                {item.time}
                            </Text>
                        </View>
                    )}
                    <View>
                        {circleAndLineVerticalRender(index === 0, index === steps.length - 1, item.iconRender, item.status)}
                    </View>
                    {item.contentRender ? (
                        item.contentRender
                    ) : (
                        <View style={{paddingLeft: 4, paddingBottom: 4}}>
                            <View >
                                <Text size={fontValue(14)}>
                                    {item.title}
                                </Text>
                            </View>
                            <Text size={fontValue(14)}>
                                {item.description}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <ScrollView>
            {steps.map((item, index) => {
                return itemRender({item, index});
            })}
        </ScrollView>

    );
};

export default Timeline;