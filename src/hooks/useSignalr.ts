import { useEffect, useState, useRef, useCallback } from "react";
import { Platform } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";
import { BASE_URL } from 'src/services/config';
import useApi from 'src/services/api';
import { normalize, schema } from 'normalizr';
import { roomSchema, messageSchema, meetingSchema } from 'src/reducers/schema';
import { addMeeting, updateMeeting, setConnectionStatus } from 'src/reducers/meeting/actions';
import { addMessages, updateMessages, addChannel, removeChannel, updateChannel } from 'src/reducers/channel/actions';

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
          dispatch(addMessages(data));
          break;
        }
        case 'update': {
          dispatch(updateMessages(data));
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
          if (data.lastMessage) dispatch(addMessages(data.lastMessage));
          break;
        }
        case 'update': {
          dispatch(updateChannel(data));
          if (data.lastMessage) dispatch(addMessages(data.lastMessage));
          break;
        }
        case 'delete': dispatch(removeChannel(data._id)); break;
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
          dispatch(addMessages(lastMessage));
          dispatch(addMeeting(data));
          break;
        };
        case 'update': {
          const { room = {} } = data;
          const { lastMessage } = room;
          if (lastMessage) dispatch(updateChannel(room));
          if (lastMessage) dispatch(addMessages(lastMessage));
          dispatch(updateMeeting(data));
          break;
        }
      }
    }
  };

  const createChannel = useCallback(({ participants, name, message }, callback = () => {}) => {
    api.post('/rooms', {
      participants,
      name,
      message,
    })
    .then(res => {
      console.log('RESult', res);
      return callback(null, res.data);
    })
    .catch(err => {
      console.log('ERROR ERROR', err);
      return callback(err);
    });
  }, []);

  const getChannelByParticipants = useCallback(({ participants }, callback = () => {}) => {
    api.post('/rooms/get-room', {
      participants,
    })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const leaveChannel = useCallback((channelId, callback = () => {}) => {
    api.delete(`/rooms/${channelId}/delete`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getChatList = useCallback((payload, callback = () => {}) => {
    api.get(`rooms?pageIndex=${payload.pageIndex || 1}&keyword=${payload.keyword || ""}`)
    .then(res => {
      const { hasMore = false, list = [] } = res.data;
      const normalized = normalize(list, new schema.Array(roomSchema));
      return callback(null, { hasMore, list: normalized?.entities?.rooms });
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getParticipantList = useCallback((payload, callback = () => {}) => {
    api.get(`users/${user._id}/contacts?pageIndex=${payload.pageIndex || 1}&keyword=${payload.keyword || ""}&loadRooms=${payload.loadRooms || false}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const sendMessage = useCallback((payload, callback = () => {}) => {
    api.post('/messages', payload)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const editMessage = useCallback((payload, callback = () => {}) => {
    api.patch(`/messages/${payload.messageId}`, payload)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const unSendMessage = useCallback((messageId, callback = () => {}) => {
    api.patch(`/messages/${messageId}/unsend`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const deleteMessage = useCallback((messageId, callback = () => {}) => {
    api.delete(`/messages/${messageId}/delete`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const seenMessage = useCallback((id, callback = () => {}) => {
    api.patch(`/messages/${id}/seen`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMessages = useCallback((channelId, pageIndex, callback = () => {}) => {
    api.get(`/messages?roomId=${channelId}&pageIndex=${pageIndex}`)
    .then(res => {
      const { hasMore = false, list = [] } = res.data;
      const normalized = normalize(list, new schema.Array(messageSchema));
      return callback(null, { hasMore, list: normalized?.entities?.messages });
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const createMeeting = useCallback((payload, callback = () => {}) => {
    api.post('/meetings', payload)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const joinMeeting = useCallback((meetingId, callback = () => {}) => {
    api.get(`/meetings/${meetingId}/join`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const endMeeting = useCallback((id, callback = () => {}) => {
    api.patch(`/meetings/${id}/end`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const leaveMeeting = useCallback((id, callback = () => {}) => {
    api.patch(`/meetings/${id}/leave`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMeetingList = useCallback((payload, callback = () => {}) => {
    api.get(`meetings?pageIndex=${payload.pageIndex || 1}`)
    .then(res => {
      const { hasMore = false, list = [] } = res.data;
      const normalized = normalize(list, new schema.Array(meetingSchema));
      return callback(null, { hasMore, list: normalized?.entities?.meetings });
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getActiveMeetingList = useCallback((callback = () => {}) => {
    api.get(`/users/${user._id}/meetings?status=${"active"}`)
    .then(res => {
      const normalized = normalize(res.data, new schema.Array(meetingSchema));
      return callback(null, normalized?.entities?.meetings);
    })
    .catch(err => {
      return callback(err);
    });
  }, [])

  const checkVersion = useCallback((callback = () => {}) => {
    const version = DeviceInfo.getVersion();
    const os = Platform.OS;
    api.post('/rooms/check-version', { os, version })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, [])
  
  return {
    connectionStatus,
    initSignalR,
    destroySignalR,
    onConnection,
    onChatUpdate,
    onRoomUpdate,
    onMeetingUpdate,
    createChannel,
    getChannelByParticipants,
    leaveChannel,
    getChatList,
    getParticipantList,
    sendMessage,
    editMessage,
    unSendMessage,
    deleteMessage,
    seenMessage,
    getMessages,
    createMeeting,
    endMeeting,
    leaveMeeting,
    joinMeeting,
    getMeetingList,
    getActiveMeetingList,
    checkVersion,
  }
}

export default useSignalr;