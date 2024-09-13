import React, { forwardRef } from 'react';
import useCheckbox from './useCheckbox';

import { CheckboxItem } from './CheckboxItem';
import { CheckboxList } from './CheckboxList';

import {View} from "react-native";
import {px} from "../../../utils/normalized";

const Checkbox = forwardRef<unknown,any>(
    (
        {
            value,
            disabledValue = [],
            defaultCheckedValue,
            containerStyle,
            options = [],
            showCheckAll = true,
            size = px(24),
            onChange,
            ...restProps
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _ref
    ) => {
        const {
            transformedOptions = [],
            checkedAllStatus,
            handleAllChange,
            handleChange,
        } = useCheckbox({ options, disabledValue, defaultCheckedValue, onChange, value, showCheckAll });

        return (
            <View style={[{ flex: 1 }, containerStyle]}>
                {showCheckAll && (
                    <CheckboxItem
                        disabled={false}
                        label="select all"
                        value="checkbox-select-all"
                        status={checkedAllStatus}
                        size={size}
                        onChange={handleAllChange}
                        {...restProps}
                    />
                )}
                {transformedOptions.map(option => {
                    return <CheckboxItem key={option.value} {...option} size={size} onChange={handleChange} {...restProps} />;
                })}
            </View>
        );
    }
);

export default Object.assign(Checkbox, { CheckboxList });