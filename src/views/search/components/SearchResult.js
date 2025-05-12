import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import DramigoItem from '../../../components/DramigoItem';
import {getSeriesListApi} from '../../../api/series';
import {ToastController} from '../../../components/modal/ToastModal';
import Placeholder from '../../../components/placeholder/Placeholder';

const screenWidth = Dimensions.get('window').width;

export default function SearchResult({keywords}) {
  const [searchList, setSearchList] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);

  // 获取搜索列表
  const getSearchList = () => {
    getSeriesListApi({
      page: page,
      size: 9,
      keywords: keywords,
    })
      .then(res => {
        const {code, data, message} = res;
        if (code === 0) {
          if (page === 1) {
            setSearchList(data.list);
            setHasMoreData(
              !data.list.length ? false : data.list.length < data.total,
            );
          } else {
            setSearchList([...searchList, ...data.list]);
            setHasMoreData(
              !data.list.length
                ? false
                : data.list.length + searchList.length < data.total,
            );
          }
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
  };

  useEffect(() => {
    if (page === 1) {
      getSearchList();
    } else {
      setPage(1);
    }
    return () => {
      setSearchList([]);
    };
  }, [keywords]);

  useEffect(() => {
    if (page > 1) {
      getSearchList();
    }
  }, [page]);

  return (
    <View style={{marginTop: 15}}>
      <FlatList
        data={searchList}
        keyExtractor={(item, index) => `${index}`}
        horizontal={false}
        numColumns={3}
        initialNumToRender={12}
        contentContainerStyle={styles.scrollListStyle}
        refreshing={refreshing}
        onEndReachedThreshold={0}
        ListEmptyComponent={
          <Placeholder text={'No data yet'} isFirst={isFirst} />
        }
        renderItem={({item, index}) => (
          <View style={styles.itemStyle}>
            <DramigoItem
              id={item.id}
              name={item.title}
              idx={index}
              preview={item.coverImageUrl}
              child={
                <Text style={styles.videoInfo}>{item.playsCount} plays</Text>
              }
              episodes={
                item.category + ` · Total ${item.totalEpisodeCount} episodes`
              }
            />
          </View>
        )}
        onEndReached={() => {
          hasMoreData && setPage(page + 1);
        }}
        onRefresh={() => {
          setRefreshing(true);
          if (page === 1) {
            getSearchList()
          } else {
            setPage(1)
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollListStyle: {
    marginTop: 16,
    marginInline: 8,
    paddingBottom: 105,
    gap: 16,
  },
  itemStyle: {
    width: (screenWidth - 4 * 16) * 0.33,
    marginInline: 8,
  },
  videoInfo: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 8,
    color: '#fff',
  },
});
