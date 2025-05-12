import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import PageRoot from '../../components/PageRoot';
import VideoPlay from './VideoPlay';
import {SingleTouchable} from '../../components/SingleTouchable';
import {getSeriesDetailApi, getSeriesListApi} from '../../api/series';
import {store} from '../../redux/persist';
import {updateVideoTotal, userQuickLogin} from '../../redux/action';
import useVideoData from '../../hooks/useVideoData';
import {ToastController} from '../../components/modal/ToastModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {jsonStringParse} from '../../utils';
import PagerView from 'react-native-pager-view';
import eventBus from '../../utils/eventBus';
import useDeviceInfo from '../../hooks/useDeviceInfo';
import {quickLoginApi} from '../../api/user';

const {height} = Dimensions.get('window');
const MAX_STORE = 9; // 设置缓存列表最大值
const PAGE_SIZE = 3; // 每页码数

export default function Home({navigation}) {
  const pagerRef = useRef(null);
  const {deviceSN} = useDeviceInfo();
  const {top, bottom} = useSafeAreaInsets();
  const [currentId, setCurrentId] = useState(0);
  const {listTotal} = useVideoData();
  const [videoList, setVideoList] = useState([]); // 视频信息列表
  const [page, setPage] = useState(1); // 当页数
  const [maxPage, setMaxPage] = useState(1);

  // 修改页码更新数据
  useEffect(() => {
    getSeriesListData();
  }, [page]);

  useEffect(() => {
    if (deviceSN) {
      quickLoginApi(deviceSN).then((res) => {
        if (res && res.code === 0) {
          store.dispatch(userQuickLogin(res.data));
        }
      });
    }
  }, [deviceSN]);

  useLayoutEffect(() => {
    eventBus.addListener('reload', reloadVideoList);

    return () => {
      eventBus.removeListener('reload', reloadVideoList);
    };
  }, [videoList]);

  // 监听点赞和收藏按钮的点击，然后获取详情数据更新到列表
  const reloadVideoList = id => {
    const keys = ['commentsCount', 'likesCount', 'playsCount', 'isLike'];
    // 通过id查询要修改的数据
    const isReloadItem = videoList.some(item => item.id === id);
    if (!isReloadItem) {
      return false;
    }
    // 查找到相关数据后请求该项数据详情
    getSeriesDetailApi(id)
      .then(res => {
        const {code, message, data} = res;
        if (code === 0) {
          const list = videoList.map(item => {
            if (item.id === id) {
              keys.forEach(key => {
                item[key] = data[key];
              });
              item['isFavorites'] = data['isFavorite']
              return item;
            } else return item;
          });
          setVideoList([...list]);
        } else {
          ToastController.showError(message || 'Failed to obtain details!');
        }
      })
      .catch(() => {
        ToastController.showError('Failed to obtain details!');
      });
  };

  // 监听分页变化
  const onPageSelected = event => {
    const index = event.nativeEvent.position;
    setCurrentId(index);
    // 如果滑动到最后一页，加载更多数据
    if (index === videoList.length - 1) {
      setPage(page + 1 > maxPage ? 1 : page + 1);
    }
  };

  // 获取剧集列表 (控制page实现分页加载)
  const getSeriesListData = () => {
    getSeriesListApi({
      page: page,
      size: PAGE_SIZE,
    })
      .then(res => {
        const {data, code, message} = res;
        if (listTotal !== data.total) {
          store.dispatch(updateVideoTotal(data.total));
        }
        if (code === 0) {
          // 超出最大值后删除部分数据
          if (videoList.length + data.list.length > MAX_STORE) {
            setVideoList([...videoList.slice(PAGE_SIZE), ...data.list]);
          } else {
            setVideoList([...videoList, ...data.list]);
          }
          setMaxPage(Math.ceil(data.total / PAGE_SIZE));
        } else {
          ToastController.showError(message || 'Failed to retrieve list data!');
        }
      })
      .catch(() => {
        ToastController.showError('Failed to retrieve list data!');
      });
  };

  return (
    <PageRoot isSafeTop={false} style={{position: 'relative'}}>
      <SingleTouchable
        style={styles.searchIcon}
        onPress={() => navigation.push('search')}
        activeOpacity={0.8}>
        <Image
          style={{width: 24, height: 24}}
          source={require('../../assets/base/search_light.png')}
        />
      </SingleTouchable>
      <View style={{overflow: 'hidden', height: height + top - 75 - bottom}}>
        <PagerView
          style={{flex: 1}}
          orientation="vertical"
          ref={pagerRef}
          initialPage={0}
          onPageSelected={onPageSelected}>
          {videoList.map((item, index) => (
            <View style={{height: height}} key={item.id}>
              <VideoPlay
                id={item.id}
                currentIndex={currentId}
                index={index}
                isPlay={currentId === index}
                title={item.title}
                tags={jsonStringParse(item.tags)}
                description={item.description}
                coverImageUrl={item.coverImageUrl}
                commentsCount={item.commentsCount}
                likesCount={item.likesCount}
                isLike={item.isLike}
                isFavorites={item.isFavorites}
                totalEpisodeCount={item.totalEpisodeCount}
                episode={item.episode}
              />
            </View>
          ))}
        </PagerView>
      </View>
    </PageRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    height: height - 75,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    right: 20,
    top: 60,
    zIndex: 410,
  },
});
