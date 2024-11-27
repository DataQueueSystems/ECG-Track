import {
  ActivityIndicator,
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
import {showToast} from '../../../utils/Toast';

export default function SingleDoctor({route}) {
  let {notDoctor, doctorId} = route.params;
  let theme = useTheme();
  let navigation = useNavigation();
  let screenName = notDoctor ? 'Doctor Detail' : 'Profile Detail';
  const {userDetail, Checknetinfo, } = useAuthContext();
  const [singleDoctor, setSingleDoctor] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const GetSingleDoctor = async () => {
    
    try {
      const unsubscribe = firestore()
        .collection('users') // Assuming agents are in the `users` collection
        .doc(doctorId)
        .onSnapshot(async userDoc => {
          if (!userDoc.exists) {
            return;
          }
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

  const [rating, setRating] = useState(0);
  const handleStarPress = index => {
    setRating(index + 1);
  };

  const [rateSpinner, setRateSpinner] = useState(false);

  const SubmitRate = async () => {
    setRateSpinner(true);
    if (!rating) {
      setRateSpinner(false);
      showToast(`Rating is Required`);
      return;
    }
    const isConnected = await Checknetinfo();
    if (!isConnected) {
      setRateSpinner(false);
      return; // Do not proceed if there is no internet connection
    }
    let data = {
      userId: userDetail?.id,
      doctorId: singleDoctor?.id,
      rating,
    };
    const currentFeedback = singleDoctor?.feedback || [];
    // Add the new rating data to the feedback array
    const updatedFeedback = [...currentFeedback, data];
    // Calculate the average rating from the updated feedback (sum of ratings)
    const total = updatedFeedback.reduce(
      (sum, feedback) => sum + feedback.rating,
      0,
    ); // Sum of rating values
    const averageRating = total / updatedFeedback.length;
    try {
      // Update the doctor's feedback array and average rating
      await firestore().collection('users').doc(singleDoctor?.id).update({
        feedback: updatedFeedback,
        averageRating: averageRating, // Store the calculated average rating
      });
      showToast('Booking confirmed successfully!');
      // Navigate to the confirmation screen or back to previous screen
      setRateSpinner(false);
    } catch (error) {
      console.error('Error saving booking:', error);
      showToast('Failed to confirm booking. Please try again.');
      setRateSpinner(false);
    }
  };

  const handleNavigate = () => {
    if (!singleDoctor?.availableTime) {
      showToast(
        "Sorry to say that, This Doctor Didn't mention the availabel time",
      );
      return;
    }
    navigation.navigate('BookDoctor', {
      doctorDetail: singleDoctor,
    });
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

            {singleDoctor?.profile_image?.imageUri ? (
              <TouchableOpacity onPress={handlePrevImage}>
                <Image
                  style={styles.image}
                  source={{uri: singleDoctor?.profile_image?.imageUri}}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.imageview}>
                <Iconify
                  icon="fontisto:doctor"
                  size={90}
                  color={theme.colors.onBackground}
                />
              </View>
            )}
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

              {singleDoctor?.address && (
                <View style={styles.iconView}>
                  <Iconify
                    icon="mingcute:location-line"
                    size={iconsize}
                    color={theme.colors.onBackground}
                  />
                  <CustomText
                    style={[
                      {fontFamily: fonts.Regular, fontSize: contentSize},
                    ]}>
                    {singleDoctor?.address}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
          <View>
            {userDetail?.role == 'user' && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleNavigate}
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

          <View style={styles.allRate}>
            <CustomText
              style={[
                {
                  fontFamily: fonts.SemiBold,
                  fontSize: 20,
                  marginTop: 10,
                  // textAlign: 'center',
                },
              ]}>
              Rating
            </CustomText>
            <Divider />

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginVertical: 10,
                alignItems: 'center',
              }}>
              {/* icon */}
              <Iconify
                icon="solar:star-bold"
                size={38}
                color={theme.colors.rate}
              />
              {/* Rate Text */}
              <View>
                <View>
                  <CustomText style={{fontFamily: fonts.Medium, fontSize: 19}}>
                    {singleDoctor?.averageRating?.toFixed(1)} Rating
                  </CustomText>
                  <CustomText style={{fontFamily: fonts.Light, fontSize: 12}}>
                    Based on {singleDoctor?.feedback?.length} rate
                  </CustomText>
                </View>
              </View>
            </View>

            <View>
              <CustomText style={{fontFamily: fonts.Light, fontSize: 14}}>
                Your rating helps others find the best doctors and ensures
                better health outcomes for everyone.
              </CustomText>
            </View>

            {userDetail?.role == 'user' && (
              <>

<CustomText style={{fontFamily: fonts.Medium, fontSize: 14,color:theme.colors.green,top:4}}>
                Give Your's
              </CustomText>
                <View style={styles.starsContainer}>
                  {Array.from({length: 5}, (_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleStarPress(index)}
                      style={styles.star}>
                      <CustomText
                        style={[
                          rating > index && styles.selectedStar,
                          {fontFamily: fonts.SemiBold, fontSize: 28},
                        ]}>
                        ★
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={rateSpinner ? () => {} : SubmitRate}
                  style={[
                    styles.button2,
                    {borderColor: theme.colors.onBackground},
                  ]}>
                  {!rateSpinner ? (
                    <CustomText
                      style={[
                        {
                          color: theme.colors.onBackground,
                          fontSize: 15,
                          fontFamily: fonts.Medium,
                        },
                      ]}>
                      Submit
                    </CustomText>
                  ) : (
                    <ActivityIndicator
                      size={24}
                      color={theme.colors.onBackground}
                    />
                  )}
                </TouchableOpacity>
              </>
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
  imageview: {
    padding: 30,
  },
  image: {
    height: 170,
    width: 170,
    borderRadius: 100,
  },
  otherDetailView: {
    marginVertical: 20,
    paddingVertical: 10,
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
  button2: {
    marginTop: 10,
    padding: 10,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  allRate: {
    marginVertical: 10,
  },
  star: {
    marginHorizontal: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  selectedStar: {
    color: '#FFD700', // Gold color for selected stars
  },
});
