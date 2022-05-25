/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback, FC } from 'react';
import _ from 'lodash';
import {
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
import useCamera from './useCamera';
import useMicrophone from './useMicrophone';

const config: ClientConfig = { 
  mode: "rtc", codec: "h264",
};

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks({
  encoderConfig: 'high_quality',
}, {
  optimizationMode: 'detail',
  encoderConfig: '720p_2',
});

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
  const [peerVideoState, setPeerVideoState] = useState<any>({});
  const [peerAudioState, setPeerAudioState] = useState<any>({});
  const [updatedAudioState, setUpdatedAudioState] = useState<any>({});
  const [myId, setMyId] = useState<number>(uid);
  const [isMute, setIsMute] = useState(options?.isMute);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const [isVideoEnable, setIsVideoEnable] = useState(options?.isVideoEnable);
  const [activeSpeaker, setActiveSpeaker] = useState(0);
  const client = useClient();
  const { ready, tracks }:any = useMicrophoneAndCameraTracks();
  const cameraList = useCamera();
  const microphoneList = useMicrophone();

  const initAgora = async () => {
    console.log('cameraList, microphoneList', cameraList, microphoneList);
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") {
        setPeerVideoState({
          ...peerVideoState,
          [user.uid]: user.videoTrack,
        });
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
        setUpdatedAudioState({
          ...peerAudioState,
          [user.uid]: user.audioTrack,
        });
      }
    });

    client.on("user-unpublished", (user, type) => {
      if (type === "audio") {
        user.audioTrack?.stop();
        setUpdatedAudioState((audioState:any) => {
          delete audioState[user.uid];
          return audioState;
        });
      }
      if (type === "video") {
        setPeerVideoState((videoState:any) => {
          delete videoState[user.uid];
          return videoState;
        });
      }
    });

    client.on("volume-indicator", (result) => {
      const sortedVolumes = _.sortBy(result, ['volume']).reverse();
      if (sortedVolumes && sortedVolumes[0]) {
        const highestVolume = sortedVolumes[0];
        if (highestVolume && highestVolume.uid === 0) {
          setActiveSpeaker(uid);
        } else {
          setActiveSpeaker(highestVolume.uid);
        }
      }
  });
    
    client.on("user-left", (user) => {
      setUpdatedAudioState((audioState:any) => {
        delete audioState[user.uid];
        return audioState;
      });
      setPeerVideoState((videoState:any) => {
        delete videoState[user.uid];
        return videoState;
      });
      setPeerIds(peerIdsLocal => {
        return peerIdsLocal.filter(id => id !== user.uid);
      });
    });

    client.on("user-joined", (user) => {
      if (user.audioTrack) {
        setUpdatedAudioState({
          ...peerAudioState,
          [user.uid]: user.audioTrack,
        });
      }

      if (user.videoTrack) {
        setPeerVideoState({
          ...peerVideoState,
          [user.uid]: user.videoTrack,
        });
      }

      setPeerIds((peerIdsLocal:any) => {
        if (peerIdsLocal.indexOf(user.uid) === -1) {
          return [...peerIdsLocal, user.uid];
        }
        return peerIdsLocal;
      });
    });

    setIsInit(true);
  };

  const joinChannel = async () => {
    await client.join(appId, channelName, token, uid);
    console.log('ENABLE TRACKS', isMute, isVideoEnable);
    if (tracks) {
      if (!isMute && isVideoEnable) {
        await client.publish(tracks);
      } else if (!isMute && !isVideoEnable) {
        await client.publish(tracks[0]);
      } else if (isMute && isVideoEnable) {
        await client.publish(tracks[1]);
      }
    }
    setMyId(uid);
    setJoinSucceed(true);
    const hasAlreadyJoined = _.find(peerIds, (id:number) => id === uid);
    if (!hasAlreadyJoined) {
      setPeerIds(peerIdsLocal => {
        return [...peerIdsLocal, uid];
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    setIsInit(false);
    setJoinSucceed(false);
    setPeerIds([]);
    setMyId(0);
  };

  const toggleIsMute = async () => {
    if (!isInit) {
      return;
    }
    console.log('TOGGLE IS MUTE');
    if (isMute) {
      await client.publish(tracks[0]);
    } else {
      await client.unpublish(tracks[0]);
    }
    setIsMute(!isMute);
  };

  const toggleRemoteAudio = async (uid, muted) => {
    // await tracks[0].setEnabled(isMute);
    setIsMute(!isMute);
  };

  const toggleIsSpeakerEnable = async () => {
    setIsSpeakerEnable(!isSpeakerEnable);
  };

  const toggleIsVideoEnable = async () => {
    if (isVideoEnable) {
      await client.unpublish(tracks[1]);
    } else {
      await client.publish(tracks[1]);
    }
    setIsVideoEnable(!isVideoEnable);
  };

  const switchCamera = async () => {
    // await rtcEngine.current?.switchCamera();
  };

  const destroyAgoraEngine = async () => {
    leaveChannel();
  };

  const onPeerAudioStateUpdate = () => {
    setPeerAudioState({
      ...peerAudioState,
      ...updatedAudioState
    });
  };

  useEffect(() => {
    if (!!_.size(updatedAudioState)) {
      onPeerAudioStateUpdate();
    }
  }, [updatedAudioState]);

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
    toggleRemoteAudio,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
    switchCamera,
    tracks,
    ready
  };
};
