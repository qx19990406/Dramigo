import React, {useEffect, useState} from 'react';
import PageRoot from '../../components/PageRoot';
import SearchBtn from './components/SearchBtn';
import TypeNavBar from './components/TypeNavBar';
import SelectMoreType from './components/SelectMoreType';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DramigoItem from '../../components/DramigoItem';
import {getCategoryListApi, getSeriesListApi} from '../../api/series';
import {ToastController} from '../../components/modal/ToastModal';
import Placeholder from '../../components/placeholder/Placeholder';
import eventBus from '../../utils/eventBus';

const screenWidth = Dimensions.get('window').width;
const PAGE_SIZE = 9;

export default function Theater() {
  const [page, setPage] = useState(1);
  const [selectType, setSelectType] = useState(0);
  const [navList, setNavList] = useState([]); // 头部分类列表
  const [categoryList, setCategoryList] = useState([]); // 分类列表
  const [seriesList, setSeriesList] = useState([]); // 剧集列表
  const [isFirst, setFirst] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 获取分类列表
  const getCategoryListData = () => {
    getCategoryListApi()
      .then(res => {
        if (res.code === 0) {
          setCategoryList([...res.data.list]);
          setNavList(
            res.data.total > 6
              ? [...res.data.list.slice(0, 6)]
              : [...res.data.list],
          );
        } else {
          ToastController.showError(
            res.message || 'Failed to category the list!',
          );
        }
      })
      .catch(() => {
        ToastController.showError('Failed to category the list!');
      });
  };

  // 获取剧集列表
  const getSeriesListData = categoryId => {
    getSeriesListApi({
      page: page,
      size: PAGE_SIZE,
      categoryId,
    })
      .then(res => {
        if (res.code === 0) {
          if (page === 1) {
            setSeriesList(res.data.list);
            setHasMoreData(res.data.list.length === 0 ? false : res.data.list.length < res.data.total);
          } else {
            setSeriesList([...seriesList, ...res.data.list]);
            setHasMoreData(
              res.data.list.length === 0
                ? false
                : res.data.list.length + seriesList.length < res.data.total,
            );
          }
        } else {
          ToastController.showError(
            res.message || 'Failed to retrieve the list!',
          );
        }
        if (isFirst) {
          setFirst(false);
        }
      })
      .catch(() => {
        ToastController.showError('Failed to retrieve the list!');
      })
      .finally(() => {
        // setIsLoading(false);
        setRefreshing(false);
      });
  };

  // 点击弹出菜单
  const clickTypeDialog = () => {
    SelectMoreType.showModal({
      selectType: selectType,
      list: categoryList,
      onConfirmClick: v => {
        // ToastController.showLoading();
        setSelectType(v);
        setPage(1);
      },
      onClearClick: () => {
        setSelectType(0);
        setPage(1);
      },
    });
  };

  useEffect(() => {
    // 获取分类列表
    getCategoryListData();

    eventBus.addListener('reloadList', getSeriesListData);
    return () => {
      eventBus.removeListener('reloadList', getSeriesListData);
    }
  }, []);

  useEffect(() => {
    if (selectType) {
      getSeriesListData(selectType);
    } else {
      getSeriesListData();
    }
  }, [selectType, page]);

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#fbfbfb'}}>
      <SearchBtn />
      <TypeNavBar
        courseType={selectType}
        onDialog={clickTypeDialog}
        list={navList}
        onCourseTypeClick={type => {
          // ToastController.showLoading();
          setSelectType(type === selectType ? 0 : type);
          setPage(1);
        }}
      />
      <FlatList
        data={seriesList}
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
              child={<Text style={styles.videoInfo}>{item.playsCount} plays</Text>}
              episodes={item.category}
            />
          </View>
        )}
        onEndReached={() => {
          hasMoreData && setPage(page + 1);
        }}
        onRefresh={() => {
          setRefreshing(true);
          if (page === 1) {
            if (selectType) {
              getSeriesListData(selectType);
            } else {
              getSeriesListData();
            }
          } else {
            setPage(1);
          }
        }}
      />
    </PageRoot>
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
  loadFooterText: {
    lineHeight: 30,
    textAlign: 'center',
    fontSize: 14,
    color: '#ccc',
  },
});
