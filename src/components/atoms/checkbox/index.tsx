import React, { FC } from 'react';
import Checkbox from 'expo-checkbox';
import { primaryColor } from '@styles/color';

interface Props {
	isChecked: boolean;
	onClick: any;
};

const CheckBox: FC<Props> = ({
	isChecked = false,
	onClick = () => {},
}) => {
	return (
		<Checkbox
			disabled={false}
			value={isChecked}
			onValueChange={onClick}
			color={isChecked ? primaryColor : undefined}
		/>
	)
};

export default CheckBox;