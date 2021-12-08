import React, { useState, useCallback } from 'react'
import {
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native'
import { useSelector } from 'react-redux';
import lodash from 'lodash';
import { outline, text } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import { ContactItem, SelectedContact } from '@components/molecules/list-item';
import { ArrowLeftIcon } from '@components/atoms/icon'
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
    paddingHorizontal: 10,
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    fontWeight: '500',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#F1F1F1',
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
})

const data = [
  {
    _id: '1',
    name: 'Nino Paul Cervantes',
    email: 'ninscervantes@gmail.com',
    image: '',
  },
  {
    _id: '2',
    name: 'JM Grills',
    email: 'jm.grills@gmail.com',
    image: '',
  },
  {
    _id: '3',
    name: 'Vash Salarda',
    email: 'vashsalarda@gmail.com',
    image: '',
  },
];

const NewChat = ({ navigation }:any) => {
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
        navigation.replace('ViewChat', data);
      }
    });
  };

  const onSelectParticipants = (selectedId) => {
    const result = lodash.reject(contacts, c => c._id === selectedId);
    const selected = lodash.find(contacts, c => c._id === selectedId);
    setParticipants(p => ([...p, selected]));
    setContacts(result);
  }

  const onRemoveParticipants = (selectedId) => {
    const result = lodash.reject(participants, c => c._id === selectedId);
    const selected = lodash.find(participants, c => c._id === selectedId);
    setContacts(p => ([...p, selected]));
    setParticipants(result);
  }

  const headerComponent = () => (
    <FlatList
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
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5 }]}>
          <TouchableOpacity onPress={onBack}>
            <ArrowLeftIcon
              size={22}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              weight={'600'}
              size={16}
            >
              New Chat
            </Text>
          </View>
          {
            !!lodash.size(participants) && (
              <TouchableOpacity disabled={nextLoading} onPress={onNext}>
                {
                  nextLoading ? (
                    <ActivityIndicator color={text.default} size={'small'} />
                  ) : (
                    <Text size={16}>Next</Text>
                  )
                }
              </TouchableOpacity>
            )
          }
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
            image={item.image}
            name={item.name}
            contact={item.email || ''}
            onPress={() => onSelectParticipants(item._id)}
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
