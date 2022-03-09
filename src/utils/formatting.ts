import lodash from 'lodash';
import dayjs from 'dayjs';

const getInitial = (value:any) => {
  return value.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
}

const getChannelName = (channel:any) => {
  if (channel.hasRoomName) {
    return channel.name;
  }
  if (!channel.isGroup) {
    const result = channel.otherParticipants;
    if (result && result[0]) {
      const data = result[0];
      return `${data.firstName} ${data.lastName}`;
    }
  }
  if (!channel.hasRoomName) {
    return channel?.otherParticipants?.map(p => p.firstName)?.toString();
  }
  return channel.name;
}

const getChannelImage = (channel:any) => {
  if (!channel.isGroup) {
    const result = channel.otherParticipants;
    if (result && result[0]) {
      const data = result[0];
      return data?.profilePicture?.thumb || '';
    }
  }
  return channel.image;
}

const getTimeString = (time:any) => {
  if (time) {
    const dateNow = dayjs();
    const dateUpdate = dayjs(new Date(time));
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
    const dateUpdate = dayjs(new Date(time));
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

const getDateTimeString = (time:any, format:string) => {
  if (time) {
    const dateTime = dayjs(new Date(time));
    return dateTime.format(format || 'MMM. DD, hh:mm A');
  }
  return '';
}

const chatSameDate = (time1:number, time2:number) => {
  const time1format = dayjs(time1 && new Date(time1)).format('DD/MM/YY');
  const time2format = dayjs(time2 && new Date(time2)).format('DD/MM/YY');
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

const getColorFromName = (value:string) => {
  const firstChar = String(value).charAt(0);
  const lowerCaseValue = String(firstChar).toLowerCase();
  const colors = ['#DC4833', '#D4883A', '#91B798', '#42495B', '#ADB6D7', '#6281C3', '#7AC4D3', '#AFDF8D', '#F19133', '#4362B5', '#599CB4', '#71D789']
  const colorFromLetters:any = {
    a: colors[0],
    b: colors[1],
    c: colors[2],
    d: colors[3],
    e: colors[4],
    f: colors[5],
    g: colors[6],
    h: colors[7],
    i: colors[8],
    j: colors[9],
    k: colors[10],
    l: colors[11],
    m: colors[0],
    n: colors[1],
    o: colors[2],
    p: colors[3],
    q: colors[4],
    r: colors[5],
    s: colors[6],
    t: colors[7],
    u: colors[8],
    v: colors[9],
    w: colors[10],
    x: colors[11],
    y: colors[0],
    z: colors[1],
  }
  return colorFromLetters[lowerCaseValue] || colors[3];
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
  getColorFromName,
}