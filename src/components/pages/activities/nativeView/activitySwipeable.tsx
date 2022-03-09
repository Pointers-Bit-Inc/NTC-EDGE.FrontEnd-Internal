import {isMobile} from "@pages/activities/isMobile";
import {Swipeable} from "react-native-gesture-handler";
import {View} from "react-native";
import React from "react";

export const ActivitySwipeable = isMobile ? Swipeable : View
