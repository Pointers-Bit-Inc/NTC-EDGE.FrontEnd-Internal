import lodash from 'lodash';
import dayjs from 'dayjs';
import IParticipants from 'src/interfaces/IParticipants';
import moment from 'moment';
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
      const data:IParticipants = result[0];
      return `${data.title ? `${data.title} ` : ''}${data.firstName} ${data.lastName} ${data.suffix ?? ''}`;
    }
  }
  if (!channel.hasRoomName) {
    return channel?.otherParticipants?.map((p:IParticipants) => `${p.title ? `${p.title} ` : ''}${p.lastName}${p.suffix ? ` ${p.suffix}` : ''}`)?.toString();
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

const getTimeDifference = (time:string) => {
  if (time) {
    const dateNow = dayjs();
    const dateUpdate = dayjs(new Date(time));
    const seconds = dateNow.diff(dateUpdate, 'seconds');
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} ${ years > 1 ? 'years' : 'year' } ago`;
    } else if (months > 0) {
      return `${months} ${ months > 1 ? 'months' : 'month' } ago`;
    } else if (weeks > 0) {
      return `${weeks} ${ weeks > 1 ? 'weeks' : 'week' } ago`;
    } else if (days > 0) {
      return `${days} ${ days > 1 ? 'days' : 'day' } ago`;
    } else if (hours > 0) {
      return `${hours} ${ hours > 1 ? 'hours' : 'hour' } ago`;
    } else if (minutes > 0) {
      return `${minutes} ${ minutes > 1 ? 'minutes' : 'minute' } ago`;
    } else {
      return `${seconds} ${ seconds > 1 ? 'seconds' : 'second' } ago`;
    }
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
  const hrs = ~~(time / 60 / 60);
  const mins = ~~((time % 3600) / 60);
  const secs = ~~(time % 60);
  let format = "";
  format += (hrs < 10 ? "0" : "") + hrs + ":";
  format += (mins < 10 ? "0" : "") + mins + ":";
  format += (secs < 10 ? "0" : "") + secs;
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

const getFileSize = (byte = 0) => {
  if (byte) {
    const kb = Math.floor(byte / 1024);
    const mb = Math.floor(kb / 1024);
    const gb = Math.floor(mb / 1024);

    if (gb > 0) {
      return `${gb} GB`;
    } else if (mb > 0) {
      return `${mb} MB`;
    } else if (kb > 0) {
      return `${kb} KB`;
    } else {
      return `${byte} B`;
    }
  }
  return byte;
}
const newObjInInitialArr = function(initialArr, newObject) {
  let id = newObject.item;
  let newArr = [];
  for (let i = 0; i < initialArr.length; i++) {
    if (id === initialArr[i].item) {
      newArr.push(newObject);
    } else {
      newArr.push(initialArr[i]);
    }
  }
  return newArr;
};

const updateObjectsInArr = function(initialArr, newArr) {
  let finalUpdatedArr = initialArr;
  for (let i = 0; i < newArr.length; i++) {
    finalUpdatedArr = newObjInInitialArr(finalUpdatedArr, newArr[i]);
  }

  return finalUpdatedArr
}
export const extractDate = (date: any, d: any) => {
  if (!date) return '';
  let _d = (`0${(moment(date)?.subtract(d === 'month' ? 1 : 0, 'months')?.get(d) + (d === 'month' ? 1 : 0))}`)?.slice(d === 'year' ? -4 : -2);
  if (d === 'month' && _d === '12') _d = '00';
  return isNaN(Number(_d)) ? '' : _d;
};

export {
  updateObjectsInArr,
  getInitial,
  getChannelName,
  getChannelImage,
  getTimeString,
  getTimeDifference,
  getChatTimeString,
  chatSameDate,
  checkSeen,
  getOtherParticipants,
  getDateTimeString,
  getTimerString,
  getDayMonthString,
  getColorFromName,
  getFileSize,
}
