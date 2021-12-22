import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, RootStateOrAny } from 'react-redux'
import ProfileImage from '@components/atoms/image/profile'
import Text from '@components/atoms/text'
import { PeopleIcon, CalendarIcon, VideoIcon } from '@atoms/icon';
import { text, outline, primaryColor } from 'src/styles/color';
import Button from '@components/atoms/button';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: primaryColor
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollview: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 60,
  },
  image: {
    height: width * 0.5,
    width: width * 0.65,
    backgroundColor: '#DCE2E5',
    borderRadius: 10,
    marginVertical: 15,
  },
  text: {
    marginVertical: 5,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 15,
    borderColor: outline.default,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  section: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
})

const Meet = ({ navigation }) => {
  const user = useSelector((state:RootStateOrAny) => state.user);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <ProfileImage
          size={45}
          image={user.image}
          name={`${user.firstName} ${user.lastName}`}
        />
        <View style={styles.titleContainer}>
          <Text
            color={'white'}
            weight={'600'}
            size={22}
          >
            Meet
          </Text>
        </View>
      </View>
      <ScrollView style={styles.scrollview}>
        <View style={styles.content}>
          <View style={styles.image} />
          <View style={styles.section}>
            <Text
              style={styles.text}
              color={'black'}
              weight={'bold'}
              size={24}
            >
              Start a meeting
            </Text>
            <Text
              style={styles.text}
              color={'#606A80'}
              weight={'600'}
              size={18}
            >
              Get everyone together
            </Text>
          </View>
          <View style={styles.section}>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('Participants')}
            >
              <View style={styles.buttonContainer}>
                <VideoIcon
                  style={styles.icon}
                  color={text.primary}
                  type='add'
                  size={24}
                />
                <Text
                  color={text.primary}
                  weight='600'
                  size={16}
                >
                  Create Meeting
                </Text>
              </View>
            </Button>
            <Button style={styles.button}>
              <View style={styles.buttonContainer}>
                <CalendarIcon
                  style={styles.icon}
                  color={text.primary}
                  type='add'
                  size={24}
                />
                <Text
                  color={text.primary}
                  weight='600'
                  size={16}
                >
                  Schedule Meeting
                </Text>
              </View>
            </Button>
            <Button style={styles.button}>
              <View style={styles.buttonContainer}>
                <PeopleIcon
                  style={styles.icon}
                  color={text.primary}
                  type='add'
                  size={24}
                />
                <Text
                  color={text.primary}
                  weight='600'
                  size={16}
                >
                  Join Meeting
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Meet
