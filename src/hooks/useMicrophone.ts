import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-react';

const noop = () => {};

interface MediaDeviceInfo {
  label: string;
  deviceId: string;
}

const useMicrophone = (): MediaDeviceInfo[] => {
  const [microphoneList, setMicrophoneList] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    let mounted = true;

    const onChange = () => {
      AgoraRTC
        .getMicrophones()
        .then((microphones: MediaDeviceInfo[]) => {
          if (mounted) {
            setMicrophoneList(microphones);
          }
        })
        .catch(noop);
    };

    AgoraRTC.onMicrophoneChanged = onChange;

    onChange();

    return () => {
      mounted = false;
      AgoraRTC.onMicrophoneChanged = undefined;
    };
  }, []);

  return microphoneList;
};

export default useMicrophone;