import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { SearchField } from '@components/molecules/form-fields';
import { ChatItem } from '@components/molecules/list-item';
import { FilterIcon, WriteIcon } from '@components/atoms/icon';
import { primaryColor, outline, text } from '@styles/color';
import useFirebase from 'src/hooks/useFirebase';
import Text from '@atoms/text';
import ProfileImage from '@components/atoms/image/profile';
import InputStyles from 'src/styles/input-style';

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
  profile: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: '82%',
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
  const user = useSelector(state => state.user);
  const {
    channels,
    getChannelRealtime,
    initializeFirebaseApp,
    deleteFirebaseApp
  } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    initializeFirebaseApp();
    const unsubscriber = getChannelRealtime();
    return () => {
      unsubscriber();
      deleteFirebaseApp();
    };
  }, []);

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
        data={channels}
        renderItem={({ item }:any) => (
          <ChatItem
            image={item.image}
            name={item.channelName}
            message={item.lastMessage}
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
