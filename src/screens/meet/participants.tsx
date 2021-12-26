import React, { useState, useEffect, useCallback } from 'react'
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
import { CloseIcon, ArrowDownIcon, CheckIcon } from '@components/atoms/icon'
import { SearchField } from '@components/molecules/form-fields'
import { primaryColor } from '@styles/color';
import useApi from 'src/services/api';
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
});

const Participants = ({ navigation }:any) => {
  const user = useSelector(state => state.user);
  const api = useApi(user.sessionToken);
  const [loading, setLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [participants, setParticipants]:any = useState([]);
  const [contacts, setContacts]:any = useState([]);
  const [searchText, setSearchText] = useState('');
  const onFetchData = useCallback(() => {
    setLoading(true);
    api.post('/internal/users')
    .then(res => {
      setLoading(false);
      setContacts(res.data);
    })
    .catch(e => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    onFetchData();
  }, []);

  const onBack = () => navigation.goBack();
  const onNext = () => navigation.replace('CreateMeeting', { participants });

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
        showsHorizontalScrollIndicator={false}
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
            <CloseIcon
              type='close'
              size={24}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              color={text.default}
              weight={'600'}
              size={16}
            >
              Participants
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
          placeholder="Search name, email or phone"
          outlineStyle={[InputStyles.outlineStyle, styles.outline]}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
        />
      </View>
      <FlatList
        data={contacts}
        showsVerticalScrollIndicator={false}
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

export default Participants
