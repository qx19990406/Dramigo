import React from 'react';
import {Image, StyleSheet, Text, TextInput} from 'react-native';
import {SingleTouchable} from '../../../components/SingleTouchable';

export default function SearchInput({ enabled = true, value, setValue, onSearchClick, onClick, style }) {

  return (
    <SingleTouchable
      activeOpacity={enabled ? 1 : 0.8}
      onPress={() => !enabled && onClick()}
      style={{...style, ...styles.box}}
    >
      <Image source={require('../../../assets/base/search_icon.png')} style={styles.searchIcon} />
      {
        enabled ? <TextInput
          selectionColor={'#333'}
          placeholder={'Search'}
          placeholderTextColor={'#19212680'}
          value={value}
          onChangeText={setValue}
          maxLength={30}
          keyboardType={'default'}
          keyboardAppearance={'light'}
          returnKeyType={'search'}
          onSubmitEditing={() => onSearchClick && onSearchClick()}
          style={{ flex: 1 }}
        /> : <Text style={styles.hintText}>Search</Text>
      }
    </SingleTouchable>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    height: 38,
    backgroundColor: '#f4f4f4',
    borderRadius: 38,
  },
  hintText: {
    alignSelf: 'center',
    flex: 1,
    fontSize: 12,
    color: '#999',
  },
  searchIcon: {
    alignSelf: 'center',
    width: 24,
    height: 24,
    marginRight: 10,
    marginLeft: 22,
  },
});
