import lodash from 'lodash';
import dayjs from 'dayjs';

const getInitial = (value:any) => {
  return value.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
}

const getChannelName = (channel:any) => {
  if (!channel.isGroup && !channel.hasChannelName) {
    const result = channel.otherParticipants;
    if (result && result[0]) {
      const data = result[0];
      return `${data.firstName}`;
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
      return dateUpdate.format('h:mm A');
    } else if (diff === 1) {
      return 'Yesterday';
    } else if (diff <= 7) {
      return dateUpdate.format('dddd');
    }
    return dateUpdate.format('DD/MM/YY');
  }
  return '';
}

const getChatTimeString = (time:any) => {
  if (time) {
    const dateNow = dayjs();
    const dateUpdate = dayjs(new Date(time * 1000));
    const diff = dateNow.diff(dateUpdate, 'days');
    const yearNow = dateNow.format('YYYY');
    const yearUpdate = dateUpdate.format('YYYY');

    if (diff === 0) {
      return dateUpdate.format('h:mm A');
    } else if (diff === 1) {
      return 'Yesterday';
    } else if (diff <= 7) {
      return dateUpdate.format('dddd');
    } else if (yearNow === yearUpdate) {
      return dateUpdate.format('MMM DD, h:mm A');
    }
    return dateUpdate.format('DD/MM/YY');
  }
  return '';
}

const getDateTimeString = (time:any) => {
  if (time) {
    const dateTime = dayjs(new Date(time * 1000));
    return dateTime.format('MMM. DD, hh:mm A');
  }
  return '';
}

const chatSameDate = (time1:number, time2:number) => {
  const time1format = dayjs(time1 && new Date(time1 * 1000)).format('DD/MM/YY');
  const time2format = dayjs(time2 && new Date(time2 * 1000)).format('DD/MM/YY');
  return time1format === time2format;
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

const getTimerString = (time:number) => {
  var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var format = "";
    format += (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "");
    format += "" + secs;
    return format;
}

const getDayMonthString = (time:number) => {
  if (time) {
    const dateTime = dayjs(new Date(time * 1000));
    return dateTime.format('MM/DD');
  }
  return '';
}

export {
  getInitial,
  getChannelName,
  getChannelImage,
  getTimeString,
  getChatTimeString,
  chatSameDate,
  checkSeen,
  getOtherParticipants,
  getDateTimeString,
  getTimerString,
  getDayMonthString,
}