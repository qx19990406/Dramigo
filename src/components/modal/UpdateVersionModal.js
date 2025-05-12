import React from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {SingleTouchable} from '../SingleTouchable';
import {BaseModalController} from './BaseModal';

export default function UpdateVersionModal({num, url, testID}) {
  return (
    <View style={styles.container}>
      <Image style={styles.Icon} source={require('../../assets/base/new_version.png')} />
      <Text style={styles.Title}>New version upgrade</Text>
      <Text style={styles.version}>Upgrade to version {num}</Text>
      <SingleTouchable
        onPress={() => {
          Linking.openURL(url);
          BaseModalController.hidden();
        }}
      >
        <View style={styles.Btn}>
          <Text style={styles.Text}>Upgrade</Text>
        </View>
      </SingleTouchable>
      <SingleTouchable
        onPress={() => BaseModalController.hidden()}
        style={{
          width: 24,
          height: 24,
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        <Image style={{ width: 24, height: 24 }} source={require('../../assets/base/close.png')} />
      </SingleTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 334,
    height: 296,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 20,
    position: 'relative',
  },
  Icon: {
    width: 100,
    height: 100,
  },
  Title: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 19,
    color: '#191919',
    textAlign: 'center',
  },
  version: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16,
    color: '#999999',
    textAlign: 'center',
    marginTop: 5,
  },
  Btn: {
    backgroundColor: '#FC4A12',
    height: 39,
    borderRadius: 20,
    width: 215,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  Text: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 16,
    color: '#fff',
  },
});
