import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import PageRoot from '../../components/PageRoot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoginInput from './components/LoginInput';
import {SingleTouchable} from '../../components/SingleTouchable';
import BottomNav from './components/BottomNav';
import {ToastController} from '../../components/modal/ToastModal';
import {userForgetPasswordApi} from '../../api/user';

export default function ChangePassword({navigation, route}) {
  const {email, flag} = route.params;
  const {top} = useSafeAreaInsets();
  const [info, setInfo] = useState({
    password: '',
    confirmPassword: '',
  });

  // 修改密码
  const onUpdatePassword = () => {
    if (!info.password) {
      ToastController.showAlert('aa');
      return false;
    }
    if (!info.confirmPassword) {
      ToastController.showAlert('cc');
      return false;
    }
    if (info.password !== info.confirmPassword) {
      ToastController.showAlert('vv');
      return false;
    }
    ToastController.showLoading();
    userForgetPasswordApi({
      email: email,
      password: info.password,
      password2: info.confirmPassword,
      flag: flag,
    }).then((res) => {
      if (res.code === 0) {
        ToastController.showSuccess('Password changed successfully!');
        navigation.push('login', {userEmail: email});
      } else {
        ToastController.showError(res.message || 'Update password failed!');
      }
    }).catch(() => {
      ToastController.showError('Update password failed!');
    });
  };

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        <Text style={{marginTop: top + 85, ...styles.title}}>
          Change New Password
        </Text>
        <Text style={styles.subTitle}>
          Enter a different password with the previous
        </Text>
        <View style={{...styles.inputAreaBox, marginTop: 40}}>
          <LoginInput
            placeholder={'Password'}
            value={info.password}
            setValue={val => setInfo({...info, password: val})}
            isPassword={true}
            testID={'btn-01'}
          />
          <View style={styles.line} />
          <LoginInput
            placeholder={'Confirm Password'}
            value={info.confirmPassword}
            setValue={val => setInfo({...info, confirmPassword: val})}
            isPassword={true}
            testID={'btn-02'}
            style={{marginTop: 16}}
          />
          <View style={styles.line} />
        </View>
        {/*按钮*/}
        <SingleTouchable
          activeOpacity={0.8}
          style={styles.loginButton}
          testID={'btn-03'}
          onPress={onUpdatePassword}
        >
          <Text style={styles.loginTextStyle}>Reset Password</Text>
        </SingleTouchable>
        {/*底部导航*/}
        <BottomNav
          title={'Remember the password?'}
          navText={'Log in'}
          style={{ marginTop: 21 }}
          onNavClick={() => navigation.push('login')}
          testID={'btn-05'}
        />
      </ScrollView>
    </PageRoot>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#352721',
    marginLeft: 22,
  },
  subTitle: {
    color: '#A8A6A7',
    marginLeft: 30,
    fontSize: 16,
    marginTop: 21,
    fontWeight: 600,
  },
  line: {
    height: 1,
    backgroundColor: '#A8A6A7',
  },
  inputAreaBox: {
    marginLeft: 40,
    marginRight: 40,
  },
  loginButton: {
    height: 44,
    backgroundColor: '#FC4A12',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginInline: 30,
    marginTop: 177,
  },
  loginTextStyle: {
    color: '#fff',
    fontSize: 22,
  },
  forgetButton: {
    alignSelf: 'flex-end',
    height: 35,
    justifyContent: 'center',
    marginTop: 3,
  },
  skipText: {
    lineHeight: 22,
    color: '#A8A6A7',
    fontSize: 16,
    margin: 10,
  },
  skipButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 69,
    marginBottom: 33,
  },
});
