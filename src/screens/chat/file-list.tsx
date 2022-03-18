import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import { ArrowDownIcon, CheckIcon, DownloadIcon, MinusIcon, NewCheckIcon, NewFileIcon, TrashIcon } from '@components/atoms/icon';
import lodash from 'lodash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: 32,
    width: 32,
    borderRadius: 32,
    backgroundColor: '#D9DBE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  file: {
    marginLeft: 10,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flipY: {
    transform: [
      {
        scaleY: -1
      }
    ]
  },
  popUpMenu: {
    position: 'absolute',
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    top: 55,
    left: 25,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 30
  }
});

const mockData = [
  {
    _id: '1',
    name: 'File.pdf',
    size: '1.0 MB'
  },
  {
    _id: '2',
    name: 'File.pdf',
    size: '1.0 MB'
  },
  {
    _id: '3',
    name: 'File.pdf',
    size: '1.0 MB'
  }
]

const FileList = () => {
  const [data, setData] = useState(mockData);
  const [selectedData, setSelectedData] = useState([]);
  const [groupAction, setGroupAction] = useState('');
  const [showPopUpMenu, setShowPopUpMenu] = useState(false);

  useEffect(() => {
    if (lodash.size(selectedData) === lodash.size(data)) {
      setGroupAction('all');
    } else if (lodash.size(selectedData) > 0) {
      setGroupAction('remove');
    } else {
      setGroupAction('');
    }
  }, [selectedData]);

  const onPressGroupAction = () => {
    if (groupAction === 'all' || groupAction === 'remove') {
      setSelectedData([]);
    } else {
      setSelectedData(data);
    }
  }

  const onSelectAll = () => {
    setSelectedData(data);
    setShowPopUpMenu(false);
  };

  const onRemoveAll = () => {
    setSelectedData([]);
    setShowPopUpMenu(false);
  }

  const onSelectItem = (item) => {
    setSelectedData(p => ([...p, item]));
  };

  const onRemoveItem = (item) => {
    const result = lodash.reject(selectedData, d => d._id === item._id);
    setSelectedData(result);
  };

  const onPressItem = (item) => {
    const isSelected = checkIfSelected(item);
    if (isSelected) {
      onRemoveItem(item);
    } else {
      onSelectItem(item);
    }
  }

  const checkIfSelected = (item) => {
    return !!lodash.find(selectedData, d => d._id === item._id);
  }

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => onPressItem(item)}>
          <View style={[styles.circle, checkIfSelected(item) && { backgroundColor: '#2863D6' }]}>
            {
              !!checkIfSelected(item) && (
                <NewCheckIcon
                  color={'white'}
                />
              )
            }
          </View>
        </TouchableOpacity>
        <View style={styles.file}>
          <NewFileIcon
            color={'#606A80'}
          />
          <View style={{ paddingHorizontal: 10 }}>
            <Text
              size={14}
              color={'#606A80'}
            >
              {item.name}
            </Text>
            <Text
              size={12}
              color={'#606A80'}
              style={{ top: -2 }}
            >
              {item.size}
            </Text>
          </View>
          <View style={{ width: 30 }} />
        </View>
      </View>
    );
  }

  const _listHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressGroupAction}>
          <View style={[styles.circle, !!groupAction && { backgroundColor: '#2863D6' }]}>
            {
              groupAction === 'all' && (
                <NewCheckIcon
                  color={'white'}
                />
              )
            }
            {
              groupAction === 'remove' && (
                <MinusIcon
                  color={'white'}
                />
              )
            }
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPopUpMenu(p => !p)}>
          <ArrowDownIcon
            style={[{ marginHorizontal: 5 }, showPopUpMenu && styles.flipY]}
            color={'#979797'}
            size={26}
          />
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity disabled={!groupAction}>
          <View style={styles.icon}>
            <DownloadIcon
              color={!!groupAction ? '#606A80' : '#979797'}
              size={12}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={!groupAction}>
          <View style={styles.icon}>
            <TrashIcon
              color={!!groupAction ? '#606A80' : '#979797'}
              size={12}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const _popUpMenu = () => {
    if (showPopUpMenu) {
      return (
        <View style={[styles.popUpMenu, styles.shadow]}>
          <TouchableOpacity onPress={onSelectAll}>
            <View style={styles.menuItem}>
              <Text
                size={18}
                color={'#37405B'}
              >Select all</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemoveAll}>
            <View style={styles.menuItem}>
              <Text
                size={18}
                color={'#37405B'}
              >none</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return null;
  }

  return (
    <View style={styles.container}>
      {_listHeader()}
      {_popUpMenu()}
      <FlatList
        data={data}
        renderItem={_renderItem}
      />
    </View>
  )
}

export default FileList
