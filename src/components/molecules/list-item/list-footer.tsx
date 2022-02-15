import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import Text from '@components/atoms/text'
import { text, primaryColor } from 'src/styles/color';

const styles = StyleSheet.create({
  fetchingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  }
})

interface Props {
  hasError?: boolean,
  fetching?: boolean,
  onRefresh?: any,
  refreshText?: string,
  loadingText?: string,
  errorText?: string,
}

const ListFooter: FC<Props> = ({
  hasError = false,
  fetching = false,
  onRefresh = () => {},
  refreshText = '',
  loadingText = '',
  errorText = '',
}) => {
  if (fetching) {
      return (
        <View style={styles.fetchingContainer}>
          <ActivityIndicator size={'small'} color={text.default} />
          <Text
            style={{ marginLeft: 5 }}
            size={12}
            color={text.default}
          >
            {loadingText}
          </Text>
        </View>
      )
    }
    if (hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text
            size={12}
            color={text.default}
          >
             {errorText}
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text
              style={{ marginLeft: 5 }}
              size={12}
              color={text.primary}
            >
              {refreshText}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    return <View style={{ height: 30 }} />;
}

export default ListFooter
