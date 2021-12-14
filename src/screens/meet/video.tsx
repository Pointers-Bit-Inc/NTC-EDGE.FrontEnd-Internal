import React, { useState, useEffect } from 'react'
import { View, StyleSheet, StatusBar, TouchableOpacity, Platform } from 'react-native'
import { useSelector, RootStateOrAny } from 'react-redux'
import { ArrowLeftIcon, ChatIcon, PeopleIcon, VideoIcon, MenuIcon, PhoneIcon } from '@components/atoms/icon'
import {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  VideoRemoteState,
} from 'react-native-agora';
import Text from '@components/atoms/text'
import ConnectingVideo from '@components/molecules/video/connecting'
import VideoButtons from '@components/molecules/video/buttons'
import VideoLayout from '@components/molecules/video/layout'
import { useInitializeAgora } from 'src/hooks/useAgora';
import { text } from 'src/styles/color';
import { getChannelName } from 'src/utils/formatting'
import { agoraTestConfig } from 'src/services/config'

const AgoraLocalView =
  Platform.OS === 'android'
    ? RtcLocalView.TextureView
    : RtcLocalView.SurfaceView;

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
  footer: {
    width: '100%',
    paddingTop: 10,
    position: 'absolute',
    bottom: 30,
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
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <VideoLayout
        header={
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
                  size={26}
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
        }
        participants={otherParticipants}
      />
      <View style={styles.footer}>
        <VideoButtons
          onSpeakerEnable={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
          onMute={() => setIsMute(!isMute)}
          onVideoEnable={() => setIsVideoEnabled(!isVideoEnabled)}
          onMore={() => {}}
          onEndCall={() => navigation.goBack()}
          isSpeakerEnabled={isSpeakerEnabled}
          isMute={isMute}
          isVideoEnabled={isVideoEnabled}
        />
      </View>
    </View>
  )
}

export default Dial
