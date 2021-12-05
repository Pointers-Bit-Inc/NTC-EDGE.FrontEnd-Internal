import React, { FC } from 'react';
import Checkbox from 'expo-checkbox';
import { primaryColor, disabledColor } from '@styles/color';

interface Props {
	style?: any;
	isChecked: boolean;
	onClick: any;
};

const CheckBox: FC<Props> = ({
	style = {},
	isChecked = false,
	onClick = () => {},
}) => {
	return (
		<Checkbox
			style={style}
			disabled={false}
			value={isChecked}
			onValueChange={onClick}
			color={isChecked ? primaryColor : disabledColor}
		/>
	)
};

export default CheckBox;