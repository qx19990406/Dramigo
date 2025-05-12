import {StyleSheet, Modal, Text, View, Image, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {TOAST_TYPE} from '../../constants/toast';

let show = (type, message) => {
};
let hidden = (timeout) => {
};

export default function ToastModal() {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(TOAST_TYPE.success);
  const [message, setMessage] = useState();

  show = (type, message) => {
    setType(type);
    setMessage(message);
    setVisible(true);
  };

  hidden = (timeout) => {
    setTimeout(() => {
      setVisible(false);
    }, timeout);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => hidden(50)}>
      <View style={styles.box}>
        <View style={styles.contentBox}>
          {
            type.type === TOAST_TYPE.loading.type ?
              <ActivityIndicator
                color={'#000'}
                style={{marginBottom: 5}}/> :
              <Image
                source={type.icon}
                style={styles.icon}/>
          }
          <Text style={styles.messageText}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    minWidth: 120,
    maxWidth: 200,
    minHeight: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 160,
    padding: 15,
    overflow: 'hidden',
  },
  icon: {
    width: 24,
    height: 24,
  },
  messageText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginTop: 5,
  },
});

export function ToastController() {
}

ToastController.showSuccess = (message) => {
  show(TOAST_TYPE.success, message);
  hidden(3000);
};

ToastController.showError = (message) => {
  show(TOAST_TYPE.error, message);
  hidden(3000);
};

ToastController.showAlert = (message) => {
  show(TOAST_TYPE.alert, message);
  hidden(3000);
};

ToastController.showLoading = (message = 'Loading…') => {
  show(TOAST_TYPE.loading, message);
};

ToastController.hidden = () => {
  hidden(50);
};
