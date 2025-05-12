import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import DramigoItem from '../../../components/DramigoItem';
import {getSeriesListApi} from '../../../api/series';
import useVideoData from '../../../hooks/useVideoData';
import {exportRandomPage} from '../../../utils';
import {ToastController} from '../../../components/modal/ToastModal';

const screenWidth = Dimensions.get('window').width;

export default function PopularList() {
  const {listTotal} = useVideoData();
  const [collectList, setCollectList] = useState([]);

  // 获取推荐剧集列表
  const getPopularList = () => {
    getSeriesListApi({
      page: 1,
      size: 9,
      isHot: true,
    })
      .then(res => {
        const {code, data, message} = res;
        if (code === 0) {
          setCollectList(data.list);
        } else {
          ToastController.showError(message || 'Failed to retrieve the list!');
        }
      })
      .catch(() => {
        ToastController.showError('Failed to retrieve the list!');
      });
  };

  useEffect(() => {
    getPopularList()
  }, []);

  return (
    <View style={styles.box}>
      <Text style={{color: '#191919', fontSize: 14, marginLeft: 8}}>
        Popular List
      </Text>
      <ScrollView contentContainerStyle={styles.scrollListStyle}>
        {collectList.map((item, index) => (
          <View key={index} style={styles.itemStyle}>
            <DramigoItem
              id={item.id}
              name={item.title}
              idx={index}
              preview={item.coverImageUrl}
              episodes={item.playsCount + ' Plays'}
              sort={true}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginInline: 8,
    marginTop: 30,
    flex: 1,
  },
  scrollListStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingBottom: 20,
    marginInline: 8,
    gap: 16,
  },
  itemStyle: {
    width: (screenWidth - 4 * 16) * 0.33,
  },
});
