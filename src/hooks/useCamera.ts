import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-react';

const noop = () => {};

interface MediaDeviceInfo {
  label: string;
  deviceId: string;
}

const useCamera = (): MediaDeviceInfo[] => {
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    let mounted = true;

    const onChange = () => {
      AgoraRTC
        .getCameras()
        .then((cameras: MediaDeviceInfo[]) => {
          if (mounted) {
            setCameraList(cameras);
          }
        })
        .catch(noop);
    };
    
    AgoraRTC.onCameraChanged = onChange;
    
    onChange();

    return () => {
      mounted = false;
      AgoraRTC.onCameraChanged = undefined;
    };
  }, []);

  return cameraList;
};

export default useCamera;