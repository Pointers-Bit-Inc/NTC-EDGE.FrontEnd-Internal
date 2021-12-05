import React, { FC } from 'react';
import Box from '@atoms/box';
import Text from '@atoms/text';
import CheckBox from '@molecules/checkbox';
import styles from './styles';

interface Props {
	termsAndCondition?: string;
	agree?: boolean;
	onClick?: any;
};

const TermsAndConditions: FC<Props> = ({
	termsAndCondition = '',
	agree,
	onClick = () => {},
}) => {
	return (
		<>
			<Box>
				<Text style={styles.text}>
					{termsAndCondition}
				</Text>
			</Box>
			<CheckBox
				style={{ margin: 20 }}
				isChecked={agree}
				onClick={onClick}
				label='I agree.'
			/>
		</>
	)
};

export default TermsAndConditions;