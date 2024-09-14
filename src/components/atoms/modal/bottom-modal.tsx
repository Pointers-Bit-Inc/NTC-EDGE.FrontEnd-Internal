import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
} from 'react';
import { View, StyleSheet, Dimensions, Platform, useWindowDimensions } from 'react-native';
import Modal from 'react-native-modal';
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  webView: {
    justifyContent: 'center',
    margin: 0,
  },
  container: {
    maxHeight: height * 0.9,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  webContainer: {
    maxHeight: height * 0.9,
    width: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    borderTopRightRadius: 15,
    alignSelf: 'center',
  }
});

interface Props {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  contentStyle?: any;
  containerStyle?: any,
  avoidKeyboard?: boolean;
  [x:string]: any;
}

export type BottomModalRef =  {
  setShowModal?: any,
  close: () => void,
  open: () => void,
}

const BottomModal: ForwardRefRenderFunction<BottomModalRef, Props> = (
  { children, header, footer, contentStyle = {}, containerStyle = {}, avoidKeyboard = true, ...otherProps },
  ref,
) => {
  const { width } = useWindowDimensions();
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  useImperativeHandle(ref, () => ({
    setShowModal,
    close: () => setShowModal(false),
    open: () => setShowModal(true),
  }));
  return (
    <Modal
      ref={modalRef}
      isVisible={showModal}
      avoidKeyboard={avoidKeyboard}
      onBackdropPress={() => setShowModal(false)}
      onSwipeComplete={() => setShowModal(false)}
      statusBarTranslucent={true}
      style={(Platform.OS === 'web' && width > 500) ? styles.webView : styles.view}
      {...otherProps}
    >
      <View style={[(Platform.OS === 'web' && width > 500) ? styles.webContainer : styles.container, containerStyle]}>
        {header}
        <View style={contentStyle}>{children}</View>
        {footer}
      </View>
    </Modal>
  );
};

export default forwardRef(BottomModal);
