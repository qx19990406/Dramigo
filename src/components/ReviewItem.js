import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DefaultAvatar from '../assets/person/user_icon.png';
import {useEffect, useState} from 'react';
import {checkSource} from '../utils';
import {SingleTouchable} from './SingleTouchable';
import LikedIcon from '../assets/video/select_like.png';
import LikeIcon from '../assets/video/likes.png';
import DeleteIcon from '../assets/input/delete.png';
import CloseIcon from '../assets/base/close.png';

export default function ReviewItem({
  user = {},
  num,
  time,
  content,
  isLike,
  id,
  onDelete,
  onLiked,
  onDisLiked,
}) {
  const {nickName, avatar} = user;
  const [checkAvatar, setCheckAvatar] = useState(false);
  const [isRemove, setIsRemove] = useState(false);

  const removeComment = () => {
    onDelete(id);
    setIsRemove(false);
  }

  useEffect(() => {
    if (!avatar) {
      setCheckAvatar(false);
    }
    checkSource(avatar)
      .then(val => setCheckAvatar(val))
      .catch(() => setCheckAvatar(false));
  }, [avatar]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.reviewItem} onLongPress={() => setIsRemove(true)} delayLongPress={500}>
        <Image
          style={styles.avatarBox}
          source={checkAvatar ? {uri: avatar} : DefaultAvatar}
        />
        <View style={styles.reviewContent}>
          <Text style={{color: '#999', fontSize: 10}}>{nickName}</Text>
          <Text style={{color: '#333', fontSize: 12}}>{content}</Text>
          <Text style={{color: '#999', fontSize: 10}}>{time}</Text>
        </View>
      </TouchableOpacity>
      {
        isRemove ?
          <>
            <SingleTouchable onPress={removeComment} style={{ marginRight: 10 }}>
              <Image style={{width: 16, height: 16}} source={DeleteIcon} />
            </SingleTouchable>
            <SingleTouchable onPress={() => setIsRemove(false)}>
              <Image style={{width: 16, height: 16}} source={CloseIcon} />
            </SingleTouchable>
          </> :
          <SingleTouchable
            onPress={() => {
              if (isLike) {
                onDisLiked(id);
              } else {
                onLiked(id);
              }
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{width: 16, height: 16, marginRight: 7}}
              source={isLike ? LikedIcon : LikeIcon}
            />
            <Text style={{color: '#999', fontSize: 10}}>{num}</Text>
          </SingleTouchable>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  reviewItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewContent: {
    flex: 1,
    paddingInline: 6,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 32,
    marginRight: 17,
  },
});
