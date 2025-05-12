import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Image, StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// 导入页面
import Home from '../views/home/Home';
import Collect from '../views/collect/Collect';
import PersonalCenter from '../views/personalCenter/PersonalCenter';
import Theater from '../views/theater/Theater';
import Login from '../views/login/Login';
import Register from '../views/login/Register';
import ChangePassword from '../views/login/ChangePassword';
import ForgotPassword from '../views/login/ForgetPassword';
import Feedback from '../views/personalCenter/Feedback';
import Search from '../views/search/Search';
import DramigoDetail from '../views/dramigoDetail/DramigoDetail';
import DramigoPlay from '../views/dramigoPlay/DramigoPlay';
import useDeepLink from '../hooks/useDeepLink';

const Stack = createNativeStackNavigator();

export default function Nav() {

  useDeepLink();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme,
          backgroundColor: '#192126FF',
        },
      }}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={'#00000000'}
        translucent={true}
      />
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}>
        <Stack.Screen name={'MainTab'} component={MainTab} />
        <Stack.Screen name={'forgetPassword'} component={ForgotPassword} />
        <Stack.Screen name={'changePassword'} component={ChangePassword} />
        <Stack.Screen name={'register'} component={Register} />
        <Stack.Screen name={'login'} component={Login} />
        <Stack.Screen name={'feedback'} component={Feedback} />
        <Stack.Screen name={'search'} component={Search} />
        <Stack.Screen name={'dramigoDetail'} component={DramigoDetail} />
        <Stack.Screen name={'dramigoPlay'} component={DramigoPlay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabs = {
  Home: {
    lightIcon: require('../assets/banner/light_home.png'),
    darkIcon: require('../assets/banner/light_home.png'),
    selectIcon: require('../assets/banner/select_home.png'),
    routeName: 'Home',
  },
  Theater: {
    lightIcon: require('../assets/banner/light_safari.png'),
    darkIcon: require('../assets/banner/dark_safari.png'),
    selectIcon: require('../assets/banner/select_safari.png'),
    routeName: 'Theater',
  },
  Collect: {
    lightIcon: require('../assets/banner/light_tv.png'),
    darkIcon: require('../assets/banner/dark_tv.png'),
    selectIcon: require('../assets/banner/select_tv.png'),
    routeName: 'Collect',
  },
  PersonalCenter: {
    lightIcon: require('../assets/banner/light_user.png'),
    darkIcon: require('../assets/banner/dark_user.png'),
    selectIcon: require('../assets/banner/select_user.png'),
    routeName: 'PersonalCenter',
  },
};

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const [light, setLight] = useState(false);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          height: 75,
          alignSelf: 'center',
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingInline: 37,
          shadowColor: '#0000003F',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.5,
          elevation: 10,
          shadowRadius: 1,
          backgroundColor: route.name === 'Home' ? '#191919' : '#fff',
          zIndex: 2000,
        },
        tabBarButton: props => (
          <TabBarButton isLight={light} props={props} route={route} />
        ),
      })}>
      <Stack.Screen
        listeners={() => ({
          tabPress: e => setLight(false),
        })}
        name={'Home'}
        component={Home}
      />
      <Stack.Screen
        listeners={() => ({
          tabPress: e => setLight(true),
        })}
        name={'Theater'}
        component={Theater}
      />
      <Stack.Screen
        listeners={() => ({
          tabPress: e => setLight(true),
        })}
        name={'Collect'}
        component={Collect}
      />
      <Stack.Screen
        listeners={() => ({
          tabPress: e => setLight(true),
        })}
        name={'PersonalCenter'}
        component={PersonalCenter}
      />
    </Tab.Navigator>
  );
};

const TabBarButton = ({props, route, isLight}) => {
  const tab = tabs[route.name];
  const focused = props?.accessibilityState?.selected;

  return (
    <TouchableOpacity
      {...props}
      testID={'view_main_tab_' + route.name}
      activeOpacity={1}
      style={styles.tabItemBox}>
      <Image
        source={
          focused ? tab.selectIcon : isLight ? tab.lightIcon : tab.darkIcon
        }
        style={{
          width: tab['routeName'] === 'Theater' ? 27 : 24,
          height: tab['routeName'] === 'Theater' ? 27 : 24,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabItemBox: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
