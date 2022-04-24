import React, {
  useEffect,
  useState,
  ReactNode,
  FC,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react'
import { View, StyleSheet, FlatList, Dimensions, Platform, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import lodash from 'lodash';
import { useInitializeAgora } from 'src/hooks/useAgora';
import {MicIcon,CameraIcon,VideoIcon,SpeakerIcon} from '@components/atoms/icon';

import ConnectingVideo from '@components/molecules/video/connecting'
import ProfileImage from '@components/atoms/image/profile';
import Text from '@components/atoms/text';
import { text } from '@styles/color';
import VideoButtons from '@components/molecules/video/buttons'
import VideoNotification from './notification';
const { width, height } = Dimensions.get('window');
import AgoraRTC from 'agora-rtc-sdk';
import VideoOutlineIcon from "@assets/svg/videoOutline";
import AddParticipantOutlineIcon from "@assets/svg/addParticipantOutline";


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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#565961"
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
    borderColor: "#1F2022",
    borderWidth: 2,
    zIndex: 1,
    borderRadius: 10,
   overflow: "hidden",
    width: 623,
    height: 419,
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
    width,
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
  message?: string;
  isVoiceCall?: false;
  onEndCall?: any;
  setNotification?: any;
  isGroup?: false;
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

function ParticipantVideo({ id }) {
  return (
      <View>
        <View nativeID={id} ></View>
      </View>
  )
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
  message = '',
  isVoiceCall = false,
  onEndCall = () => {},
  setNotification = (message:string) => {},
  isGroup = false,
}, ref) => {
  useImperativeHandle(ref, () => ({
    joinSucceed,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    toggleIsMute,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
  }));

  const initAgora = () => {
    let client = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    });

    client.init(agora.appId);
    client.join(
        agora.token,
        agora.channelName,
        agora.uid,
        (uid) => {
          let localStream = AgoraRTC.createStream({
            audio: true,
            video: true,
          });
          // Initialize the local stream
          localStream.init(()=>{
            // Play the local stream

            localStream.play("me");
            // Publish the local stream
            client.publish(localStream, (error) => {
              console.error(error)
            });
          }, (error) => {
            console.error(error)
          });
        },
        (error) => {
          console.error(error)
        })

    client.on('stream-added', (evt) => {
      console.log('stream-added')
      client.subscribe(evt.stream, handleError)
    })

    client.on('stream-subscribed', (evt) => {
      console.log('stream-subscribed')
      const stream = evt.stream
      const streamId = String(stream.getId())
      setStreams({
        ...streams,
        [streamId]: {
          stream: stream,
          added: false,
          removed: false,
        },
      })
    })

    client.on('stream-removed', (evt) => {
      console.log('stream-removed')
      const stream = evt.stream
      const streamId = String(stream.getId())

      setStreams(strs => {
        strs[streamId].removed = true
        return { ...strs }
      })
    })

    client.on('stream-unpublished', (evt) => {
      console.log('stream-unpublished')
    })


    client.on("peer-leave", function(evt){
      console.log('peer-leave')
      const stream = evt.stream
      const streamId = String(stream.getId())

      setStreams(strs => {
        strs[streamId].removed = true
        return { ...strs }
      })
    });
  }

  useEffect(() => {
    if (!loading && agora.appId) {
      initAgora();
    }
  }, [loading, agora.appId]);


  const [streams, setStreams] = useState({})

  const handleError = (error) => {
    console.error(error)
  }


  useEffect(() => {
    if(!Object.keys(streams).find((streamId) => !streams[streamId].added || streams[streamId].removed)) return

    setStreams(strs => {
      Object.keys(strs).forEach((streamId) => {
        if (!strs[streamId].added) {
          strs[streamId].added = true
          strs[streamId].stream.play(streamId)
        } else if (strs[streamId].removed) {
          strs[streamId].stream.close()
          delete strs[streamId]
        }
      })
      return { ... strs }
    })
  }, [streams])



  return (
    <View style={styles.container}>

      <View style={[styles.video, {position: "absolute", zIndex: 2, flex: 1, justifyContent: "flex-end"}]}>
        <View style={{position: "absolute",  backgroundColor: "rgba(96, 106, 128, 0.5)",  width: 643, height: 80}}>
          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
            <View style={{flexDirection: "row", gap: (width * 0.43) * 0.11, justifyContent: "center", }}>
              <View style={{alignItems: "center"}}>
                <View style={{paddingBottom: 15}}>
                  <VideoIcon
                      size={25}
                      type={ 'video'}
                      color={'white'}
                  />
                </View>

                <Text color={"white"}>Video On</Text>
              </View>
              <View style={{alignItems: "center"}}>
                <View style={{paddingBottom: 15}}>
                  <MicIcon
                      size={25}
                      type={'mic'}
                      color={'white'}
                  />
                </View>

                <Text color={"white"}>Mic On</Text>
              </View>
              <View style={{alignItems: "center"}}>
                <View style={{paddingBottom: 15}}>
                  <SpeakerIcon
                      size={25}
                      type={''}
                      color={'white'}
                  />
                </View>

                <Text color={"white"}>Speaker On</Text>
              </View>

            </View>
            <View style={{alignItems: "center"}}>
              <View style={{paddingBottom: 15}}>
               <AddParticipantOutlineIcon color={"white"}/>
              </View>

              <Text color={"white"}>Speaker On</Text>
            </View>

          </View>

        </View>
      </View>
        <View nativeID={"me"} style={styles.video}>
          <ConnectingVideo
              participants={participants}
              callEnded={callEnded}
          />
        </View>
        {
          Object.keys(streams).map((streamId) => {
            return <ParticipantVideo id={streamId} key={streamId} />
          })
        }
      </View>

  );
}

export default forwardRef(VideoLayout)
