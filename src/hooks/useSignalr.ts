import {  useState, useRef, useCallback } from "react";
import { Alert, Platform } from "react-native";
import { HubConnectionBuilder, HubConnection, HttpTransportType } from "@microsoft/signalr";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";
import { BASE_URL, API_VERSION } from '@/src/services/config';
import useApi from '@/src/services/api';
import { normalize, schema } from 'normalizr';
import { roomSchema, messageSchema, meetingSchema } from '@/src/reducers/schema';
import { addMeeting, updateMeeting, setConnectionStatus, setNotification, setMeeting, removeMeetingFromList, setToggle, endCall, updateMeetingParticipants } from '@/src/reducers/meeting/actions';
import {
  addMessages,
  updateMessages,
  addChannel,
  removeChannel,
  updateChannel,
  addFiles,
  updateParticipants,
  updateParticipantStatus,
  setHasNewChat
} from '@/src/reducers/channel/actions';
import {Audio} from "expo-av";
import * as React from "react";
import axios from "axios";

const useSignalr = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const [connectionStatus, setConnectionStatus] = useState('');
  const signalr = useRef<HubConnection|null>(null);
  const api = useApi(user.sessionToken,user.createdAt);
  const playbackInstance:any=React.useRef(null);
  const initSignalR = useCallback(async () => {
    signalr.current = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/chathub`, {
          transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
          accessTokenFactory: () => user.sessionToken,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'CreatedAt': `${user.createdAt}`,
            'Authorization': `Bearer ${user.sessionToken}`
          }
        })

        .withAutomaticReconnect()
        .build();
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

  const onStatusUpdate = (users:Array<string>, data:any) => {
    dispatch(updateParticipantStatus(data));
  }

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
        case 'endcall': {
          dispatch(addMessages(data.roomId, data));
          if (data.meeting) {
            dispatch(endCall({
              _id: data.meeting._id,
              ended: true,
              endedAt: data.meeting.EndedAt,
              updatedAt: data.meeting.EndedAt,
            }));
          }
          break;
        }
      }
    }
  };
  const playSound = async (del?:any) => {
    try {
      try {
        if (playbackInstance?.current != null) {
          await playbackInstance?.current?.unloadAsync();
          // this.playbackInstance.setOnPlaybackStatusUpdate(null);
          playbackInstance.current = null;
        }
        const {sound, status} = await Audio.Sound.createAsync(
              del ? require('@assets/sound/delete.mp3') : require('@assets/sound/notification_sound.mp3'),
            {shouldPlay: true}
        );
        playbackInstance.current = sound;
      } catch (e) {
        console.log(e)
      }


    } catch (e) {
      console.log(e)
    }
  }
  const onRoomUpdate = (users:Array<string>, type:string, data:any) => {
    if (data) {
      switch(type) {
        case 'create': {
          playSound()
          dispatch(addChannel(data));
          if (data.lastMessage) dispatch(addMessages(data._id, data.lastMessage));
          if (data?.lastMessage?.attachment !== null) dispatch(addFiles(data.lastMessage));
          break;
        }
        case 'update': {
          playSound()
          dispatch(updateChannel(data));
          if (data.lastMessage) dispatch(addMessages(data._id, data.lastMessage));
          break;
        }
        case 'updateParticipants': {
          playSound()
          dispatch(updateParticipants(data));
          break;
        }
        case 'delete': {
          playSound(true)
          dispatch(removeChannel(data._id));
        } break;
        case 'remove': {
          playSound(true)
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
          if (room) dispatch(updateChannel(room));
          if (lastMessage) dispatch(addMessages(room._id, lastMessage));
          dispatch(addMeeting(data));
          break;
        };
        case 'update': {
          const { room } = data;
          const { lastMessage } = room;
          if (room) dispatch(updateChannel(room));
          if (lastMessage) dispatch(addMessages(room._id, lastMessage));
          dispatch(updateMeeting(data));
          break;
        }
        case 'updateParticipants': {
          dispatch(updateMeetingParticipants(data));
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
        case 'togglemute': {
          dispatch(setToggle(data));
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

    axios.post('/rooms/new', payload, { ...config,  headers: {
        'Content-Type': 'multipart/form-data',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      console.log('ERROR ERROR', err);
      return callback(err);
    });
  }, []);

  const getChannel = useCallback((id, callback = () => {}, config = {}) => {
    axios.get(`/rooms/${id}`, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      }
    })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getChannelByParticipants = useCallback(({ participants }, callback = () => {}, config = {}) => {
    axios.post('/rooms/get-room', {
      participants,
    }, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      }
    })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const leaveChannel = useCallback((channelId, callback = () => {}, config = {}) => {
    axios.delete(`/rooms/${channelId}/delete`, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      }
    })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getChatList = useCallback((payload, callback = () => {}, config = {}) => {
    axios.get(`rooms?pageIndex=${payload.pageIndex || 1}&keyword=${payload.keyword || ""}`, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      }
    })
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

    const api1 = axios.get(BASE_URL + `/users/${user._id}/contacts?pageIndex=${payload.pageIndex || 1}&keyword=${payload.keyword || ""}&loadRooms=${payload.loadRooms || false}`, {
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      }
    });

    const api2 = axios.get(BASE_URL + `/users/${user._id}/contacts?pageIndex=${payload.pageIndex || 1}&keyword=${payload.keyword || ""}&loadRooms=${payload.loadRooms || false}`, {
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region7',
      }
    });

    Promise.all([api1, api2])
      .then(axios.spread((response1, response2) => {

        return callback(null, {
          ...response1.data,
          ...response2.data,
          list: [ ...response1.data.list, ...response2.data.list ],
          rooms: [...response1.data.rooms, ...response2.data.rooms]
        });
      }))
      .catch(error => {
        return callback(error);
      });
  }, []);

  const sendMessage = useCallback((payload, callback = () => {}, config = {}) => {

    axios.post('/messages', payload, { ...config,  headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const sendFile = useCallback((channelId, payload, callback = () => {}, config = {}) => {
    axios.post(`/messages/${channelId}/upload-file`, payload, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const editMessage = useCallback((payload, callback = () => {}, config = {}) => {
    axios.patch(`/messages/${payload.messageId}`, payload, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const unSendMessage = useCallback((messageId, callback = () => {}, config = {}) => {
    axios.patch(`/messages/${messageId}/unsend`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const deleteMessage = useCallback((messageId, callback = () => {}, config = {}) => {
    axios.delete(`/messages/${messageId}/delete`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const seenMessage = useCallback((id, callback = () => {}, config = {}) => {
    axios.patch(`/messages/${id}/seen`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMessages = useCallback((channelId, pageIndex, file = false, callback = () => {}, config = {}) => {
    axios.get(`/messages?roomId=${channelId}&pageIndex=${pageIndex}&file=${file}`,  {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
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

    axios.post('/meetings', payload, {
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: user?.createdAt,
      }
    } )

    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const joinMeeting = useCallback(({ meetingId, muted = false }, callback = () => {}, config = {}) => {
    axios.get(`/meetings/${meetingId}/join?muted=${muted}`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const meetingLobby = useCallback(({ meetingId }, callback = () => {}, config = {}) => {
    axios.post(`/meetings/${meetingId}/lobby`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const admitMeeting = useCallback(({ meetingId }, callback = () => {}, config = {}) => {
    axios.get(`/meetings/${meetingId}/admit`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMeeting = useCallback((id, callback = () => {}, config = {}) => {
    axios.get(`/meetings/${id}`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const endMeeting = useCallback((id, callback = () => {}, config = {}) => {
    axios.patch(`/meetings/${id}/callend`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      if (res.data) {
        const data = res.data;
        dispatch(updateMessages(data.roomId, data));
          if (data.meeting) {
            dispatch(endCall({
              _id: data.meeting._id,
              ended: true,
              endedAt: data.meeting.EndedAt,
              updatedAt: data.meeting.EndedAt,
            }));
          }
      }
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const leaveMeeting = useCallback((id, status, callback = () => {}, config = {}) => {
    axios.patch(`/meetings/${id}/leave?status=${status}`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const muteParticipant = useCallback((id, payload, callback = () => {}, config = {}) => {
    axios.patch(`/meetings/${id}/toggle-mute`, payload, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
    .then(res => {
      if (res.data) dispatch(setToggle(res.data));
      return callback(null, res.data);
    })
    .catch(err => {
      return callback(err);
    });
  }, []);

  const getMeetingList = useCallback((payload, callback = () => {}, config = {}) => {
    axios.get(`meetings?pageIndex=${payload.pageIndex || 1}`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
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
    axios.get(`/users/${user._id}/meetings?status=active`, {
      ...config, headers:{
        Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: 'ntc-region10',
      } })
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
      axios.post('/check-version', { os, version }, config)
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
    onStatusUpdate,
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
    meetingLobby,
    admitMeeting,
    muteParticipant,
    getMeetingList,
    getActiveMeetingList,
    checkVersion,
  }
}

export default useSignalr;
