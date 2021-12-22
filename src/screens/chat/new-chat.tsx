import React, { useState, useCallback } from 'react'
import {
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux';
import lodash from 'lodash';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import { outline, button, text } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import { ContactItem, SelectedContact } from '@components/molecules/list-item';
import { ArrowLeftIcon, ArrowDownIcon, CheckIcon } from '@components/atoms/icon'
import { SearchField } from '@components/molecules/form-fields'
import { primaryColor } from '@styles/color';
import useFirebase from 'src/hooks/useFirebase';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    paddingBottom: 0,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    fontWeight: '500',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
  },
  icon: {
    fontSize: 16
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: width - 60,
    alignSelf: 'flex-end',
    backgroundColor: outline.default,
  },
  notSelected: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: button.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: button.primary,
    backgroundColor: button.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  }
})

const data = [
  {
    _id: '1',
    name: 'Guy Hawkins',
    firstname: 'Guy',
    lastname: 'Hawkins',
    email: 'guy.hawkins@gmail.com',
    image: '',
  },
  {
    _id: '2',
    name: 'Dianne Russell',
    firstname: 'Dianne',
    lastname: 'Russell',
    email: 'dianne.russell@gmail.com',
    image: 'https://www.himalmag.com/wp-content/uploads/2019/07/sample-profile-picture.png',
  },
  {
    _id: '3',
    name: 'Ralph Edwards',
    firstname: 'Ralph',
    lastname: 'Edwards',
    email: 'ralph.edwards@gmail.com',
    image: '',
  },
  {
    _id: '4',
    name: 'Wade Warren',
    firstname: 'Wade',
    lastname: 'Warren',
    email: 'wade.warren@gmail.com',
    image: '',
  }
];

const NewChat = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { createChannel } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [loading, setLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [participants, setParticipants]:any = useState([]);
  const [contacts, setContacts]:any = useState(() => {
    const result = lodash.reject(data, d => d._id === user._id);
    return result;
  });
  const [searchText, setSearchText] = useState('');
  const onFetchData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const onBack = () => navigation.goBack();
  const onNext = () => {
    setNextLoading(true);
    createChannel(participants, (error, data) => {
      setNextLoading(false);
      if (!error) {
        dispatch(setSelectedChannel(data));
        navigation.replace('ViewChat', data);
      }
    });
  };

  const onSelectParticipants = (selectedId:string) => {
    const selected = lodash.find(contacts, c => c._id === selectedId);
    setParticipants(p => ([...p, selected]));
  }

  const onRemoveParticipants = (selectedId:string) => {
    const result = lodash.reject(participants, c => c._id === selectedId);
    setParticipants(result);
  }

  const onTapCheck = (selectedId:string) => {
    const isSelected = checkIfSelected(selectedId);
    if (isSelected) {
      onRemoveParticipants(selectedId);
    } else {
      onSelectParticipants(selectedId);
    }
  }

  const checkIfSelected = (contactId:string) => {
    const selected = lodash.find(participants, c => c._id === contactId);
    return !!selected;
  }

  const headerComponent = () => (
    <View>
      <FlatList
        style={{ paddingHorizontal: 10, paddingBottom: 10 }}
        horizontal
        data={participants}
        renderItem={({ item }) => (
          <SelectedContact
            image={item.image}
            name={item.name}
            onPress={() => onRemoveParticipants(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      <View style={styles.contactTitle}>
        <ArrowDownIcon
          style={{ marginTop: 2, marginRight: 3 }}
          color={text.default}
          size={24}
        />
        <Text
          size={16}
          weight={'bold'}
          color={text.default}
        >
          My contacts
        </Text>
      </View>
    </View>
  )

  const emptyComponent = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
      }}>
      <Text
        color={text.default}
        size={14}
      >
        No matches found
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5 }]}>
          <TouchableOpacity onPress={onBack}>
            <ArrowLeftIcon
              size={22}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              color={text.default}
              weight={'600'}
              size={16}
            >
              New message
            </Text>
          </View>
          <TouchableOpacity
            disabled={!lodash.size(participants) || nextLoading}
            onPress={onNext}
          >
            {
              nextLoading ? (
                <ActivityIndicator color={text.default} size={'small'} />
              ) : (
                <Text
                  weight={'600'}
                  color={!!lodash.size(participants) ? text.primary : text.default}
                  size={14}
                >
                  Next
                </Text>
              )
            }
          </TouchableOpacity>
        </View>
        <SearchField
          inputStyle={[InputStyles.text, styles.input]}
          iconStyle={styles.icon}
          placeholder="Search"
          outlineStyle={[InputStyles.outlineStyle, styles.outline]}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
        />
      </View>
      <FlatList
        data={contacts}
        refreshControl={
          <RefreshControl
            tintColor={primaryColor} // ios
            progressBackgroundColor={primaryColor} // android
            colors={['white']} // android
            refreshing={loading}
            onRefresh={onFetchData}
          />
        }
        renderItem={({ item }) => (
          <ContactItem
            disabled={true}
            image={item.image}
            name={item.name}
            rightIcon={
              <TouchableOpacity
                onPress={() => onTapCheck(item._id)}
              >
                {
                  checkIfSelected(item._id) ? (
                    <View style={styles.selected}>
                      <CheckIcon
                        type={'check1'}
                        size={16}
                        color="white"
                      />
                    </View>
                  ) : (
                    <View style={styles.notSelected} />
                  )
                }
              </TouchableOpacity>
            }
            contact={item.email || ''}
          />
        )}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={
          () => <View style={styles.separator} />
        }
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={emptyComponent}
      />
    </SafeAreaView>
  )
}

export default NewChat
