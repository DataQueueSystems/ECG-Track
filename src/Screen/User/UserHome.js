import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useAuthContext} from '../../context/GlobaContext';
import {useIsFocused} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import {Iconify} from 'react-native-iconify';
import CustomText from '../../customText/CustomText';
import {useTheme} from 'react-native-paper';
import {fonts} from '../../customText/fonts';

export default function Home() {
  let theme = useTheme();
  const {handleLogout} = useAuthContext();
  let TextColor = {color: 'rgb(22, 21, 21)'};

  const isFocused = useIsFocused();
  const backPressedOnce = useRef(false);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log(backPressedOnce, 'backPressedOnce');
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
    <>
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        {/* Header */}
        <View style={styles.headerView}>
          {/* Greeting */}
          <View>
            <CustomText
              style={{fontFamily: fonts.Bold, fontSize: 22, color: 'black'}}>
              Hello, Murshid
            </CustomText>

            <CustomText
              style={{
                fontFamily: fonts.Light,
                fontSize: 13,
                color: 'black',
                top: -4,
              }}>
              How do you feel today?
            </CustomText>
          </View>
          {/* ProfileDetail */}
          <View style={styles.userProfile}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Iconify
                icon="majesticons:logout-half-circle-line"
                size={30}
                color={'black'}
                onPress={handleLogout}
              />
            </View>

            <View style={styles.profileImage}>
              <Iconify icon="fa-solid:user" size={27} color={'black'} />
            </View>
          </View>
        </View>

        <View style={styles.trackHeader}>
          <View style={styles.trackIcon}>
            <Iconify icon="mingcute:run-line" size={55} color={'black'} />
          </View>
          <CustomText
            style={{fontFamily: fonts.Bold, fontSize: 26, textAlign: 'center'}}>
            Health Tracking
          </CustomText>
          <CustomText
            style={{
              fontFamily: fonts.Light,
              fontSize: 13,
              textAlign: 'center',
              top: -5,
            }}>
            Track your walk, fitness and all activity you do!
          </CustomText>
        </View>

        {/* Recommanded */}

        <View style={styles.RecommandedView}>
          <View>
            <CustomText
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 19,
                color: 'black',
              }}>
              Recommended
            </CustomText>
            <CustomText
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 17,
                color: 'black',
                top: -4,
              }}>
              activity
            </CustomText>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <Iconify icon="wi:time-8" size={20} color={'black'} />
            <CustomText
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 12,
              }}>
              Time activity
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'column',
              gap: 4,
              left: 10,
              marginVertical: 8,
            }}>
            <CustomText
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 12,
              }}>
              - 60m
            </CustomText>
            <CustomText
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 12,
              }}>
              - 30m
            </CustomText>
            <CustomText
              style={{
                fontFamily: fonts.SemiBold,
                fontSize: 12,
              }}>
              - 30m
            </CustomText>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 20,
              flexDirection: 'row',
              gap: 10,
            }}>
            <View
              style={{
                position: 'absolute',
                bottom: -10,
                right: -20,
                backgroundColor: '#cde5f5',
                padding: 10,
                height: 190,
                borderTopLeftRadius: 120,
                width: 190,
    borderWidth:1,
    borderColor:'#fff',
    borderBottomRightRadius:20

              }}
            />
            <View style={{gap: 10}}>
              <View
                style={[
                  styles.profileImage,
                  {right: 20, width: 65, height: 65,
                    backgroundColor:"rgba(255, 220, 99, 1)"},
                ]}>
                <Iconify
                  icon="ph:person-simple-swim-fill"
                  size={50}
                  color={'black'}
                />
              </View>
              <View style={[styles.profileImage, {bottom: 10, left: 20,
                    backgroundColor:"rgba(244, 160, 223, 1)"

              }]}>
                <Iconify icon="cbi:roomsgym" size={27} color={'black'} />
              </View>
            </View>
            <View style={{gap: 10}}>
              <View style={[styles.profileImage, {top: -35,
                    backgroundColor:"#e5e5e5"

              }]}>
                <Iconify icon="fa-solid:running" size={27} color={'black'} />
              </View>
              <View style={[styles.profileImage,
                   { backgroundColor:"#85bbfc"}
                
              ]}>
                <Iconify
                  icon="icon-park-solid:play-volleyball"
                  size={27}
                  color={'black'}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    // backgroundColor:'green'
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    padding: 10,
    borderRadius: 100,
    height: 45,
    width: 45,
    alignItems: 'center',
  },
  trackHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  trackIcon: {
    padding: 10,
    borderRadius: 100,
    height: 65,
    width: 65,
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: 'grey',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  RecommandedView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    elevation:2
  },
});
