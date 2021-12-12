/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import _ from 'lodash';
import RtcEngine, { VideoRemoteState } from 'react-native-agora';
import { useSelector } from 'react-redux';
import { requestCameraAndAudioPermission } from './usePermission';

export const useRequestCameraAndAudioPermission = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
      });
    }
  }, []);
};

export const useInitializeAgora = () => {
};
