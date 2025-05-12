import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View} from 'react-native';

// 页面根组件
export default function PageRoot({children, isSafeTop, style}) {
  const {top} = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, marginBottom: isSafeTop ? top : 0, ...style }}>
      {children}
    </View>
  );
}
