import { PixelRatio, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const defaultPixelRatio = 1;
const designWidth = 375;
const designHeight = 667;

const dpWidth = designWidth / defaultPixelRatio;
const dpHeight = designHeight / defaultPixelRatio;

const scale = Math.min(height / dpHeight, width / dpWidth);

export const deviceWidth = width;
export const deviceHeight = height;
export const ONE_PIXEL = StyleSheet.hairlineWidth;

export const px = (size: number) => {
    return PixelRatio.roundToNearestPixel(size * scale);
};