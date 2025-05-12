import React, {useState} from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {SingleTouchable} from '../../../components/SingleTouchable';
import IconEyeClosed from '../../../assets/input/icon_eye_closed.png';
import IconEyeOpen from '../../../assets/input/icon_eye_open.png';

export default function LoginInput({
  isPassword = false,
  value,
  setValue,
  keyboardType = 'default',
  style,
  testID, placeholder,
}) {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  return (
    <View style={{...styles.box, ...style}}>
      <TextInput
        placeholder={placeholder}
        value={value}
        maxLength={50}
        onChangeText={setValue}
        keyboardType={keyboardType}
        keyboardAppearance={'light'}
        returnKeyType={'default'}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
      {
        isPassword && value && value.length > 0 &&
        <SingleTouchable
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={styles.secureButton}
          testID={testID}
        >
          <Image
            source={secureTextEntry ? IconEyeClosed : IconEyeOpen}
            style={secureTextEntry ? styles.secureHiddenImg : styles.secureShowImg}
          />
        </SingleTouchable>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    color: '#A8A6A7',
  },
  box: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
  },
  secureHiddenImg: {
    width: 18,
    height: 18,
  },
  secureShowImg: {
    width: 20,
    height: 20,
  },
  secureButton: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
});
