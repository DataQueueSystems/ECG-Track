import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';

export default function Home() {
  const isFocused = useIsFocused();
  const backPressedOnce = useRef(false);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isFocused) {
          if (!backPressedOnce.current) {
            backPressedOnce.current = true;
            showToast("Tap again if you're ready to exit.");
            setTimeout(() => {
              backPressedOnce.current = false;
            }, 2000); // Reset backPressedOnce after 2 seconds
            return true;
          } else {
            BackHandler.exitApp();
            return true;
          }
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View>
      <Text>AdminHome</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
