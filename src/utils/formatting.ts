import lodash from 'lodash';
import dayjs from 'dayjs';

const getInitial = (value:any) => {
  return value.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
}

const getChannelName = (channel:any) => {
  if (!channel.isGroup) {
    const result = channel.otherParticipants;
    if (result && result[0]) {
      const data = result[0];
      return `${data.firstname} ${data.lastname}`;
    }
  }
  return channel.channelName;
}

const getChannelImage = (channel:any) => {
  if (!channel.isGroup) {
    const result = channel.otherParticipants;
    if (result && result[0]) {
      const data = result[0];
      return data.image;
    }
  }
  return channel.image;
}

const getTimeString = (time:any) => {
  if (time) {
    const dateNow = dayjs();
    const dateUpdate = dayjs(new Date(time * 1000));
    const diff = dateNow.diff(dateUpdate, 'days');

    if (diff === 0) {
      return dayjs(new Date(time * 1000)).format('h:mm A');
    } else if (diff === 1) {
      return 'Yesterday';
    } else if (diff <= 7) {
      return dayjs(new Date(time * 1000)).format('dddd');
    }
    return dayjs(new Date(time * 1000)).format('DD/MM/YY');
  }
  return '';
}

const checkSeen = (seen = [], user:any) => {
  return !!lodash.size(
    lodash.find(
      seen,
      (s:any) => s._id === user._id
    )
  )
}

const getOtherParticipants = (participants = [], user:any) => {
  return lodash.reject(
    participants,
    (p:any) => p._id === user._id
  );
}

export {
  getInitial,
  getChannelName,
  getChannelImage,
  getTimeString,
  checkSeen,
  getOtherParticipants,
}