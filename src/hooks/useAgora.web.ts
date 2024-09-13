/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback, FC } from 'react';
import _ from 'lodash';
import {
  createClient,
  ClientConfig,
} from "agora-rtc-react";

const config: ClientConfig = { 
  mode: "rtc", codec: "h264",
};

const useClient = createClient(config);

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
  const [volumeIndicator, setVolumIndicator] = useState<any>({});
  const [myId, setMyId] = useState<number>(uid);
  const [isMute, setIsMute] = useState(options?.isMute);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const [isVideoEnable, setIsVideoEnable] = useState(options?.isVideoEnable);
  const [activeSpeaker, setActiveSpeaker] = useState(0);
  const client = useClient();
  const { tracks }:any = options;
  // const cameraList = useCamera();
  // const microphoneList = useMicrophone();

  const initAgora = async () => {
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") {
        setPeerVideoState((videoState:any) => ({
          ...videoState,
          [user.uid]: user.videoTrack,
        }));
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
        setPeerAudioState((audioState:any) => ({
          ...audioState,
          [user.uid]: user.audioTrack,
        }));
      }
    });

    client.on("user-unpublished", async (user, type) => {
      if (type === "audio") {
        user.audioTrack?.stop();
        setPeerAudioState((audioState:any) => {
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
    client.enableAudioVolumeIndicator();
    client.on("volume-indicator", (volumes) => {
      volumes.forEach((volume, index) => {
        setVolumIndicator((volumeState:any) => ({
          ...volumeState,
          [volume.uid]: Math.floor(volume.level) > 5 ? 1 : 0,
        }));
      });
    });
    
    client.on("user-left", (user) => {
      setPeerAudioState((audioState:any) => {
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
        setPeerAudioState((audioState:any) => ({
          ...audioState,
          [user.uid]: user.audioTrack,
        }));
      }

      if (user.videoTrack) {
        setPeerVideoState((videoState:any) => ({
          ...videoState,
          [user.uid]: user.videoTrack,
        }));
      }

      setPeerIds((peerIdsLocal:any) => {
        if (peerIdsLocal.indexOf(user.uid) === -1) {
          return [...peerIdsLocal, user.uid];
        }
        return peerIdsLocal;
      });
    });

    client.on("user-info-updated", (uid, msg) => {
      if (msg === 'mute-audio') {
        setPeerAudioState((audioState:any) => {
          delete audioState[uid];
          return audioState;
        });
      } else if (msg === 'unmute-audio') {
        setPeerAudioState({
          ...peerAudioState,
          [uid]: true,
        });
      }
    })

    setIsInit(true);
  };

  const joinChannel = async () => {
    await client.join(appId, channelName, token, uid);
    if (tracks) {
      if (!isMute && isVideoEnable) {
        await client.publish(tracks);
      } else if (!isMute && !isVideoEnable) {
        await client.publish(tracks[0]);
        await client.unpublish(tracks[1]);
      } else if (isMute && isVideoEnable) {
        await client.publish(tracks[1]);
        await client.unpublish(tracks[0]);
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
    tracks[0].close();
    tracks[1].close();
    setIsInit(false);
    setJoinSucceed(false);
    setPeerIds([]);
    setMyId(0);
  };

  const toggleIsMute = async (mute = false) => {
    if (!isInit) {
      return;
    }
    if (!mute) {
      await client.publish(tracks[0]);
    } else {
      await client.unpublish(tracks[0]);
    }
    setIsMute(mute);
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
    volumeIndicator,
  };
};
