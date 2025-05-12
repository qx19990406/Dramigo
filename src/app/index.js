import React from 'react';
import Nav from '../nav';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BaseModal from '../components/modal/BaseModal';
import ToastModal from '../components/modal/ToastModal';
import {Provider} from 'react-redux';
import {persistor, store} from '../redux/persist';
import {PersistGate} from 'redux-persist/integration/react';
import AppProvider from '../context/AppProvider';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AppProvider>
          <SafeAreaProvider>
            <BaseModal>
              <Nav />
            </BaseModal>
            <ToastModal />
          </SafeAreaProvider>
        </AppProvider>
      </PersistGate>
    </Provider>
  );
}
