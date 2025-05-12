import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {SingleTouchable} from './SingleTouchable';
import React, {} from 'react';
import {BaseModalController} from './modal/BaseModal';
import {store} from '../redux/persist';
import {setCurrentIdx} from '../redux/action';

const {width, height} = Dimensions.get('window');

const EpisodeItem = ({isSelect, order, idx, onConfirmClick}) => {
  return (
    <SingleTouchable
      style={{
        ...styles.episodeItem,
        backgroundColor: isSelect ? '#FF4A564D' : '#F7F7F7FF',
      }}
      onPress={() => {
        onConfirmClick && onConfirmClick(idx);
      }}
      activeOpacity={0.8}>
      <Text
        style={{
          color: isSelect ? '#fff' : '#191919',
          fontSize: 14,
          lineHeight: 16,
        }}>
        {order}
      </Text>
    </SingleTouchable>
  );
};

function ModalView({list, onConfirmClick, hidden, currentIndex}) {

  const onClickEpisode = (idx) => {
    onConfirmClick && onConfirmClick(idx);
    store.dispatch(setCurrentIdx(idx));
    hidden();
  }

  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <SingleTouchable
          style={styles.closeBtn}
          onPress={hidden}
          activeOpacity={0.8}>
          <Image
            style={{width: 24, height: 24}}
            source={require('../assets/base/arrow_down.png')}
          />
        </SingleTouchable>
        <Text style={styles.titleStyle}>Selections</Text>
        <View />
      </View>
      <View style={styles.episodeList}>
        {list.map((item, index) => (
          <EpisodeItem
            key={index}
            idx={index}
            order={item.order}
            isSelect={currentIndex === index}
            onConfirmClick={onClickEpisode}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: width,
    maxHeight: height * 0.7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
    zIndex: 10,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginInline: 8,
  },
  closeBtn: {
    width: 24,
    height: 24,
    zIndex: 20,
    marginTop: 8,
  },
  titleStyle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
    paddingRight: 16,
  },
  episodeList: {
    marginTop: 15,
    marginInline: 20,
    columnGap: 8,
    rowGap: 13,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  episodeItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    width: 45,
    height: 45,
  },
});

export default function SelectEpiList() {}

SelectEpiList.showModal = ({list, onConfirmClick, currentIndex}) => {
  let component = (
    <ModalView list={list} onConfirmClick={onConfirmClick} currentIndex={currentIndex} hidden={BaseModalController.hidden} />
  );
  BaseModalController.show(component, 'bottom', true, false);
};
