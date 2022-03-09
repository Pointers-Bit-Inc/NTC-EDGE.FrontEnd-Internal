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
      return data?.image || '';
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
  const colors = ['#D74D43', '#D4883A', '#91B798', '#42495B', '#ADB6D7']
  const colorFromLetters:any = {
    a: colors[0],
    b: colors[1],
    c: colors[2],
    d: colors[3],
    e: colors[4],
    f: colors[0],
    g: colors[1],
    h: colors[2],
    i: colors[3],
    j: colors[4],
    k: colors[0],
    l: colors[1],
    m: colors[2],
    n: colors[3],
    o: colors[4],
    p: colors[0],
    q: colors[1],
    r: colors[2],
    s: colors[3],
    t: colors[4],
    u: colors[0],
    v: colors[1],
    w: colors[2],
    x: colors[3],
    y: colors[4],
    z: colors[0],
  }
  return colorFromLetters[lowerCaseValue] || colors[0];
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