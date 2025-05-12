import {Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SingleTouchable} from '../../../components/SingleTouchable';
import {BaseModalController} from '../../../components/modal/BaseModal';

const { width, height } = Dimensions.get('window');

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
          fontSize: 14,
          color: isSelected ? '#fff' : '#757575',
        }}>
        {text}
      </Text>
    </SingleTouchable>
  );
};

function ModalView({ hidden, onConfirmClick, onClearClick, list, selectType }) {
  const [selectIndex, setSelectIndex] = useState(selectType);

  // 点击清除
  const clickClear = () => {
    if (!selectIndex) {
      return false;
    } else {
      setSelectIndex(0);
    }
  };
  // 点击确定
  const clickConfirm = () => {
    onConfirmClick(selectIndex);
    hidden();
  };

  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <SingleTouchable
          style={styles.closeBtn}
          onPress={() => {
            hidden();
          }}
          testID={'cancel-111'}
          activeOpacity={0.8}
        >
          <Image style={{ width: 24, height: 24 }} source={require('../../../assets/base/arrow_down.png')} />
        </SingleTouchable>
        <Text style={styles.titleStyle}>filter</Text>
        <View />
      </View>
      <ScrollView contentContainerStyle={styles.categoryList}>
        {list.map((item, index) => (
          <TypeItem
            key={index}
            isSelected={selectIndex === item.id}
            text={item.name}
            testID={'cate-nav-' + index + 1}
            onClick={() => {
              setSelectIndex(selectIndex === item.id ? 0 : item.id);
            }}
          />
        ))}
      </ScrollView>
      <View style={styles.bottomBox}>
        <SingleTouchable style={styles.hollowBtn} onPress={clickClear}>
          <Text style={{color: selectIndex ? '#FC4A12FF' : '#FC4A1233'}}>clear</Text>
        </SingleTouchable>
        <SingleTouchable style={styles.solidBtn} onPress={clickConfirm}>
          <Text style={{color: '#fff'}}>confirm</Text>
        </SingleTouchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: width,
    maxHeight: height * 0.9,
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
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
    paddingBottom: 85,
  },
  typeItem: {
    borderRadius: 18,
    paddingInline: 18,
    paddingBlock: 6,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    height: 75,
    width: width,
    backgroundColor: '#fff',
    shadowColor: '#0000003F',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 1,
    flexDirection: 'row',
    paddingInline: 16,
    gap: 16,
  },
  solidBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FC4A12',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
  },
  hollowBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderColor: '#FC4A12',
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
  },
});

export default function SelectMoreType() {}

SelectMoreType.showModal = ({onConfirmClick, onClearClick, list, selectType}) => {
  let component = <ModalView
    hidden={BaseModalController.hidden}
    onConfirmClick={onConfirmClick}
    onClearClick={onClearClick}
    list={list}
    selectType={selectType}
  />;
  BaseModalController.show(component, 'bottom', true, false);
};
