/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback, FC } from 'react';
import {Dimensions,Platform} from 'react-native';
import _ from 'lodash';
import AgoraRTC from 'agora-rtc-sdk';


interface Props {
  appId: string;
  token: string;
  channelName: string;
  uid: number;
  options: any;
}

interface Option {
  isMute: boolean;
  isVideoEnabled: boolean;
  isSpeakerPhoneEnabled: boolean;
}
const { height, width } = Dimensions.get('window');
export const useInitializeAgora = ({
  appId,
  token,
  channelName,
  uid,
  options,
}:Props) => {
  const [isInit, setIsInit] = useState(false);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [peerVideoState, setPeerVideState] = useState({});
  const [peerAudioState, setPeerAudioState] = useState({});
  const [myId, setMyId] = useState<number>(0);
  const [isMute, setIsMute] = useState(options?.isMute);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const [isVideoEnable, setIsVideoEnable] = useState(options?.isVideoEnable);
  const [activeSpeaker, setActiveSpeaker] = useState(0);
  const rtcEngine = useRef(null);

  const initAgora = useCallback(async () => {
    let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    client.init(appId);
    var localStream=AgoraRTC.createStream({audio:options?.isMute,video:options?.isVideoEnable,screen:false});
    localStream.init();
    const localStreamContainer=document.createElement("div");
    localStreamContainer.id="local" +uid;
    localStreamContainer.style.width= width + "px";
    localStreamContainer.style.height= height + "px";
    localStreamContainer.style.position="absolute";
    document.body.append(localStreamContainer);
    localStream.play(localStreamContainer.id);
    client.join(token,channelName,uid,(uid)=>{
      setMyId(uid);
      setPeerIds(peerIdsLocal => {
        if (peerIdsLocal.indexOf(uid) === -1) {
          return [...peerIdsLocal, uid];
        }
        return peerIdsLocal;
      });

      client.publish(localStream);
    });
    client.on('error', (evt) => {
      console.log('Error', evt);
    })
    client.on('stream-added',(evt)=>{
      client.subscribe(evt.stream)
    });
    client.on('stream-subscribed',(evt)=>{
      let stream=evt.stream;
      let streamId=stream.getId();
      addVideoStream(streamId);
      stream.play(streamId)
    });
    client.on('stream-removed',(evt)=>{
      let stream=evt.stream;
      let streamId=stream.getId();
      stream.close();
      removeVideoStream(streamId)
    });
    client.on("peer-leave",function(evt){
      let stream=evt.stream;
      let streamId=stream.getId();
      setPeerIds(peerIdsLocal => {
        return peerIdsLocal.filter(id => id !== uid);
      });
      stream.close();
      removeVideoStream(streamId);
    });
    client.on('volume-indicator', (evt) => {
      evt.attr.forEach(function(volume, index){
        const sortedVolumes = _.sortBy(volume, ['volume']).reverse();
        if (sortedVolumes && sortedVolumes[0]) {
          const highestVolume = sortedVolumes[0];
          if (highestVolume && highestVolume.uid === 0) {
            setActiveSpeaker(myId);
          } else {
            setActiveSpeaker(highestVolume.uid);
          }
        }
      });

    })





    setIsInit(true);
  }, [appId, token, channelName, uid]);
  function addVideoStream(elementId){
    let streamDiv=document.createElement("div");
    streamDiv.id=elementId;
    streamDiv.style.width= width + "px";
    streamDiv.style.height= height + "px";
    streamDiv.style.position="absolute";
    streamDiv.style.transform="rotateY(180deg)";
    const remoteContainer=document.createElement("div");
    remoteContainer.id= "remote" + uid;
    remoteContainer.style.width= width + "px";
    remoteContainer.style.height= height + "px";
    remoteContainer.style.position="absolute";
    remoteContainer.appendChild(streamDiv)
  }

  function removeVideoStream(elementId){
    let rem=document.getElementById(elementId);
    if(rem) rem.parentNode?.removeChild(rem)
  }
  const joinChannel = useCallback(async () => {
    await rtcEngine.current?.joinChannel(token, channelName, null, uid);
  }, [channelName, token, uid]);

  const leaveChannel = useCallback(async () => {
    await rtcEngine.current?.leaveChannel();
    setPeerIds([]);
    setMyId(0);
    setJoinSucceed(false);
  }, []);

  const toggleIsMute = useCallback(async () => {
    await rtcEngine.current?.muteLocalAudioStream(!isMute);
    setIsMute(!isMute);
  }, [isMute]);

  const toggleIsSpeakerEnable = useCallback(async () => {
    await rtcEngine.current?.setEnableSpeakerphone(!isSpeakerEnable);
    setIsSpeakerEnable(!isSpeakerEnable);
  }, [isSpeakerEnable]);

  const toggleIsVideoEnable = useCallback(async () => {
    await rtcEngine.current?.muteLocalVideoStream(isVideoEnable);
    setIsVideoEnable(!isVideoEnable);
  }, [isVideoEnable]);

  const switchCamera = useCallback(async () => {
    await rtcEngine.current?.switchCamera();
  }, []);

  const destroyAgoraEngine = useCallback(async () => {
    await rtcEngine.current?.destroy();
  }, []);

  // useEffect(() => {
  //   if (appId) {
  //     initAgora();
  //   }
  //   return () => {
  //     destroyAgoraEngine();
  //   };
  // }, [destroyAgoraEngine, initAgora, appId]);

  return {
    isInit,
    initAgora,
    destroyAgoraEngine,
    channelName,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    joinSucceed,
    activeSpeaker,
    peerIds,
    peerVideoState,
    peerAudioState,
    myId,
    joinChannel,
    leaveChannel,
    toggleIsMute,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
    switchCamera,
  };
};
