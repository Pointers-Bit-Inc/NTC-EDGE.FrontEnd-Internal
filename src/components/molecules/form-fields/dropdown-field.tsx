import React, { FC, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Text from '@atoms/text';
import Dropdown from '@atoms/dropdown';
import styles from '@styles/input-style';
import { input, outline } from '@styles/color';

interface Props {
    value?: string;
    alternativeValue?: string;
    items?: any;
    placeholder?: any;
    onPreSelect?: any;
    onChangeValue?: any;
    hasValidation?: boolean;
    description?: string;
    error?: string;
    loading?: boolean;
    required?: boolean;
    [x: string]: any;
}

const DropDownField: FC<Props> = ({
                                      value = '',
                                      alternativeValue = '',
                                      items = [],
                                      placeholder = 'Choose an item...',
                                      onPreSelect = () => {},
                                      onChangeValue = () => {},
                                      hasValidation = false,
                                      description,
                                      error,
                                      loading,
                                      required,
                                      ...otherProps
                                  }) => {
    const { text, background } = input;

    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.mainContainer}>
            <Dropdown
                items={items}
                value={value}
                alternativeValue={alternativeValue}
                onPreSelect={onPreSelect}
                onChangeValue={onChangeValue}
                placeholder={`${placeholder}${required && !value ? '*' : ''}`}
                containerStyle={[
                    styles.container,
                    styles.dropdownContainer,
                    focused && {
                        borderColor: outline.primary,
                        backgroundColor: '#fff',
                    },
                    !!error && {
                        backgroundColor: background?.error,
                        borderColor: text?.errorColor,
                    }
                ]}
                dropdownStyle={styles.dropdownListContainer}
                dropdownElementStyle={styles.dropdownElementContainer}
                selectedElementColor={input.background.default}
                placeholderStyle={!value && styles.placeholderText}
                iconSize={15}
                iconColor={text.defaultColor}
                onToggle={(visible: any) => setFocused(visible)}
                loading={loading}
                required={required}
            />
            {
                hasValidation && (!!error || !!description) && (
                    <View>
                        <Text
                            style={[
                                styles?.validationText,
                                !!error && { color: text?.errorColor }
                            ]}
                        >
                            {error || description}
                        </Text>
                    </View>
                )
            }
        </View>
    );
};

export default DropDownField;
