import React, { useCallback, useState } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/reducers/user/actions';
import LoginForm from '@organisms/forms/login';
import Api from 'src/services/api';

const api = Api();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 30,
    width: '100%',
  }
});

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const request = useCallback(async (value) => {
    setLoading(true);
    await api.get('/', value)
    .then(res => console.log('response', res))
    .catch(err => console.log('error', err));
    setLoading(false);
    dispatch(setUser({ email: value.email }));
    navigation.replace('Home');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <LoginForm
          onSubmit={value => request(value)}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  )
}

export default Login
