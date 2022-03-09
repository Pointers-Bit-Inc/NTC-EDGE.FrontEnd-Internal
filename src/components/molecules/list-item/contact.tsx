import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import { text, primaryColor } from 'src/styles/color';
import ProfileImage from '@components/atoms/image/profile';
import GroupImage from '@components/molecules/image/group';
import { Regular500 } from '@styles/font';
import lodash from 'lodash';
import IParticipants from 'src/interfaces/IParticipants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10
  },
  channelInfo: {
    paddingBottom: 3,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})

interface Props {
  image?: string;
  name?: string;
  contact?: string;
  onPress?: any;
  rightIcon?: any;
  data?: any,
  isGroup?: boolean,
  [x: string]: any;
}

const ContactItem: FC<Props> = ({
  image = '',
  name = '',
  contact = '',
  onPress = () => {},
  rightIcon,
  data = {},
  isGroup = false,
  ...otherProps
}) => {
  const getName = (data:any) => {
    let result = '';
    
    if (isGroup) {
      if (data.name) {
        result += data.name;
      } else {
        lodash.map(data.participants, (participant:IParticipants) => {
          let participantName = '';

          if (participant.title) participantName += participant.title + ' ';
          participantName += participant.firstName;

          result += participantName + ',';
        });
      }
    } else {
      if (data.title) result += data.title + ' ';
      if (data.name) result += data.name;
      if (data.suffix) result += ', ' + data.suffix;
    }

    return result;
  }

  const getInfo = (data:any) => {
    let result = '';
    
    if (isGroup) {
      if (data.name) {
        lodash.map(data.participants, (participant:IParticipants) => {
          let participantName = '';

          if (participant.title) participantName += participant.title + ' ';
          participantName += participant.firstName;

          result += participantName + ',';
        });
      }
    } else {
      if (data.designation) result += data.designation;
      if (data.designation && data.position) result += ' - ';
      if (data.position) result += data.position;
    }

    return result;
  } 

  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      <View style={[styles.container, styles.horizontal]}>
        {
          !isGroup ? (
            <ProfileImage
              image={image}
              name={name}
              size={42}
              textSize={14}
            />
          ) : (
            <GroupImage
              participants={data.participants}
              size={42}
              textSize={14}
            />
          )
        }
        <View style={styles.content}>
          <Text
            color={'black'}
            size={16}
            numberOfLines={1}
            style={{ fontFamily: Regular500, marginBottom: -3 }}
          >
            {getName(data)}
          </Text>
          {
            (!!data.designation || !!data.position || (isGroup && !!name)) &&
              <Text
                color={text.default}
                size={12}
                numberOfLines={1}
              >
                {getInfo(data)}
              </Text>
          }
        </View>
        {rightIcon}
      </View>
    </TouchableOpacity>
  );
}

export default ContactItem
