import React, { FC } from 'react';
import { View, FlatList } from 'react-native';
import Text from '@atoms/text';
import CheckBox from '@molecules/checkbox';
import { DropdownField } from '@molecules/form-fields';
import styles from './styles';

interface Props {
  types?: any;
  applicationType?: any;
  onChangeValue?: any;
  onSelect?: any;
};

const Types: FC<Props> = ({
  types = [],
  applicationType = {},
  onChangeValue = () => {},
  onSelect = () => {},
}) => {
  const { label, elements, element, requirements } = applicationType;
  const renderSeparator = () => <View style={styles.separator} />
  const renderItem = ({item}: any) => {
    return (
      <View style={styles.row}>
        <CheckBox
          type='circle'
          style={styles.checkbox}
          isChecked={element === item}
          onClick={() => onSelect(item)}
          label={item}
        />
      </View>
    )
  };
  const renderRequirement = ({item, index}: any) => {
    return (
      <View>
        <Text>{index + 1}. {item?.title}{item?.required && <Text style={styles?.requiredText}>*</Text>}</Text>
        {
          !!item?.description &&
          <Text style={styles?.reqDesc}>{item?.description}</Text>
        }
      </View>
    )
  }
  return (
    <FlatList
      initialNumToRender={100}
      style={styles.container}
      showsVerticalScrollIndicator={true}
      data={elements}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${index}`}
      ItemSeparatorComponent={() => renderSeparator()}
      ListHeaderComponent={() => (
        <DropdownField
          items={types}
          placeholder='Application type'
          value={label}
          onChangeValue={onChangeValue}
        />
      )}
      ListFooterComponent={() => (
        <FlatList
          initialNumToRender={100}
          showsVerticalScrollIndicator={true}
          data={requirements}
          renderItem={renderRequirement}
          keyExtractor={(item, index) => `${index}`}
          ListHeaderComponent={() => (
            <View style={elements?.length > 0 ? styles?.reqHeaderView : styles?.reqHeaderView2}>
              <Text style={styles?.reqHeaderTitle}>Requirements</Text>
            </View>
          )}
          ListFooterComponent={() => <View style={styles?.footer} />}
          ListEmptyComponent={() => (
            <View>
              <Text style={[styles?.reqDesc, styles?.reqEmptyText]}>No requirements to be listed.</Text>
            </View>
          )}
          ItemSeparatorComponent={() => renderSeparator()}
        />
      )}
    />
  )
};

export default React.memo(Types);
