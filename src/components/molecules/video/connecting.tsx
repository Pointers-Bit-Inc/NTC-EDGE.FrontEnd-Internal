import React from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/atoms/text'
import GroupImage from '../image/group'
import Loading from '@components/atoms/loading'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

const ConnectingVideo = ({ participants = [], callEnded = false }) => {
  return (
    <View style={styles.container}>
      <GroupImage
        participants={participants}
        size={80}
        textSize={18}
      />
      <View
        style={{
          marginTop: 20,
          alignItems: 'flex-end',
          flexDirection: 'row',
        }}
      >
        {
          callEnded ? (
            <Text
              size={14}
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
    </View>
  )
}

export default ConnectingVideo
