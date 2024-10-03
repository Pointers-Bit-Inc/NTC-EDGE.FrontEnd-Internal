import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, InteractionManager, ActivityIndicator, Dimensions, Image, Linking, Platform } from 'react-native'
import Modal from 'react-native-modal';
import Text from '@components/atoms/text'
import { ArrowDownIcon, CheckIcon, CloseIcon, DownloadIcon, FileIcon, MinusIcon, NewCheckIcon, NewFileIcon, TrashIcon } from '@components/atoms/icon';
import lodash from 'lodash';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import IMessages from '@/src/interfaces/IMessages';
import IParticipants from '@/src/interfaces/IParticipants';
import useSignalr from '@/src/hooks/useSignalr';
import {
  addToFiles,
  setFiles,
  updateMessages
} from '@/src/reducers/channel/actions';
import useDownload from '@/src/hooks/useDownload';
import { text } from '@styles/color';
import { FileItem } from '@components/molecules/list-item';
import IAttachment from '@/src/interfaces/IAttachment';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: 32,
    width: 32,
    borderRadius: 32,
    backgroundColor: '#D9DBE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  file: {
    marginLeft: 10,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    maxWidth: width * 0.6,
    paddingRight: 30,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flipY: {
    transform: [
      {
        scaleY: -1
      }
    ]
  },
  popUpMenu: {
    position: 'absolute',
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    top: 55,
    left: 25,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 30
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const FileList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const messages:Array<IMessages> = useSelector((state:RootStateOrAny) => {
    const { files } = state.channel;
    const messagesList = lodash.keys(files).map((m:string) => {
      return files[m];
    });
    let delivered = false;
    let seen:any = [];
    const messageArray = lodash.orderBy(messagesList, 'createdAt', 'desc')
    .map((msg:IMessages) => {
      if (!delivered && msg.delivered) {
        delivered = true;
      }
      if (delivered) msg.delivered = true;

      seen = lodash.unionBy(seen, msg.seen, 'id');
      msg.seen = seen;
      
      return msg;
    });

    return messageArray;
  });
  const { _id, isGroup, lastMessage, otherParticipants } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;

      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, (p:IParticipants) => p._id === user._id);
      return selectedChannel;
    }
  );
  const channelId = _id;
  const [selectedData, setSelectedData]:any = useState([]);
  const [progress, setProgress]:any = useState({});
  const [downloaded, setDownloaded]:any = useState({});
  const [error, setError]:any = useState({});
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [groupAction, setGroupAction] = useState('');
  const [showPopUpMenu, setShowPopUpMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [preview, setPreview] = useState<any>({})

  const {
    getMessages,
    deleteMessage,
  } = useSignalr();

  const {
    checkPermission,
    downloadFile,
  } = useDownload();

  const fetchMoreMessages = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    getMessages(channelId, pageIndex, true, (err:any, res:any) => {
      setLoading(false);
      if (res) {
        if (res.list) dispatch(addToFiles(res.list));
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        setHasError(true);
      }
      setFetching(false);
    })
  }

  useEffect(() => {
    checkPermission();
    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    let unmount = false;
    if (rendered) {
      getMessages(channelId, 1, true, (err:any, res:any) => {
        if (!unmount) {
          setLoading(false);
          if (res) {
            dispatch(setFiles(res.list));
            setPageIndex(current => current + 1);
            setHasMore(res.hasMore);
          }
          if (err) {
            setHasError(true);
          }
        }
      })
    }

    return () => {
      unmount = true;
    }
  }, [rendered, channelId]);

  useEffect(() => {
    if (lodash.size(selectedData) > 0 && lodash.size(selectedData) === lodash.size(messages)) {
      setGroupAction('all');
    } else if (lodash.size(selectedData) > 0) {
      setGroupAction('remove');
    } else {
      setGroupAction('');
    }
  }, [selectedData]);

  const onPressGroupAction = () => {
    if (groupAction === 'all' || groupAction === 'remove') {
      setSelectedData([]);
    } else {
      setSelectedData(messages);
    }
  }

  const onSelectAll = () => {
    setSelectedData(messages);
    setShowPopUpMenu(false);
  };

  const onRemoveAll = () => {
    setSelectedData([]);
    setShowPopUpMenu(false);
  }

  const onSelectItem = (item:IMessages) => {
    setSelectedData((p:IMessages) => ([...p, item]));
  };

  const onRemoveItem = (item:IMessages) => {
    const result = lodash.reject(selectedData, (d:IMessages) => d._id === item._id);
    setSelectedData(result);
  };

  const onPressItem = (item:IMessages) => {
    const isSelected = checkIfSelected(item);
    if (isSelected) {
      onRemoveItem(item);
    } else {
      onSelectItem(item);
    }
  }

  const checkIfSelected = (item:IMessages) => {
    return !!lodash.find(selectedData, (d:IMessages) => d._id === item._id);
  }

  const onDelete = async () => {
    const promises:any = [];
    setDeleting(true);
    selectedData.map((data:IMessages) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          deleteMessage(data._id, (res:any, err:any) => {
            if (err) {
              return reject(err);
            }
            onRemoveItem(data);
            dispatch(updateMessages(data.roomId, res));
            return resolve(res);
          })
        })
      )
    });
    Promise.all(promises).then(function(values) {
      setDeleting(false);
      setGroupAction('');
      setSelectedData([]);
    })
    .catch(() => {
      setDeleting(false);
    });
  }

  const onDownload = async () => {
    
    if (selectedData) {
      const promises:any = [];
      setDownloading(true);
      setDownloaded({});
      setProgress({});
      setError({});
      selectedData.map((data:IMessages) => {
        promises.push(
          new Promise(async (resolve, reject) => {
            downloadFile(data.attachment)
            .progress({ count: 10 }, (received, total) => {
              console.log('RECEIVED TOTAL', received, total);
              const progress = received / total;
              setProgress((p:any) => ({...p, [data._id]: progress}));
            })
            .then((res) => {
              setDownloaded((d:any) => ({ ...d, [data._id]: true }));
              resolve(res);
            })
            .catch((err) => {
              setError((err:any) => ({ ...err, [data._id]: true }));
              reject(err);
            })
          })
        )        
      });

      Promise.all(promises).then(function(values) {
        setDownloading(false);
      })
      .catch((err = []) => {
        setDownloading(false);
      });
    }
  }

  const emptyComponent = () => (
    <View style={styles.empty}>
      <FileIcon
        size={36}
        color={text.default}
      />
      <Text
        color={text.default}
        size={16}
      >
        No files yet
      </Text>
    </View>
  );

  const _renderItem = ({ item }:any) => {
    return (
      <FileItem
        name={item?.attachment?.name}
        size={item?.attachment?.size}
        uri={item?.attachment?.uri}
        selected={checkIfSelected(item)}
        onPress={() => onPressItem(item)}
        progress={progress[item._id] || 0}
        downloaded={downloaded[item._id] || false}
        error={error[item._id] || false}
        onPreview={() => setPreview(item)}
      />
    );
  }

  const _listHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressGroupAction}>
          <View style={[styles.circle, !!groupAction && { backgroundColor: '#2863D6' }]}>
            {
              groupAction === 'all' && (
                <NewCheckIcon
                  color={'white'}
                />
              )
            }
            {
              groupAction === 'remove' && (
                <MinusIcon
                  color={'white'}
                />
              )
            }
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPopUpMenu(p => !p)}>
          <ArrowDownIcon
            style={[{ marginHorizontal: 5 }, showPopUpMenu && styles.flipY]}
            color={'#979797'}
            size={26}
          />
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        {
          Platform.OS !== 'ios' && (
            <TouchableOpacity disabled={!groupAction || downloading} onPress={onDownload}>
              <View style={styles.icon}>
                <DownloadIcon
                  color={!!groupAction ? '#606A80' : '#979797'}
                  size={12}
                />
              </View>
            </TouchableOpacity>
          )
        }
        <TouchableOpacity disabled={!groupAction || deleting} onPress={onDelete}>
          <View style={styles.icon}>
            <TrashIcon
              color={!!groupAction ? '#606A80' : '#979797'}
              size={12}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const _popUpMenu = () => {
    if (showPopUpMenu) {
      return (
        <View style={[styles.popUpMenu, styles.shadow]}>
          <TouchableOpacity onPress={onSelectAll}>
            <View style={styles.menuItem}>
              <Text
                size={18}
                color={'#37405B'}
              >Select all</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemoveAll}>
            <View style={styles.menuItem}>
              <Text
                size={18}
                color={'#37405B'}
              >none</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return null;
  }

  const checkIfImage = (uri:any) => {
    if (uri && (uri.endsWith(".png") || uri.endsWith(".jpg") || uri.endsWith(".jpeg"))) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {_listHeader()}
      {_popUpMenu()}
      {
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'small'} color={text.default} />
            <Text color={text.default}>Fetching files...</Text>
          </View>
        ) : (
          <FlatList
            initialNumToRender={100}
            data={messages}
            renderItem={_renderItem}
            keyExtractor={(item:any) => item._id}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={emptyComponent}
            onEndReached={() => fetchMoreMessages()}
            onEndReachedThreshold={0.5}
          />
        )
      }
      <Modal
        isVisible={!!preview?.attachment}
        statusBarTranslucent={true}
        onBackdropPress={() => setPreview({})}
        onSwipeComplete={() => setPreview({})}
        style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 }}
      >
        <View style={{ position: 'absolute', top: 20, right: 10 }}>
          <TouchableOpacity onPress={() => setPreview({})}>
            <Text
              color={'white'}
              size={16}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
        {
          !!preview?.attachment && checkIfImage(preview?.attachment?.uri) ? (
            <Image
              resizeMode={'contain'}
              source={{ uri: preview?.attachment?.uri }}
              style={{ width: width * 0.9, height: height * 0.8 }}
            />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <NewFileIcon
                color={'#fff'}
                width={60}
                height={60}
              />
              <Text
                style={{ textAlign: 'center', marginTop: 15 }}
                color={'white'}
                size={18}
                numberOfLines={3}
              >
                {preview?.attachment?.name}
              </Text>
              <View style={{ justifyContent: 'center', marginTop: 30 }}>
                <TouchableOpacity onPress={() => Linking.openURL(preview?.attachment?.uri)}>
                  <View style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#2863D6', borderRadius: 10 }}>
                    <Text
                      color={'white'}
                      size={16}
                    >
                      Download
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </Modal>
    </View>
  )
}

export default FileList
