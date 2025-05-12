import {useRef} from 'react';
import {Animated} from 'react-native';

export function initAnim(startValue, endValue) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const animValue = useRef(new Animated.Value(startValue, endValue)).current;

  const animIn = (duration = 300) => {
    Animated.timing(animValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const animOut = (duration = 300) => {
    Animated.timing(animValue, {
      toValue: startValue,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  return {animValue, animIn, animOut};
}
