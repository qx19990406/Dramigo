import {useContext} from 'react';
import {AppContext} from '../context/AppProvider';

export default function useUserData() {
  const {
    email,
    isLogin,
    userId,
    avatar,
    username,
    history,
    nickname,
    currentIdx,
    version,
    deviceSN,
    uniqueId,
  } = useContext(AppContext);
  return {
    email,
    isLogin,
    userId,
    avatar,
    username,
    history,
    nickname,
    currentIdx,
    version,
    deviceSN,
    uniqueId,
  };
}
