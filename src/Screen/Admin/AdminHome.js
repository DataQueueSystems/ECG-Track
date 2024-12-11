import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import {useTheme} from 'react-native-paper';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {Iconify} from 'react-native-iconify';
import GradientCards from '../../Component/Admin/GradientCards';
import {useAuthContext} from '../../context/GlobaContext';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
export default function Home() {
  let theme = useTheme();
  const {
    handleLogout,
    userDetail,
    setUserDetail,
    setAdminDoctors,
    setAdminPatient,
  } = useAuthContext();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
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

  let todaysDate = moment().format('ddd ,DD MMM');
  const handleNavigate = () => {
    navigation.navigate('SingleDetail');
  };

  const GetListofUser = async () => {
    try {
      const subscriber = firestore()
        .collection('users')
        .where('Status', '==', 'Active')
        .onSnapshot(async snapshot => {
          let alluser = snapshot.docs.map(snapdata => ({
            id: snapdata.id,
            ...snapdata.data(),
          }));
          const allpatient = alluser?.filter(user => user?.role === 'user');
          await setAdminPatient(allpatient); // Set the filtered list as needed
        });
      // Clean up the listener when the component unmounts
      return () => subscriber();
    } catch (error) {
      console.log('Error is:', error);
    }
  };

  useEffect(() => {
    // Fetch appointments only if the user is not an admin
    let unsubscribe = () => {}; // Default to a no-op function.
    if (userDetail && userDetail?.role == 'admin') {
      unsubscribe = GetListofUser();
    }
    // Clean up the listener on component unmount or dependency change.
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userDetail]);

  const GetListofDoctor = async () => {
    try {
      const subscriber = firestore()
        .collection('users')
        .where('Status', '==', 'Active')
        .onSnapshot(async snapshot => {
          let alluser = snapshot.docs.map(snapdata => ({
            id: snapdata.id,
            ...snapdata.data(),
          }));
          const allpatient = alluser?.filter(user => user?.role === 'doctor');
          await setAdminDoctors(allpatient); // Set the filtered list as needed
        });
      // Clean up the listener when the component unmounts
      return () => subscriber();
    } catch (error) {
      console.log('Error is:', error);
    }
  };

  useEffect(() => {
    // Fetch appointments only if the user is not an admin
    let unsubscribe = () => {}; // Default to a no-op function.
    if (userDetail && userDetail?.role == 'admin') {
      unsubscribe = GetListofDoctor();
    }
    // Clean up the listener on component unmount or dependency change.
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
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
          {/* ProfileDetail */}
          <View style={styles.userProfile}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleNavigate}
              style={styles.profileImage}>
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

            <View style={styles.NameDate}>
              <CustomText
                numberOfLines={2}
                style={[
                  {
                    fontFamily: fonts.SemiBold,
                    fontSize: 14,
                    width: 200,
                  },
                ]}>
                Hi,{userDetail?.name}
              </CustomText>
              <CustomText
                style={[
                  {
                    fontFamily: fonts.Regular,
                    fontSize: 13,
                  },
                ]}>
                {todaysDate}
              </CustomText>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Iconify
              icon="majesticons:logout-half-circle-line"
              size={37}
              color={theme.colors.onBackground}
              onPress={handleLogout}
            />
          </View>
        </View>


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
        {/* MainHead Text */}
        <View style={styles.manageView}>
          <View style={styles.manageExplore}>
            <CustomText style={[styles.manageText, {fontFamily: fonts.Bold}]}>
              Explore
            </CustomText>
            <Iconify
              icon="fluent-mdl2:recruitment-management"
              size={30}
              color={theme.colors.onBackground}
            />
          </View>
          <CustomText
            style={[
              styles.manageText,
              {fontFamily: fonts.Bold, lineHeight: 35},
            ]}>
            User & Doctor
          </CustomText>
        </View>

        {/* Manage Card */}
        <GradientCards />
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
    marginBottom:10
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
    height: 55,
    width: 55,
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: 'grey',
  },
  manageView: {
    marginTop: 20,
    marginBottom: 10,
  },
  manageExplore: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  manageText: {
    fontSize: 30,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    bottom: 7,
  },
});
