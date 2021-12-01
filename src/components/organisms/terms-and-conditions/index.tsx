import React, { useState, FC } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import CheckBox from '@atoms/checkbox';
import Button from '@atoms/button';
import { CloseIcon } from '@atoms/icon';
import styles from './styles';

interface Props {
	visible: boolean;
	termsAndConditions: string;
	onCancel: any;
	onAgree: any;
};

const TC: FC<Props> = ({
	visible,
	termsAndConditions = '',
	onCancel = () => {},
	onAgree = () => {},
}: any) => {
	const [isChecked, setIsChecked] = useState(false);
  return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={visible}
		>
			<View style={styles.modal}>

				<View style={styles.view}>

					<TouchableOpacity onPress={() => onCancel()}>
						<CloseIcon size={25} style={{alignSelf: 'flex-end', marginBottom: 30}} />
					</TouchableOpacity>

					<Text style={styles.title}>
						Terms and Conditions
					</Text>

					<ScrollView>
						<Text style={styles.TCText}>
							{termsAndConditions}
						</Text>
					</ScrollView>

					<View style={styles.iAgreeContainer}>
						<CheckBox
							isChecked={isChecked}
							onClick={() => setIsChecked(!isChecked)}
						/>
						<Text style={styles.iAgreeTxt}>
							I agree.
						</Text>
					</View>

				</View>

				<Button
					style={isChecked ? styles.buttonEnabled : styles.buttonDisabled}
					onPress={() => onAgree()}
					disabled={!isChecked}
				>
					<Text style={styles.buttonTxt}>
						OK
					</Text>
				</Button>

			</View>
		</Modal>
	)
};

export default TC;