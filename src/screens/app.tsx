import React, { useCallback, useEffect, useState } from 'react';
import { StackActions } from '@react-navigation/native';
import { View, Image, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {useSelector, RootStateOrAny, useDispatch} from 'react-redux';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import axios from "axios";
import {BASE_URL} from "../services/config";
import {setPermission} from "../reducers/user/actions";

const splash = require('../../assets/splash.png');
const logo = require('@assets/ntc-edge.png');

SplashScreen.preventAutoHideAsync();

const App = ({ navigation }:any) => {
  const user = useSelector((state:RootStateOrAny) => state.user);
  const dispatch = useDispatch()
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });



  useEffect(() => {
    if (fontsLoaded) {
      const hideSplashscreen = async () => {
        await SplashScreen.hideAsync();
        if (user && user.email) {

          axios.get(BASE_URL + '/check-permission', {
            headers:{
              Authorization:"Bearer ".concat(user?.sessionToken)
            }
          } ).then((response)=>{
              dispatch(setPermission(response.data.permission))
          })

          navigation.replace('ActivitiesScreen');
        } else {
          if (Platform.OS === 'web') {
            navigation.replace( 'Login');
          } else {
            navigation.replace('AppIntro');
          }
        }
      }
      hideSplashscreen();
    }
  }, [fontsLoaded]);

  if (Platform.OS == 'web') {
    return (
      <View style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#031A6E'
      }}>
        <Image
          resizeMode='contain'
          source={logo}
          style={{
            height: 250,
            width: 250,
          }}
        />
      </View>
    )
  }

  return (
    <View style={{ flex: 1  }}>
      <Image
        source={splash}
        style={{ height: '100%', width: '100%' }}
      />
    </View>
  );
}

export default App
