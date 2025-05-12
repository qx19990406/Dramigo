import React, {useState} from 'react';
import PageRoot from '../../components/PageRoot';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SearchInput from './components/SearchInput';
import {ToastController} from '../../components/modal/ToastModal';
import SearchHistory from './components/SearchHistory';
import PopularList from './components/PopularList';
import SearchResult from './components/SearchResult';
import {historyAdd} from '../../redux/action';
import {store} from '../../redux/persist';

// 搜索页
export default function Search() {
  const {top} = useSafeAreaInsets();
  const [keywords, setKeywords] = useState(''); // 搜索关键词
  const [value, setValue] = useState(''); // 当前输入值
  const [isSearch, setIsSearch] = useState(false);

  return (
    <PageRoot
      isSafeTop={false}
      style={{backgroundColor: '#fff', flex: 1, flexDirection: 'column'}}>
      {/*搜索框*/}
      <View style={{...styles.searchBox, marginTop: top + 14}}>
        <SearchInput
          value={value}
          setValue={setValue}
          onSearchClick={() => {
            if (!value) {
              ToastController.showAlert('please input search text!');
            }
            setKeywords(value);
            if (value) {
              // 添加搜索记录
              store.dispatch(historyAdd(value));
            }
            setIsSearch(!!value);
          }}
        />
      </View>
      {isSearch ? (
        <SearchResult keywords={keywords} />
      ) : (
        <>
          {/*历史数据*/}
          <SearchHistory setIsSearch={setIsSearch} setValue={setValue} setKeywords={setKeywords} />
          {/*推荐列表*/}
          <PopularList />
        </>
      )}
    </PageRoot>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    marginTop: 13,
    marginInline: 28,
    marginEnd: 20,
  },
});
