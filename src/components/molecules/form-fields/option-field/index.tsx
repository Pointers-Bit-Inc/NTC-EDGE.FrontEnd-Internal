import React, { FC } from 'react';
import { FlatList, View } from 'react-native';
import CheckBox from '@molecules/checkbox';
import DynamicField from '@organisms/forms/fields/dynamic';
import styles from './styles';

interface Props {
  items?: string[];
  onSelect?: any;
  [x: string]: any;
  /**can also select only one, just empty value first before pushing the item instead of immediately pushing it*/
};

const OptionField: FC<Props> = ({
  items = [],
  onSelect = () => {},
  ...otherProps
}) => {
  const {
    type = '',
    parentId = '',
    index = -1,
    onChangeValue = () => {},
  } = otherProps;
  const renderSeparator = () => <View style={styles.separator} />;
  const renderItem = (Item: any) => {
    const { item } = Item;
    const isChecked = item?.selected;
    return (
      <View>
        <CheckBox
          type='circle'
          style={styles.checkbox}
          isChecked={isChecked}
          onClick={() => onSelect(item)}
          label={item?.value}
        />
        {
          item?.hasSpecification && isChecked &&
          <View style={styles?.dynamicView}>
            <DynamicField
              parentId={parentId}
              subParentId={otherProps?.id}
              subIndex={Item?.index}
              index={index}
              {...item?.specification}
              onChangeValue={onChangeValue}
              parentType={type}
              option
            />
          </View>
        }
      </View>
    )
  };
  return (
    <FlatList
      initialNumToRender={100}
      style={styles.container}
      showsVerticalScrollIndicator={true}
      data={items}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${index}`}
      ItemSeparatorComponent={() => renderSeparator()}
    />
  )
};

export default OptionField;