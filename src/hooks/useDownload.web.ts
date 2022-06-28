import axios from 'axios';
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

  const downloadFile = async (attachment:any) => {
    try {
      let link:any = document.createElement('a');
      link.href = attachment.uri;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link = null;
      return attachment;
    } catch (err) {
      console.log('ERROR', err);
      throw err;
    }
  };

  return {
    granted,
    checkPermission,
    downloadFile,
  }
}

export default useDownload