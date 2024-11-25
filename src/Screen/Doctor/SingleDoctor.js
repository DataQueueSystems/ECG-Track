import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../Component/Header';
import {Appbar, Divider, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {useAuthContext} from '../../context/GlobaContext';
import {Iconify} from 'react-native-iconify';
import ImageModal from '../../Component/Modal/ImageModal';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export default function SingleDoctor({route}) {
  let {notDoctor, doctorId} = route.params;
  let theme = useTheme();
  let navigation = useNavigation();
  let screenName = notDoctor ? 'Doctor Detail' : 'Profile Detail';
  const {userDetail} = useAuthContext();
  const [singleDoctor, setSingleDoctor] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const GetSingleDoctor = async () => {
    const userToken = await AsyncStorage.getItem('token');
    if (!userToken) return;
    try {
      const unsubscribe = firestore()
        .collection('users') // Assuming agents are in the `users` collection
        .doc(doctorId)
        .onSnapshot(async userDoc => {
          if (!userDoc.exists) {
            return;
          };
          const singleDoctor = {id: userDoc.id, ...userDoc.data()};
          // Set user details if the account is active
          await setSingleDoctor(singleDoctor);
        });
      // Clean up the listener when the component unmounts or userToken changes
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    GetSingleDoctor();
  }, []);

  let iconsize = 26;
  let contentSize = 15;

  const renderAction = () => (
    <>
      <Appbar.Action
        onPress={() => navigation.navigate('EditProfile', {fromdoctor: true})}
        animated={false}
        icon={() => (
          <Iconify icon="mynaui:edit" size={28} color={theme.colors.green} />
        )}
      />
    </>
  );

  const [visible, setVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [previmage, setPrevimage] = useState(null);
  // Function to handle opening the modal with animation
  const handlePrevImage = () => {
    setVisible(true);
    let imageUri = singleDoctor?.profile_image?.imageUri;
    setPrevimage(imageUri);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  return (
    <>
      <Header screenName={screenName} {...(!notDoctor ? {renderAction} : {})} />
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.topcontainer}>
            <View style={styles.profileNameandSpecialist}>
              <CustomText
                numberOfLines={2}
                style={[{fontFamily: fonts.Bold, fontSize: 24, width: 200}]}>
                {singleDoctor?.name}
              </CustomText>
              <View style={[styles.specialistView]}>
                <CustomText
                  style={[
                    {
                      fontFamily: fonts.SemiBold,
                      fontSize: 14,
                      // textAlign: 'center',
                    },
                  ]}>
                  {singleDoctor?.specialist}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity
              onPress={handlePrevImage}
              style={styles.imageview}>
              <Image
                style={styles.image}
                source={{uri: singleDoctor?.profile_image?.imageUri}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.otherDetailView,
              // {backgroundColor: theme.colors.transpgrey},
            ]}>
            <CustomText style={[{fontFamily: fonts.Bold, fontSize: 20}]}>
              Other Detail
            </CustomText>

            <View style={{marginTop: 10, marginHorizontal: 10}}>
              <View style={styles.iconView}>
                <Iconify
                  icon="mdi:phone"
                  size={iconsize}
                  color={theme.colors.onBackground}
                />
                <CustomText
                  style={[{fontFamily: fonts.Regular, fontSize: contentSize}]}>
                  {singleDoctor?.contact}
                </CustomText>
              </View>

              <View style={styles.iconView}>
                <Iconify
                  icon="mdi:email"
                  size={iconsize}
                  color={theme.colors.onBackground}
                />
                <CustomText
                  style={[{fontFamily: fonts.Regular, fontSize: contentSize}]}>
                  {singleDoctor?.email}
                </CustomText>
              </View>

              {singleDoctor?.availableTime && (
                <View style={styles.iconView}>
                  <Iconify
                    icon="lets-icons:time-fill"
                    size={iconsize}
                    color={theme.colors.onBackground}
                  />
                  <CustomText
                    style={[
                      {fontFamily: fonts.Regular, fontSize: contentSize},
                    ]}>
                    {moment(singleDoctor?.availableTime?.from).format(
                      'hh:mm A',
                    )}{' '}
                    -{' '}
                    {moment(singleDoctor?.availableTime?.to).format('hh:mm A')}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
          <View>
            {userDetail?.role == 'user' && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('BookDoctor', {
                    doctorDetail: singleDoctor,
                  })
                }
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.onBackground},
                ]}>
                {!spinner ? (
                  <CustomText
                    style={[
                      {
                        color: theme.colors.background,
                        fontSize: 17,
                        fontFamily: fonts.SemiBold,
                      },
                    ]}>
                    Book Doctor
                  </CustomText>
                ) : (
                  <ActivityIndicator
                    size={24}
                    color={theme.colors.background}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      <ImageModal
        visible={visible}
        image={previmage}
        opacityAnim={opacityAnim}
        setVisible={setVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 10,

    // backgroundColor:'green'
  },
  topcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileNameandSpecialist: {},
  specialistView: {
    padding: 2,
    borderRadius: 10,
    marginHorizontal: 2,
    top: -2,
  },
  imageview: {},
  image: {
    height: 170,
    width: 170,
    borderRadius: 100,
  },
  otherDetailView: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 10,
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  button: {
    marginTop: 10,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
