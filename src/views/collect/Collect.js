import React, {useState} from 'react';
import PageRoot from '../../components/PageRoot';
import TypeChange from './components/TypeChange';
import MyList from './components/MyList';
import MyLike from './components/MyLike';
import useUserData from '../../hooks/useUserData';
import {Dimensions, Text} from 'react-native';

const {height} = Dimensions.get('window');

export default function Collect() {
  const [dramType, setDramType] = useState(1);
  const {isLogin} = useUserData();

  return (
    <PageRoot isSafeTop={false} style={{background: 'f5f5f5'}}>
      <TypeChange
        courseType={dramType}
        onCourseTypeClick={type => {
          setDramType(type === dramType ? dramType : type);
        }}
      />
      {!isLogin ? (
        <Text
          style={{
            color: '#333',
            textAlign: 'center',
            fontSize: 24,
            marginTop: height / 3,
          }}>
          The current page needs to be viewed after logging in!
        </Text>
      ) : dramType === 1 ? (
        <MyList />
      ) : (
        <MyLike />
      )}
    </PageRoot>
  );
}
