import React, { FC, ReactNode, useState, useEffect } from 'react';
import { View, Modal, TouchableWithoutFeedback, Animated, Dimensions, PanResponder } from 'react-native';
import styles from './styles';

interface Props {
  onDismiss?: any;
	containerStyle?:any;
  visible?: boolean;
  children?: ReactNode;
};

const AnimatedModal: FC<Props> = ({
	containerStyle,
  onDismiss = () => {},
  visible,
  children,
}) => {
  const [panY] = useState(new Animated.Value(Dimensions.get('screen').height));
	const _resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
		useNativeDriver: false,
  });
	const _closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 300,
		useNativeDriver: false
  });
	const _handleDismiss = () => {
		_closeAnim.start();
		setTimeout(() => onDismiss(), 300);
	}
	const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

	const _panResponders = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => false,
		onPanResponderMove: Animated.event(
			[ null, {dy: panY} ],
			{ useNativeDriver: false }
		),
		onPanResponderRelease: (e, gs) => {
			if (gs.dy > 0 && gs.vy > 2) return _handleDismiss();
			return _resetPositionAnim.start();
		},
	});

  useEffect(() => {
		if (visible) _resetPositionAnim.start();
	}, [visible]);

  return (
    <Modal
			animated
			animationType='fade'
			visible={visible}
			transparent
		>
			<TouchableWithoutFeedback onPress={_handleDismiss}>
				<View style={styles.overlay}>
					<Animated.View
						{..._panResponders.panHandlers}
						style={[styles.container, {top}, containerStyle]}
					>
						{children}
					</Animated.View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
  )
};

export default AnimatedModal;