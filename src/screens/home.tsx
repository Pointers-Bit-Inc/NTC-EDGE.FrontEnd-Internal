import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import Button from '@atoms/button';
import Text from '@atoms/text';
import { primaryColor } from '@styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
});

const Home = () => {
  const navigation = useNavigation(); // temporary
  const user = useSelector((state: RootStateOrAny) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome, {user.email}</Text>

      {/* temporary */}
      <Button
        style={{backgroundColor: primaryColor, width: '100%', marginTop: 30}}
        onPress={() => navigation.navigate('ApplicationSteps')}
      >
        <Text fontSize={16} color='#fff'>
          Service 1
        </Text>
      </Button>

    </SafeAreaView>
  );
};

export default Home;
