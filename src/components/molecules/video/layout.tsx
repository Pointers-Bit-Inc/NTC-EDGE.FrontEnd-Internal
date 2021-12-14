import React, { useEffect, ReactNode, FC } from 'react'
import { View, StyleSheet, FlatList, Dimensions, Platform } from 'react-native'
import lodash from 'lodash';
import { useInitializeAgora } from 'src/hooks/useAgora';
import { MicIcon } from '@components/atoms/icon';
import {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  VideoRemoteState,
} from 'react-native-agora';
import ConnectingVideo from '@components/molecules/video/connecting'
import ProfileImage from '@components/atoms/image/profile';
import Text from '@components/atoms/text';
import { text } from '@styles/color';
import { agoraTestConfig } from 'src/services/config'
const { width, height } = Dimensions.get('window');
const AgoraLocalView =
  Platform.OS === 'android'
    ? RtcLocalView.TextureView
    : RtcLocalView.SurfaceView;

const AgoraRemoteView =
  Platform.OS === 'android'
    ? RtcRemoteView.TextureView
    : RtcRemoteView.SurfaceView;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutTwoVideo: {
    flex: 1,
    backgroundColor: 'black',
  },
  horizontal: {
    flexDirection: 'row',
    flex: 1,
  },
  vertical: {
    flexDirection: 'column',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
  },
  smallVideo: {
    backgroundColor: '#606A80',
    width: width * 0.30,
    height: width * 0.37,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoList: {
    position: 'absolute',
    bottom: 100,
  },
  name: {
    textAlign: 'center',
    marginTop: 5,
  },
  floatingName: {
    position: 'absolute',
    bottom: 5,
    left: 10,
  },
  mic: {
    position: 'absolute',
    top: 5,
    left: 10,
  }
})

interface VideoProps {
  participants?: [],
  header?: ReactNode,
}

const data = [1,2,3,4];

const VideoLayout: FC<VideoProps> = ({
  participants = [],
  header,
}) => {
  const { joinChannel, leaveChannel, isInit, myId, peerIds, channelName, joinSucceed } = useInitializeAgora({
    ...agoraTestConfig,
    options: {
      isMute: false,
      isVideoEnabled: true,
      isSpeakerPhoneEnabled: false,
    },
  })

  useEffect(() => {
    if (isInit) {
      joinChannel();
    }
  }, [isInit, joinChannel]);

  const separator = () => (
    <View style={{ width: 15 }} />
  );
    console.log('PARTICIPANTS', participants)
  return (
    <View style={styles.container}>
      {header}
      {
        joinSucceed ? (
          <>
            <AgoraLocalView
              style={styles.video}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
            />
            <View style={styles.videoList}>
              <FlatList
                data={participants}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.smallVideo}>
                    {/* <AgoraLocalView
                      style={styles.video}
                      channelId={channelName}
                      renderMode={VideoRenderMode.Hidden}
                    /> */}
                    <ProfileImage
                      image={item.image}
                      name={`${item.firstname} ${item.lastname}`}
                      size={50}
                      textSize={16}
                    />
                    <Text
                      style={styles.name}
                      numberOfLines={1}
                      size={12}
                      color={'white'}
                    >
                      {item.firstname}
                    </Text>
                    <MicIcon
                      style={styles.mic}
                      size={14}
                      type='muted'
                      color={text.error}
                    />
                  </View>
                )}
                ItemSeparatorComponent={separator}
                ListHeaderComponent={separator}
                ListFooterComponent={separator}
                keyExtractor={item => item._id}
              />
            </View>
          </>
        ) : (
          <ConnectingVideo
            participants={participants}
          />
        )
      }
    </View>
  );
}

export default VideoLayout
