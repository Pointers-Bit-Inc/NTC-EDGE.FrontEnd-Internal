import { useEffect, useState, useRef, useCallback } from "react";
import { Platform } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { useSelector, RootStateOrAny } from "react-redux";
import { BASE_URL } from 'src/services/config';
import useApi from 'src/services/api';
import { normalize, schema } from 'normalizr';
import { roomSchema, messageSchema, meetingSchema } from 'src/reducers/schema';

const useSignalr = () => {
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

  const createChannel = useCallback(({ participants, name, message }, callback = () => {}) => {
    api.post('/room', {
      participants,
      name,
      message,
    })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getChannelByParticipants = useCallback(({ participants }, callback = () => {}) => {
    api.post('/room/get-room', {
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
    api.delete(`/room/delete?id=${channelId}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getChatList = useCallback((url, callback = () => {}) => {
    api.get(url)
    .then(res => {
      const { hasMore = false, list = [] } = res.data;
      const normalized = normalize(list, new schema.Array(roomSchema));
      return callback(null, { hasMore, list: normalized?.entities?.rooms });
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getParticipantList = useCallback((url, callback = () => {}) => {
    api.get(url)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const sendMessage = useCallback((payload, callback = () => {}) => {
    api.post('/message', payload)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const editMessage = useCallback((payload, callback = () => {}) => {
    api.patch('/message/edit', payload)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const unSendMessage = useCallback((messageId, callback = () => {}) => {
    api.patch(`/message/unsend?id=${messageId}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const deleteMessage = useCallback((messageId, callback = () => {}) => {
    api.delete(`/message/delete?id=${messageId}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const seenMessage = useCallback((id, callback = () => {}) => {
    api.patch(`/message/seen?id=${id}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMessages = useCallback((channelId, pageIndex, callback = () => {}) => {
    api.get(`/message/list?roomId=${channelId}&pageIndex=${pageIndex}`)
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
    api.post('/meeting', payload)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const joinMeeting = useCallback((meetingId, callback = () => {}) => {
    api.get(`/meeting/join?meetingId=${meetingId}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const endMeeting = useCallback((id, callback = () => {}) => {
    api.patch(`/meeting/end?id=${id}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const leaveMeeting = useCallback((id, callback = () => {}) => {
    api.patch(`/meeting/leave?id=${id}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMeetingList = useCallback((url, callback = () => {}) => {
    api.get(url)
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
    api.get('/meeting/get-active-meetings')
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
    api.get(`/room/check-version?os=${os}&version=${version}`)
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