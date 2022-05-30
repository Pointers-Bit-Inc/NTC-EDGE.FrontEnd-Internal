/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback, FC } from 'react';
import { Platform } from 'react-native';
import _ from 'lodash';
import RtcEngine, { VideoRemoteState } from 'react-native-agora';
import { useSelector } from 'react-redux';
import { requestCameraAndAudioPermission } from './usePermission';
import { RectProps } from 'react-native-svg';

export const useRequestCameraAndAudioPermission = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
      });
    }
  }, []);
};

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
  const [myId, setMyId] = useState<number>(0);
  const [isMute, setIsMute] = useState(options?.isMute);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const [isVideoEnable, setIsVideoEnable] = useState(options?.isVideoEnable);
  const [activeSpeaker, setActiveSpeaker] = useState(0);
  let tracks:any = null;
  const rtcEngine = useRef<RtcEngine|null>(null);

  const initAgora = async () => {
    rtcEngine.current = await RtcEngine.create(appId);
    await rtcEngine.current?.enableVideo();
    await rtcEngine.current?.enableAudio();
    await rtcEngine.current?.enableAudioVolumeIndication(1000, 3, false);
    await rtcEngine.current?.muteLocalAudioStream(options?.isMute);
    await rtcEngine.current?.muteLocalVideoStream(!options?.isVideoEnable);
    await rtcEngine.current?.setEnableSpeakerphone(true);
    await rtcEngine.current?.setVideoEncoderConfiguration({
      bitrate: 1710,
      frameRate: 30,
      minFrameRate: 15,
      minBitrate: 500,
      degradationPrefer: 2,
      dimensions: {
        height: 720,
        width: 1280,
      },
      mirrorMode: 2,
    })

    rtcEngine.current?.addListener('UserJoined', (uid) => {
      setPeerIds(peerIdsLocal => {
        if (peerIdsLocal.indexOf(uid) === -1) {
          return [...peerIdsLocal, uid];
        }
        return peerIdsLocal;
      });
    });

    rtcEngine.current?.addListener('UserOffline', (uid, reason) => {
      setPeerIds(peerIdsLocal => {
        return peerIdsLocal.filter(id => id !== uid);
      });
    });

    rtcEngine.current?.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        setMyId(uid);
        setJoinSucceed(true);
        const hasAlreadyJoined = _.find(peerIds, id => id === uid);
        if (!hasAlreadyJoined) {
          setPeerIds(peerIdsLocal => {
            return [...peerIdsLocal, uid];
          });
        }
      },
    );

    rtcEngine.current?.addListener('RemoteVideoStateChanged', (uid, state) => {
      setPeerVideoState({
        ...peerVideoState,
        [uid]: state,
      });
    });

    rtcEngine.current?.addListener('RemoteAudioStateChanged', (uid, state) => {
      setPeerAudioState({
        [uid]: state,
      });
    });

    rtcEngine.current?.addListener('Error', error => {
      console.log('Error', error);
    });

    rtcEngine.current?.addListener('AudioVolumeIndication', volumes => {
      const sortedVolumes = _.sortBy(volumes, ['volume']).reverse();
      if (sortedVolumes && sortedVolumes[0]) {
        const highestVolume = sortedVolumes[0];
        if (highestVolume && highestVolume.uid === 0) {
          setActiveSpeaker(myId);
        } else {
          setActiveSpeaker(highestVolume.uid);
        }
      }
    });

    setIsInit(true);
  };

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

  const toggleRemoteAudio = useCallback(async (uid, muted) => {
    await rtcEngine.current?.muteRemoteAudioStream(uid, muted)
  }, []);

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
