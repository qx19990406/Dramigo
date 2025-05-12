import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import PageRoot from '../../components/PageRoot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoginInput from './components/LoginInput';
import {SingleTouchable} from '../../components/SingleTouchable';
import BottomNav from './components/BottomNav';
import {ToastController} from '../../components/modal/ToastModal';
import {userRegisterApi} from '../../api/user';

export default function Register({navigation}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]*\.com$/;

  const {top} = useSafeAreaInsets();
  const [info, setInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const goToLogin = () => {
    navigation.push('login', {
      userEmail: '',
    });
  };

  // 点击注册
  const onCreateAccount = () => {
    if (!info.email) {
      ToastController.showAlert('Please input your email');
      return false;
    }
    if (!emailRegex.test(info.email)) {
      ToastController.showAlert('Please enter the correct email format!');
      return false;
    }
    if (!info.password) {
      ToastController.showAlert('Please input your password');
      return false;
    }
    if (!info.confirmPassword) {
      ToastController.showAlert('Please input your password again');
      return false;
    }
    if (info.password !== info.confirmPassword) {
      ToastController.showAlert('The two passwords do not match');
      return false;
    }
    userRegisterApi({
      email: info.email,
      password: info.password,
      password2: info.confirmPassword,
    })
      .then(res => {
        if (res.code === 0) {
          ToastController.showSuccess('Register user successfully!');
          navigation.push('login', {
            userEmail: info.email,
          });
        } else {
          ToastController.showError(res.message || 'Register failed!');
        }
      })
      .catch(() => {
        ToastController.showError('Register failed!');
      });
  };

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        {/*标题栏*/}
        <Text style={{marginTop: top + 85, ...styles.title}}>
          Creat account
        </Text>
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
          <LoginInput
            placeholder={'Confirm Password'}
            value={info.confirmPassword}
            setValue={v => setInfo({...info, confirmPassword: v})}
            isPassword={true}
            style={{marginTop: 16}}
            testID={'btn-03'}
          />
          <View style={styles.line} />
        </View>
        {/*按钮*/}
        <SingleTouchable
          activeOpacity={0.8}
          style={styles.loginButton}
          onPress={onCreateAccount}
          testID={'btn-04'}>
          <Text style={styles.loginTextStyle}>Create Account</Text>
        </SingleTouchable>
        {/*底部导航*/}
        <BottomNav
          title={'Already have an account?'}
          navText={'Log in'}
          style={{marginTop: 18}}
          onNavClick={goToLogin}
          testID={'btn-05'}
        />
        {/*跳转导航*/}
        <SingleTouchable
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
          style={styles.skipButton}
          testID={'btn-06'}>
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
    marginTop: 116,
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
