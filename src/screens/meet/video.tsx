import React from 'react'
import { View, StyleSheet, StatusBar, TouchableOpacity, Platform } from 'react-native'
import { useSelector, RootStateOrAny } from 'react-redux'
import { ArrowLeftIcon, ChatIcon, PeopleIcon } from '@components/atoms/icon'
import Text from '@components/atoms/text'
import VideoLayout from '@components/molecules/video/layout'
import { getChannelName } from 'src/utils/formatting'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#606A80',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 45,
    zIndex: 1,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  channelName: {
    flex: 1,
    marginHorizontal: 10,
  },
  layout: {
    flex: 1,
    backgroundColor: 'grey',
  },
  icon: {
    paddingHorizontal: 5
  }
})

const Dial = ({ navigation }) => {
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { channelId, isGroup, channelName, otherParticipants } = useSelector(
    (state:RootStateOrAny) => state.channel.selectedChannel
  );

  const header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeftIcon
          color='white'
        />
      </TouchableOpacity>
      <View style={styles.channelName}>
        <Text
          color={'white'}
          size={16}
          numberOfLines={1}
        >
          {getChannelName({ otherParticipants, isGroup, channelName })}
        </Text>
        <Text
          color='white'
        >
          01:26
        </Text>
      </View>
      <TouchableOpacity>
        <View style={styles.icon}>
          <ChatIcon
            size={24}
            color='white'
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.icon}>
          <PeopleIcon
            size={32}
            color='white'
          />
        </View>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <VideoLayout
        header={header()}
        participants={otherParticipants}
        uid={Math.floor(Math.random() * 100000)}
      />
    </View>
  )
}

export default Dial
