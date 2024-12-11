import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useAuthContext} from '../../context/GlobaContext';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import {Iconify} from 'react-native-iconify';
import CustomText from '../../customText/CustomText';
import {Button, useTheme} from 'react-native-paper';
import {fonts} from '../../customText/fonts';
import Appointment from '../../Component/Appointment';
import RecommandedDoctor from '../../Component/User/RecommandedDoctor';

export default function Home() {
  let theme = useTheme();
  const {handleLogout, userDetail} = useAuthContext();
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
  }, [isFocused]);

  let navigation = useNavigation();
  const handleNavigate = () => {
    navigation.navigate('EditProfile', {fromuser: true, fromdoctor: false});
  };

  return (
    <>
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        {/* Header */}
        <View style={styles.headerView}>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate('Profile')}>
              {userDetail?.profile_image?.imageUri ? (
                <Image
                  style={styles.image}
                  source={{uri: userDetail?.profile_image?.imageUri}}
                />
              ) : (
                <Iconify
                  icon="fa-solid:user"
                  size={35}
                  color={theme.colors.onBackground}
                />
              )}
            </TouchableOpacity>
            {/* Greeting */}
            <View>
              <CustomText
                numberOfLines={2}
                style={{fontFamily: fonts.Bold, fontSize: 22, width: 200}}>
                Hello, {userDetail?.name}
              </CustomText>

              <CustomText
                style={{
                  fontFamily: fonts.Light,
                  fontSize: 13,
                  top: -4,
                }}>
                How do you feel today?
              </CustomText>
            </View>
          </View>
          {/* ProfileDetail */}
          <View style={styles.userProfile}>
            <View style={styles.profileImage}>
              <Iconify
                icon="mynaui:edit"
                size={28}
                color={theme.colors.onBackground}
                onPress={handleNavigate}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Iconify
                icon="majesticons:logout-half-circle-line"
                size={30}
                color={theme.colors.onBackground}
                onPress={handleLogout}
              />
            </View>
          </View>
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View  >
            <CustomText style={[{fontFamily: fonts.Medium, fontSize: 16,color:theme.colors.appColor}]}>
              Welcome to ECG - Track
            </CustomText>
            <CustomText style={[{fontFamily: fonts.Regular, fontSize: 14}]}>
              Our app is designed to bring you closer to the services and
              features you care about. Explore our mission, values, and the
              people behind the scenes who make it all possible.
            </CustomText>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate('AboutUs')}>
              <CustomText
                style={[
                  {
                    fontFamily: fonts.Regular,
                    textDecorationLine: 'underline',
                    color: theme.colors.appColor,
                  },
                ]}>
                For more About Us
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* User AppointMent */}
          <Appointment fromUser={true} />

          <RecommandedDoctor />
        </ScrollView>
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
    gap: 3,
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
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    bottom: 7,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});
