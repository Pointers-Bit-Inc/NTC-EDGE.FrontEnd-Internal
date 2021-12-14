import React from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, RootStateOrAny } from 'react-redux'
import ProfileImage from '@components/atoms/image/profile'
import Text from '@components/atoms/text'
import { VideoIcon, WriteIcon } from '@atoms/icon';
import { text, button, primaryColor } from 'src/styles/color';
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
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    height: width * 0.3,
    width: width * 0.4,
    backgroundColor: '#DCE2E5',
    borderRadius: 10,
    marginVertical: 15,
  },
  text: {
    marginVertical: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    borderRadius: 5,
    paddingVertical: 10,
    width: width * 0.5
  },
})

const Meet = ({ navigation }) => {
  const user = useSelector((state:RootStateOrAny) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ProfileImage
          size={35}
          image={user.image}
          name={`${user.firstname} ${user.lastname}`}
        />
        <View style={styles.titleContainer}>
          <Text
            color={text.default}
            weight={'600'}
            size={22}
          >
            Meet
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
          <VideoIcon
            size={24}
            color={primaryColor}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.image} />
        <Text
          style={styles.text}
          color={text.default}
          weight={'bold'}
          size={18}
        >
          Start a meeting
        </Text>
        <Text
          style={[styles.text, { maxWidth: width * 0.6 }]}
          color={text.default}
          size={16}
        >
          Lorem Ipsum Lorem Ipsum Lorem Ipsum 
        </Text>
        <Button
          style={[styles.button, { backgroundColor: button.primary }]}
        >
          <Text color="white" size={16}>Meet now</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default Meet
