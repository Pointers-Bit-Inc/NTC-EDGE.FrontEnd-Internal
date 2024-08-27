import React, { useEffect, useState } from 'react'
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import RNFetchBlob from 'react-native-blob-util';

const useDownload = () => {
  const [granted, setGranted] = useState(false);

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File',
            buttonPositive: 'ok',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setGranted(true);
        } else {
          // If permission denied then show alert
          Alert.alert('Error','Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++"+err);
      }
    } else {
      setGranted(true);
    }
  };

  const downloadFile = (attachment:any) => {
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;

    if (Platform.OS === 'ios') {
      RootDir = fs.dirs.DocumentDir;
    }

    const date = new Date();
    const FILE_URL = attachment.uri;
    const downloadPath = `${RootDir}/${Math.floor(date.getTime() + date.getSeconds() / 2)}-${attachment.name}`;
    let options = {
      fileCache: true,
      ios: {
        fileCache: true,
        path: downloadPath,
        notification: true,
      },
      addAndroidDownloads: {
        path: downloadPath,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,   
      },
    };
    return config(options).fetch('GET', FILE_URL)
  };

  return {
    granted,
    checkPermission,
    downloadFile,
  }
}

export default useDownload