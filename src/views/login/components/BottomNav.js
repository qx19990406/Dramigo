import { StyleSheet, Text, View } from 'react-native';
import {SingleTouchable} from '../../../components/SingleTouchable';

export default function BottomNav({title, navText, onNavClick, style, testID}) {
  return (
    <View style={{...styles.box, ...style}}>
      <Text style={styles.titleText}>{title}</Text>
      <SingleTouchable
        activeOpacity={0.5}
        onPress={onNavClick}
        style={styles.navButton}
        testID={testID}
      >
        <Text style={styles.navText}>{navText}</Text>
      </SingleTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: '300',
    color: '#252525',
    fontSize: 13,
    marginRight: 2,
  },
  navText: {
    fontWeight: '400',
    color: '#FC4A12',
    fontSize: 13,
  },
  navButton: {
    justifyContent: 'center',
  },
});
