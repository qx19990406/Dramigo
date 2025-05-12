import useUserData from './useUserData';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';

export default function useDeviceInfo() {
  const {deviceSN, uniqueId} = useUserData();
  const [deviceId, setDeviceId] = useState(deviceSN);
  const platform = Platform.select({ios: 1, android: 2});

  useEffect(() => {
    if (!deviceId) {
      // 延时更新，先从辅助app获取设备序列号，如果没有获取到再使用设备id
      const timeId = setTimeout(() => {
        if (deviceSN) {
          setDeviceId(deviceSN);
        } else {
          setDeviceId(uniqueId);
        }
      }, 2000);

      return () => {
        clearTimeout(timeId);
      };
    }
  }, [deviceId, deviceSN, uniqueId]);

  return {deviceSN, deviceId, platform};
}
