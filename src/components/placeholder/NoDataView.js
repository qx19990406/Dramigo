import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

export default function NoDataView({title, theme = 'light', style}) {
  return (
    <View style={{...styles.box, ...style}}>
      <Image source={theme === 'light' ? require('../../assets/base/icon_no_data_light.png') : require('../../assets/base/icon_no_data_dark.png')}
        style={{ width: 162, height: 162 }}
      />
      <Text style={{...styles.text, color: theme === 'light' ? '#999' : '#fff'}}>- {title} -</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    marginBlock: 50,
  },
  text: {
    lineHeight: 19,
    fontSize: 16,
    marginTop: 10,
  },
});
