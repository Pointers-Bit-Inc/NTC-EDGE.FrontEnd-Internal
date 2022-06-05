import { useEffect, useState, useRef, useCallback } from "react";
import { Alert, Platform } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";
import { BASE_URL, API_VERSION } from 'src/services/config';
import useApi from 'src/services/api';
import { normalize, schema } from 'normalizr';
import { roomSchema, messageSchema, meetingSchema } from 'src/reducers/schema';
import { addMeeting, updateMeeting, setConnectionStatus, setNotification, setMeeting, removeMeetingFromList } from 'src/reducers/meeting/actions';
import { addMessages, updateMessages, addChannel, removeChannel, updateChannel, addFiles, updateParticipants } from 'src/reducers/channel/actions';

const useSignalr = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const [connectionStatus, setConnectionStatus] = useState('');
  const signalr = useRef<HubConnection|null>(null);
  const api = useApi(user.sessionToken);

  const initSignalR = useCallback(async () => {
    signalr.current = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/chathub`, {
          transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
          accessTokenFactory: () => user.sessionToken
        })
        .withAutomaticReconnect()
        .build();
    signalr.current.serverTimeoutInMilliseconds = 1000 * 60 * 3;
    signalr.current.keepAliveIntervalInMilliseconds = 1000 * 60 * 1;
    signalr.current.onclose(() => setConnectionStatus('disconnected'));
    signalr.current.onreconnected(() => setConnectionStatus('connected'));
    signalr.current.onreconnecting(() => setConnectionStatus('reconnecting'));
    signalr.current.start().then(() => setConnectionStatus('connected'));
  }, []);
  const destroySignalR = useCallback(() => {
    signalr.current?.stop();
  }, []);

  const onConnection = useCallback((connection, callback = () => {}) =>
    signalr.current?.on(connection, callback),
  []);

  const onChatUpdate = (users:Array<string>, type:string, data:any) => {
    if (data) {
      switch(type) {
        case 'create': {
          dispatch(addMessages(data.roomId, data));
          if (data?.attachment !== null) dispatch(addFiles(data));
          break;
        }
        case 'update': {
          dispatch(updateMessages(data.roomId, data));
          break;
        }
      }
    }
  };

  const onRoomUpdate = (users:Array<string>, type:string, data:any) => {
    if (data) {
      switch(type) {
        case 'create': {
          dispatch(addChannel(data));
          if (data.lastMessage) dispatch(addMessages(data._id, data.lastMessage));
          if (data?.lastMessage?.attachment !== null) dispatch(addFiles(data.lastMessage));
          break;
        }
        case 'update': {
          dispatch(updateChannel(data));
          if (data.lastMessage) dispatch(addMessages(data._id, data.lastMessage));
          break;
        }
        case 'updateParticipants': {
          dispatch(updateParticipants(data));
          break;
        }
        case 'delete': dispatch(removeChannel(data._id)); break;
        case 'remove': {
          dispatch(removeChannel(data._id));
          Alert.alert('Alert', 'You have been removed from the chat.');
          break;
        }
      }
    }
  };

  const onMeetingUpdate = (users:Array<string>, type:string, data:any) => {
    if (data) {
      switch(type) {
        case 'create': {
          const { room } = data;
          const { lastMessage } = room;
          dispatch(updateChannel(room));
          dispatch(addMessages(room._id, lastMessage));
          dispatch(addMeeting(data));
          break;
        };
        case 'update': {
          const { room = {} } = data;
          const { lastMessage } = room;
          if (lastMessage) dispatch(updateChannel(room));
          if (lastMessage) dispatch(addMessages(room._id, lastMessage));
          dispatch(updateMeeting(data));
          break;
        }
        case 'meetingnotification': {
          dispatch(setNotification(data));
          break;
        }
        case 'remove': {
          dispatch(removeChannel(data.roomId));
          dispatch(setMeeting(null));
          dispatch(removeMeetingFromList(data._id));
          Alert.alert('Alert', 'You have been removed from the meeting.');
          break;
        }
      }
    }
  };

  const OnMeetingNotification = (users:Array<string>, type:string, data:any) => {
    if (data) {
      switch(type) {
        case 'meetingnotification': {
          dispatch(setNotification(data));
          break;
        }
      }
    }
  };

  const createChannel = useCallback((payload, callback = () => {}, config = {}) => {
    api.post('/rooms/new', payload, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      console.log('ERROR ERROR', err);
      return callback(err);
    });
  }, []);

  const getChannel = useCallback((id, callback = () => {}, config = {}) => {
    api.get(`/rooms/${id}`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getChannelByParticipants = useCallback(({ participants }, callback = () => {}, config = {}) => {
    api.post('/rooms/get-room', {
      participants,
    }, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const leaveChannel = useCallback((channelId, callback = () => {}, config = {}) => {
    api.delete(`/rooms/${channelId}/delete`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getChatList = useCallback((payload, callback = () => {}, config = {}) => {
    api.get(`rooms?pageIndex=${payload.pageIndex || 1}&keyword=${payload.keyword || ""}`, config)
    .then(res => {
      const { hasMore = false, list = [] } = res.data;
      const normalized = normalize(list, new schema.Array(roomSchema));
      return callback(null, { hasMore, list: normalized?.entities?.rooms });
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getParticipantList = useCallback((payload, callback = () => {}, config = {}) => {
    api.get(`users/${user._id}/contacts?pageIndex=${payload.pageIndex || 1}&keyword=${payload.keyword || ""}&loadRooms=${payload.loadRooms || false}`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const sendMessage = useCallback((payload, callback = () => {}, config = {}) => {
    api.post('/messages', payload, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const sendFile = useCallback((channelId, payload, callback = () => {}, config = {}) => {
    api.post(`/messages/${channelId}/upload-file`, payload, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const editMessage = useCallback((payload, callback = () => {}, config = {}) => {
    api.patch(`/messages/${payload.messageId}`, payload, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const unSendMessage = useCallback((messageId, callback = () => {}, config = {}) => {
    api.patch(`/messages/${messageId}/unsend`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const deleteMessage = useCallback((messageId, callback = () => {}, config = {}) => {
    api.delete(`/messages/${messageId}/delete`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const seenMessage = useCallback((id, callback = () => {}, config = {}) => {
    api.patch(`/messages/${id}/seen`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMessages = useCallback((channelId, pageIndex, file = false, callback = () => {}, config = {}) => {
    api.get(`/messages?roomId=${channelId}&pageIndex=${pageIndex}&file=${file}`, config)
    .then(res => {
      const { hasMore = false, list = [] } = res.data;
      const normalized = normalize(list, new schema.Array(messageSchema));
      return callback(null, { hasMore, list: normalized?.entities?.messages || {} });
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const createMeeting = useCallback((payload, callback = () => {}, config = {}) => {
    api.post('/meetings', payload, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const joinMeeting = useCallback(({ meetingId, muted = false }, callback = () => {}, config = {}) => {
    api.get(`/meetings/${meetingId}/join?muted=${muted}`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMeeting = useCallback((id, callback = () => {}, config = {}) => {
    api.get(`/meetings/${id}`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const endMeeting = useCallback((id, callback = () => {}, config = {}) => {
    api.patch(`/meetings/${id}/end`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const leaveMeeting = useCallback((id, status, callback = () => {}, config = {}) => {
    api.patch(`/meetings/${id}/leave?status=${status}`, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const muteParticipant = useCallback((id, payload, callback = () => {}, config = {}) => {
    api.patch(`/meetings/${id}/mute`, payload, config)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMeetingList = useCallback((payload, callback = () => {}, config = {}) => {
    api.get(`meetings?pageIndex=${payload.pageIndex || 1}`, config)
    .then(res => {
      const { hasMore = false, list = [] } = res.data;
      const normalized = normalize(list, new schema.Array(meetingSchema));
      return callback(null, { hasMore, list: normalized?.entities?.meetings });
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getActiveMeetingList = useCallback((callback = () => {}, config = {}) => {
    api.get(`/users/${user._id}/meetings?status=active`, config)
    .then(res => {
      const normalized = normalize(res.data, new schema.Array(meetingSchema));
      return callback(null, normalized?.entities?.meetings);
    })
    .catch(err => {
      return callback(err);
    });
  }, [])

  const checkVersion = useCallback((callback = () => {}, config = {}) => {
    const version = API_VERSION;
    const os = Platform.OS;
    if (os) {
      api.post('/check-version', { os, version }, config)
      .then(res => {
        return callback(null, res.data);
      })
      .catch(err => {
        return callback(err);
      });
    }
    return callback();
  }, [])
  
  return {
    connectionStatus,
    initSignalR,
    destroySignalR,
    onConnection,
    onChatUpdate,
    onRoomUpdate,
    onMeetingUpdate,
    OnMeetingNotification,
    createChannel,
    getChannel,
    getChannelByParticipants,
    leaveChannel,
    getChatList,
    getParticipantList,
    sendMessage,
    sendFile,
    editMessage,
    unSendMessage,
    deleteMessage,
    seenMessage,
    getMessages,
    createMeeting,
    getMeeting,
    endMeeting,
    leaveMeeting,
    joinMeeting,
    muteParticipant,
    getMeetingList,
    getActiveMeetingList,
    checkVersion,
  }
}

export default useSignalr;