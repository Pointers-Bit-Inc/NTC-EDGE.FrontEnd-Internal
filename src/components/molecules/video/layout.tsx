import React, {
  useEffect,
  ReactNode,
  FC,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react'
import { View, StyleSheet, FlatList, Dimensions, Platform } from 'react-native'
import lodash from 'lodash';
import { useNavigation } from '@react-navigation/native';
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
import VideoButtons from '@components/molecules/video/buttons'
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

  // const videoStateMessage = state => {
  //   switch (state) {
  //     case VideoRemoteState.Stopped:
  //       return 'Video is disabled';
  
  //     case VideoRemoteState.Frozen:
  //       return 'Connection Issue, Please Wait...';
  
  //     case VideoRemoteState.Failed:
  //       return 'Network Error';
  //   }
  // };
  
  // const videoStateIcon = state => {
  //   switch (state) {
  //     case VideoRemoteState.Stopped:
  //       return <Icon3 name={'videocam-off'} size={40} color={'white'} />;
  
  //     case VideoRemoteState.Frozen:
  //       return (
  //         <Icon4 name={'network-strength-1-alert'} size={40} color={'red'} />
  //       );
  
  //     case VideoRemoteState.Failed:
  //       return <Icon4 name={'network-strength-off'} size={40} color={'red'} />;
  //   }
  // };


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
  },
  footer: {
    width: '100%',
    paddingTop: 10,
    position: 'absolute',
    bottom: 30,
  },
})

interface Props {
  participants?: [],
  header?: ReactNode,
  uid?: any,
}

export type VideoLayoutRef =  {
  joinSucceed: boolean;
  isMute: boolean;
  isSpeakerEnable: boolean;
  isVideoEnable: boolean;
  toggleIsMute: () => void;
  toggleIsSpeakerEnable: () => void;
  toggleIsVideoEnable: () => void;
}

const VideoLayout: ForwardRefRenderFunction<VideoLayoutRef, Props> = ({
  participants = [],
  header,
  uid,
}, ref) => {
  const navigation = useNavigation();
  const {
    joinChannel,
    isInit,
    myId,
    peerIds,
    peerVideoState,
    peerAudioState,
    channelName,
    joinSucceed,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    toggleIsMute,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
  } = useInitializeAgora({
    ...agoraTestConfig,
    uid: uid,
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

  useImperativeHandle(ref, () => ({
    joinSucceed,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    toggleIsMute,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
  }));

  const separator = () => (
    <View style={{ width: 15 }} />
  );
  return (
    <View style={styles.container}>
      {joinSucceed ? header : null}
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
                data={peerIds}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View style={styles.smallVideo}>
                    {
                      peerVideoState[item] === VideoRemoteState.Decoding ? (
                        <AgoraRemoteView
                          style={styles.video}
                          channelId={channelName}
                          uid={item}
                          renderMode={VideoRenderMode.Hidden}
                        />
                      ) : (
                        <ProfileImage
                          image={participants[index].image}
                          name={`${participants[index].firstname} ${participants[index].lastname}`}
                          size={50}
                          textSize={16}
                        />
                      )
                    }
                    <Text
                      style={
                        peerVideoState[item] === VideoRemoteState.Decoding ?
                        styles.floatingName : styles.name
                      }
                      numberOfLines={1}
                      size={12}
                      color={'white'}
                    >
                      {participants[index].firstname}
                    </Text>
                    {
                      peerAudioState[item] === 0 ? (
                        <MicIcon
                          style={styles.mic}
                          size={16}
                          type='muted'
                          color={text.error}
                        />
                      ) : null
                    }
                  </View>
                )}
                ItemSeparatorComponent={separator}
                ListHeaderComponent={separator}
                ListFooterComponent={separator}
                keyExtractor={item => `${item}`}
              />
            </View>
          </>
        ) : (
          <ConnectingVideo
            participants={participants}
          />
        )
      }
      <View style={styles.footer}>
        <VideoButtons
          onSpeakerEnable={toggleIsSpeakerEnable}
          onMute={toggleIsMute}
          onVideoEnable={toggleIsVideoEnable}
          onMore={() => {}}
          onEndCall={() => navigation.goBack()}
          isSpeakerEnabled={isSpeakerEnable}
          isMute={isMute}
          isVideoEnabled={isVideoEnable}
        />
      </View>
    </View>
  );
}

export default forwardRef(VideoLayout)
