import React, { useState, useEffect } from 'react'
import {
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import lodash from 'lodash';
import { button, text, header } from '@styles/color';
import Text from '@atoms/text';
import useApi from '@/src/services/api'
import { ContactItem, ListFooter, SelectedContact } from '@components/molecules/list-item';
import { CloseIcon, ArrowDownIcon, CheckIcon, BackIcon } from '@components/atoms/icon'
import { SearchField } from '@components/molecules/form-fields'
import { primaryColor } from '@styles/color';
import { updateChannel } from '@/src/reducers/channel/actions'
import useSignalr from '@/src/hooks/useSignalr';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { Bold, Regular, Regular500 } from '@styles/font';
import IParticipants from '@/src/interfaces/IParticipants';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';

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
    fontSize: RFValue(14),
    fontFamily: Regular,
    color: 'black',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#EFF0F6',
    borderRadius: 10,
  },
  icon: {
    fontSize: RFValue(16),
    color: '#6E7191'
  },
  separator: {
    // height: StyleSheet.hairlineWidth,
    // width: width - 60,
    // alignSelf: 'flex-end',
    // backgroundColor: outline.default,
  },
  notSelected: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: button.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: button.info,
    backgroundColor: button.info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  outlineBorder: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  }
});

const AddParticipants = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const {
    getParticipantList,
  } = useSignalr();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const api = useApi(user.sessionToken, user.createdAt);
  const [loading, setLoading] = useState(true);
  const [nextLoading, setNextLoading] = useState(false);
  const [selectedParticipants, setSelectedParticipants]:any = useState([]);
  const [sendRequest, setSendRequest] = useState(0);
  const [contacts, setContacts]:any = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { participants = [], roomId = '', _id } = useSelector((state:RootStateOrAny) => state.meeting?.meeting ?? {});

  const onRequestData = () => setSendRequest(request => request + 1);

  const fetchMoreParticipants = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    const payload = searchValue ? { pageIndex, keyword: searchValue } : { pageIndex };

    getParticipantList(payload, (err:any, res:any) => {
      if (res) {
        let resultList = res.list;

        if (resultList && selectedParticipants) {
          resultList = lodash.reject(resultList, (r:IParticipants) => lodash.find(participants, (p:IParticipants) => p._id === r._id));
        }

        setContacts([...contacts, ...resultList]);
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        console.log('ERR', err);
        setHasError(true);
      }
      setFetching(false);
    });
  }

  useEffect(() => {
    if (!_id) {
      navigation.goBack();
    }
  }, [_id]);

  useEffect(() => {
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    const source = axios.CancelToken.source();
    const payload = searchValue ? { pageIndex: 1, keyword: searchValue } : { pageIndex: 1 };

    getParticipantList(payload, (err:any, res:any) => {
      if (res) {
        let resultList = res.list;

        if (resultList && selectedParticipants) {
          resultList = lodash.reject(resultList, (r:IParticipants) => lodash.find(selectedParticipants, (p:IParticipants) => p._id === r._id));
          resultList = lodash.reject(resultList, (r:IParticipants) => lodash.find(participants, (p:IParticipants) => p._id === r._id));
        }

        setContacts(resultList);
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        if (axios.isCancel(err)) {
          console.log('CANCELLED');
        } else {
          Alert.alert(err.message || 'Something went wrong.');
        }
      }
      setLoading(false);
    }, { cancelToken: source.token });
  
    return () => {
      setLoading(false);
      source.cancel();
    };
  }, [sendRequest, searchValue]);

  const onBack = () => navigation.goBack();

  const addMembers = () => {
    setNextLoading(true);
    api.post(`/rooms/${roomId}/add-members`, {
      participants: selectedParticipants,
      meetingId: _id
    })
    .then((res) => {
      setNextLoading(false);
      if(res.data) {
        dispatch(updateChannel(res.data));
        navigation.goBack();
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert', e?.message || 'Something went wrong.')
    });
  }

  const onSelectParticipants = (selectedId:string) => {
    const selected = lodash.find(contacts, (c:IParticipants) => c._id === selectedId);
    setSelectedParticipants(p => ([...p, selected]));
  }

  const onRemoveParticipants = (selectedId:string) => {
    const result = lodash.reject(selectedParticipants, (c:IParticipants) => c._id === selectedId);
    setSelectedParticipants(result);
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
    const selected = lodash.find(selectedParticipants, (c:IParticipants) => c._id === contactId);
    return !!selected;
  }

  const headerComponent = () => (
    <View>
      <FlatList
        style={[styles.outlineBorder, !lodash.size(selectedParticipants) && { borderBottomWidth: 0 }]}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={selectedParticipants}
        renderItem={({ item }) => (
          <SelectedContact
            image={item?.profilePicture?.thumb}
            name={item.name}
            isGroup={item.isGroup}
            data={item}
            onPress={() => onRemoveParticipants(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() => <View style={{ width: 20 }} />}
      />
      <View style={[styles.contactTitle, !!lodash.size(selectedParticipants) && { paddingTop: 15 }]}>
        <ArrowDownIcon
          style={{ marginTop: 2, marginRight: 3 }}
          color={text.default}
          size={24}
        />
        <Text
          size={14}
          color={text.default}
          style={{ fontFamily: Regular500 }}
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

  const ListFooterComponent = () => {
    return (
      <ListFooter
        hasError={hasError}
        fetching={fetching}
        loadingText="Loading more users..."
        errorText="Unable to load users"
        refreshText="Refresh"
        onRefresh={() => fetchMoreParticipants(true)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5 }]}>
          <View style={{ position: 'absolute', left: 0, zIndex: 999 }}>
            <TouchableOpacity onPress={onBack}>
              <BackIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text
              color={header.default}
              size={14}
              style={{ fontFamily: Regular500 }}
            >
              Add participants
            </Text>
          </View>
          {
            !!lodash.size(selectedParticipants) && (
              <View style={{ position: 'absolute', right: 0, zIndex: 999 }}>
                <TouchableOpacity
                  disabled={!lodash.size(selectedParticipants) || nextLoading}
                  onPress={addMembers}
                >
                  {
                    nextLoading ? (
                      <ActivityIndicator color={text.default} size={'small'} />
                    ) : (
                      <Text
                        color={text.info}
                        size={16}
                        style={{ fontFamily: Regular500 }}
                      >
                        Done
                      </Text>
                    )
                  }
                </TouchableOpacity>
              </View>
            )
          }
        </View>
        <SearchField
          inputStyle={[styles.input]}
          iconStyle={styles.icon}
          placeholder="Search"
          outlineStyle={[styles.outline]}
          placeholderTextColor="#6E7191"
          value={searchText}
          onChangeText={setSearchText}
          onChangeTextDebounce={setSearchValue}
          onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
        />
      </View>
      <FlatList
        data={contacts}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            tintColor={primaryColor} // ios
            progressBackgroundColor={primaryColor} // android
            colors={['white']} // android
            refreshing={loading}
            onRefresh={onRequestData}
          />
        }
        renderItem={({ item }) => (
          <ContactItem
            image={item?.profilePicture?.thumb}
            data={item}
            isGroup={item.isGroup}
            name={item.name}
            isOnline={item.isOnline}
            onPress={() => onTapCheck(item._id)}
            rightIcon={
              <TouchableOpacity
                onPress={() => onTapCheck(item._id)}
              >
                {
                  checkIfSelected(item._id) ? (
                    <View style={styles.selected}>
                      <CheckIcon
                        type={'check1'}
                        size={RFValue(16)}
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
        ListFooterComponent={ListFooterComponent}
        onEndReached={() => fetchMoreParticipants()}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  )
}

export default AddParticipants
