import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import GroupImage from '../image/group'
import Loading from '@components/atoms/loading'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    backgroundColor: '#A0A3BD',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
  }
})

const ConnectingVideo = ({ participants = [], callEnded = false }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {
        !callEnded && (
          <GroupImage
            participants={participants}
            size={80}
            textSize={24}
          />
        )
      }
      <View
        style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
        }}
      >
        {
          callEnded ? (
            <Text
              size={24}
              color='white'
            >
              Call ended
            </Text>
          ) : (
            <>
              <Text
                size={14}
                color='white'
              >
                Connecting
              </Text>
              <Loading
                size={2}
                space={1}
                numberOfDots={3}
                color={'white'}
                speed={3000}
                style={{ marginBottom: 4, marginLeft: 1 }}
              />
            </>
          )
        }
      </View>
      {
        callEnded && (
          <View style={{ position: 'absolute', bottom: 80 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={styles.close}>
                <Text
                  color={'white'}
                  size={18}
                >
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    </View>
  )
}

export default ConnectingVideo
