import React, { useState, useCallback, useEffect } from 'react'
import {
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux';
import lodash from 'lodash';
import { setSelectedChannel, addChannel } from '@/src/reducers/channel/actions';
import { outline, button, text } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from '@/src/styles/input-style';
import { ContactItem, ListFooter, SelectedContact } from '@components/molecules/list-item';
import { ArrowLeftIcon, ArrowDownIcon, CheckIcon } from '@components/atoms/icon'
import { SearchField } from '@components/molecules/form-fields'
import { primaryColor } from '@styles/color';
import useSignalr from '@/src/hooks/useSignalr';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
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
     fontWeight: "500"  ,
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
  }
})

const NewChat = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const {
    getParticipantList,
    createChannel,
  } = useSignalr();
  const [loading, setLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [participants, setParticipants]:any = useState([]);
  const [sendRequest, setSendRequest] = useState(0);
  const [contacts, setContacts]:any = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onRequestData = () => setSendRequest(request => request + 1);

  const fetchMoreParticipants = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    const payload = searchValue ? { pageIndex, keyword: searchValue } : { pageIndex };

    getParticipantList(payload, (err:any, res:any) => {
      if (res) {
        setContacts([...contacts, ...res.list]);
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
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    const source = axios.CancelToken.source();
    const payload = searchValue ? { pageIndex: 1, keyword: searchValue } : { pageIndex: 1 };

    getParticipantList(payload, (err:any, res:any) => {
      if (res) {
        setContacts(res.list);
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
  const onNext = () => {
    setNextLoading(true);
    createChannel(participants, (err:any, res:any) => {
      setNextLoading(false);
      if (res) {
        res.otherParticipants = lodash.reject(res.participants, p => p._id === user._id);
        dispatch(setSelectedChannel(res));
        dispatch(addChannel(res));
        navigation.replace('ViewChat', res);
      }
      if (err) {
        console.log('ERROR', err);
      }
    });
  }

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
            image={item?.profilePicture?.thumb}
            name={item.name}
            onPress={() => onRemoveParticipants(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() => <View style={{ width: 20 }} />}
        showsHorizontalScrollIndicator={false}
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
          onChangeTextDebounce={setSearchValue}
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
            onRefresh={onRequestData}
          />
        }
        renderItem={({ item }) => (
          <ContactItem
            image={item?.profilePicture?.thumb}
            name={item.name}
            onPress={() => onTapCheck(item._id)}
            disabled={true}
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

export default NewChat
