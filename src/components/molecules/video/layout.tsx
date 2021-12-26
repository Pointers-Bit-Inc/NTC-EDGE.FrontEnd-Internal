import React, {
  useEffect,
  useState,
  ReactNode,
  FC,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react'
import { View, StyleSheet, FlatList, Dimensions, Platform, TouchableOpacity } from 'react-native'
import lodash from 'lodash';
import { useInitializeAgora } from 'src/hooks/useAgora';
import { MicIcon, CameraIcon } from '@components/atoms/icon';
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
  fullVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallVideo: {
    backgroundColor: '#606A80',
    width: width * 0.30,
    height: width * 0.37,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
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
    left: 5,
  },
  footer: {
    width: '100%',
    paddingTop: 10,
    position: 'absolute',
    bottom: 30,
  },
})

interface Props {
  loading?: boolean;
  participants?: [];
  meetingParticipants?: [];
  user: any;
  options: any;
  header?: ReactNode;
  agora?: any;
  callEnded?: false;
  isVoiceCall?: false;
  onEndCall?: () => void;
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
  loading = false,
  participants = [],
  meetingParticipants = [],
  user = {},
  options = {},
  header,
  agora = {},
  callEnded = false,
  isVoiceCall = false,
  onEndCall = () => {},
}, ref) => {
  const [selectedPeer, setSelectedPeer]:any = useState(null);
  const [peerList, setPeerList]:any = useState([]);
  const {
    initAgora,
    destroyAgoraEngine,
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
    switchCamera,
  } = useInitializeAgora({
    ...agora,
    options: {
      ...options,
      isVideoEnable: isVoiceCall ? !isVoiceCall : options?.isVideoEnable,
    },
  })

  useImperativeHandle(ref, () => ({
    joinSucceed,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    toggleIsMute,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
  }));

  useEffect(() => {
    if (!loading && agora.appId) {
      initAgora();
      return () => destroyAgoraEngine();
    }
  }, [loading, agora.appId]);

  useEffect(() => {
    if (isInit) {
      joinChannel();
    }
  }, [isInit, joinChannel]);

  useEffect(() => {
    if (meetingParticipants) {
      if (lodash.size(peerIds) === 2) {
        const filterPeer = lodash.reject(peerIds, p => p === myId);
        setSelectedPeer(filterPeer[0]);
        setPeerList([myId]);
      } else {
        const findFocus = lodash.find(meetingParticipants, p => {
          if (p.isFocused) {
            const findPeer = lodash.find(peerIds, pd => pd === p.uid)
            return !!findPeer;
          }
          return false
        });
        if (findFocus) {
          const filterPeer = lodash.reject(peerIds, p => p === findFocus.uid);
          setSelectedPeer(findFocus.uid);
          setPeerList(filterPeer);
        } else {
          const filterPeer = lodash.reject(peerIds, p => p === myId);
          setSelectedPeer(myId);
          setPeerList(filterPeer);
        }
      }
    }
  }, [meetingParticipants, peerIds])

  const separator = () => (
    <View style={{ width: 15 }} />
  );
  
  const fullVideo = (isFocused) => {
    const findParticipant = lodash.find(meetingParticipants, p => p.uid === selectedPeer);
    if (isFocused) {
      return (
        <View style={styles.fullVideo}>
          {
            isVideoEnable ? (
              <AgoraLocalView
                style={styles.video}
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
              />
            ) : (
              <ProfileImage
                size={80}
                textSize={24}
                image={user.image}
                name={`${user.firstName} ${user.lastName}`}
              />
            )
          }
          {
          isVideoEnable ? null : (
            <Text
              style={styles.name}
              numberOfLines={1}
              size={16}
              color={'white'}
            >
              {findParticipant?.firstName}
            </Text>
          )
        }
          {
            isMute ? (
              <MicIcon
                style={[styles.mic, { top: 120, left: 20 }]}
                size={24}
                type='muted'
                color={text.error}
              />
            ) : null
          }
          <View style={{ position:'absolute', top: 115, right: 20 }}>
            <TouchableOpacity onPress={switchCamera}>
              <CameraIcon
                size={28}
                type='switch'
                color={'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.fullVideo}>
        {
          peerVideoState[selectedPeer] === VideoRemoteState.Decoding ? (
            <AgoraRemoteView
              style={styles.video}
              channelId={channelName}
              uid={selectedPeer}
              renderMode={VideoRenderMode.Hidden}
            />
          ) : (
            <ProfileImage
              image={findParticipant?.image}
              name={`${findParticipant?.firstName} ${findParticipant?.lastName}`}
              size={80}
              textSize={24}
            />
          )
        }
        {
          peerVideoState[selectedPeer] === VideoRemoteState.Decoding ? null : (
            <Text
              style={styles.name}
              numberOfLines={1}
              size={16}
              color={'white'}
            >
              {findParticipant?.firstName}
            </Text>
          )
        }
        {
          peerAudioState[selectedPeer] === 0 ? (
            <MicIcon
              style={[styles.mic, { top: 120, left: 20 }]}
              size={16}
              type='muted'
              color={text.error}
            />
          ) : null
        }
      </View>
    )
  }
  const renderItem = ({ item }) => {
    const findParticipant = lodash.find(meetingParticipants, p => p.uid === item);
    if (findParticipant) {
      if (item === myId) {
        return (
          <View style={styles.smallVideo}>
            {
              isVideoEnable ? (
                <AgoraLocalView
                  style={styles.video}
                  channelId={channelName}
                  renderMode={VideoRenderMode.Hidden}
                />
              ) : (
                <ProfileImage
                  image={findParticipant.image}
                  name={`${findParticipant.firstName} ${findParticipant.lastName}`}
                  size={50}
                  textSize={16}
                />
              )
            }
            <Text
              style={
                isVideoEnable ?
                styles.floatingName : styles.name
              }
              numberOfLines={1}
              size={12}
              color={'white'}
            >
              {findParticipant.firstName}
            </Text>
            {
              isMute ? (
                <MicIcon
                  style={styles.mic}
                  size={16}
                  type='muted'
                  color={text.error}
                />
              ) : null
            }
            <View style={{ position:'absolute', top: 0, right: 5 }}>
              <TouchableOpacity onPress={switchCamera}>
                <CameraIcon
                  size={22}
                  type='switch'
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      return (
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
                image={findParticipant.image}
                name={`${findParticipant.firstName} ${findParticipant.lastName}`}
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
            {findParticipant.firstName}
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
      );
    }
    return null;
  }
  return (
    <View style={styles.container}>
      {(joinSucceed && !callEnded) ? header : null}
      {
        (joinSucceed && !callEnded) ? (
          <>
            {fullVideo(!selectedPeer || selectedPeer === myId)}
            <View style={styles.videoList}>
              <FlatList
                data={peerList}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
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
            callEnded={callEnded}
          />
        )
      }
      {
        !callEnded && (
          <View style={styles.footer}>
            <VideoButtons
              onSpeakerEnable={toggleIsSpeakerEnable}
              onMute={toggleIsMute}
              onVideoEnable={toggleIsVideoEnable}
              onMore={() => {}}
              onEndCall={onEndCall}
              isSpeakerEnabled={isSpeakerEnable}
              isMute={isMute}
              isVideoEnabled={isVideoEnable}
            />
          </View>
        )
      }
    </View>
  );
}

export default forwardRef(VideoLayout)
