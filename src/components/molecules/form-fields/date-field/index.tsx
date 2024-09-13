import React, { FC } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import Moment from 'moment';
import Text from '@atoms/text';
import { DropdownField } from '@molecules/form-fields';
import inputStyle from '@styles/input-style';
import styles from './styles';
import { birthyearList, yearList } from '@/src/utils/ntc';

interface Props {
  label?: string;
  value?: any;
  onChangeValue?: any;
  parentType?: string;
  isDateOfBirth?: boolean;
  required?: boolean;
};

const DateField: FC<Props> = ({
  label = '',
  value,
  onChangeValue = () => {},
  parentType = '',
  isDateOfBirth,
  required,
}) => {
  const { width } = useWindowDimensions();
  let isParentList = parentType === 'list';
  let year = value?.find((v: any) => v?.id === 'year')?.value || '';
  let month = value?.find((v: any) => v?.id === 'month')?.value || '';
  let day = value?.find((v: any) => v?.id === 'day')?.value || '';

  year = isNaN(year) ? '' : year;
  month = isNaN(month) ? '' : month;
  day = isNaN(day) ? '' : day;

  let _year = year || Moment().get('year');
  let _month = month || '00';

  const datesArray = Array.from(Array(Moment(new Date()).set({year: _year, month: _month}).daysInMonth()), (_, i) => {
    return {
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    }
  });
  const monthsArray = [
    { label: 'January', value: '00' },
    { label: 'February', value: '01' },
    { label: 'March', value: '02' },
    { label: 'April', value: '03' },
    { label: 'May', value: '04' },
    { label: 'June', value: '05' },
    { label: 'July', value: '06' },
    { label: 'August', value: '07' },
    { label: 'September', value: '08' },
    { label: 'October', value: '09' },
    { label: 'November', value: '10' },
    { label: 'December', value: '11' },
  ];
  return (
    <View>
      <Text style={inputStyle.headerLabelText}>
        {label}
      </Text>
      <View style={styles.view}>
        <View style={[
          styles.dropdownContainer,
          {...Platform.select( { web: {flex: 0.48}})},
          !!isParentList && styles?.dropdownContainer3
        ]}>
          <DropdownField
            items={monthsArray}
            placeholder='Month'
            required={required}
            hasValidation={true}
            value={month}
            alternativeValue={monthsArray.find((m: any) => m?.value === month)?.label}
            onChangeValue={(value: string) => onChangeValue('month', value)}
          />
        </View>
        <View style={[styles.dropdownContainer, {...Platform.select( { web: {flex: 0.48}})}]}>
          <DropdownField
            items={datesArray}
            placeholder='Day'
            required={required}
            hasValidation={true}
            value={day}
            onChangeValue={(value: string) => onChangeValue('day', value)}
          />
        </View>
      </View>
      <View style={styles.dropdownContainer2}>
        <DropdownField
          items={!!isDateOfBirth ? birthyearList() : yearList()}
          placeholder='Year'
          required={required}
          hasValidation={true}
          value={year}
          onChangeValue={(value: string) => onChangeValue('year', value)}
        />
      </View>
    </View>
  )
};

export default DateField;
