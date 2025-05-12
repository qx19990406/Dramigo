// 剧集视频播放组件
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {SingleTouchable} from '../../components/SingleTouchable';
import ArrowBlack from '../../assets/topBar/arrow_black.png';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomVideoPlayer from '../../components/CustomVideoPlayer';
import {useNavigation} from '@react-navigation/native';
import useUserData from '../../hooks/useUserData';
import {ToastController} from '../../components/modal/ToastModal';
import {collectApi, disCollectApi, disLikeApi, likeApi} from '../../api/series';
import lodash from 'lodash';
import eventBus from '../../utils/eventBus';
import ReviewsList from '../../components/ReviewsList';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function DramVideoPlay({
  title,
  description,
  videoUrl,
  currentIndex,
  index,
  isPlay,
  commentsCount,
  isLike,
  isFavorite,
  totalEpisodeCount,
  likesCount,
  seriesId,
  onSelectEpisode,
}) {
  const {isLogin} = useUserData();
  const navigation = useNavigation();
  const {top, bottom} = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClear, setIsClear] = useState(false); // 是否释放视频资源

  useEffect(() => {
    return navigation.addListener('blur', () => {
      setIsClear(true);
    });
  }, [navigation]);

  useEffect(() => {
    setIsClear(Math.abs(currentIndex - index) >= 1);
  }, [currentIndex, index]);

  // 剧集评论管理
  const clickReviewsList = () => {
    ReviewsList.showModal({
      seriesId: seriesId,
      onReload: () => {}
    })
  }

  // 点赞剧集(还需要添加数据更新操作, 但需要避免列表重绘)
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
          } else {
            ToastController.showError(message || 'Like failed!');
          }
        })
        .catch(() => {
          ToastController.showError('Like failed!');
        });
    }
  }, 3000);

  // 收藏剧集(还需要添加数据更新操作, 但需要避免列表重绘)
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
    <View style={{...styles.videoWrapper, height: screenHeight + top - bottom}}>
      {/*视频播放区*/}
      <View style={{...styles.videoPlay}}>
        {videoUrl ? (
          <CustomVideoPlayer
            videoUrl={videoUrl}
            height={screenHeight + top - bottom}
            width={screenWidth}
            isPlay={isPlay}
            isClear={isClear}
          />
        ) : null}
        <Text style={{...styles.titleStyle, top: top + 8}}>{title}</Text>
        {/*追剧按钮*/}
        <SingleTouchable
          activeOpacity={0.8}
          onPress={() => clickCollectDramigo(seriesId, isFavorite)}
          style={styles.listBtn}>
          <Image
            style={{width: 35, height: 35}}
            source={
              isFavorite
                ? require('../../assets/video/select_star.png')
                : require('../../assets/video/star.png')
            }
          />
        </SingleTouchable>
        {/*评论按钮*/}
        <SingleTouchable
          activeOpacity={0.8}
          onPress={clickReviewsList}
          style={styles.commentBtn}>
          <Image
            style={{width: 32, height: 32}}
            source={require('../../assets/video/comment.png')}
          />
          <Text style={{color: '#fff', fontSize: 14, textAlign: 'center'}}>
            {commentsCount}
          </Text>
        </SingleTouchable>
        {/*收藏按钮*/}
        <SingleTouchable
          activeOpacity={0.8}
          onPress={() => clickIsLikeDram(seriesId, isLike)}
          style={styles.likeBtn}>
          <Image
            style={{width: 32, height: 32}}
            source={
              isLike
                ? require('../../assets/video/select_like.png')
                : require('../../assets/video/like.png')
            }
          />
          <Text style={{color: '#fff', fontSize: 14, textAlign: 'center'}}>
            {likesCount}
          </Text>
        </SingleTouchable>
        {/*短剧简介*/}
        <View style={styles.videoInfo}>
          <Text
            numberOfLines={isExpanded ? undefined : 2}
            style={{color: '#fff', fontSize: 12}}>
            {description}
          </Text>
          {description.length > 90 && (
            <SingleTouchable onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={{color: '#FC4A12', fontSize: 14}}>
                {isExpanded ? 'Close text' : 'View more'}
              </Text>
            </SingleTouchable>
          )}
        </View>
      </View>
      {/*底部选择剧集*/}
      <View style={styles.bottom}>
        <SingleTouchable onPress={onSelectEpisode} style={styles.select}>
          <Text style={{color: '#fff', fontSize: 18, fontWeight: 700, flex: 1}}>
            selections · {totalEpisodeCount} episodes in total
          </Text>
          <Image style={styles.upArrow} source={ArrowBlack} />
        </SingleTouchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  videoWrapper: {
    zIndex: 100,
    flexDirection: 'column',
    // backgroundColor: '#100000',
  },
  titleStyle: {
    position: 'absolute',
    left: 52,
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
  },
  bottom: {
    backgroundColor: '#100000',
    paddingInline: 12,
    paddingBlock: 16,
  },
  videoPlay: {
    flex: 1,
    position: 'relative',
    borderRadius: 12,
  },
  select: {
    backgroundColor: '#191919',
    paddingBlock: 9,
    paddingInline: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upArrow: {
    width: 24,
    height: 24,
    transform: [{rotate: '90deg'}],
  },
  playBtn: {
    position: 'absolute',
    width: 32,
    height: 37,
    top: '50%',
    left: '60%',
    transform: [{translateX: -50}],
  },
  listBtn: {
    position: 'absolute',
    width: 35,
    height: 35,
    right: 15,
    zIndex: 351,
    bottom: 236,
  },
  commentBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 351,
    bottom: 149,
  },
  likeBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 351,
    bottom: 62,
  },
  videoInfo: {
    bottom: 13,
    left: 17,
    position: 'absolute',
    flexDirection: 'column',
    width: '70%',
    zIndex: 351,
    marginTop: 13,
  },
});
