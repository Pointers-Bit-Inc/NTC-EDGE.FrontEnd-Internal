import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import lodash from 'lodash';
import dayjs from 'dayjs';
import {setChannelList, updateChannel, removeChannel } from 'src/reducers/channel/actions';
import { SearchField } from '@components/molecules/form-fields';
import { ChatItem } from '@components/molecules/list-item';
import { FilterIcon, WriteIcon } from '@components/atoms/icon';
import { primaryColor, outline, text } from '@styles/color';
import { getChannelName, getChannelImage } from 'src/utils/formatting';
import useFirebase from 'src/hooks/useFirebase';
import Text from '@atoms/text';
import ProfileImage from '@components/atoms/image/profile';
import InputStyles from 'src/styles/input-style';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingBottom: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#F1F1F1',
    paddingVertical: 3,
  },
  icon: {
    paddingHorizontal: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: width - 70,
    alignSelf: 'flex-end',
    backgroundColor: outline.default,
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
  floating: {
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  button: {
    height: 65,
    width: 65,
    borderRadius: 65,
    backgroundColor: primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const ChatList = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const channelList = useSelector((state:RootStateOrAny) => {
    const { channelList } = state.channel;
    const sortedChannel = lodash.orderBy(channelList, 'updatedAt', 'desc');
    return sortedChannel;
  });
  const {
    channelSubscriber,
    initializeFirebaseApp,
    deleteFirebaseApp,
    getChannel,
  } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [searchText, setSearchText] = useState('');
  const [init, setInit] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const onFetchChannel = useCallback(() => {
    setLoading(true);
    getChannel((err:any, snapshot:any) => {
      setLoading(false);
      if (err) {
        return setError(err);
      }
      const data:any = [];
      snapshot.forEach((doc:any) => {
        const d = doc.data();
        d._id = doc.id;
        d.channelId = doc.id;
        data.push(d);
      });
      dispatch(setChannelList(data));
      if (!init) {
        setInit(true);
      }
    });
  }, [init]);

  useEffect(() => {
    initializeFirebaseApp();
    onFetchChannel();
    return () => {
      deleteFirebaseApp();
    };
  }, []);

  useEffect(() => {
    if (init) {
      const unsubscriber = channelSubscriber((querySnapshot:any) => {
        querySnapshot.docChanges().forEach((change:any) => {
          const data = change.doc.data();
          data._id = change.doc.id;
          data.channelId = change.doc.id;
          if (change.type === 'added') {
            const hasSave = lodash.find(channelList, (ch:any) => ch._id === data._id);
            if (!hasSave) {
              dispatch(updateChannel(data));
            }
          }
          if (change.type === 'modified') {
            dispatch(updateChannel(data));
          }
          if (change.type === 'removed') {
            dispatch(removeChannel(data._id));
          }
        });
      });
      return () => {
        unsubscriber();
      }
    }
  }, [init])

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

  const getTimeString = (time:any) => {
    if (time) {
      const dateNow = dayjs();
      const dateUpdate = dayjs(new Date(time * 1000));
      const diff = dateNow.diff(dateUpdate, 'days');

      if (diff === 0) {
        return dayjs(new Date(time * 1000)).format('hh:mm A');
      } else if (diff === 1) {
        return 'Yesterday';
      } else if (diff <= 7) {
        return dayjs(new Date(time * 1000)).format('dddd');
      }
      return dayjs(new Date(time * 1000)).format('DD/MM/YY');
    }
    return '';
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ProfileImage
            image={user.image}
            name={`${user.firstname} ${user.lastname}`}
          />
          <View style={styles.titleContainer}>
            <Text
              weight={'600'}
              size={24}
            >
              Chat
            </Text>
          </View>
          <TouchableOpacity>
            <FilterIcon
              size={28}
            />
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
      <View style={styles.shadow} />
      <FlatList
        data={channelList}
        renderItem={({ item }:any) => (
          <ChatItem
            image={getChannelImage(item, user)}
            name={getChannelName(item, user)}
            message={item.lastMessage}
            isGroup={item.isGroup}
            isSender={item.lastMessage.sender._id === user._id}
            seen={
              !!lodash.size(
                lodash.find(
                  item.seen,
                  s => s._id === user._id
                )
              )
            }
            time={getTimeString(item?.updatedAt?.seconds)}
            onPress={() => navigation.navigate('ViewChat', item)}
          />
        )}
        keyExtractor={(item:any) => item._id}
        ItemSeparatorComponent={
          () => <View style={styles.separator} />
        }
        ListEmptyComponent={emptyComponent}
      />
      <View style={styles.floating}>
        <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
          <View style={[styles.button, styles.shadow]}>
            <WriteIcon
              size={28}
              color={'white'}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ChatList
