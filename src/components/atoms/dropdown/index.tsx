import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, Platform, StatusBar, Pressable } from 'react-native';
import Text from '@atoms/text';
import Ellipsis from '@atoms/ellipsis';
import { infoColor, text } from '@styles/color';
import styles2 from '@styles/input-style';
import styles from './styles';
import Down from "@atoms/icon/down";

const DropDown = ({
                    items = [],
                    value = '',
                    alternativeValue = '',
                    onPreSelect = () => {},
                    onChangeValue = () => {},
                    placeholder = 'Choose an item..',
                    iconSize = 24,
                    iconColor = '#000',
                    containerStyle = {},
                    dropdownStyle = {},
                    dropdownElementStyle = {},
                    selectedElementColor = {},
                    placeholderStyle = {},
                    onToggle = () => {},
                    loading = false,
                    required = false,
                    error = '',
                  }) => {
  const DropdownButton = useRef();
  const DropdownList = useRef();
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  useEffect(() => {
    onToggle(visible);
    if (visible && !(items?.length > 0)) {
      onPreSelect();
    }
  }, [visible]);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton?.current?.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
      setDropdownWidth(_w)
      setDropdownLeft(_px)
      setDropdownTop((h + py) - (Platform.OS === 'ios' ? 0 : (StatusBar?.currentHeight || 0)));
    });
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    onChangeValue(item);
    setVisible(false);
  };

  const onLayout = () => {
    let index = items?.findIndex((i: any) => i?.value === value || i?.label === value);
    if (index > -1) {
      DropdownList.current.scrollToIndex({index, animated: true});
    }
  }

  const renderItem = ({ item }: any): ReactElement<any, any> => {
    return (
        <TouchableOpacity onPress={() => onItemPress(item)}>
          <View style={[
            dropdownElementStyle,
            (value === item?.value || value === item?.label) && { backgroundColor: selectedElementColor },
          ]}>
            <Text>{item.label}</Text>
          </View>
        </TouchableOpacity>
    )
  };

  const renderDropdown = (): ReactElement<any, any> => {
    const ItemSeparatorComponent = <View style={{height: 5}} />
    return (
        <Modal visible={visible} transparent animationType='none'>
          <Pressable
              style={styles.overlay}
              onPress={() => {
                setVisible(false);
              }}
          >
            <View
                style={[
                  styles.dropdown,
                  {
                    top: dropdownTop + 5,
                    opacity: dropdownTop,
                  },
                  dropdownStyle,
                  {
                    ...Platform.select({
                      web: {
                        bottom: items?.length < 6  ? undefined : "15%",
                        width: dropdownWidth,
                        left: dropdownLeft,
                        overflow: 'auto'
                      }
                    }),

                  },
                ]}
                onLayout={onLayout}
            >
              {
                !!loading
                    ? <View style={styles?.ellipsisContainer}>
                      <Ellipsis color={infoColor} size={10} />
                    </View>
                    : <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ref={DropdownList}
                        // ItemSeparatorComponent={() => ItemSeparatorComponent}
                        onScrollToIndexFailed={info => {
                          const wait = new Promise(resolve => setTimeout(resolve, 100));
                          wait.then(() => {
                            DropdownList.current?.scrollToIndex({ index: info.index, animated: true });
                          });
                        }}
                        ListEmptyComponent={() => (
                            <View style={styles?.emptyListContainer}><Text style={styles?.emptyListText}>No data available yet.</Text></View>
                        )}
                    />
              }
            </View>
          </Pressable>
        </Modal>
    );
  };

  return (
      <TouchableOpacity
          ref={DropdownButton}
          style={[
            containerStyle,
            styles.container,
          ]}
          onPress={toggleDropdown}
      >
        {renderDropdown()}
        <View style={{ flex: 0.95 }}>
          {!!value && !!placeholder && (
              <View style={styles2.labelContainer}>
                <Text
                    style={[
                      styles2.labelText,
                      value && styles?.labelText,
                      !!error && {color: text?.error}
                    ]}
                >
                  {placeholder}
                </Text>
                {required && (
                    <Text style={[styles2.requiredText, value && styles?.labelText]}>
                      {'*'}
                    </Text>
                )}
              </View>
          )}
          <Text
              style={[
                styles.placeholder,
                value && styles?.valueText,
                placeholderStyle,
              ]}
              numberOfLines={1}
          >
            {(alternativeValue || value) || placeholder}
          </Text>
        </View>
        <Down size={iconSize} iconColor={iconColor} />
      </TouchableOpacity>
  );
};

export default DropDown;
