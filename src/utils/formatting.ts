import lodash from 'lodash';

const getInitial = (value:any) => {
  return value.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
}

const getChannelName = (channel:any, user:any) => {
  if (!channel.isGroup) {
    const result = lodash.reject(
      channel.participants,
      p => p._id === user._id
    );
    if (result && result[0]) {
      const data = result[0];
      return `${data.firstname} ${data.lastname}`;
    }
  }
  return channel.channelName;
}

const getChannelImage = (channel:any, user:any) => {
  if (!channel.isGroup) {
    const result = lodash.reject(
      channel.participants,
      p => p._id === user._id
    );
    if (result && result[0]) {
      const data = result[0];
      return data.image;
    }
  }
  return channel.image;
}

export {
  getInitial,
  getChannelName,
  getChannelImage,
}