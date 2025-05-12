import React, {createContext, useEffect, useState} from 'react';
import {store} from '../redux/persist';
import {Platform} from 'react-native';
import {ToastController} from '../components/modal/ToastModal';
import {BaseModalController} from '../components/modal/BaseModal';
import UpdateVersionModal from '../components/modal/UpdateVersionModal';
import DeviceInfo from 'react-native-device-info';
import {requestVersion} from '../api/system';
import {isNeedUpdate} from '../utils';

export const AppContext = createContext(null);

export default function AppProvider({children}) {
  const [isLogin, setIsLogin] = useState(store.getState().user.isLogin);
  const [userId, setUserId] = useState(store.getState().user.userId);
  const [avatar, setAvatar] = useState(store.getState().user.avatar);
  const [username, setUsername] = useState(store.getState().user.username);
  const [email, setEmail] = useState(store.getState().user.email);
  const [history, setHistory] = useState(store.getState().history.list);
  const [nickname, setNickname] = useState(store.getState().user.nickname);
  const [version, setVersion] = useState('1.0.0');
  const [listTotal, setListTotal] = useState(store.getState().home.total);
  const [currentIdx, setCurrentIdx] = useState(store.getState().home.currentIdx);
  const [deviceSN, setDeviceSN] = useState(store.getState().user.deviceSN);
  const [uniqueId, setUniqueId] = useState(null);

  // 版本检测
  const checkVersion = () => {
    switch (Platform.OS) {
      case 'android':
        requestVersion()
          .then(res => {
            if (res.code === 0 && res.data) {
              if (isNeedUpdate(res.data.android.version)) {
                BaseModalController.show(
                  <UpdateVersionModal
                    num={res.data.android.version}
                    url={res.data.android.url}
                  />,
                  'center',
                  false,
                  false,
                );
              } else {
                // ToastController.showAlert('You are using the latest version!');
              }
            } else {
              ToastController.showAlert(res.message || 'Get version failed!');
            }
          })
          .catch(() => {
            ToastController.showAlert(res.message || 'Get version failed!');
          });
        break;
      case 'ios':
        requestVersion()
          .then(res => {
            if (res.code === 0 && res.data) {
              if (isNeedUpdate(res.data.ios.version)) {
                BaseModalController.show(
                  <UpdateVersionModal
                    num={res.data.ios.version}
                    url={res.data.ios.url}
                  />,
                  'center',
                  false,
                  false,
                );
              } else {
                // ToastController.showAlert('You are using the latest version!');
              }
            } else {
              ToastController.showAlert(res.message || 'Get version failed!');
            }
          })
          .catch(() => {
            ToastController.showAlert(res.message || 'Get version failed!');
          });
        break;
      default:
        ToastController.showAlert('You are using the latest version!');
    }
  };

  useEffect(() => {
    DeviceInfo.getUniqueId().then((res) => {
      setUniqueId(res);
    });
    let Version = DeviceInfo.getVersion();
    setVersion(Version);

    checkVersion();
  }, []);

  useEffect(() => {
    store.subscribe(() => {
      setIsLogin(store.getState().user.isLogin);
      setUserId(store.getState().user.userId);
      setAvatar(store.getState().user.avatar);
      setUsername(store.getState().user.username);
      setEmail(store.getState().user.email);
      setNickname(store.getState().user.nickname);
      setHistory(store.getState().history.list);
      setListTotal(store.getState().home.total);
      setCurrentIdx(store.getState().home.currentIdx);
      setDeviceSN(store.getState().user.deviceSN);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLogin,
        userId,
        avatar,
        username,
        email,
        history,
        nickname,
        version,
        listTotal,
        currentIdx,
        deviceSN,
        uniqueId,
        checkVersion,
      }}>
      {children}
    </AppContext.Provider>
  );
}
