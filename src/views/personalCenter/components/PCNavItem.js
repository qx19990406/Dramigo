import React from 'react';
import {SingleTouchable} from '../../../components/SingleTouchable';
import {Image, StyleSheet, Text, View} from 'react-native';
import LeftArrowIcon from '../../../assets/person/left_arrow.png';

export default function PCNavItem({icon, onClick, text, arrowShow = true, subDesc, testID, rightCid}) {
  return (
    <SingleTouchable
      testID={testID}
      onPress={onClick}
      style={{ paddingBlock: 16 }}
    >
      <View style={styles.tabItemBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={styles.iconStyle} source={icon} />
          <Text style={styles.navTextStyle}>{text}</Text>
        </View>
        {
          arrowShow ? <Image style={styles.arrowStyle} source={LeftArrowIcon} /> : (rightCid || null)
        }
      </View>
      {
        subDesc ? <Text style={styles.subTitleStyle}>{subDesc}</Text> : null
      }
    </SingleTouchable>
  );
}

const styles = StyleSheet.create({
  tabItemBox: {
    marginLeft: 30,
    marginRight: 21,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 16,
  },
  navTextStyle: {
    color: '#191919',
    fontSize: 16,
  },
  arrowStyle: {
    width: 24,
    height: 24,
  },
  subTitleStyle: {
    marginTop: 4,
    fontSize: 12,
    color: '#E21321',
    paddingInline: 62,
  },
});
