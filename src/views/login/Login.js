import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import PageRoot from '../../components/PageRoot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoginInput from './components/LoginInput';
import {SingleTouchable} from '../../components/SingleTouchable';
import BottomNav from './components/BottomNav';
import {ToastController} from '../../components/modal/ToastModal';
import {userGetCodeApi, userLoginApi} from '../../api/user';
import {store} from '../../redux/persist';
import {userLogin} from '../../redux/action';

export default function Login({navigation, route}) {
  const {userEmail} = route.params;
  const {top} = useSafeAreaInsets();
  const [info, setInfo] = useState({
    email: '',
    password: '',
  });

  // 登录账户
  const toLogin = () => {
    if (!info.email) {
      ToastController.showAlert('Please input your email');
      return false;
    }
    if (!info.password) {
      ToastController.showAlert('Please input your password');
      return false;
    }
    ToastController.showLoading('Logging in...');
    userLoginApi({
      email: info.email,
      password: info.password,
    })
      .then(res => {
        if (res.code === 0) {
          store.dispatch(userLogin(res.data));
          navigation.navigate('PersonalCenter');
          ToastController.showSuccess('Login successful!');
        } else {
          ToastController.showError(res.message || 'Login failed!');
        }
      })
      .catch(() => {
        ToastController.showError('login failed!');
      });
  };

  useEffect(() => {
    if (userEmail) {
      setInfo({email: userEmail, password: ''});
    }
  }, [userEmail]);

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        {/*标题栏*/}
        <Text style={{marginTop: top + 85, ...styles.title}}>Sign In</Text>
        <Text style={styles.subTitle}>Fist creat your account</Text>
        {/*登录表单*/}
        <View style={{...styles.inputAreaBox, marginTop: 79}}>
          <LoginInput
            placeholder={'Email'}
            value={info.email}
            setValue={v => setInfo({...info, email: v})}
            keyboardType={'default'}
            testID={'btn-01'}
          />
          <View style={styles.line} />
          <LoginInput
            placeholder={'Password'}
            value={info.password}
            setValue={v => setInfo({...info, password: v})}
            isPassword={true}
            style={{marginTop: 16}}
            testID={'btn-02'}
          />
          <View style={styles.line} />
          <SingleTouchable
            style={styles.forgetButton}
            testID={'btn-03'}
            activeOpacity={0.5}
            onPress={() => navigation.push('forgetPassword')}>
            <Text style={{fontSize: 10, color: '#333', fontWeight: 600}}>
              Forget password?
            </Text>
          </SingleTouchable>
        </View>
        {/*登录按钮*/}
        <SingleTouchable
          activeOpacity={0.8}
          style={styles.loginButton}
          onPress={toLogin}
          testID={'btn-04'}>
          <Text style={styles.loginTextStyle}>Login</Text>
        </SingleTouchable>
        {/*底部导航*/}
        <BottomNav
          title={'Not register yet?'}
          navText={'Create Account'}
          style={{marginTop: 18}}
          onNavClick={() => navigation.push('register')}
          testID={'btn-05'}
        />
        {/*跳转导航*/}
        <SingleTouchable
          activeOpacity={0.5}
          style={styles.skipButton}
          testID={'btn-06'}
          onPress={() => navigation.goBack()}>
          <Text style={styles.skipText}>Skip now --{'>'}</Text>
        </SingleTouchable>
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
    marginTop: 36,
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
    marginTop: 150,
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
