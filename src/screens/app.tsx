import React, { useCallback, useEffect, useState } from 'react';
import { StackActions } from '@react-navigation/native';
import { View, Image, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useSelector, RootStateOrAny } from 'react-redux';
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';

const splash = require('../../assets/splash.png');

SplashScreen.preventAutoHideAsync();

const App = ({ navigation }:any) => {
  const user = useSelector((state:RootStateOrAny) => state.user);
  const [appIsReady, setAppIsReady] = useState(false);
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });
  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true);
      const hideSplashscreen = async () => {
        await SplashScreen.hideAsync();
        if (user && user.email) {
          navigation.replace('ActivitiesScreen');
        } else {
          if (Platform.OS === 'web') {
            navigation.replace('Login');
          } else {
            navigation.replace('AppIntro');
          }
        }
      }
      hideSplashscreen();
    }
  }, [fontsLoaded]);

  if (Platform.OS == 'web' && !fontsLoaded) {
    return null;
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