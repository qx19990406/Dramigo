import PageRoot from '../../components/PageRoot';
import React, {useEffect, useState} from 'react';
import StickyTopNav from '../../components/StickyTop';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SingleTouchable} from '../../components/SingleTouchable';
import DramigoItem from '../../components/DramigoItem';
import {
  collectApi,
  disCollectApi,
  disLikeApi,
  getSeriesDetailApi,
  getSeriesListApi,
  likeApi,
} from '../../api/series';
import {ToastController} from '../../components/modal/ToastModal';
import {checkSource, exportRandomPage, jsonStringParse} from '../../utils';
import useVideoData from '../../hooks/useVideoData';
import {store} from '../../redux/persist';
import {setCurrentIdx, updateVideoTotal} from '../../redux/action';
import {useNavigation} from '@react-navigation/native';
import ImageError from '../../assets/base/image-error.png';
import useUserData from '../../hooks/useUserData';
import lodash from 'lodash';
import ReviewsList from '../../components/ReviewsList';
import eventBus from '../../utils/eventBus';

const screenWidth = Dimensions.get('window').width;
const PAGE_SIZE = 9;

const SERIES_DETAIL = {
  category: '',
  coverImageUrl: '',
  description: '',
  episodes: [],
  favoritesCount: 0,
  id: 0,
  isRecommend: false,
  commentsCount: 0,
  likesCount: 0,
  playsCount: 0,
  title: '',
  tags: '',
  status: '',
  totalEpisodeCount: 0,
  isLike: false,
  isFavorite: false,
};

// 短剧详情
export default function DramigoDetail({route, navigation}) {
  const {id} = route.params;
  const {currentIdx} = useUserData();
  // const [selectEpi, setSelectEpi] = useState(currentIdx);
  const [dramigoDetail, setDramigoDetail] = useState(SERIES_DETAIL);
  const {listTotal} = useVideoData();
  const [recommendList, setRecommendList] = useState([]); // 获取推荐剧集列表
  // 检测资源路径是否正确
  const [checklineUrl, setChecklineUrl] = useState(false);
  const {isLogin} = useUserData();

  useEffect(() => {
    if (id) {
      getSeriesDetail();
      getRecommendList();
    }
    return () => {
      store.dispatch(setCurrentIdx(0));
    }
  }, [id]);

  useEffect(() => {
    if (!dramigoDetail.coverImageUrl) {
      setChecklineUrl(false);
    } else {
      checkSource(dramigoDetail.coverImageUrl)
        .then(res => setChecklineUrl(res))
        .catch(() => {
          setChecklineUrl(false);
        });
    }
  }, [dramigoDetail.coverImageUrl]);

  // 剧集评论管理
  const clickReviewsList = () => {
    ReviewsList.showModal({
      seriesId: id,
      onReload: getSeriesDetail,
    });
  };

  // 获取剧集详情
  function getSeriesDetail() {
    getSeriesDetailApi(id)
      .then(res => {
        const {code, data, message} = res;
        if (code === 0) {
          setDramigoDetail(prev => Object.assign({}, prev, data));
          store.dispatch(setCurrentIdx(0));
        } else {
          ToastController.showError(message || 'Failed to obtain details!');
        }
      })
      .catch(() => {
        ToastController.showError('Failed to obtain details!');
      });
  }

  // 获取推荐剧集列表
  function getRecommendList() {
    const randomPage = exportRandomPage(listTotal, PAGE_SIZE);
    getSeriesListApi({
      page: randomPage,
      size: PAGE_SIZE,
      id: id,
    })
      .then(res => {
        const {code, data, message} = res;
        if (code === 0) {
          setRecommendList(data.list);
          if (data.total !== listTotal) {
            store.dispatch(updateVideoTotal(data.total));
          }
        } else {
          ToastController.showError(message || 'Failed to category the list!');
        }
      })
      .catch(() => {
        ToastController.showError('Failed to category the list!');
      });
  }

  // 点赞剧集
  const clickIsLikeDram = lodash.throttle((id, isLike) => {
    if (!isLogin) {
      return ToastController.showAlert('please log in first!');
    }
    if (isLike) {
      disLikeApi(id)
        .then(res => {
          const {code, message} = res;
          if (code === 0) {
            ToastController.showSuccess('Cancel liked successfully!');
            eventBus.emit('reload', id);
            getSeriesDetail();
          } else {
            ToastController.showError(message || 'Cancel liked failed!');
          }
        })
        .catch(() => {
          ToastController.showError('Cancel liked failed!');
        });
    } else {
      likeApi(id)
        .then(res => {
          const {code, message} = res;
          if (code === 0) {
            ToastController.showSuccess('Liked successfully!');
            eventBus.emit('reload', id);
            getSeriesDetail();
          } else {
            ToastController.showError(message || 'Like failed!');
          }
        })
        .catch(() => {
          ToastController.showError('Like failed!');
        });
    }
  }, 3000);

  // 收藏剧集
  const clickCollectDramigo = lodash.throttle((id, isLikeisFavorites) => {
    if (!isLogin) {
      return ToastController.showAlert('please log in first!');
    }
    if (isLikeisFavorites) {
      disCollectApi(id)
        .then(res => {
          const {code, message} = res;
          if (code === 0) {
            ToastController.showSuccess('Cancel collected successfully!');
            eventBus.emit('reload', id);
            getSeriesDetail();
          } else {
            ToastController.showError(message || 'Cancel collected failed!');
          }
        })
        .catch(() => {
          ToastController.showError('Cancel collected failed!');
        });
    } else {
      collectApi(id)
        .then(res => {
          const {code, message} = res;
          if (code === 0) {
            ToastController.showSuccess('Collected successfully!');
            eventBus.emit('reload', id);
            getSeriesDetail();
          } else {
            ToastController.showError(message || 'Collected failed!');
          }
        })
        .catch(() => {
          ToastController.showError('Collected failed!');
        });
    }
  }, 3000);

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#100000'}}>
      <StickyTopNav theme={'dark'} showBack={true} />
      {/*短剧信息*/}
      <View style={styles.dramInfo}>
        <Image
          style={{width: 68, height: 97}}
          source={
            checklineUrl ? {uri: dramigoDetail.coverImageUrl} : ImageError
          }
        />
        <View
          style={{
            marginLeft: 18,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.title}>{dramigoDetail.title}</Text>
          <Text style={styles.subTitle}>
            {dramigoDetail.status} · Total {dramigoDetail.episodes.length}{' '}
            episodes
          </Text>
          <Text style={styles.playsText}>{dramigoDetail.playsCount}Plays</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{flexDirection: 'column', position: 'relative'}}>
        {/*短剧标签*/}
        <View style={styles.tagList}>
          {jsonStringParse(dramigoDetail.tags).map((item, index) => (
            <View key={`${index}`} style={styles.tagItem}>
              <Text style={{color: '#fff', fontSize: 12}}>{item.text}</Text>
            </View>
          ))}
        </View>
        {/*短剧介绍*/}
        <Text style={styles.dramDetails}>{dramigoDetail.description}</Text>
        {/*短剧选集*/}
        <Text
          style={{
            marginTop: 8,
            color: '#fff',
            marginLeft: 18,
            fontSize: 14,
            lineHeight: 16,
          }}>
          Select Episode
        </Text>
        <View style={styles.episodeList}>
          {dramigoDetail.episodes.map((item, index) => (
            <EpisodeItem
              key={index}
              order={item.order}
              idx={index}
              isSelect={currentIdx === index}
              seriesId={id}
            />
          ))}
        </View>
        {/*其他推荐短剧*/}
        <Text
          style={{
            marginTop: 23,
            color: '#fff',
            marginLeft: 18,
            fontSize: 14,
            lineHeight: 16,
          }}>
          You might also like
        </Text>
        <View style={styles.otherDram}>
          {recommendList.map((item, index) => (
            <View key={index} style={styles.itemStyle}>
              <DramigoItem
                id={item.id}
                name={item.title}
                idx={index}
                preview={item.coverImageUrl}
                episodes={item.category}
                child={
                  <Text style={styles.videoInfo}>{item.playsCount} plays</Text>
                }
                theme={'dark'}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {/*底部栏*/}
      <View style={styles.fixedStyle}>
        {/*喜欢*/}
        <SingleTouchable
          activeOpacity={0.8}
          onPress={() =>
            clickIsLikeDram(dramigoDetail.id, dramigoDetail.isLike)
          }
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{width: 25, height: 25, marginRight: 4}}
            source={
              dramigoDetail.isLike
                ? require('../../assets/video/select_like.png')
                : require('../../assets/video/like.png')
            }
          />
          <Text style={{color: '#fff', fontSize: 12}}>
            {dramigoDetail.likesCount}
          </Text>
        </SingleTouchable>
        {/*评论*/}
        <SingleTouchable
          activeOpacity={0.8}
          onPress={clickReviewsList}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{width: 25, height: 25, marginRight: 4}}
            source={require('../../assets/video/comment.png')}
          />
          <Text style={{color: '#fff', fontSize: 12}}>
            {dramigoDetail.commentsCount}
          </Text>
        </SingleTouchable>
        {/*追剧*/}
        <SingleTouchable
          activeOpacity={0.8}
          onPress={() =>
            clickCollectDramigo(dramigoDetail.id, dramigoDetail.isFavorite)
          }
          style={{width: 27, height: 27}}>
          <Image
            style={{width: 25, height: 25}}
            source={
              dramigoDetail.isFavorite
                ? require('../../assets/video/select_star.png')
                : require('../../assets/video/star.png')
            }
          />
        </SingleTouchable>
        {/*播放*/}
        <SingleTouchable
          onPress={() => navigation.push('dramigoPlay', {id})}
          activeOpacity={0.8}
          style={styles.playIcon}>
          <Image
            style={{width: 25, height: 25, marginRight: 8}}
            source={require('../../assets/video/play.png')}
          />
          <Text style={{color: '#fff', fontSize: 18}}>Play</Text>
        </SingleTouchable>
      </View>
    </PageRoot>
  );
}

const EpisodeItem = ({isSelect, order, seriesId, idx}) => {
  const navigation = useNavigation();

  return (
    <SingleTouchable
      style={{
        ...styles.episodeItem,
        backgroundColor: isSelect ? '#FF4A564D' : '#F7F7F7FF',
      }}
      onPress={() => {
        navigation.push('dramigoPlay', {id: seriesId});
        store.dispatch(setCurrentIdx(idx));
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

const styles = StyleSheet.create({
  dramInfo: {
    flexDirection: 'row',
    marginTop: 18,
    marginInline: 24,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#FFAA00FF',
    fontWeight: 700,
    lineHeight: 20,
    marginRight: 44,
  },
  subTitle: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 22,
  },
  playsText: {
    fontWeight: 700,
    fontSize: 12,
    color: '#fff',
    lineHeight: 22,
  },
  tagList: {
    marginInline: 24,
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagItem: {
    backgroundColor: '#ffffff4d',
    borderRadius: 3,
    paddingInline: 8,
    paddingBlock: 2,
  },
  dramDetails: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 14,
    marginTop: 13,
    textAlign: 'left',
    marginLeft: 24,
    marginRight: 19,
    marginBottom: 9,
  },
  episodeList: {
    marginTop: 15,
    marginInline: 20,
    columnGap: 8,
    rowGap: 13,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  episodeItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    width: 45,
    height: 45,
  },
  otherDram: {
    marginTop: 15,
    marginInline: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 70,
  },
  itemStyle: {
    width: (screenWidth - 4 * 16) * 0.33,
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
  fixedStyle: {
    width: screenWidth,
    backgroundColor: '#191919',
    height: 63,
    shadowColor: '#0000003F',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.5,
    position: 'absolute',
    bottom: 0,
    paddingInline: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBlock: 4,
    paddingInline: 30,
    backgroundColor: 'rgb(252, 74, 18)',
    borderRadius: 30,
  },
});
