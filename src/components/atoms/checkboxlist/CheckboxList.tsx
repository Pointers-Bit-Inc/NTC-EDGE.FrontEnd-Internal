import React, { FC } from 'react';
import { CheckboxItem } from './CheckboxItem';

import {ONE_PIXEL, px} from "../../../utils/normalized";
import {View} from "react-native";
import {disabledColor} from "@styles/color";
import useCheckbox from "@atoms/checkboxlist/useCheckbox";

export const CheckboxList: FC<any> = ({
                                                    value,
                                                    disabledValue = [],
                                                    defaultCheckedValue,
                                                    containerStyle,
                                                    options = [],
                                                    showCheckAll = true,
                                                    size = px(24),
                                                    onChange,
                                                    itemStyle,
                                                    ...restProps
                                                }) => {
    const {
        transformedOptions = [],
        checkedAllStatus,
        handleAllChange,
        handleChange,
    } = useCheckbox({ options, disabledValue, defaultCheckedValue, onChange, value, showCheckAll });

    return (
        <View style={containerStyle}>
            {showCheckAll && (
                <View
                    key="checkbox-select-all"
                    style={[itemStyle, {height: px(50), justifyContent: "center", alignItems: "flex-start", paddingLeft: 6, borderBottomWidth: ONE_PIXEL, borderBottomColor: disabledColor}]}
                >
                    <CheckboxItem
                        mode="list"
                        disabled={false}
                        label="全选"
                        value="checkbox-select-all"
                        status={checkedAllStatus}
                        size={size}
                        onChange={handleAllChange}
                        {...restProps}
                    />
                </View>
            )}
            {transformedOptions.map(option => {
                return (
                    <View
                        key={option.value}
                        style={[itemStyle,{height: px(50), justifyContent: "center", alignItems: "flex-start", paddingLeft: 6, borderBottomWidth: ONE_PIXEL, borderBottomColor: disabledColor} ]}
                    >
                        <CheckboxItem mode="list" {...option} size={size} onChange={handleChange} {...restProps} />
                    </View>
                );
            })}
        </View>
    );
};