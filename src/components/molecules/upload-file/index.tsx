import React, {FC, useEffect, useState} from 'react';
import { View, TouchableOpacity, FlatList, ImageBackground, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import Button from '@atoms/button';
import { AnimatedModal } from '@atoms/modals';

import Text from '@atoms/text';
import ProgressBar from '@atoms/progress-bar';
import Alert from '@atoms/alert';
import { defaultColor, disabledColor, infoColor, text } from '@styles/color';
import { NTCPreview } from '@/src/utils/ntc';
import {isMobile} from "@/src/utils/formatting";
import styles from './styles';
import Camera from "@atoms/icon/camera";
import Upload from "@atoms/icon/upload";
import FileAdd from "@atoms/icon/file-add";
import Close from "@atoms/icon/close";

interface Props {
  onUpload?: any;
  onRemove?: any;
  defaultFile?: any;
  defaultFiles?: any;
  uploading?: boolean;
  uploaded?: boolean;
  disabled?: boolean;
  uploadText?: string;
  raw?: boolean;
  photoOnly?: boolean;
};

const UploadFile: FC<Props> = ({
  photoOnly = false,
  raw = false,
  onUpload = () => {},
  onRemove = () => {},
  uploadText = 'Upload a file..',
  disabled = false,
  defaultFile,
  defaultFiles,
  uploading = false,
  uploaded = false,
}) => {





  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [file, setFile] = useState(defaultFile);
  const [files, setFiles] = useState(defaultFiles);
  const [visible, setVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alert, setAlert] = useState({title: '', message: ''});
  const multipleFiles = files?.length > 0;

  const onRequestCamera = async () => {
    let notGranted = (s: string = 'unavailable') => {
      return {
        status: s,
        title: `Camera ${(s && s[0].toUpperCase() + s.slice(1)) || 'Unavailable'}`,
        message: s === 'blocked' || s === 'denied'
          ? "You can manually enable the camera on this device's setings."
          : 'Camera is not available on this device.'
      };
    };
    if (!status?.granted && !status?.canAskAgain) return notGranted(status?.status);
    else {
      let _request = await requestPermission();
      if (_request?.granted) return {status: 'granted'};
      else return notGranted(_request?.status);
    }
  }

  const _onUpload = (_file: any) => {
    delete _file?.type;
    if (multipleFiles) {
      let _files = [...files];
      _files.push(_file);
      setFiles(_files);
    }
    else setFile(_file);
    onUpload(_file);
  };

  const _onTakePhoto = () => {
    _onUploadPhoto(true);
  };

  const _onUploadPhoto = async (isTakePhoto: boolean = false) => {
    let go = async () => {
      let _f = isTakePhoto === true
        ? await ImagePicker.launchCameraAsync({ presentationStyle: 0 })
        : await ImagePicker.launchImageLibraryAsync({ presentationStyle: 0 });
      if (!_f?.cancelled) {
        setVisible(false);
        let split = _f?.uri?.split('/');
        let name = split?.[split?.length - 1];
        _f = {
          type: _f?.cancelled ? 'cancel' : '',
          name,
          mimeType: `${_f?.type}/${name?.split('.')?.[1]}`,
          uri: _f?.uri,
        };
        _onUpload(_f);
      }
    };
    if (isTakePhoto) {
      let _permission = await onRequestCamera();
      if (_permission?.status === 'granted') go();
      else {
        setVisible(false);
        setTimeout(() => {
          setAlert({
            title: _permission?.title || '',
            message: _permission?.message || '',
          });
          setAlertVisible(true);
        }, 500);
      }
    }
    else go();
  };

  const _onUploadFile = async () => {
    let _f = await DocumentPicker.getDocumentAsync({
      type:'*/*',
      copyToCacheDirectory: false,
    });
    if (_f.type !== 'cancel') {
      setVisible(false);
      _onUpload(_f);
    }
  };

  const _onPreview = (filepath: string) => {
    filepath = filepath?.replace('file://', '');
    const path = FileViewer.open(filepath)
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
      });
  };

  const renderSelection = () => {
    let selection = [
      {
        label: 'Take a photo',
        icon: () => <Camera size={20} style={styles?.selectionIcon} />,
        onPress: _onTakePhoto,
      },
      {
        label: 'Upload a photo',
        icon: () => <Upload size={20} style={styles?.selectionIcon} />,
        onPress: _onUploadPhoto,
      },
      {
        label: 'Cancel',
        onPress: () => setVisible(false),
      }
    ];
    if (!photoOnly) {
      selection.splice(1, 0, {
        label: 'Upload a file',
        icon: () => <FileAdd size={20} style={styles?.selectionIcon} />,
        onPress: _onUploadFile,
      });
    }
    let renderItem = ({item}: any) => {
      return (
        <TouchableOpacity onPress={item?.onPress}>
          <View style={styles.selectionRow}>
            {item?.icon && item?.icon()}
            <Text style={styles?.selectionText}>{item?.label}</Text>
          </View>
        </TouchableOpacity>
      )
    };
    return (
      <AnimatedModal
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <FlatList
          initialNumToRender={100}
          data={selection}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}`}
          ItemSeparatorComponent={() => <View style={styles?.selectionSeparator} />}
        />
      </AnimatedModal>
    )
  };

  const renderAlert = () => {
    return (
      <Alert
        visible={alertVisible}
        title={alert?.title}
        message={alert?.message}
        confirmText='OK'
        onConfirm={() => setAlertVisible(false)}
      />
    )
  };

  const renderItem = (_file: any, _index: number) => {

    if (multipleFiles) {
      uploading = _file?.uploading;
      uploaded = _file?.uploaded;
    }
    function truncate(source, size) {
      return source?.length > size ? source?.slice(0, size - 1) + "…" : source;
    }
    const fileName = _file?.links?.small ? _file?.links?.small?.split('/')?.pop() : _file?.name;
    const uri = _file?.links?.small || _file?.uri;


    const preview = NTCPreview(fileName);




    return (
      <>
        {
          !!fileName &&
          <View style={styles.fileContainer}>
            <View style={!!fileName && uploaded && styles?.fileTextContainer50}>
              <Text style={styles.fileText} numberOfLines={1}>
                {Platform.select({
                  web: truncate(fileName, 15),
                  native:fileName
                })}
              </Text>
              {
                uploaded && !uploading &&
                <Text style={styles.uploadedText}>Uploaded</Text>
              }
            </View>
            <View>
              {
                !!_file?.name && uploaded
                  ? <TouchableOpacity
                      onPress={() => _onPreview(_file?.uri)}
                      disabled={disabled}
                    >
                      <ImageBackground
                        style={styles?.filePreview}
                        source={preview === 'image' && Platform.OS != "web" ? {uri} : preview}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (multipleFiles) {
                              let _files = [...files];
                              _files.splice(_index, 1);
                              setFiles(_files);
                            }
                            else setFile({});
                            onRemove(_index);
                          }}
                          disabled={disabled}
                        >
                          <View style={styles?.xPreviewContainer}>
                            <Close size={20} color='#fff' />
                          </View>
                        </TouchableOpacity>
                      </ImageBackground>

                    </TouchableOpacity>

                  : <TouchableOpacity
                      style={styles.fileXContainer}
                      onPress={() => {
                        if (multipleFiles) {
                          let _files = [...files];
                          _files.splice(_index, 1);
                          setFiles(_files);
                        }
                        else setFile({});
                        onRemove(_index);
                      }}
                      disabled={disabled}
                    >
                      <Close
                        color={disabled ? disabledColor : defaultColor}
                        size={15}
                      />
                    </TouchableOpacity>
              }
            </View>
          </View>
        }
        {
          uploading &&
          <ProgressBar
            color={infoColor}
            height={4}
            style={styles.progressBar}
          />
        }
      </>
    )
  };

  return (
    <View style={!raw && styles.container}>
      <Button
        style={[styles.uploadContainer, raw && {backgroundColor: undefined}]}
        onPress={() => {
          if(isMobile){
            setVisible(true)
          }else{
            _onUploadFile()
          }

        }}
        disabled={disabled}
      >
        <Upload
          color={disabled ? disabledColor : raw ? infoColor : defaultColor}
          size={15}
        />
        <Text style={[styles.uploadText, disabled && styles.disabledText]}>
          {uploadText}
        </Text>
      </Button>
      {!raw && <Text style={styles?.descriptionText}>File size must not exceed 20MB.</Text>}
      {!raw && renderItem(file, -1)}
      {
        !raw &&
        multipleFiles &&
        <FlatList
          initialNumToRender={100}
          horizontal={Platform.select({web: true, native: false})}
          data={defaultFiles}
          renderItem={({item, index}) => renderItem(item, index)}
          keyExtractor={(item, index) => `${index}`}
          ItemSeparatorComponent={() => <View style={styles?.separator} />}
        />
      }
      {renderSelection()}
      {renderAlert()}
    </View>
  )
};

export default UploadFile;
