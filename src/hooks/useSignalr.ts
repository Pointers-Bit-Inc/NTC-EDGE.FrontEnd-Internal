import { useEffect, useState, useRef, useCallback } from "react";
import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { useSelector, RootStateOrAny } from "react-redux";
import { BASE_URL } from 'src/services/config';
import useApi from 'src/services/api';
import { normalize, schema } from 'normalizr';
import { roomSchema, messageSchema, meetingSchema } from 'src/reducers/schema';

const useSignalr = () => {
  const user = useSelector((state:RootStateOrAny) => state.user);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const signalr = useRef<HubConnection|null>(null);
  const api = useApi(user.token);

  const initSignalR = useCallback(async () => {
    signalr.current = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/chathub`, {
          transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
          accessTokenFactory: () => user.token
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Debug)
        .build();
    signalr.current.onclose(() => setIsConnected(false));
    signalr.current.onreconnected(() => {
      setIsConnected(true);
      setIsReconnecting(false);
    });
    signalr.current.onreconnecting(() => {
      setIsReconnecting(true);
    });
    signalr.current.start().then(() => setIsConnected(true));
  }, []);
  const destroySignalR = useCallback(() => {
    if (isConnected) {
      signalr.current?.stop();
    }
  }, [isConnected]);

  const onConnection = useCallback((connection, callback = () => {}) =>
    signalr.current?.on(connection, callback),
  []);

  const createChannel = useCallback((participants, callback = () => {}) => {
    api.post('/room', {
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

  const endMeeting = useCallback((id, callback = () => {}) => {
    api.patch(`/meeting/end?id=${id}`)
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
  
  return {
    isConnected,
    isReconnecting,
    initSignalR,
    destroySignalR,
    onConnection,
    createChannel,
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
    getMeetingList,
  }
}

export default useSignalr;