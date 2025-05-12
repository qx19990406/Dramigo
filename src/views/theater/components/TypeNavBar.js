import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {SingleTouchable} from '../../../components/SingleTouchable';
import React from 'react';

export default function TypeNavBar({
  courseType = 0,
  onCourseTypeClick,
  onDialog,
  list,
}) {
  const hiddenPoint = !courseType || list.some(item => item.id === courseType);

  return (
    <View style={styles.navBarBox}>
      <FlatList
        data={list}
        keyExtractor={(item, index) => `${index}`}
        horizontal={true}
        contentContainerStyle={styles.navItemSwiper}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TypeItem
            key={index}
            isSelected={courseType === item.id}
            text={item.name}
            onClick={() => onCourseTypeClick && onCourseTypeClick(item.id)}
            testID={'btn-nav-' + index + 1}
          />
        )}
      />
      <SingleTouchable
        onPress={onDialog}
        testID={'btn-011'}
        style={styles.downIcon}
        activeOpacity={0.8}>
        {!hiddenPoint ? (
          <View style={styles.point}>
            <Text style={{color: '#fff', lineHeight: 16, fontSize: 13}}>1</Text>
          </View>
        ) : (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../../assets/base/arrow_down.png')}
          />
        )}
      </SingleTouchable>
    </View>
  );
}

const TypeItem = ({isSelected, onClick, text, testID}) => {
  return (
    <SingleTouchable
      onPress={onClick}
      style={{
        ...styles.typeItem,
        backgroundColor: isSelected ? '#FC4A12' : '#F6F6F6',
      }}
      testID={testID}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: isSelected ? '#fff' : '#757575',
        }}>
        {text}
      </Text>
    </SingleTouchable>
  );
};

const styles = StyleSheet.create({
  navBarBox: {
    marginLeft: 15,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 27,
    marginBottom: 8,
  },
  navItemSwiper: {},
  downIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
    justifyContent: 'center',
  },
  typeItem: {
    height: 20,
    borderRadius: 12,
    paddingInline: 14,
    paddingBlock: 2,
    marginRight: 9,
  },
  point: {
    width: 16,
    height: 16,
    backgroundColor: '#FC4A12',
    borderRadius: 16,
    alignItems: 'center',
  },
});
