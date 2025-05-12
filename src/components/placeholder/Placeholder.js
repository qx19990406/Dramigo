import {Dimensions} from 'react-native';
import Loading from './Loading';
import NoDataView from './NoDataView';
import React from 'react';

const { height } = Dimensions.get('window');

export default function Placeholder({ text, isFirst, loadingStyle, noDataStyle, theme = 'light' }) {

  return (
    isFirst ?
    <Loading style={{ marginTop: height / 3, ...loadingStyle }} /> :
      <NoDataView title={text} style={{ marginTop: height / 3, ...loadingStyle }} theme={theme} />
  );
}
