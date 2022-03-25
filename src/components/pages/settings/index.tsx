import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { Image, View } from 'react-native';
import Text from '@atoms/text';
import BellIcon from "@assets/svg/bell";
import DonutIcon from "@assets/svg/donut";
import LogoutIcon from "@assets/svg/logout";
import { ArrowRightIcon, CloseIcon, ExclamationIcon, RightIcon } from '@atoms/icon';
import Alert from '@atoms/alert';
import Button from '@atoms/button';
import NavBar from '@molecules/navbar';
import {disabledColor , text} from '@styles/color';
import styles from './styles';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {resetUser , setUser} from 'src/reducers/user/actions'
import { resetMeeting } from 'src/reducers/meeting/actions';
import { resetChannel } from 'src/reducers/channel/actions';
import {RFValue} from "react-native-responsive-fontsize";
import Api from "../../../services/api";
import {StackActions} from "@react-navigation/native";
import {fontValue} from "@pages/activities/fontValue";
import {setApplicationItem} from "../../../reducers/application/actions";

export default ({
  navigation
}: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootStateOrAny) => state.user) || {};
  const profilePicture = user?.profilePicture?.small;
  const photo = profilePicture ? {uri: profilePicture} : require('@assets/avatar.png');
  const [visible, setVisible] = useState(false);

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
  const logout = {
    label: 'Log out',
    value: 'logout',
    icon: <LogoutIcon width={fontValue(21)} height={fontValue(21)} color={text.error} />,
    onPress: () => setVisible(true),
  };

  const onLogout =  useCallback(() => {
    const api = Api(user.sessionToken);
    setVisible(false)
    setTimeout(() => {
      dispatch(setApplicationItem({}))
      dispatch(resetUser());
      dispatch(resetMeeting());
      dispatch(resetChannel());
      navigation.dispatch(StackActions.replace('Login'));
    }, 500);
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
            item?.value !== 'logout' &&
            <RightIcon />
          }
        </View>
      </TouchableOpacity>
    )
  };

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