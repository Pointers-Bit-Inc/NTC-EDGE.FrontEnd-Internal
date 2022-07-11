import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { ActivityIndicator, Image, View } from 'react-native';
import Text from '@atoms/text';
import LogoutIcon from "@assets/svg/logout";
import { ArrowRightIcon, CloseIcon, ExclamationIcon, RightIcon, ToggleIcon } from '@atoms/icon';
import Alert from '@atoms/alert';
import Button from '@atoms/button';
import NavBar from '@molecules/navbar';
import {disabledColor , text} from '@styles/color';
import styles from './styles';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {StackActions} from "@react-navigation/native";
import {fontValue} from "@pages/activities/fontValue";
import useLogout from "../../../hooks/useLogout";
import {
  setApplicationItem,
  setApplications,
  setNotPinnedApplication,
  setPinnedApplication
} from "../../../reducers/application/actions";
import {setResetFilterStatus} from "../../../reducers/activity/actions";
import {resetUser, setBiometricsLogin} from "../../../reducers/user/actions";
import {resetMeeting} from "../../../reducers/meeting/actions";
import {resetChannel} from "../../../reducers/channel/actions";
import useOneSignal from "../../../hooks/useOneSignal";
import Api from "../../../services/api";
import BellIcon from '@assets/svg/bell';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useBiometrics from 'src/hooks/useBiometrics';


export default ({
  navigation
}: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootStateOrAny) => state.user) || {};
  const biometricsLogin = user.biometrics;
  const api = Api(user.sessionToken);
  const profilePicture = user?.profilePicture?.small;
  const photo = profilePicture ? {uri: profilePicture} : require('@assets/avatar.png');
  const [visible, setVisible] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [loading, setLoading] = useState(false);
  const { destroy } = useOneSignal(user);
  const {
    isBiometricSupported,
  } = useBiometrics();

  const settings = [
    /*{
      label: 'Notifications',
      value: 'notifications',
      disabled: true,
      icon: <BellIcon disabled={true} width={fontValue(21)} height={fontValue(21)} />,
      onPress: () => {alert(123)},
    },
    {
      label: 'Help Center',
      value: 'help-center',
      disabled: true,
      icon: <DonutIcon disabled={true} width={fontValue(21)} height={fontValue(21)} />,
      onPress: () => {},
    },
    {
      label: 'About',
      value: 'about',
      disabled: true,
      icon: <ExclamationIcon color={disabledColor} disabled={true}  size={fontValue(21)} type='circle' />,
      onPress: () => {},
    },*/
  ];
  const biometrics = {
    label: 'Login with biometrics',
    value: 'biometrics',
    disabled: loading || !isBiometricSupported,
    icon: <MaterialCommunityIcons
      name="fingerprint"
      size={20}
      color={loading || !isBiometricSupported ? disabledColor : 'black'}
    />,
    rightIcon: !loading ? <ToggleIcon
      style={
        enableBiometrics ?
        styles.toggleActive :
        styles.toggleDefault
      }
      size={28}
    /> : <ActivityIndicator color={'#A0A3BD'} size={24} />,
    onPress: () => onRequestBiometrics(user._id),
  }

  const logout = {
    label: 'Log out',
    value: 'logout',
    icon: <LogoutIcon width={fontValue(21)} height={fontValue(21)} color={text.error} />,
    onPress: () => setVisible(true),
  };

  const onLogout = useCallback(() => {
    setVisible(false)
    setTimeout(()=>{
      dispatch(setApplications([]))
      dispatch(setPinnedApplication([]))
      dispatch(setNotPinnedApplication([]))
      dispatch(setApplicationItem({}))
      dispatch(setResetFilterStatus([]))
      dispatch(resetUser());
      dispatch(resetMeeting());
      dispatch(resetChannel());
      destroy();
      navigation.dispatch(StackActions.replace('Login'));
    },500);
  }, []);

  const renderRow = ({item}: any) => {
    return (
      <TouchableOpacity disabled={item?.disabled ? true : false} onPress={item?.onPress}>
        <View style={[styles?.row, {justifyContent: 'space-between'}]}>
          <View style={styles?.row}>
            {item?.icon}
            <Text style={[styles.textSettings, !!item?.disabled && {color: disabledColor} , item?.value === 'logout' && {color: text.error}]}>{item?.label}</Text>
          </View>
          {
            (item?.value !== 'logout' && !item?.rightIcon) &&
            <RightIcon />
          }
          {item?.rightIcon}
        </View>
      </TouchableOpacity>
    )
  };

  const onRequestBiometrics = async (userId:string) => {
    if (enableBiometrics) {
      setEnableBiometrics(false);
      return dispatch(setBiometricsLogin(null));
    }
    setLoading(true);
    api.get(`/users/${userId}/request-biometrics`)
      .then(res => {
        setLoading(false);
        console.log('RESULT', res.data);
        dispatch(setBiometricsLogin(res.data));
      })
      .catch(e => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (biometricsLogin?.email) {
      setEnableBiometrics(true);
    } else {
      setEnableBiometrics(false);
    }
  }, [biometricsLogin]);

  const separator = <View style={styles.separator} />;
  const separator2 = <View style={styles.separator2} />;

  return (
    <>
      <NavBar
        title='Preview'
        leftIcon={<CloseIcon type='close' color='#fff' />}
        onLeft={() => navigation.goBack()}
      />

      <ScrollView>

        <View style={[styles.sectionContainer, styles.profileContainer]}>
          <Image
            style={styles.image}
            source={photo}
          />
          <Text style={styles.nameText}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
          <Button style={styles.button} onPress={() => navigation.navigate('UserProfileScreen')}>
            <Text {...styles.textButton} style={styles.leftTextButton} >Edit Profile</Text>
            <ArrowRightIcon {...styles.textButton} />
          </Button>
        </View>

        {!!settings.length &&separator}

        <View style={styles.sectionContainer}>
          <FlatList
            data={settings}
            renderItem={renderRow}
            keyExtractor={(item, index) => `${index}`}
            ItemSeparatorComponent={() => separator2}
          />
        </View>

        {separator}
        <View style={styles.sectionContainer}>
          {renderRow({item: biometrics})}
        </View>
        <View style={styles.sectionContainer}>
          {renderRow({item: logout})}
        </View>
        <Alert
            visible={visible}
            title='Log out'
            message='Are you sure you want to log out?'
            confirmText='OK'
            cancelText='Cancel'
            onConfirm={onLogout}
            onCancel={() => setVisible(false)}
        />
      </ScrollView>

    </>
  )
};