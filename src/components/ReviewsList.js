import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SingleTouchable} from './SingleTouchable';
import {useEffect, useState} from 'react';
import ReviewItem from './ReviewItem';
import Placeholder from './placeholder/Placeholder';
import {BaseModalController} from './modal/BaseModal';
import {
  createCommentApi,
  reviewsListApi,
  deleteCommentApi,
  dislikeCommentApi,
  likeCommentApi,
} from '../api/reviews';
import {ToastController} from './modal/ToastModal';
import useUserData from '../hooks/useUserData';
import lodash from 'lodash';
import eventBus from '../utils/eventBus';

const {width, height} = Dimensions.get('window');
const PAGE_SIZE = 10;

function ModalView({hidden, seriesId, onReload}) {
  const {isLogin} = useUserData();
  const [reviewText, setReviewText] = useState('');
  const [total, setTotal] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [isFirst, setIsFirst] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);

  // 创建评论
  const createComment = () => {
    if (!isLogin) {
      ToastController.showAlert('You can only post comments after logging in');
      return false;
    }
    if (!reviewText) {
      ToastController.showAlert('Please enter the comment content');
      return false;
    }
    createCommentApi({
      content: reviewText,
      seriesId: seriesId,
    })
      .then(res => {
        const {code, message} = res;
        if (code === 0) {
          if (page === 1) {
            getReviewsListData();
          } else {
            setPage(1);
          }
          onReload()
          eventBus.emit('reload', seriesId)
        } else {
          ToastController.showError(message || 'Failed to create comment!');
        }
      })
      .catch(() => ToastController.showError('Failed to create comment!'))
      .finally(() => setReviewText(''));
  };

  // 删除评论
  const deleteComment = id => {
    deleteCommentApi({
      id: id,
      seriesId: seriesId,
    })
      .then(res => {
        const {code, message} = res;
        if (code === 0) {
          if (page === 1) {
            getReviewsListData();
          } else {
            setPage(1);
          }
          onReload()
          eventBus.emit('reload', seriesId)
        } else {
          ToastController.showError(message || 'Failed to delete comment!');
        }
      })
      .catch(() => ToastController.showError('Failed to delete comment!'));
  };

  // 点赞评论
  const likeComment = lodash.throttle(id => {
    if (!isLogin) {
      return ToastController.showAlert('The current operation requires login!');
    }
    likeCommentApi({
      id: id,
      seriesId: seriesId,
    })
      .then(res => {
        const {code, message} = res;
        if (code === 0) {
          if (page === 1) {
            getReviewsListData();
          } else {
            setPage(1);
          }
        } else {
          ToastController.showError(message || 'Like failed!');
        }
      })
      .catch(() => ToastController.showError('Like failed!'));
  }, 3000);

  // 取消点赞评论
  const dislikeComment = lodash.throttle(id => {
    if (!isLogin) {
      return ToastController.showAlert('The current operation requires login!');
    }
    dislikeCommentApi({
      id: id,
      seriesId: seriesId,
    })
      .then(res => {
        const {code, message} = res;
        if (code === 0) {
          if (page === 1) {
            getReviewsListData();
          } else {
            setPage(1);
          }
        } else {
          ToastController.showError(message || 'Cancel like failed!');
        }
      })
      .catch(() => ToastController.showError('Cancel like failed!'));
  }, 3000);

  // 获取评论列表
  const getReviewsListData = () => {
    reviewsListApi({
      page: page,
      size: PAGE_SIZE,
      seriesId: seriesId,
    })
      .then(res => {
        const {code, data, message} = res;
        if (code === 0) {
          if (page === 1) {
            setReviewList(data.list);
          } else {
            setReviewList([...data.list, ...reviewList]);
          }
          setHasMoreData(
            !data.list.length
              ? false
              : data.list.length + reviewList.length < data.total,
          );
          setTotal(data.total);
        } else {
          ToastController.showError(
            message || 'Failed to obtain comment data!',
          );
        }
      })
      .catch(() => {
        ToastController.showError('Failed to obtain comment data!')
      });
  };

  useEffect(() => {
    getReviewsListData();
  }, [page]);

  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <SingleTouchable
          style={styles.closeBtn}
          onPress={hidden}
          activeOpacity={0.8}>
          <Image
            style={{width: 24, height: 24}}
            source={require('../assets/base/arrow_down.png')}
          />
        </SingleTouchable>
        <Text style={styles.titleStyle}>{`Reviews(${total})`}</Text>
        <View />
      </View>
      <FlatList
        data={reviewList}
        keyExtractor={(item, index) => `${index}`}
        horizontal={false}
        initialNumToRender={10}
        contentContainerStyle={styles.reviewsList}
        onEndReachedThreshold={0}
        ListEmptyComponent={
          <Placeholder
            text={'No reviews yet!'}
            isFirst={isFirst}
            loadingStyle={{marginTop: 0, marginBottom: 80}}
            noDataStyle={{marginTop: 0}}
          />
        }
        renderItem={({item, index}) => (
          <View style={styles.courseItemStyle}>
            <ReviewItem
              id={item.id}
              user={item.user}
              content={item.content}
              isLike={item.isLike}
              num={item.likesCount}
              time={item.createdAt}
              onLiked={likeComment}
              onDisLiked={dislikeComment}
              onDelete={deleteComment}
            />
          </View>
        )}
        onEndReached={() => {
          hasMoreData && setPage(page + 1);
        }}
      />
      <View style={styles.bottomBox}>
        <View style={styles.reviewInputStyle}>
          <Image
            style={{width: 14, height: 14, marginLeft: 8}}
            source={require('../assets/input/write_icon.png')}
          />
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder={isLogin ? 'Write your review here...' : 'Comment after logging in!'}
            placeholderTextColor={'#999'}
            editable={isLogin}
            style={{flex: 1, paddingRight: 18, height: 44}}
          />
        </View>
        {
          isLogin ? <SingleTouchable onPress={createComment}>
            <Text style={{ fontSize: 14, color: '#999', marginLeft: 4 }}>Send</Text>
          </SingleTouchable> : null
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: width,
    maxHeight: height * 0.9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
    zIndex: 10,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginInline: 8,
  },
  closeBtn: {
    width: 24,
    height: 24,
    zIndex: 20,
    marginTop: 8,
  },
  titleStyle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
    paddingRight: 16,
  },
  reviewsList: {
    paddingBottom: 85,
    marginInline: 25,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#0000003F',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingInline: 22,
    gap: 16,
    paddingBlock: 20,
  },
  reviewInputStyle: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 44,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    flex: 1,
  },
  courseItemStyle: {
    height: 75,
    marginBlock: 16,
    marginInline: 12,
  },
});

export default function ReviewsList() {}

ReviewsList.showModal = ({seriesId, onReload}) => {
  let component = (
    <ModalView hidden={BaseModalController.hidden} seriesId={seriesId} onReload={onReload} />
  );
  BaseModalController.show(component, 'bottom', true, false);
};
