import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import lodash from 'lodash';
import { setSelectedChannel, addChannel, updateChannel, removeChannel } from 'src/reducers/channel/actions';
import { SearchField } from '@components/molecules/form-fields';
import { ChatItem } from '@components/molecules/list-item';
import { VideoIcon, WriteIcon } from '@components/atoms/icon';
import { primaryColor, outline, text } from '@styles/color';
import {
  getChannelName,
  getChannelImage,
  getTimeString,
  getOtherParticipants,
  checkSeen,
} from 'src/utils/formatting';
import useFirebase from 'src/hooks/useFirebase';
import Text from '@atoms/text';
import ProfileImage from '@components/atoms/image/profile';
import InputStyles from 'src/styles/input-style';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingBottom: 5,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#F1F1F1',
    paddingVertical: 3,
    borderRadius: 10,
  },
  icon: {
    paddingHorizontal: 5,
    color: text.default,
    fontSize: 18,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
  } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(Platform.OS === 'web') {
      initializeFirebaseApp();
      return () => {
        deleteFirebaseApp();
      };
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscriber = channelSubscriber(searchValue, (querySnapshot:FirebaseFirestoreTypes.QuerySnapshot) => {
      setLoading(false);
      querySnapshot.docChanges().forEach((change:any) => {
        const data = change.doc.data();
        data._id = change.doc.id;
        data.channelId = change.doc.id;
        switch(change.type) {
          case 'added': {
            const hasSave = lodash.find(channelList, (ch:any) => ch._id === data._id);
            data.otherParticipants = getOtherParticipants(data.participants, user);
            data.hasSeen = checkSeen(data.seen, user);
            if (!hasSave) {
              dispatch(addChannel(data));
            }
            return;
          }
          case 'modified': {
            data.otherParticipants = getOtherParticipants(data.participants, user);
            data.hasSeen = checkSeen(data.seen, user);
            dispatch(updateChannel(data));
            return;
          }
          case 'removed': {
            data.otherParticipants = getOtherParticipants(data.participants, user);
            data.hasSeen = checkSeen(data.seen, user);
            dispatch(removeChannel(data._id));
            return;
          }
          default:
            return;
        }
      });
    });
    return () => {
      unsubscriber();
    }
  }, [searchValue])

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
        <View style={styles.headerContent}>
          <ProfileImage
            size={40}
            image={user.image}
            name={`${user.firstname} ${user.lastname}`}
          />
          <View style={styles.titleContainer}>
            <Text
              color={text.default}
              weight={'600'}
              size={24}
            >
              Chat
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
            <VideoIcon
              size={24}
              color={primaryColor}
            />
          </TouchableOpacity>
          <View style={{ width: 25 }} />
          <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
            <WriteIcon
              size={22}
              color={primaryColor}
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
          onChangeTextDebounce={setSearchValue}
          onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
        />
      </View>
      <View style={styles.shadow} />
      {
        loading ? (
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size={'small'} color={text.default} />
            <Text
              size={14}
              color={text.default}
            >
              Fetching chat...
            </Text>
          </View>
        ) : (
          <FlatList
            data={channelList}
            renderItem={({ item }:any) => (
              <ChatItem
                image={getChannelImage(item)}
                imageSize={50}
                textSize={18}
                name={getChannelName(item)}
                user={user}
                participants={item.otherParticipants}
                message={item.lastMessage}
                isGroup={item.isGroup}
                seen={item.hasSeen}
                time={getTimeString(item?.updatedAt?.seconds)}
                onPress={() => {
                  dispatch(setSelectedChannel(item));
                  navigation.navigate('ViewChat', item)
                }}
              />
            )}
            keyExtractor={(item:any) => item._id}
            ListEmptyComponent={emptyComponent}
          />
        )
      }
    </SafeAreaView>
  )
}

export default ChatList
