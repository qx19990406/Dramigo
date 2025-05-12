import {useEffect} from 'react';
import {Linking} from 'react-native';
import {store} from '../redux/persist';
import {userDevice} from '../redux/action';
import useUserData from './useUserData';

export default function useDeepLink() {
  const {deviceSN} = useUserData();

  useEffect(() => {
    if (!deviceSN) {
      // 应用未运行
      Linking.getInitialURL()
        .then(url => {
          if (url) {
            handleDeepLink(url);
          }
        })
        .catch(console.error);

      // 应用正在运行
      let listener = Linking.addEventListener('url', event => {
        handleDeepLink(event.url);
      });

      function handleDeepLink(url) {
        const query = url.split('?')[1];
        const params = {};
        if (query) {
          query.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            params[key] = decodeURIComponent(value);
          });
          if (params.device_sn) {
            store.dispatch(userDevice(params.device_sn));
          }
        }
      }

      // 启动辅助app
      const scheme = 'dramigo';
      const host = 'com.adeal.dramigo';
      const url = `wise://com.wise.acc?scheme=${scheme}&host=${host}`;
      Linking.canOpenURL(url).then(res => {
        if (res) {
          Linking.openURL(url).catch(() => {});
        }
      });

      return () => {
        listener.remove();
      };
    }
  }, []);
}
