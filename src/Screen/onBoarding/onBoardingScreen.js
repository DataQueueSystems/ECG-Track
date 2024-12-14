import React, { useEffect, useState } from 'react';
import {View, Dimensions, StyleSheet, ActivityIndicator} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../customText/CustomText';
import {Iconify} from 'react-native-iconify';
import {fonts} from '../../customText/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../../utils/Toast';

const OnboardingScreen = ({}) => {
  let navigation = useNavigation();
  let theme = useTheme();
  const handleBtnPress = () => {
    navigation.navigate('Login');
  };
  let iconSize = 210;

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const checkFirstScreen = async () => {
      try {
        await AsyncStorage.setItem('firstScreen', 'login');
        const firstScreen = await AsyncStorage.getItem('firstScreen');
        // console.log(firstScreen,'firstScreenfirstScreen');
        setTimeout(() => {
          setIsLoading(false); // Hide spinner after 5 seconds
          if (firstScreen === 'login') {
            navigation.navigate('Login');
          }
        }, 50); // 5-second delay
      } catch (error) {
        showToast('Error retrieving first screen setting');
        setIsLoading(false);
      }
    };

    checkFirstScreen();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={{flex:1,backgroundColor:theme.colors.background,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color={theme.colors.appColor} />
      </View>
    );
  }


  return (
    <Onboarding
      skipLabel={
        <CustomText
          style={{
            fontSize: 16,
            color: theme.colors.appColor,
            fontFamily: fonts.SemiBold,
          }}>
          Skip
        </CustomText>
      }
      nextLabel={
        <CustomText
          style={{
            fontSize: 16,
            color: theme.colors.appColor,
            fontFamily: fonts.SemiBold,
          }}>
          Next
        </CustomText>
      }
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
