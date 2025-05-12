import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function Loading({style}) {

  return (
    <View style={{...styles.box, ...style}}>
      <ActivityIndicator size="small" color={'#757575'} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
});
