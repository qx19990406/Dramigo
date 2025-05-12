import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {SingleTouchable} from '../../../components/SingleTouchable';
import {COLLECT} from '../../../constants/collect';

export default function TypeChange({courseType = 1, onCourseTypeClick}) {
  const {top} = useSafeAreaInsets();

  return (
    <View style={{ marginTop: 23 + top, marginBottom: 15, marginInline: 15, flexDirection: 'row', gap: 12 }}>
      <TypeItem
        isSelected={courseType === COLLECT.List}
        text={'My List'}
        onClick={() => onCourseTypeClick && onCourseTypeClick(COLLECT.List)}
        testID={'btn-01'}
      />
      <TypeItem
        isSelected={courseType === COLLECT.Like}
        text={'Like'}
        onClick={() => onCourseTypeClick && onCourseTypeClick(COLLECT.Like)}
        testID={'btn-02'}
      />
    </View>
  );
}

const TypeItem = ({isSelected, onClick, text, testID}) => {
  return (
    <SingleTouchable
      onPress={onClick}
      style={{...styles.typeItem, backgroundColor: isSelected ? '#FC4A12' : '#F4F4F4'}}
      testID={testID}
    >
      <Text style={{
        textAlign: 'center',
        lineHeight: 26,
        fontSize: 14,
        color: isSelected ? '#fff' : '#757575',
      }}>{text}</Text>
    </SingleTouchable>
  );
};

const styles = StyleSheet.create({
  typeItem: {
    width: 94,
    height: 26,
    borderRadius: 4,
  },
});
