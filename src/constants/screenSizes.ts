import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export default {
  screenWidth,
  screenHeight,
  windowWidth,
  windowHeight,
};
