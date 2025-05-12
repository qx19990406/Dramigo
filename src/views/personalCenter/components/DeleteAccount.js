import React from 'react';
import {Image, Text, TextInput, View} from 'react-native';
import AlarmIcon from '../../../assets/toast/alarm_icon.png';

export default function DeleteAccount({value, setValue}) {

  return (
    <View style={{paddingTop: 12, paddingBottom: 44, flexDirection: 'column'}}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image style={{ width: 14, height: 14 }} source={AlarmIcon} />
        <Text style={{ marginLeft: 2, color: '#EE2525', fontSize: 12 }}>Deleting your account will clear all data</Text>
      </View>
      <Text style={{ marginTop: 34, fontSize: 14, color: '#333', marginBottom: 18 }}>Please enter password</Text>
      <TextInput
        placeholder={''}
        value={value}
        maxLength={50}
        secureTextEntry={true}
        onChangeText={v => setValue(v)}
        keyboardType={'default'}
        keyboardAppearance={'light'}
        returnKeyType={'default'}
        style={{ height: 38, borderRadius: 8, borderColor: '#9e9e9e', borderStyle: 'solid', borderWidth: 1 }}
      />
    </View>
  );
}
