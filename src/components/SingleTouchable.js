import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

// 封装点击效果组件
export const SingleTouchable = ({ onPress = () => {}, children, style, testID, activeOpacity = 0.8 }) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      testID={testID}
      onPress={() => {
        setDisabled(true);
        onPress();
        setTimeout(() => setDisabled(false), 500);
      }}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};
