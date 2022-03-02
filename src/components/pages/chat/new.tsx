import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  RefreshControl,
  ActivityIndicator,
  InteractionManager,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import lodash from 'lodash';
import { outline, button, text } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import { ContactItem, ListFooter, SelectedContact } from '@components/molecules/list-item';
import { ArrowRightIcon, ArrowDownIcon, CheckIcon, CloseIcon, NewGroupIcon } from '@components/atoms/icon'
import { InputField, SearchField } from '@components/molecules/form-fields'
import { primaryColor, header } from '@styles/color';
import { Bold, Regular, Regular500 } from '@styles/font';
import useSignalr from 'src/hooks/useSignalr';
import axios from 'axios';
import { InputTags } from '@components/molecules/form-fields';
import { RFValue } from 'react-native-responsive-fontsize';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
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
  },
  newGroupContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#EAEAF4',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  outlineText: {
    borderRadius: 10,
  },
  inputText: {
    fontSize: RFValue(16),
  },
  groupName: {
    height: undefined,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    marginBottom: -30,
    marginTop: 20,
    paddingHorizontal: 10
  }
});

const tagStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#D6D6D6',
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
  },
  tag: {
    borderRadius: 10,
    margin: 2,
  },
  textTag: {
    color: header.default,
    fontFamily: Bold,
    fontSize: RFValue(14),
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#606060',
    fontSize: RFValue(14),
    fontFamily: Bold,
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: -2,
  },
});

const NewChat = ({ onClose = () => {}, onSubmit = () => {} }:any) => {
  const {
    getParticipantList,
    createChannel,
  } = useSignalr();
  const inputRef:any = useRef(null);
  const inputTagRef:any = useRef(null);
  const groupNameRef:any = useRef(null);
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
  const [groupName, setGroupName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [initialTags, setInitialTags] = useState([])

  const onRequestData = () => setSendRequest(request => request + 1);

  const fetchMoreParticipants = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    const url = searchValue ?
      `/room/search-participants?pageIndex=${pageIndex}&search=${searchValue}` :
      `/room/list-participants?pageIndex=${pageIndex}`;

    getParticipantList(url, (err:any, res:any) => {
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
    inputTagRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (searchValue) {
      setLoading(true);
      setPageIndex(1);
      setHasMore(false);
      setHasError(false);
      const source = axios.CancelToken.source();
      const url = searchValue ?
        `/room/search-participants?pageIndex=1&search=${searchValue}` :
        `/room/list-participants?pageIndex=1`;

      InteractionManager.runAfterInteractions(() => {
        getParticipantList(url, (err:any, res:any) => {
          if (res) {
            setContacts(res.list);
            setPageIndex(current => current + 1);
            setHasMore(res.hasMore);
          }
          if (err) {
            console.log('ERR', err);
          }
          setLoading(false);
        });
      });
    
      return () => {
        source.cancel();
      };
    } else {
      setContacts([]);
      setPageIndex(1);
      setHasMore(false);
      setLoading(false);
      setHasError(false);
    }
  }, [sendRequest, searchValue]);

  const onNext = () => {
    setNextLoading(true);
    createChannel({ participants, name: groupName }, (err:any, res:any) => {
      setNextLoading(false);
      if (res) {
        onSubmit(res);
      }
      if (err) {
        console.log('ERROR', err);
      }
    });
  }

  const onBeforeClose = () => {
    if (isGroup) {
      setGroupName('');
      setIsGroup(false);
      inputRef.current?.focus();
    } else {
      onClose();
    }
  }

  const onSelectParticipants = (selectedId:string) => {
    const selected = lodash.find(contacts, c => c._id === selectedId);
    setParticipants(p => ([...p, selected]));
    if (!isGroup) {
      inputTagRef?.current?.addTag(selected);
      inputTagRef?.current?.blur();
      setSearchValue('');
    }
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

  const onChangeTags = (tags:any) => {
    setInitialTags(tags);
    setParticipants(tags);
  };

  const renderTag = ({ tag, index, onPress, deleteTagOnPress, readonly }:any) => {
    return (
      <TouchableOpacity
        key={`${tag?._id}-${index}`}
        onPress={onPress}
        style={tagStyles.tag}>
        <Text style={tagStyles.textTag}>{tag?.firstName},</Text>
      </TouchableOpacity>
    );
  };

  const headerComponent = () => (
    <View>
      <FlatList
        style={[styles.outlineBorder, !lodash.size(participants) && { borderBottomWidth: 0 }]}
        horizontal
        data={participants}
        renderItem={({ item }) => (
          <SelectedContact
            image={item?.image}
            name={item.name}
            data={item}
            onPress={() => onRemoveParticipants(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() => <View style={{ width: 20 }} />}
        ItemSeparatorComponent={() => <View style={{ width: RFValue(5) }} />}
        showsHorizontalScrollIndicator={false}
      />
      <View style={[styles.contactTitle, !!lodash.size(participants) && { paddingTop: 15 }]}>
        <ArrowDownIcon
          style={{ marginTop: 2, marginRight: 3 }}
          color={text.default}
          size={24}
        />
        <Text
          size={14}
          color={'#606A80'}
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
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5, marginHorizontal: 15 }]}>
          <View style={{ position: 'absolute', left: 0, zIndex: 999 }}>
            <TouchableOpacity onPress={onBeforeClose}>
              <CloseIcon
                type='close'
                size={RFValue(18)}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text
              color={header.default}
              size={16}
              style={{ fontFamily: Bold }}
            >
              New message
            </Text>
          </View>
          {
            !!lodash.size(participants) && (
              <View style={{ position: 'absolute', right: 0, zIndex: 999 }}>
                <TouchableOpacity
                  disabled={!lodash.size(participants) || nextLoading}
                  onPress={onNext}
                >
                  {
                    nextLoading ? (
                      <ActivityIndicator color={text.default} size={'small'} />
                    ) : (
                      <Text
                        color={text.default}
                        size={14}
                        style={{ fontFamily: Regular500 }}
                      >
                        Create
                      </Text>
                    )
                  }
                </TouchableOpacity>
              </View>
            )
          }
        </View>
        {
          isGroup ? (
            <View style={{ paddingHorizontal: 15 }}>
              <InputField
                ref={groupNameRef}
                placeholder={'Group name'}
                containerStyle={styles.groupName}
                placeholderTextColor={'#C4C4C4'}
                inputStyle={[styles.inputText, { backgroundColor: 'white' }]}
                outlineStyle={[styles.outlineText, { backgroundColor: 'white' }]}
                value={groupName}
                onChangeText={setGroupName}
                returnKeyType={'done'}
              />
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
          ) : (
            <View style={{ marginBottom: 5, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignContent: 'center', paddingHorizontal: 15, paddingTop: 10 }}>
                <Text
                  color={text.default}
                  size={14}
                  style={{ fontFamily: Regular }}
                >
                  To:
                </Text>
                <View style={{ flex: 1, marginTop: -RFValue(10), paddingLeft: 5 }}>
                  <InputTags
                    ref={inputTagRef}
                    containerStyle={tagStyles.container}
                    initialTags={participants}
                    initialText={''}
                    inputStyle={tagStyles.input}
                    onChangeTags={onChangeTags}
                    renderTag={renderTag}
                    onChangeTextDebounce={setSearchValue}
                    onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
                  />
                </View>
              </View>
              <View style={styles.newGroupContainer}>
                <View style={{ alignContent: 'center', flexDirection: 'row' }}>
                  <NewGroupIcon
                    width={RFValue(22)}
                    height={RFValue(22)}
                    color={header.default}
                  />
                  <Text
                    color={header.default}
                    size={14}
                    style={{ fontFamily: Regular500, marginLeft: 5 }}
                  >
                    Create new group
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setIsGroup(true);
                    groupNameRef.current?.focus();
                  }}
                >
                  <ArrowRightIcon
                    type='chevron-right'
                    color={'#606A80'}
                    size={RFValue(22)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        }
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
            onRefresh={onRequestData}
          />
        }
        renderItem={({ item }) => (
          <ContactItem
            image={item?.image}
            data={item}
            name={item.name}
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
        ListHeaderComponent={isGroup ? headerComponent : undefined}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={ListFooterComponent}
        onEndReached={() => fetchMoreParticipants()}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  )
}

export default NewChat
