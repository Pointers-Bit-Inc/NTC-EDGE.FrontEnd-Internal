import React, { FC } from 'react'
import { View, TouchableOpacity, StyleSheet, StyleSheetProperties } from 'react-native'
import { SpeakerIcon, MicIcon, VideoIcon, MenuIcon, PhoneIcon } from '@components/atoms/icon'
import { text } from 'src/styles/color';

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    justifyContent: 'center',
  },
  button: {
    height: 45,
    width: 45,
    borderRadius: 45,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  moreButton: {
    paddingHorizontal: 5,
    marginRight: 10,
  },
  inActiveButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  endCall: {
    backgroundColor: text.error
  },
  footerButtons: {
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 30,
  }
});

interface Props {
  onSpeakerEnable: () => void;
  onMute: () => void;
  onVideoEnable: () => void;
  onMore: () => void;
  onEndCall: () => void;
  isSpeakerEnabled: boolean;
  isMute: boolean;
  isVideoEnabled: boolean;
  [x:string]: any;
}

const VideoButtons: FC<Props> = ({
  onSpeakerEnable,
  onMute,
  onVideoEnable,
  onMore,
  onEndCall,
  isSpeakerEnabled,
  isMute,
  isVideoEnabled,
  ...otherProps
}) => {
  return (
    <View style={[styles.container, styles.horizontal]} {...otherProps}>
      <TouchableOpacity onPress={onSpeakerEnable}>
        <View style={[styles.button, !isSpeakerEnabled && styles.inActiveButton]}>
          <SpeakerIcon
            size={24}
            type={isSpeakerEnabled ? '' : 'speaker-off'}
            color={isSpeakerEnabled ? 'black' : 'white'}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMute}>
        <View style={[styles.button, isMute && styles.inActiveButton]}>
          <MicIcon
            size={20}
            type={isMute ? 'muted' : 'mic'}
            color={isMute ? 'white' : 'black'}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onVideoEnable}>
        <View style={[styles.button, isVideoEnabled && styles.inActiveButton]}>
          <VideoIcon
            size={16}
            type={isVideoEnabled ? 'video' : 'muted'}
            color={isVideoEnabled ? 'white' : 'black'}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMore}>
        <View style={[styles.moreButton, { backgroundColor: 'transparent' }]}>
          <MenuIcon
            size={32}
            type='more-horizontal'
            color='white'
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onEndCall}>
        <View style={[styles.button, styles.endCall, styles.shadow]}>
          <PhoneIcon
            size={24}
            type='hangup'
            color='white'
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default VideoButtons
