import React, { FC } from 'react';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import Text from '../text';
import SvgIcon from "@molecules/timeline/SvgIcon";
import {disabledColor, lightPrimaryColor, primaryColor} from "@styles/color";
import IconCheckboxChecked from "@molecules/timeline/IconCheckboxChecked";
import IconCheckedboxUnchecked from "@molecules/timeline/IconCheckboxUnchecked";

const mapping: Record<string, any> = {
    checked: 'checkboxChecked',
    unchecked: 'checkboxUnchecked',
    halfchecked: 'checkboxHalfchecked',
};

export const CheckboxItem: FC<any> = ({
                                                        mode,
                                                        size,
                                                        status,
                                                        label,
                                                        value,
                                                        disabled,
                                                        itemStyle,
                                                        labelStyle,
                                                        onChange,
                                                    }) => {


    const handleChange = () => {
        Keyboard.dismiss();
        if (disabled) return;
        onChange?.(value, status);
    };

    console.log(mapping[status])

    return (
        <TouchableOpacity
            onPress={handleChange}
            activeOpacity={disabled ? 1 : 0.5}
            style={[mode === 'list' ? { width: '100%', flex: 1 } : {}, itemStyle]}
        >
            <View style={[{flex: 1, flexDirection: "row", alignItems: "center", marginRight: 12, }, mode === 'list' ? { flex: 1, width: '100%' } : {}]}>
                <View style={{marginRight: 6}}>
                    {
                        mapping[status]  == "checkboxUnchecked" ? <IconCheckedboxUnchecked></IconCheckedboxUnchecked>:<IconCheckboxChecked color={primaryColor}></IconCheckboxChecked>
                    }
                </View>
                {typeof label === 'string' ? (
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                        <Text color={disabled ? disabledColor : "rgba(0,0,0,0.5)"} style={labelStyle}>
                            {label}
                        </Text>
                    </View>

                ) : (
                    label
                )}
            </View>
        </TouchableOpacity>
    );
};
