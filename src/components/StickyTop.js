import React from 'react';
import {SingleTouchable} from './SingleTouchable';
import ArrowBlack from '../assets/topBar/arrow_black.png';
import ArrowLight from '../assets/topBar/arrow_light.png';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 顶部导航栏
export default function StickyTopNav({title, theme = 'light', showBack = false, style, testID}) {
  const {top} = useSafeAreaInsets();

  const navigation = useNavigation();
  // 点击返回
  const goToBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ backgroundColor: 'transparent', paddingBlock: 8, flexDirection: 'row', alignItems: 'center', marginTop: top, ...style }}>
      {
        !showBack ? null :
          <SingleTouchable
            onPress={goToBack}
            testID={testID}
          >
            <Image style={{ width: 24, height: 24, marginLeft: 20 }} source={theme === 'light' ? ArrowLight : ArrowBlack} />
          </SingleTouchable>
      }
      <View style={{ flex: 1, height: '100%' }}>
        <Text style={{ fontSize: 18, color: theme === 'light' ? '#100000' : '#fff', lineHeight: 34, textAlign: 'center' }}>{title}</Text>
      </View>
      {
        !showBack ? null : <View style={{ width: 24, height: 24, marginRight: 20 }} />
      }
    </View>
  );
}
