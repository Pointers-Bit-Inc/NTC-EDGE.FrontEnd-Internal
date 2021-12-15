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
  const [peerVideoState, setPeerVideState] = useState({});
  const [peerAudioState, setPeerAudioState] = useState({});
  const [myId, setMyId] = useState<number|null>(null);
  const [isMute, setIsMute] = useState(false);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const [isVideoEnable, setIsVideoEnable] = useState(true);
  const rtcEngine = useRef<RtcEngine|null>(null);

  const initAgora = useCallback(async () => {
    rtcEngine.current = await RtcEngine.create(appId);
    await rtcEngine.current?.enableVideo();
    await rtcEngine.current?.enableAudio();
    await rtcEngine.current?.muteLocalAudioStream(false);
    await rtcEngine.current?.muteLocalVideoStream(false);
    await rtcEngine.current?.setEnableSpeakerphone(true);

    rtcEngine.current?.addListener('UserJoined', (uid) => {
      console.log('USER JOINED');
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
      },
    );

    rtcEngine.current?.addListener('RemoteVideoStateChanged', (uid, state) => {
      setPeerVideState({
        ...peerVideoState,
        [uid]: state,
      });
    });

    rtcEngine.current?.addListener('RemoteAudioStateChanged', (uid, state) => {
      setPeerAudioState({
        ...peerAudioState,
        [uid]: state,
      });
    });

    rtcEngine.current?.addListener('Error', error => {
      console.log('Error', error);
    });
    setIsInit(true);
  }, [appId, token, channelName, uid]);

  const joinChannel = useCallback(async () => {
    await rtcEngine.current?.joinChannel(token, channelName, null, uid);
  }, [channelName, token, uid]);

  const leaveChannel = useCallback(async () => {
    await rtcEngine.current?.leaveChannel();
    setPeerIds([]);
    setMyId(null);
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

  useEffect(() => {
    if (appId) {
      initAgora();
    }
    return () => {
      destroyAgoraEngine();
    };
  }, [destroyAgoraEngine, initAgora, appId]);

  return {
    isInit,
    destroyAgoraEngine,
    channelName,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    joinSucceed,
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
