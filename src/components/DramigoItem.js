import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SingleTouchable} from './SingleTouchable';
import {LinearGradient} from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

// 排序标签背景色
const sortTagBgColor = idx => {
  switch (idx) {
    case 0:
      return (
        <LinearGradient
          colors={['#E21220FF', '#D40F1000']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.sortTag}>
          <Text style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>
            {idx + 1}
          </Text>
        </LinearGradient>
      );
    case 1:
      return (
        <LinearGradient
          colors={['#EC6200FF', '#EC620000']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.sortTag}>
          <Text style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>
            {idx + 1}
          </Text>
        </LinearGradient>
      );
    case 2:
      return (
        <LinearGradient
          colors={['#4B88FDFF', '#4B88FD00']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.sortTag}>
          <Text style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>
            {idx + 1}
          </Text>
        </LinearGradient>
      );
    default:
      return (
        <View style={{...styles.sortTag, backgroundColor: '#9a9a9a'}}>
          <Text style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>
            {idx + 1}
          </Text>
        </View>
      );
  }
};

/**
 * 短剧组件
 * */
export default function DramigoItem({
  id,
  preview,
  name,
  episodes,
  child,
  idx,
  sort = false,
  theme = 'light',
}) {
  const navigation = useNavigation();

  return (
    <SingleTouchable
      style={styles.itemBox}
      testID={'btn-221-' + idx + 1}
      onPress={() => navigation.push('dramigoDetail', {id})}
    >
      <ImageBackground
        style={styles.videoPre}
        source={{ uri: preview }}
        resizeMode={'cover'}>
        {sort ? sortTagBgColor(idx) : null}
        {child ? (
          <LinearGradient
            colors={['#66666600', '#000000CC']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.gradient}
          />
        ) : null}
        {child}
      </ImageBackground>
      <Text style={{...styles.videoName, color: theme === 'light' ? '#191919' : '#fff'}} numberOfLines={1} ellipsizeMode={'tail'}>
        {name}
      </Text>
      {episodes ? <Text style={styles.episodes}>{episodes}</Text> : null}
    </SingleTouchable>
  );
}

const styles = StyleSheet.create({
  itemBox: {
    backgroundColor: 'transparent',
  },
  videoPre: {
    aspectRatio: 104 / 146,
    borderRadius: 7,
    position: 'relative',
    overflow: 'hidden',
  },
  videoName: {
    marginTop: 8,
    fontSize: 13,
    width: 104,
  },
  episodes: {
    marginTop: 1,
    fontSize: 10,
    color: '#999',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  sortTag: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 0,
    left: 0,
    borderTopLeftRadius: 7,
    borderBottomRightRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
