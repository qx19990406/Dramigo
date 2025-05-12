import React, {useState} from 'react';
import { initAnim } from '../../utils/animUtil';
import {Modal, StyleSheet, Animated} from 'react-native';
import {SingleTouchable} from '../SingleTouchable';

const CLICK_OUTSIDE_HIDDEN = false;
const CLICK_BACK_HIDDEN = true;

let show = (component, position, outsideHidden, backHidden) => {
};

let hidden = () => {
};

let showPosition = 'bottom';

export default function BaseModal({children}) {
  const [visible, setVisible] = useState(false);
  const [component, setComponent] = useState(null);
  const [outsideHidden, setOutsideHidden] = useState(CLICK_OUTSIDE_HIDDEN);
  const [backHidden, setBackHidden] = useState(CLICK_BACK_HIDDEN);

  // scale
  const {animValue: centerAnim, animIn: centerIn, animOut: centerOut} = initAnim(0, 1);
  // translateY
  const {animValue: bottomAnim, animIn: bottomIn, animOut: bottomOut} = initAnim(1000, 0);

  show = (component, position, outsideHidden, backHidden) => {
    showPosition = position;
    setComponent(component);
    setOutsideHidden(outsideHidden);
    setBackHidden(backHidden);
    setVisible(true);

    setTimeout(() => {
      showPosition === 'bottom' ? bottomIn() : centerIn();
    }, 100);
  };

  hidden = () => {
    showPosition === 'bottom' ? bottomOut() : centerOut();

    setImmediate(() => {
      setVisible(false);
      setComponent(null);
      setOutsideHidden(CLICK_OUTSIDE_HIDDEN);
      setBackHidden(CLICK_BACK_HIDDEN);
    }, 300);
  };

  const style = showPosition === 'bottom' ?
    {justifyContent: 'flex-end'} : {justifyContent: 'center'};
  const transform = showPosition === 'bottom' ?
    [{translateY: bottomAnim}] : [{scale: centerAnim}];

  return <>
    {children}
    <Modal
      animationType={'none'}
      transparent={true}
      visible={visible}
      onRequestClose={() => backHidden && hidden()}
    >
      <SingleTouchable
        activeOpacity={1}
        style={{ ...styles.box, ...style }}
        onPress={() => outsideHidden && hidden()}
        testID={'btn-135'}
      >
        <Animated.View style={{ transform: transform }}>
          <SingleTouchable activeOpacity={1} onPress={() => {}}>
            {component}
          </SingleTouchable>
        </Animated.View>
      </SingleTouchable>
    </Modal>
  </>;
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#00000080',
    flex: 1,
    alignItems: 'center',
  },
});

export function BaseModalController() {}

BaseModalController.show = (
  component,
  position,
  clickOutsideHidden = CLICK_OUTSIDE_HIDDEN,
  clickBackHidden = CLICK_BACK_HIDDEN
) => {
  show(component, position, clickOutsideHidden, clickBackHidden);
};

BaseModalController.hidden = () => {
  hidden();
};
