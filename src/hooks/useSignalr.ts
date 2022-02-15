import { useEffect, useState, useRef, useCallback } from "react";
import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { useSelector, RootStateOrAny } from "react-redux";
import { BASE_URL } from 'src/services/config';
import useApi from 'src/services/api';

const useSignalr = () => {
  const user = useSelector((state:RootStateOrAny) => state.user);
  const [isConnected, setIsConnected] = useState(false);
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
    await signalr.current.start();
    if (signalr.current.state === 'Connected') {
      setIsConnected(true);
    }
  }, []);

  const destroySignalR = useCallback(() => {
    if (isConnected) {
      signalr.current?.stop();
    }
  }, [isConnected]);

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
      return callback(null, res.data);
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

  const getMessages = useCallback((channelId, pageIndex, callback = () => {}) => {
    api.get(`/message/list?roomId=${channelId}&pageIndex=${pageIndex}`)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const createMeeting = useCallback((payload, callback = () => {}) => {
    console.log('PAYLOAD MEETING', payload);
    api.post('/meeting', payload)
    .then(res => {
      console.log('RESULT MEETING', res.data);
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMeetingList = useCallback((url, callback = () => {}) => {
    api.get(url)
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);
  
  return {
    isConnected,
    initSignalR,
    destroySignalR,
    createChannel,
    leaveChannel,
    getChatList,
    getParticipantList,
    sendMessage,
    editMessage,
    unSendMessage,
    deleteMessage,
    getMessages,
    createMeeting,
    getMeetingList,
  }
}

export default useSignalr;