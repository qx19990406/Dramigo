import React, {useEffect} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import PageRoot from '../../components/PageRoot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PCNavItem from './components/PCNavItem';
import {SingleTouchable} from '../../components/SingleTouchable';
import DeleteAccountModal from '../../components/modal/DeleteAccountModal';
import useUserData from '../../hooks/useUserData';
import {userDeleteAccount, userGetInfoApi, userLogoutApi} from '../../api/user';
import {requestVersion} from '../../api/system';
import {userInfo, userLogout} from '../../redux/action';
import {store} from '../../redux/persist';
import {ToastController} from '../../components/modal/ToastModal';
import {isNeedUpdate} from '../../utils';
import {BaseModalController} from '../../components/modal/BaseModal';
import UpdateVersionModal from '../../components/modal/UpdateVersionModal';

/**
 * 个人中心页
 * */
export default function PersonalCenter({navigation}) {
  const {top} = useSafeAreaInsets();
  const {isLogin, userId, email, nickname, version} = useUserData();

  // 点击删除账户
  const onClickDeleteAccount = () => {
    DeleteAccountModal.showModal({
      title: 'Delete your account',
      onConfirmClick: v => {
        userDeleteAccount({password: v})
          .then(res => {
            if (res.code === 0) {
              ToastController.showSuccess('Account deleted successfully!');
              store.dispatch(userLogout());
            } else {
              ToastController.showError(
                res.message || 'Error while deleting account!',
              );
            }
          })
          .catch(() => {
            ToastController.showError('Error while deleting account!');
          });
      },
      onClearClick: () => {},
    });
  };

  // 点击更新版本
  const updateVersion = () => {
    requestVersion()
      .then(res => {
        switch (Platform.OS) {
          case 'ios':
            if (isNeedUpdate(res.data.ios.version)) {
              BaseModalController.show(
                <UpdateVersionModal
                  num={res.data.ios.version}
                  url={res.data.ios.link}
                />,
                'center',
                false,
                false,
              );
            } else {
              ToastController.showAlert('The latest version!');
            }
            break;
          case 'android':
            if (isNeedUpdate(res.data.android.version)) {
              BaseModalController.show(
                <UpdateVersionModal
                  num={res.data.android.version}
                  url={res.data.android.link}
                />,
                'center',
                false,
                false,
              );
            } else {
              ToastController.showAlert('The latest version!');
            }
            break;
          default:
        }
      })
      .catch(() => {});
  };

  // 退出登录
  const logout = () => {
    userLogoutApi()
      .then(res => {
        if (res.code === 0) {
          store.dispatch(userLogout());
          ToastController.showSuccess('already logout!');
        } else {
          ToastController.showError(res.message || 'logout failed!');
        }
      })
      .catch(() => {
        ToastController.showError('logout failed!');
      });
  };

  // 跳转注册
  const goToRegister = () => {
    navigation.push('register');
  };

  // 跳转登录
  const goToLogin = () => {
    if (!isLogin) {
      navigation.push('login', {
        userEmail: '',
      });
    }
  };

  // 获取用户信息
  const requestUserInfo = () => {
    userGetInfoApi()
      .then(res => {
        if (res.code === 0) {
          store.dispatch(userInfo(res.data));
        } else {
          ToastController.showError(
            res.message || 'Failed to obtain user information!',
          );
        }
      })
      .catch(() => {
        ToastController.showError('Failed to obtain user information!');
      });
  };

  useEffect(() => {
    if (isLogin && !userId) {
      requestUserInfo();
    }
  }, [isLogin, userId]);

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#f5f5f5'}}>
      {/*用户头像和用户名*/}
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          marginTop: top,
        }}>
        <Image
          source={require('../../assets/person/user_icon.png')}
          style={styles.avatar}
        />
        <SingleTouchable onPress={goToLogin} activeOpacity={isLogin ? 1 : 0.5}>
          <Text style={styles.titleStyle}>{isLogin ? nickname : 'Login'}</Text>
          <Text style={styles.emailStyle}>{email ? email : '——'}</Text>
        </SingleTouchable>
      </View>
      <ScrollView>
        {/*<PCNavItem*/}
        {/*  testID={'btn-11'}*/}
        {/*  icon={require('../../assets/person/rat.png')}*/}
        {/*  text={'Rating'}*/}
        {/*/>*/}
        {/*<PCNavItem*/}
        {/*  testID={'btn-12'}*/}
        {/*  icon={require('../../assets/person/about.png')}*/}
        {/*  text={'About Us'}*/}
        {/*/>*/}
        <PCNavItem
          testID={'btn-17'}
          icon={require('../../assets/person/feedback.png')}
          text={'Feedback'}
          onClick={() => navigation.push('feedback')}
        />
        {!isLogin ? null : (
          <PCNavItem
            testID={'btn-18'}
            icon={require('../../assets/person/delete.png')}
            text={'Delete Account'}
            onClick={onClickDeleteAccount}
            subDesc={'Agree to delete all data and deactivate your account'}
          />
        )}
        <PCNavItem
          testID={'btn-13'}
          icon={require('../../assets/person/terms.png')}
          text={'Terms of Use'}
          onClick={() => Linking.openURL('https://adeal.app/terms-of-service')}
        />
        <PCNavItem
          testID={'btn-14'}
          icon={require('../../assets/person/privacy.png')}
          text={'Privacy Policy'}
          onClick={() => Linking.openURL('https://adeal.app/privacy-policy')}
        />
        {/*<PCNavItem*/}
        {/*  testID={'btn-15'}*/}
        {/*  icon={require('../../assets/person/recommend.png')}*/}
        {/*  text={'Recommend to Friends'}*/}
        {/*  arrowShow={false}*/}
        {/*/>*/}
        {/*<PCNavItem*/}
        {/*  testID={'btn-16'}*/}
        {/*  icon={require('../../assets/person/business.png')}*/}
        {/*  text={'Business Cooperation'}*/}
        {/*/>*/}
        <PCNavItem
          testID={'btn-19'}
          icon={require('../../assets/person/version.png')}
          text={'Version'}
          arrowShow={false}
          onClick={updateVersion}
          rightCid={
            <Text style={{paddingRight: 8, fontSize: 16, color: '#999'}}>
              {`v${version}`}
            </Text>
          }
        />
        <View style={{marginTop: 43, alignSelf: 'center', marginBottom: 155}}>
          {isLogin ? (
            <SingleTouchable
              testID={'btn-05'}
              style={styles.solidBtn}
              onPress={logout}>
              <Text style={{color: '#fff'}}>Sign Out</Text>
            </SingleTouchable>
          ) : (
            <>
              <SingleTouchable
                testID={'btn-03'}
                style={styles.solidBtn}
                onPress={goToRegister}>
                <Text style={{color: '#fff'}}>Register</Text>
              </SingleTouchable>
              <SingleTouchable
                testID={'btn-04'}
                style={styles.hollowBtn}
                onPress={goToLogin}>
                <Text style={{color: '#FC4A12'}}>Sign In</Text>
              </SingleTouchable>
            </>
          )}
        </View>
      </ScrollView>
    </PageRoot>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 66,
    margin: 'auto',
    marginTop: 35,
  },
  titleStyle: {
    fontWeight: 'bold',
    color: '#191919',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 18,
    marginTop: 17,
  },
  emailStyle: {
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    marginBottom: 23,
  },
  solidBtn: {
    width: 314,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FC4A12',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
  },
  hollowBtn: {
    width: 314,
    height: 38,
    borderRadius: 19,
    borderColor: '#FC4A12',
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
  },
});
