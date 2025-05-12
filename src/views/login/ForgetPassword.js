import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import PageRoot from '../../components/PageRoot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoginInput from './components/LoginInput';
import {SingleTouchable} from '../../components/SingleTouchable';
import useCountDown from '../../hooks/useCountDown';
import BottomNav from './components/BottomNav';
import {ToastController} from '../../components/modal/ToastModal';
import {userGetCodeApi, vailCodePassword} from '../../api/user';

export default function ForgetPassword({navigation}) {
  const {top} = useSafeAreaInsets();
  const [info, setInfo] = useState({
    email: '',
    code: '',
  });
  const {countDown, totalCount, startTimer} = useCountDown();
  const sendDisabled = countDown < totalCount;
  const [isFirstSend, setFirstSend] = useState(true);

  // 获取验证码
  const send = () => {
    if (!sendDisabled) {
      if (!info.email) {
        ToastController.showAlert('Please input email');
        return false;
      }
      ToastController.showLoading('Sending');
      // 获取验证码
      userGetCodeApi({email: info.email})
        .then(res => {
          if (res.code === 0) {
            ToastController.showSuccess('code already send!');
          } else {
            ToastController.showError(res.message || 'Update password failed!');
          }
        })
        .catch(() => {
          ToastController.showError('Update password failed!');
        })
        .finally(() => {
          startTimer();
          isFirstSend && setFirstSend(false);
        });
    }
  };

  // 下一步，校验验证码， 通过校验则跳转修改密码， 否则弹出提示框
  const goToChangePassword = () => {
    if (!info.email) {
      ToastController.showAlert('Please input your email');
      return false;
    }
    if (!info.code) {
      ToastController.showAlert('Please input your verification code');
      return false;
    }
    vailCodePassword({email: info.email, code: info.code})
      .then(res => {
        if (res.code === 0 && res.data) {
          ToastController.showSuccess('Verification passed!');
          navigation.push('changePassword', {
            email: info.email,
            flag: res.data.flag,
          });
        } else {
          ToastController.showError(
            res.message ||
              'Verification failed, please check the information filled in or network connection!',
          );
        }
      })
      .catch(() => {
        ToastController.showError(
          'Verification failed, please check the information filled in or network connection!',
        );
      });
  };

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        <Text style={{marginTop: top + 85, ...styles.title}}>
          Forget password?{' '}
        </Text>
        <Text style={styles.subTitle}>Enter your registered email below</Text>
        <View style={{...styles.inputAreaBox, marginTop: 79}}>
          <LoginInput
            placeholder={'Email'}
            value={info.email}
            setValue={v => setInfo({...info, email: v})}
            keyboardType={'email-address'}
            testID={'btn-01'}
          />
          <View style={styles.line} />
          <View style={{flexDirection: 'row', marginTop: 17}}>
            <LoginInput
              placeholder={'Verification Code'}
              value={info.code}
              setValue={v => setInfo({...info, code: v})}
              testID={'btn-02'}
            />
            <SingleTouchable
              activeOpacity={sendDisabled ? 1 : 0.5}
              style={styles.sendButton}
              onPress={send}
              testID={'btn-03'}>
              {sendDisabled ? (
                <Text
                  style={styles.sendText}>{`Resend after ${countDown}s`}</Text>
              ) : (
                <Text style={styles.sendText}>
                  {isFirstSend ? 'Send' : 'Resend'}
                </Text>
              )}
            </SingleTouchable>
          </View>
          <View style={styles.line} />
        </View>
        {/*修改按钮*/}
        <SingleTouchable
          activeOpacity={0.8}
          style={styles.loginButton}
          onPress={goToChangePassword}
          testID={'btn-04'}>
          <Text style={styles.loginTextStyle}>Next</Text>
        </SingleTouchable>
        {/*底部导航*/}
        <BottomNav
          title={'Remember the password?'}
          navText={'Log in'}
          style={{marginTop: 18, marginBottom: 120}}
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
    marginTop: 45,
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
  sendButton: {
    width: 121,
    justifyContent: 'center',
    marginLeft: 28,
  },
  sendText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
