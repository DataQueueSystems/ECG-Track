import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {Button, useTheme} from 'react-native-paper';
import {useAuthContext} from '../../context/GlobaContext';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import CustomText from '../../customText/CustomText';
import {Iconify} from 'react-native-iconify';
import {fonts} from '../../customText/fonts';

const OnboardingScreen = ({}) => {
  let navigation = useNavigation();

  const {isLogin} = useAuthContext();
  let theme = useTheme();

  const handleBtnPress = () => {
    if (isLogin) {
      showToast('Login First');
      navigation.navigate('Login');
    } else {
      navigation.navigate('Home');
    }
  };
  let iconSize = 210;
  return (
    <Onboarding
      onSkip={handleBtnPress} // Replace 'HomeScreen' with your desired navigation target
      onDone={handleBtnPress} // Navigate after the last onboarding screen
      pages={[
        {
          backgroundColor: theme.colors.background,
          title: (
            <View style={styles.contentIcons}>
              <Iconify
                icon="ix:health"
                size={iconSize}
                color={theme.colors.appColor}
              />
            </View>
          ),
          subtitle: (
            <View>
              <CustomText
                style={[
                  {
                    marginHorizontal: 20,
                    fontFamily: fonts.SemiBold,
                    fontSize: 17, // Customize font size if needed

                    textAlign: 'center',
                  },
                  {color: theme.colors.onBackground},
                ]}>
                Track your heart’s health, predict ECG results, and connect with
                expert doctors—all in one app
              </CustomText>
            </View>
          ),
        },

        {
          backgroundColor: theme.colors.background,
          title: (
            <View style={styles.contentIcons}>
              <Iconify
                icon="vaadin:hourglass-start"
                size={180}
                color={theme.colors.appColor}
              />
            </View>
          ),
          subtitle: (
            <View>
              <CustomText
                style={[
                  {
                    marginHorizontal: 20,
                    fontFamily: fonts.SemiBold,
                    fontSize: 17, // Customize font size if needed
                    textAlign: 'center',
                  },
                  {color: theme.colors.onBackground},
                ]}>
                Receive personalized recommendations for trusted doctors based
                on your ECG and symptoms
              </CustomText>
            </View>
          ),
          titleStyles: {
            fontFamily: 'Sora-Bold',
            fontSize: 24,
            color: '#000',
          },
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
  contentIcons: {
    // position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default OnboardingScreen;
