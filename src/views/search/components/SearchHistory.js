import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SingleTouchable} from '../../../components/SingleTouchable';
import DeleteIcon from '../../../assets/base/delete.png';
import {store} from '../../../redux/persist';
import {historyClear, historyRemove} from '../../../redux/action';
import useUserData from '../../../hooks/useUserData';

export default function SearchHistory({setKeywords, setValue, setIsSearch}) {
  const {history} = useUserData();
  const [remove, setRemove] = useState(false);

  return (
    <>
      {!history.length ? null : (
        <View style={styles.historyContainer}>
          <View style={styles.header}>
            <Text style={{fontSize: 14, color: '#191919'}}>History</Text>
            {remove ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SingleTouchable
                  activeOpacity={0.8}
                  onPress={() => {
                    store.dispatch(historyClear());
                  }}>
                  <Text style={styles.clearText}>ClearAll</Text>
                </SingleTouchable>
                <SingleTouchable
                  activeOpacity={0.8}
                  onPress={() => {
                    setRemove(false);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 6,
                    marginRight: 6,
                  }}>
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../../../assets/base/close.png')}
                  />
                </SingleTouchable>
              </View>
            ) : (
              <SingleTouchable
                activeOpacity={0.8}
                onPress={() => {
                  setRemove(true);
                }}
                style={{width: 18, height: 18}}>
                <Image source={DeleteIcon} style={{width: 18, height: 18}} />
              </SingleTouchable>
            )}
          </View>
          <View style={styles.historyList}>
            {history.map((item, index) => (
              <SingleTouchable
                key={index}
                onPress={() => {
                  if (remove) {
                    store.dispatch(historyRemove(index));
                  } else {
                    setValue(item);
                    setKeywords(item);
                    setIsSearch(true);
                  }
                }}
                activeOpacity={0.8}
                style={styles.historyItem}>
                <Text style={styles.historyItemText}>{`${item}`}</Text>
                {remove ? (
                  <Image
                    style={{width: 16, height: 16}}
                    source={require('../../../assets/base/close.png')}
                  />
                ) : null}
              </SingleTouchable>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    marginTop: 20,
    marginInline: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyList: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 20,
  },
  historyItem: {
    backgroundColor: '#f6f6f6',
    paddingBlock: 4,
    paddingInline: 13,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemText: {
    color: '#757575',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  clearText: {
    fontSize: 14,
    color: '#757575',
    borderRightColor: '#757575',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    paddingRight: 8,
  },
});
