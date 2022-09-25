import React, { FC, ReactNode, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';

import { defaultColor } from '@styles/color';
import styles from './styles';
import ChevronDown from "@assets/svg/chevron-down";
import ChevronUp from "@assets/svg/chevron-up";

interface Props {
  style?: any;
  headerContainer?: any,
  label?: ReactNode;
  children?: ReactNode;
  onToggle?: any;
  isCollapse?: any
};

const DropdownCard: FC<Props> = ({
  style = {},
  headerContainer= {},
  label = <View />,
  children,
  onToggle = () => {},
    isCollapse = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapse);
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.headerContainer, headerContainer]} >
        <View style={styles.headerLabelContainer}>
          {label}
        </View>

          <TouchableOpacity onPress={() => {
            setIsCollapsed(!isCollapsed);
            onToggle(!isCollapsed);
          }}>
            {
              isCollapsed
                  ? <ChevronDown size={20} color={defaultColor} />
                  : <ChevronUp size={20} color={defaultColor} />
            }
          </TouchableOpacity>

      </View>
      {
        !!children &&
        <Collapsible collapsed={isCollapsed}>
          <View style={styles.contentContainer}>
            {children}
          </View>
        </Collapsible>
      }
    </View>
  )
}

export default DropdownCard;
