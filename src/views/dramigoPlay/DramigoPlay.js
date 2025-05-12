import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import PageRoot from '../../components/PageRoot';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBlack from '../../assets/topBar/arrow_black.png';
import MoreIcon from '../../assets/video/more.png';
import {SingleTouchable} from '../../components/SingleTouchable';
import DramVideoPlay from './DramVideoPlay';
import {useNavigation} from '@react-navigation/native';
import {getSeriesDetailApi, videoPlayApi} from '../../api/series';
import {ToastController} from '../../components/modal/ToastModal';
import PagerView from 'react-native-pager-view';
import lodash from 'lodash';
import eventBus from '../../utils/eventBus';
import SelectEpiList from '../../components/SelectEpiList';
import useUserData from '../../hooks/useUserData';
import {store} from '../../redux/persist';
import {setCurrentIdx} from '../../redux/action'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MAX_STORE = 9; // 设置列表最大值
const PAGE_SIZE = 3; // 每页码数

const SERIES_DETAIL = {
  category: '',
  coverImageUrl: '',
  description: '',
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

export default function DramigoPlay({route}) {
  const {id} = route.params;
  const {currentIdx, isLogin} = useUserData();
  const {top, bottom} = useSafeAreaInsets();
  const pagerRef = useRef(null);
  const navigation = useNavigation();
  const [allEpisodes, setAllEpisodes] = useState([]); // 全部剧集列表
  const [dramigoInfo, setDramigoInfo] = useState(SERIES_DETAIL);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!id) return false;
    getSeriesDetailData(id);
  }, [id]);

  useEffect(() => {
    eventBus.addListener('reload', getSeriesDetailData);
    recordPlayNum();
    return () => {
      eventBus.removeListener('reload', getSeriesDetailData);
    };
  }, [dramigoInfo]);

  // 记录播放次数
  const recordPlayNum = () => {
    if (!isLogin) return false;
    if (dramigoInfo.id) {
      videoPlayApi(dramigoInfo.id).finally(() => {
        eventBus.emit('reloadList')
      });
    }
  }

  // 选集
  const clickSelectEpisode = () => {
    SelectEpiList.showModal({
      list: allEpisodes,
      currentIndex: currentIndex,
      onConfirmClick: v => {
        if (currentIndex === v) return false;
        if (pagerRef.current) {
          pagerRef.current.setPage(v);
          setCurrentIndex(v);
        }
      },
    });
  };

  // 获取详情
  const getSeriesDetailData = id => {
    getSeriesDetailApi(id)
      .then(res => {
        const {code, data, message} = res;
        if (code === 0) {
          if (data.episodes && Array.isArray(data.episodes)) {
            setAllEpisodes([...data.episodes]);
          }
          setDramigoInfo({
            ...dramigoInfo,
            ...lodash.pick(data, Object.keys(dramigoInfo)),
          });
        } else {
          ToastController.showError(
            message || 'Failed to obtain episode details!',
          );
        }
      })
      .catch(() => {
        ToastController.showError('Failed to obtain episode details!');
      });
  };

  const onPageSelected = event => {
    const index = event.nativeEvent.position;
    setCurrentIndex(index);
    store.dispatch(setCurrentIdx(index));
  };

  return (
    <PageRoot isSafeTop={false} style={{position: 'relative', zIndex: 1}}>
      <View style={{...styles.dramHeader, marginTop: top + 8}}>
        <SingleTouchable
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 8}}>
          <Image
            style={{width: 24, height: 24, marginRight: 4}}
            source={ArrowBlack}
          />
        </SingleTouchable>
        <SingleTouchable onPress={() => {}} activeOpacity={0.8}>
          {/*<Image*/}
          {/*  style={{width: 24, height: 24, marginRight: 4}}*/}
          {/*  source={MoreIcon}*/}
          {/*/>*/}
        </SingleTouchable>
      </View>
      <View
        style={{
          overflow: 'hidden',
          height: height + top - bottom,
          backgroundColor: '#100000',
        }}>
        {!allEpisodes.length ? null : (
          <PagerView
            ref={pagerRef}
            style={{flex: 1}}
            orientation="vertical"
            initialPage={currentIdx}
            onPageSelected={onPageSelected}>
            {allEpisodes.map((item, index) => (
              <View
                style={{height: height, backgroundColor: '#000'}}
                key={item.id}>
                <DramVideoPlay
                  id={item.id}
                  title={item.title}
                  description={dramigoInfo.description}
                  videoUrl={item.videoUrl}
                  currentIndex={currentIndex}
                  index={index}
                  isPlay={currentIndex === index}
                  commentsCount={dramigoInfo.commentsCount}
                  isLike={dramigoInfo.isLike}
                  isFavorite={dramigoInfo.isFavorite}
                  likesCount={dramigoInfo.likesCount}
                  totalEpisodeCount={dramigoInfo.totalEpisodeCount}
                  seriesId={dramigoInfo.id}
                  onSelectEpisode={clickSelectEpisode}
                />
              </View>
            ))}
          </PagerView>
        )}
      </View>
    </PageRoot>
  );
}

const styles = StyleSheet.create({
  dramHeader: {
    paddingInline: 16,
    position: 'absolute',
    top: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
