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
import { text } from '@styles/color';
import styles from './styles';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { setUser } from 'src/reducers/user/actions'
import { resetMeeting } from 'src/reducers/meeting/actions';
import { resetChannel } from 'src/reducers/channel/actions';

export default ({
  navigation
}: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootStateOrAny) => state.user) || {};
  const profilePicture = user?.profilePicture?.small;
  const photo = profilePicture ? {uri: profilePicture} : require('@assets/avatar.png');
  const [visible, setVisible] = useState(false);
  const settings = [
    {
      label: 'Notifications',
      value: 'notifications',
      icon: <BellIcon size={21} />,
      onPress: () => {},
    },
    {
      label: 'Help Center',
      value: 'help-center',
      icon: <DonutIcon size={21} />,
      onPress: () => {},
    },
    {
      label: 'About',
      value: 'about',
      icon: <ExclamationIcon size={21} type='circle' />,
      onPress: () => {},
    },
  ];
  const logout = {
    label: 'Log out',
    value: 'logout',
    icon: <LogoutIcon size={21} color={text.error} />,
    onPress: () => setVisible(true),
  };
  const onLogout = () => {
    setVisible(false);
    dispatch(setUser({}));
    dispatch(resetMeeting());
    dispatch(resetChannel());
    setTimeout(() => {
      navigation.replace('Login');
    }, 500);
  };

  const renderRow = ({item}: any) => {
    return (
      <TouchableOpacity onPress={item?.onPress}>
        <View style={[styles?.row, {justifyContent: 'space-between'}]}>
          <View style={styles?.row}>
            {item?.icon}
            <Text style={[styles.textSettings, item?.value === 'logout' && {color: text.error}]}>{item?.label}</Text>
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

      <Alert
        visible={visible}
        title='Log out'
        message='Are you sure you want to log out?'
        confirmText='OK'
        cancelText='Cancel'
        onConfirm={onLogout}
        onCancel={() => setVisible(false)}
      />

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

        {separator}

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

      </ScrollView>

    </>
  )
};