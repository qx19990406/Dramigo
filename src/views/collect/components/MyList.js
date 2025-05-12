import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import DramigoItem from '../../../components/DramigoItem';
import React, {useEffect, useState} from 'react';
import {getSeriesListApi} from '../../../api/series';
import {ToastController} from '../../../components/modal/ToastModal';
import Placeholder from '../../../components/placeholder/Placeholder';
import eventBus from '../../../utils/eventBus';

const screenWidth = Dimensions.get('window').width;
const PAGE_SIZE = 9;

export default function MyList() {
  const [isFirst, setIsFirst] = useState(true);
  const [page, setPage] = useState(1);
  const [collectList, setCollectList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);

  // 获取收藏剧集列表
  const getCollectListData = () => {
    getSeriesListApi({
      page: page,
      size: PAGE_SIZE,
      isFavorites: true,
    })
      .then(res => {
        const {code, data, message} = res;
        if (code === 0) {
          if (page === 1) {
            setCollectList(data.list);
          } else {
            setCollectList([...data.list, ...collectList]);
          }
          setHasMoreData(
            !data.list.length
              ? false
              : data.list.length + collectList.length < data.total,
          );
        } else {
          ToastController.showError(message || 'Failed to retrieve the list!');
        }
        if (isFirst) {
          setIsFirst(false);
        }
      })
      .catch(() => {
        ToastController.showError('Failed to retrieve the list!');
      })
      .finally(() => {
        setRefreshing(false);
      });
  }

  useEffect(() => {
    getCollectListData()
  }, [page]);

  useEffect(() => {
    eventBus.addListener('reload', getCollectListData);

    return () => {
      eventBus.removeListener('reload', getCollectListData)
    }
  }, []);

  return (
    <FlatList
      data={collectList}
      keyExtractor={(item, index) => `${index}`}
      horizontal={false}
      numColumns={3}
      initialNumToRender={12}
      contentContainerStyle={styles.scrollListStyle}
      refreshing={refreshing}
      onEndReachedThreshold={0}
      ListEmptyComponent={<Placeholder text={'No data yet'} isFirst={isFirst} />}
      renderItem={({item, index}) => (
        <View style={styles.itemStyle}>
          <DramigoItem
            id={item.id}
            name={item.title}
            idx={index}
            preview={item.coverImageUrl}
            episodes={'1/' + item.totalEpisodeCount}
          />
        </View>
      )}
      onEndReached={() => {
        hasMoreData && setPage(page + 1)
      }}
      onRefresh={() => {
        setRefreshing(true);
        if (page === 1) {
          getCollectListData();
        } else {
          setPage(1)
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  scrollListStyle: {
    marginInline: 8,
    marginTop: 15,
    paddingBottom: 105,
    gap: 16,
  },
  itemStyle: {
    width: (screenWidth - 4 * 16) * 0.33,
    marginInline: 8,
  },
});
