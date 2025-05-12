import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import DeleteAccount from '../../views/personalCenter/components/DeleteAccount';
import {SingleTouchable} from '../SingleTouchable';
import {ToastController} from './ToastModal';
import {BaseModalController} from './BaseModal';

const { width } = Dimensions.get('window');

function ModalView({ hidden, title, onConfirmClick, onClearClick }) {

  // 校验密码
  const [validatePass, setValidatePass] = useState('');

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <DeleteAccount value={validatePass} setValue={setValidatePass} />
      <View style={{ height: 65, flexDirection: 'row', paddingBottom: 25, justifyContent: 'space-between' }}>
        <SingleTouchable
          activeOpacity={0.5}
          onPress={() => {
            if (!validatePass) {
              ToastController.showAlert('Please enter your password');
              return false;
            }
            setTimeout(() => {
              onConfirmClick && onConfirmClick(validatePass);
            }, 500);
            hidden();
          }}
          style={styles.buttonBox}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </SingleTouchable>
        <SingleTouchable
          activeOpacity={0.5}
          style={styles.buttonBox}
          onPress={() => {
            setTimeout(() => {
              onClearClick && onClearClick();
            }, 500);
            setValidatePass('');
            hidden();
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </SingleTouchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: width - 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 15,
    paddingInline: 15,
  },
  titleText: {
    fontSize: 16,
    color: '#333',
  },
  buttonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingInline: 39,
    paddingBlock: 11,
    borderRadius: 20,
    borderStyle: 'solid',
    borderColor: '#333',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
});

export default function DeleteAccountModal(){}

DeleteAccountModal.showModal = ({ title, onConfirmClick, onClearClick }) => {
  let component = <ModalView
    hidden={BaseModalController.hidden}
    title={title}
    onConfirmClick={(v) => onConfirmClick(v)}
    onClearClick={onClearClick}
  />;
  BaseModalController.show(component, 'center', true);
};
