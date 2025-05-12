import {useContext} from 'react';
import {AppContext} from '../context/AppProvider';

export default function useVideoData() {
  const {listTotal} = useContext(AppContext);
  return {listTotal};
}
