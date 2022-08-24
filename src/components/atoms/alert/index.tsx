import React, { FC } from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './styles';

interface Props {
  visible?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: any;
  onCancel?: any;
  messageStyle?:any;
};

const Alert: FC<Props> = ({
  visible = false,
  title = '',
  message = '',
  confirmText = '',
  cancelText = '',
  onConfirm = () => {},
  onCancel = () => {},
  messageStyle={}
}) => {
  return (
    <AwesomeAlert
        useNativeDriver={true}
      show={visible}
      title={title}
      message={message}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      confirmText={confirmText}
      cancelText={cancelText}
      showConfirmButton={!!confirmText}
      showCancelButton={!!cancelText}
      onConfirmPressed={onConfirm}
      onCancelPressed={onCancel}
      alertContainerStyle={styles.alertContainerStyle}
      contentContainerStyle={styles.contentContainerStyle}
      contentStyle={styles.contentStyle}
      titleStyle={styles.titleStyle}
      messageStyle={[styles.messageStyle, messageStyle]}
      actionContainerStyle={styles.actionContainerStyle}
      confirmButtonStyle={styles.confirmButtonStyle}
      cancelButtonStyle={styles.cancelButtonStyle}
      confirmButtonTextStyle={styles.confirmButtonTextStyle}
      cancelButtonTextStyle={styles.cancelButtonTextStyle}
    />
  )
};

export default Alert;