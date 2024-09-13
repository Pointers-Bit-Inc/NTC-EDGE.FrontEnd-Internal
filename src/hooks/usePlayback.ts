import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-react';

const noop = () => {};

interface MediaDeviceInfo {
  label: string;
  deviceId: string;
}

const usePlayback = (): MediaDeviceInfo[] => {
  const [playbackList, setPlaybackList] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    let mounted = true;

    const onChange = () => {
      AgoraRTC
        .getPlaybackDevices()
        .then((playback: MediaDeviceInfo[]) => {
          if (mounted) {
            setPlaybackList(playback);
          }
        })
        .catch(noop);
    };
    
    AgoraRTC.onPlaybackDeviceChanged = onChange;
    
    onChange();

    return () => {
      mounted = false;
      AgoraRTC.onPlaybackDeviceChanged = undefined;
    };
  }, []);

  return playbackList;
};

export default usePlayback;