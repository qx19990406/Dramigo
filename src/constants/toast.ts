import { ImageSourcePropType } from 'react-native';

type ToastInfo = {
  type: string;
  icon: ImageSourcePropType | undefined;
}

type ToastType = {
  loading: ToastInfo;
  success: ToastInfo;
  error: ToastInfo;
  alert: ToastInfo;
}

export const TOAST_TYPE: ToastType = {
  loading: { type: 'loading', icon: undefined },
  success: { type: 'success', icon: require('../assets/toast/icon_toast_success.png') },
  error: { type: 'error', icon: require('../assets/toast/icon_toast_error.png') },
  alert: { type: 'alert', icon: require('../assets/toast/icon_toast_alert.png') },
};
