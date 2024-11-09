import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {View, TouchableOpacity, Modal, FlatList, Platform, StatusBar, Pressable, Dimensions} from 'react-native';
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
  const [dropdownHeight, setDropdownHeight] = useState(0);

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
    DropdownButton?.current?.measure((_fx, _fy, _w, h, _px, py) => {
      const screenHeight = Dimensions.get('window').height;
      const statusBarHeight = Platform.OS === 'android' ? StatusBar?.currentHeight || 0 : 0;
      const availableHeight = screenHeight - py - h - statusBarHeight;

      setDropdownWidth(_w);
      setDropdownLeft(_px);
      setDropdownTop(py + h - statusBarHeight);
      setDropdownHeight(Math.min(availableHeight, 300));
    });
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    onChangeValue(item);
    setVisible(false);
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableOpacity onPress={() => onItemPress(item)}>
      <View
        style={[
          dropdownElementStyle,
          (value === item?.value || value === item?.label) && { backgroundColor: selectedElementColor },
        ]}
      >
        <Text>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={styles.overlay}
        onPress={() => setVisible(false)}
      >
        <View
          style={[
            styles.dropdown,
            { top: dropdownTop + 5, height: dropdownHeight, opacity: dropdownTop },
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

            }
          ]}
        >
          {loading ? (
            <View style={styles?.ellipsisContainer}>
              <Ellipsis color={infoColor} size={10} />
            </View>
          ) : (
            <FlatList
              initialNumToRender={100}
              data={items}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ref={DropdownList}
              showsVerticalScrollIndicator
              showsHorizontalScrollIndicator
              getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
              ListEmptyComponent={() => (
                <View style={styles?.emptyListContainer}>
                  <Text style={styles?.emptyListText}>No data available yet.</Text>
                </View>
              )}
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  DropdownList.current?.scrollToIndex({ index: info.index, animated: true });
                }, 100);
              }}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={[containerStyle, styles.container]}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <View style={{ flex: 0.95 }}>
        {!!value && !!placeholder && (
          <View style={styles2.labelContainer}>
            <Text
              style={[
                styles2.labelText,
                !!error && { color: text?.error },
              ]}
            >
              {placeholder}
            </Text>
            {required && (
              <Text style={styles2.requiredText}>
                {'*'}
              </Text>
            )}
          </View>
        )}
        <Text
          style={[
            styles.placeholder,
            value && styles.valueText,
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
