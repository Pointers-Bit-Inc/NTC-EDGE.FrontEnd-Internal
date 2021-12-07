import React, { useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SearchField } from '@components/molecules/form-fields';
import { ChatItem } from '@components/molecules/list-item';
import { FilterIcon } from '@components/atoms/icon';
import { primaryColor, outline } from '@styles/color';
import Text from '@atoms/text';
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
  }
});

const data = [
  {
    _id: '1',
    member: [],
    channelName: 'Test Group',
    recipient: [],
    sender: [],
    image: 'https://www.himalmag.com/wp-content/uploads/2019/07/sample-profile-picture.png',
    lastMessage: {
      sender: 'You',
      message: 'Thanks',
      time: '9:31 AM',
    },
  },
  {
    _id: '2',
    member: [],
    channelName: 'Test Group',
    recipient: [],
    sender: [],
    lastMessage: {
      sender: 'You',
      message: 'Thanks',
      time: '9:31 AM',
    },
  },
  {
    _id: '3',
    member: [],
    channelName: 'Test Group',
    recipient: [],
    sender: [],
    image: 'https://www.himalmag.com/wp-content/uploads/2019/07/sample-profile-picture.png',
    lastMessage: {
      sender: 'You',
      message: 'Thanks',
      time: '9:31 AM',
    },
  },
]

const ChatList = () => {
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState(data);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            style={styles.profile}
            source={{ uri: 'https://www.himalmag.com/wp-content/uploads/2019/07/sample-profile-picture.png' }}
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
        data={messages}
        renderItem={({ item }) => (
          <ChatItem
            image={item.image}
            name={item.channelName}
            message={item.lastMessage}
          />
        )}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={
          () => <View style={styles.separator} />
        }
      />
    </SafeAreaView>
  )
}

export default ChatList
