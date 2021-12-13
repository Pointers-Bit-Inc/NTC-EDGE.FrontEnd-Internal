import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    maxHeight: height * 0.9,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

interface Props {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  contentStyle?: any;
  avoidKeyboard?: boolean;
  [x:string]: any;
}

export type BottomModalRef =  {
  setShowModal?: any,
  close: () => void,
  open: () => void,
}

const BottomModal: ForwardRefRenderFunction<BottomModalRef, Props> = (
  { children, header, footer, contentStyle = {}, avoidKeyboard = true },
  ref,
) => {
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
      style={styles.view}>
      <View style={styles.container}>
        {header}
        <View style={contentStyle}>{children}</View>
        {footer}
      </View>
    </Modal>
  );
};

export default forwardRef(BottomModal);
