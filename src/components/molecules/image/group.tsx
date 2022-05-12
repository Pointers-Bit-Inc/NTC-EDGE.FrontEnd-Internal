import React, { FC } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import lodash from 'lodash';
import ProfileImage from '@components/atoms/image/profile';
import { primaryColor } from '@styles/color';
import {isMobile} from "@pages/activities/isMobile";
import {fontValue} from "@pages/activities/fontValue";
import IParticipants from 'src/interfaces/IParticipants';

const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderWidth: isMobile ? fontValue(2) : 2,
    borderColor: 'white',
  },
  topPosition: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomPosition: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  }
});

interface Props {
  participants?: any;
  size?: number;
  textSize?: number;
  backgroundColor?: string;
  inline?: boolean;
  sizeOfParticipants?: number;
  showOthers?: boolean;
}

const GroupImage: FC<Props> = ({
  participants = [],
  size = 35,
  textSize = 14,
  inline = false,
  sizeOfParticipants = 2,
  showOthers = false,
}) => {
  const imageSize = size / 1.4;
  if (lodash.size(participants) === 1) {
    return (
      <ProfileImage
        image={participants[0]?.profilePicture?.thumb}
        name={`${participants[0]?.firstName} ${participants[0]?.lastName}`}
        size={size}
        textSize={textSize}
        isOnline={participants[0]?.isOnline}
      />
    );
  }

  if (inline) {
    const filteredParticipants = lodash.take(participants, sizeOfParticipants);
    const others = lodash.size(participants) - lodash.size(filteredParticipants);

    return (
      <View style={{ height: fontValue(imageSize), marginLeft: imageSize * 0.35 }}>
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          {
            filteredParticipants?.map((p:IParticipants, index:number) => (
              <View
                key={p._id}
                style={{ marginLeft: -(imageSize * 0.35), zIndex: 999 - index }}
              >
                <ProfileImage
                  style={styles.border}
                  image={p?.profilePicture?.thumb}
                  name={`${p?.firstName} ${p?.lastName}`}
                  size={imageSize}
                  textSize={textSize/2}
                />
              </View>
            ))
          }
          {
            others > 0 && showOthers && (
              <View
                key={'others'}
                style={{ marginLeft: -(imageSize * 0.35), zIndex: 999 - lodash.size(filteredParticipants) }}
              >
                <ProfileImage
                  style={{ marginHorizontal: 1, }}
                  key={'others'}
                  image={''}
                  others={`+${others}`}
                  size={imageSize}
                  textSize={textSize/2}
                />
              </View>
            )
          }
        </View>
        {/* <View style={styles.topPosition}>
          <ProfileImage
            style={styles.border}
            image={participants[0]?.profilePicture?.thumb}
            name={`${participants[0]?.firstName} ${participants[0]?.lastName}`}
            size={imageSize}
            textSize={textSize/2}
          />
        </View>
        <View style={styles.bottomPosition}>
          <ProfileImage
            style={styles.border}
            image={participants[1]?.profilePicture?.thumb}
            name={`${participants[1]?.firstName} ${participants[1]?.lastName}`}
            size={imageSize}
            textSize={textSize/2}
          />
        </View> */}
      </View>
    )
  }

  return (
    <View style={{ width: fontValue(size), height: fontValue(size) }}>
      <View style={styles.topPosition}>
        <ProfileImage
          style={styles.border}
          image={participants[0]?.profilePicture?.thumb}
          name={`${participants[0]?.firstName} ${participants[0]?.lastName}`}
          size={imageSize}
          textSize={textSize/2}
        />
      </View>
      <View style={styles.bottomPosition}>
        <ProfileImage
          style={styles.border}
          image={participants[1]?.profilePicture?.thumb}
          name={`${participants[1]?.firstName} ${participants[1]?.lastName}`}
          size={imageSize}
          textSize={textSize/2}
        />
      </View>
    </View>
  )
}

export default GroupImage
