import {Image, StyleSheet, Text} from 'react-native';
import React from 'react';
import {SingleTouchable} from '../../../components/SingleTouchable';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

export default function SearchBtn() {

  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SingleTouchable
      testID={'btn-00'}
      style={{...styles.searchBox, marginTop: top + 13}}
      onPress={() => navigation.push('search')}
    >
      <Image style={styles.searchIcon} source={require('../../../assets/base/search_icon.png')} />
      <Text style={styles.searchText}>Search</Text>
    </SingleTouchable>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    marginInline: 28,
    backgroundColor: '#f2f2f2',
    height: 33,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    marginLeft: 14,
  },
  searchText: {
    fontSize: 12,
    color: '#999',
  },
});
