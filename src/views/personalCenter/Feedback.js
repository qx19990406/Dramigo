import PageRoot from '../../components/PageRoot';
import React, {useState} from 'react';
import StickyTopNav from '../../components/StickyTop';
import {StyleSheet, Text, TextInput} from 'react-native';
import {SingleTouchable} from '../../components/SingleTouchable';
import {ToastController} from '../../components/modal/ToastModal';
import {userFeedbackApi} from '../../api/system';

// 意见反馈
export default function Feedback() {
  const [text, setText] = useState('');

  // 提交反馈意见
  const submitFeedback = () => {
    if (!text) {
      ToastController.showAlert('The input content cannot be empty!');
      return false;
    }
    userFeedbackApi({
      content: text,
    }).then((res) => {
      if (res.code === 0) {
        setText('');
        ToastController.showSuccess('Feedback successfully!');
      } else {
        ToastController.showError(res.message || 'Feedback failed!');
      }
    }).catch(() => {
      ToastController.showError('Feedback failed!');
    });
  };

  return (
    <PageRoot isSafeTop={false} style={{backgroundColor: '#f5f5f5'}}>
      <StickyTopNav title={'Feedback'} showBack={true} testID={'btn-00'} />
      <Text style={styles.titleStyle}>How are you feeling?</Text>
      <TextInput
        style={styles.inputBox}
        keyboardType={'email-address'}
        multiline={true}
        placeholder={'Add a Comment...'}
        placeholderTextColor={'#999'}
        value={text}
        onChangeText={setText}
        textAlignVertical={'top'}
      />
      <SingleTouchable
        activeOpacity={0.8}
        style={styles.loginButton}
        onPress={submitFeedback}
        testID={'btn-01'}>
        <Text style={styles.loginTextStyle}>Submit now</Text>
      </SingleTouchable>
    </PageRoot>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: 19,
    marginLeft: 22,
    fontSize: 14,
    color: '#333',
  },
  inputBox: {
    height: 134,
    marginInline: 13,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e1e1e1',
    borderStyle: 'solid',
    marginTop: 11,
    paddingInline: 16,
  },
  loginButton: {
    height: 44,
    backgroundColor: '#FC4A12',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginInline: 60,
    marginTop: 30,
  },
  loginTextStyle: {
    color: '#fff',
    fontSize: 16,
  },
});
