import React, { useState, useCallback } from 'react'
import {
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import { outline, button, text } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import { ArrowLeftIcon, ToggleIcon, CheckIcon } from '@components/atoms/icon'
import { InputField } from '@components/molecules/form-fields'
import useFirebase from 'src/hooks/useFirebase';
import Button from '@components/atoms/button';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    fontSize: 18,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
  },
  icon: {
    fontSize: 16
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: button.primary
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: '#687287',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  toggleDefault: {
    transform: [{ scaleX: -1 }],
    color: '#687287',
  },
  toggleActive: {
    color: button.primary,
  }
})

const CreateMeeting = ({ navigation, route }:any) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { participants = [] } = route.params;
  const { createMeeting } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [loading, setLoading] = useState(false);
  const [meetingName, setMeetingName] = useState('');
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(false);
  const onBack = () => navigation.goBack();
  const onStartMeeting = () => {
    setLoading(true);
    createMeeting(participants, (error, data) => {
      setLoading(false);
      if (!error) {
        dispatch(setSelectedChannel(data));
        navigation.replace('VideoCall', {
          options: {
            isMute: !micOn,
            isVideoEnable: videoOn,
          }
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5 }]}>
          <TouchableOpacity onPress={onBack}>
            <ArrowLeftIcon
              size={24}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              color={text.default}
              weight={'600'}
              size={18}
            >
              Create Meeting
            </Text>
          </View>
        </View>
        <InputField
          inputStyle={[InputStyles.text, styles.input]}
          placeholder="Meeting name"
          outlineStyle={[InputStyles.outlineStyle, styles.outline]}
          value={meetingName}
          onChangeText={setMeetingName}
          onSubmitEditing={(event:any) => setMeetingName(event.nativeEvent.text)}
        />
        <View style={{ paddingTop: 20, paddingBottom: 60 }}>
          <View style={styles.section}>
            <Text
              color='#687287'
              size={22}
            >
              Video {videoOn ? 'On' : 'Off'}
            </Text>
            <TouchableOpacity
              onPress={() => setVideoOn(!videoOn)}
            >
              <ToggleIcon
                style={
                  videoOn ?
                    styles.toggleActive :
                    styles.toggleDefault
                }
                size={38}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text
              color='#687287'
              size={22}
            >
              Mic {micOn ? 'On' : 'Off'}
            </Text>
            <TouchableOpacity
              onPress={() => setMicOn(!micOn)}
            >
              <ToggleIcon
                style={
                  micOn ?
                    styles.toggleActive :
                    styles.toggleDefault
                }
                size={38}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          style={styles.button}
          disabled={loading}
          onPress={onStartMeeting}
        >
          {
            loading ? (
              <ActivityIndicator color={'white'} size={24} />
            ) : (
              <Text
                size={18}
                weight='bold'
                color='white'
              >
                Start Meeting
              </Text>
            )
          }
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default CreateMeeting
