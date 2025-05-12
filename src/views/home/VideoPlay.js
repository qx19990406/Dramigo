import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SingleTouchable} from '../../components/SingleTouchable';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomVideoPlayer from '../../components/CustomVideoPlayer';
import useUserData from '../../hooks/useUserData';
import {ToastController} from '../../components/modal/ToastModal';
import {collectApi, disCollectApi, disLikeApi, likeApi} from '../../api/series';
import lodash from 'lodash';
import eventBus from '../../utils/eventBus';
import ReviewsList from '../../components/ReviewsList';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// 视频滑动播放组件
export default function VideoPlay({
  id,
  currentIndex,
  index,
  isPlay, // 是否播放
  title,
  tags = [],
  description,
  coverImageUrl,
  commentsCount,
  likesCount,
  isLike,
  isFavorites,
  totalEpisodeCount,
  episode,
}) {
  const navigation = useNavigation();
  const {isLogin} = useUserData();
  const {bottom, top} = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClear, setIsClear] = useState(false);

  useEffect(() => {
    setIsClear(Math.abs(currentIndex - index) >= 2);
  }, [currentIndex, index]);

  // 剧集评论管理
  const clickReviewsList = () => {
    ReviewsList.showModal({
      seriesId: id,
      onReload: () => {}
    });
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
        .then((res) => {
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
        })
    } else {
      collectApi(id).then((res) => {
        const {code, message} = res;
        if (code === 0) {
          ToastController.showSuccess('Collected successfully!');
          eventBus.emit('reload', id);
        } else {
          ToastController.showError(message || 'Collected failed!');
        }
      }).catch(() => {
        ToastController.showError('Collected failed!');
      })
    }
  }, 3000);

  return (
    <View
      style={{
        ...styles.videoWrapper,
        backgroundColor: '#100000',
        height: screenHeight + top - bottom - 75,
      }}>
      {episode && episode.videoUrl ? (
        <CustomVideoPlayer
          videoUrl={episode.videoUrl}
          previewUrl={coverImageUrl}
          height={screenHeight + top - bottom - 75}
          width={screenWidth}
          isPlay={isPlay}
          isClear={isClear}
        />
      ) : null}
      {isExpanded && (
        <SingleTouchable
          activeOpacity={0.8}
          onPress={() => setIsExpanded(false)}
          style={styles.coverDialog}>
          <View style={{width: '100%', height: '100%'}} />
        </SingleTouchable>
      )}
      <SingleTouchable
        activeOpacity={0.8}
        onPress={() => clickCollectDramigo(id, isFavorites)}
        style={styles.listBtn}>
        <Image
          style={{width: 35, height: 35}}
          source={
            isFavorites
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
        onPress={() => clickIsLikeDram(id, isLike)}
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
      {/*视频信息*/}
      <View style={styles.videoInfo}>
        <View style={styles.videoInfoTitle}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{color: '#fff', fontSize: 16, marginRight: 3}}>
            {title}
          </Text>
          <SingleTouchable
            onPress={() => navigation.push('dramigoDetail', {id})}
            style={{width: 20, height: 20}}
            activeOpacity={0.8}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../../assets/video/right_icon.png')}
            />
          </SingleTouchable>
        </View>
        {/*短剧标签*/}
        <View style={styles.tagList}>
          {tags.map((item, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={{color: '#fff', fontSize: 12}}>{item.text}</Text>
            </View>
          ))}
        </View>
        {/*短剧简介*/}
        <View style={styles.textIntroduction}>
          <Text
            numberOfLines={isExpanded ? undefined : 2}
            style={{color: '#fff', fontSize: 12}}>
            {description}
          </Text>
          {description.length > 113 && (
            <SingleTouchable onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={{color: '#FC4A12', fontSize: 14}}>
                {isExpanded ? 'Close text' : 'View more'}
              </Text>
            </SingleTouchable>
          )}
        </View>
        {/*短剧选集*/}
        <SingleTouchable
          onPress={() => navigation.push('dramigoPlay', {id: id, idx: null})}
          activeOpacity={0.8}
          style={styles.selectEpi}>
          <Text style={{color: '#fff', fontSize: 12}}>
            Total {totalEpisodeCount} episodes
          </Text>
          <Image
            style={{width: 18, height: 18}}
            source={require('../../assets/video/right_icon.png')}
          />
        </SingleTouchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coverDialog: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0000001b',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 350,
  },
  videoWrapper: {
    position: 'relative',
    width: screenWidth,
    zIndex: 100,
  },
  playBtn: {
    position: 'absolute',
    width: 32,
    height: 37,
    top: '50%',
    left: '60%',
    transform: [{translateX: -50}, {translateY: -50}],
  },
  listBtn: {
    position: 'absolute',
    width: 35,
    height: 35,
    right: 15,
    zIndex: 351,
    bottom: 276,
  },
  commentBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 351,
    bottom: 189,
  },
  likeBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 551,
    bottom: 102,
  },
  videoInfo: {
    bottom: 13,
    left: 17,
    position: 'absolute',
    flexDirection: 'column',
    width: '100%',
    zIndex: 221,
  },
  videoInfoTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  tagList: {
    marginTop: 9,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '80%',
  },
  tagItem: {
    backgroundColor: '#ffffff4d',
    borderRadius: 3,
    paddingInline: 8,
    paddingBlock: 2,
  },
  selectEpi: {
    width: 180,
    paddingInline: 8,
    paddingBlock: 6,
    backgroundColor: '#FFFFFF4D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    marginTop: 11,
  },
  textIntroduction: {
    marginTop: 13,
    width: '80%',
  },
});
