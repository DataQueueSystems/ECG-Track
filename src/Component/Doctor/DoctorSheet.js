import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Appearance,
  Alert,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useTheme, Portal, Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {Iconify} from 'react-native-iconify';
import ImageModal from '../Modal/ImageModal';
import moment from 'moment';
import {useAuthContext} from '../../context/GlobaContext';
import firestore from '@react-native-firebase/firestore';
import {showToast} from '../../../utils/Toast';
const DoctorSheet = ({bottomSheetRef, doctor, fromApt, selectedaptDetail}) => {
  const {Checknetinfo, userDetail, bookingData, setRateCount} =
    useAuthContext();
  const snapPoints = ['60%', '90%'];
  const theme = useTheme();
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  let themeColor = Appearance.getColorScheme();
  let iconColor = themeColor == 'dark' ? '#fff' : 'black';
  let iconsize = 70;

  let navigation = useNavigation();
  const handleEdit = () => {
    bottomSheetRef.current.close();
    navigation.navigate('ControlDoctor', {
      screenName: 'Edit Doctor',
      userData: doctor,
    });
  };

  const [visible, setVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [previmage, setPrevimage] = useState(null);
  // Function to handle opening the modal with animation
  const handlePrevImage = () => {
    setVisible(true);
    let imageUri = doctor?.profile_image?.imageUri;
    setPrevimage(imageUri);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const [spinner, setSpinner] = useState(false);

  const SubmitRate = async () => {
    setSpinner(true);
    if (!rating) {
      setSpinner(false);
      showToast(`Rating is Required`);
      return;
    }
    const isConnected = await Checknetinfo();
    if (!isConnected) {
      setSpinner(false);
      return; // Do not proceed if there is no internet connection
    }
    let data = {
      userId: userDetail?.id,
      doctorId: doctor?.id,
      aptId: selectedaptDetail?.id,
      rating,
    };
    const currentFeedback = doctor?.feedback || [];
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
      await firestore().collection('users').doc(doctor?.id).update({
        feedback: updatedFeedback,
        averageRating: averageRating, // Store the calculated average rating
      });
      showToast('Booking confirmed successfully!');
      // Navigate to the confirmation screen or back to previous screen
      navigation.navigate('Parent'); // or navigation.goBack() if going back
      setSpinner(false);
      setRateCount(count => count + 1);
    } catch (error) {
      console.error('Error saving booking:', error);
      showToast('Failed to confirm booking. Please try again.');
      setSpinner(false);
    }
  };

  const [rating, setRating] = useState(0);
  const handleStarPress = index => {
    setRating(index + 1);
  };

  return (
    <>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          index={-1} // Initially closed
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: theme.colors.background,
          }}
          handleIndicatorStyle={{backgroundColor: theme.colors.onBackground}}>
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.bottomModelDiv,
                {backgroundColor: theme.colors.background},
              ]}>
              {/* action Icon */}

              {!fromApt && (
                <View style={styles.actionView}>
                  <Iconify
                    onPress={handleEdit}
                    icon="mynaui:edit"
                    size={27}
                    color={theme.colors.error}
                  />
                </View>
              )}

              {/* Doctor Details */}
              <View style={styles.profileContainer}>
                {doctor?.profile_image?.imageUri ? (
                  <TouchableOpacity onPress={handlePrevImage}>
                    <Image
                      source={{uri: doctor?.profile_image?.imageUri}}
                      style={[
                        styles.profileImage,
                        {borderColor: theme.colors.appcolor},
                      ]}
                    />
                  </TouchableOpacity>
                ) : (
                  <>
                    <View
                      style={[
                        styles.iconView,
                        {backgroundColor: theme.colors.background},
                      ]}>
                      <Iconify
                        icon="fontisto:doctor"
                        size={iconsize}
                        color={iconColor}
                      />
                    </View>
                  </>
                )}

                <CustomText
                  style={[
                    styles.doctorName,
                    {
                      color: theme.colors.onBackground,
                      fontFamily: fonts.SemiBold,
                    },
                  ]}>
                  {doctor?.name || 'Doctor Name'}
                </CustomText>
                {doctor?.specialist && (
                  <CustomText
                    style={[
                      styles.doctorspecialist,
                      {color: theme.colors.primary, fontFamily: fonts.Medium},
                    ]}>
                    {doctor?.specialist}
                  </CustomText>
                )}

                {doctor?.averageRating && (
                  <View style={styles.starsContainer}>
                    {[...Array(Math.floor(doctor?.averageRating))].map(
                      (_, index) => (
                        <Iconify
                          key={`filled-${index}`}
                          icon="solar:star-bold"
                          size={30}
                          color={theme.colors.rate}
                        />
                      ),
                    )}
                  </View>
                )}
              </View>

              {userDetail?.rol == 'admin' ? (
                <>
                  <View
                    style={{
                      marginVertical: 10,
                      marginTop: 20,
                    }}>
                    <CustomText
                      style={[
                        {
                          color: theme.colors.onBackground,
                          fontFamily: fonts.SemiBold,
                        },
                      ]}>
                      AppointMent Detail
                    </CustomText>
                    <Divider />
                  </View>

                  <CustomText
                    style={[
                      styles.infoLabel,
                      {
                        color: theme.colors.onBackground,
                        fontFamily: fonts.Regular,
                      },
                    ]}>
                    Date:{moment(selectedaptDetail?.time).format('DD MMM y')}
                  </CustomText>
                  <CustomText
                    style={[
                      styles.infoLabel,
                      {
                        color: theme.colors.onBackground,
                        fontFamily: fonts.Regular,
                      },
                    ]}>
                    Time:{selectedaptDetail?.timeSlot}
                  </CustomText>

                  <View>
                    <CustomText
                      style={[
                        styles.doctorspecialist,
                        {
                          color: theme.colors.onBackground,
                          fontFamily: fonts.SemiBold,
                        },
                      ]}>
                      {userDetail?.role == 'user'
                        ? 'Doctor Detail'
                        : 'User Detail'}
                    </CustomText>
                    <Divider />
                  </View>
                </>
              ) : (
                <View style={{marginTop: 10}} />
              )}
              {/* Additional Information */}
              <View style={styles.infoContainer}>
                {doctor?.availableTime && (
                  <>
                    <CustomText
                      style={[
                        styles.infoLabel,
                        {
                          color: theme.colors.onBackground,
                          fontFamily: fonts.Medium,
                        },
                      ]}>
                      Available Time:
                    </CustomText>
                    <CustomText
                      style={[
                        styles.infoValue,
                        {
                          color: theme.colors.onBackground,
                          fontFamily: fonts.Regular,
                        },
                      ]}>
                      {moment(doctor?.availableTime?.from).format('hh:mm A')} -{' '}
                      {moment(doctor?.availableTime?.to).format('hh:mm A')}
                    </CustomText>
                  </>
                )}

                <CustomText
                  style={[
                    styles.infoLabel,
                    {
                      color: theme.colors.onBackground,
                      fontFamily: fonts.Medium,
                    },
                  ]}>
                  Contact:
                </CustomText>
                <CustomText
                  style={[
                    styles.infoValue,
                    {
                      color: theme.colors.onBackground,
                      fontFamily: fonts.Regular,
                    },
                  ]}>
                  {doctor?.contact || '+1 234 567 890'}
                </CustomText>
                <CustomText
                  style={[
                    styles.infoLabel,
                    {
                      color: theme.colors.onBackground,
                      fontFamily: fonts.Medium,
                    },
                  ]}>
                  Email:
                </CustomText>
                <CustomText
                  style={[
                    styles.infoValue,
                    {
                      color: theme.colors.onBackground,
                      fontFamily: fonts.Regular,
                    },
                  ]}>
                  {doctor?.email}
                </CustomText>

                {doctor?.address && (
                  <>
                    <CustomText
                      style={[
                        styles.infoLabel,
                        {
                          color: theme.colors.onBackground,
                          fontFamily: fonts.Medium,
                        },
                      ]}>
                      Address:
                    </CustomText>
                    <CustomText
                      style={[
                        styles.infoValue,
                        {
                          color: theme.colors.onBackground,
                          fontFamily: fonts.Regular,
                        },
                      ]}>
                      {doctor?.address}
                    </CustomText>
                  </>
                )}
              </View>
              <Divider style={{marginTop: 10}} />
              {userDetail?.role == 'admin' && doctor?.averageRating && (
                <>
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
                        <CustomText
                          style={{fontFamily: fonts.Medium, fontSize: 19}}>
                          {doctor?.averageRating?.toFixed(1)} Rating
                        </CustomText>
                        <CustomText
                          style={{fontFamily: fonts.Light, fontSize: 12}}>
                          Based on {doctor?.feedback?.length} rate
                        </CustomText>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>

            {userDetail?.role == 'user' && (
              <View
                style={[
                  styles.ratecontainer,
                  {backgroundColor: theme.colors.transpgrey},
                ]}>
                <View style={{marginTop: 10}}>
                  <CustomText
                    style={[{fontFamily: fonts.Medium, fontSize: 18}]}>
                    Rate Doctor
                  </CustomText>
                </View>
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
                  onPress={spinner ? () => {} : SubmitRate}
                  activeOpacity={0.8}
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
                          fontFamily: fonts.Medium,
                        },
                      ]}>
                      Submit
                    </CustomText>
                  ) : (
                    <ActivityIndicator
                      size={24}
                      color={theme.colors.background}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </Portal>
      <ImageModal
        visible={visible}
        image={previmage}
        opacityAnim={opacityAnim}
        setVisible={setVisible}
      />
    </>
  );
};

export default DoctorSheet;

const styles = StyleSheet.create({
  bottomModelDiv: {
    padding: 15,
  },
  profileContainer: {
    alignItems: 'center',
  },
  iconView: {
    borderRadius: 100,
    alignItems: 'center',
    padding: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
  },

  doctorName: {
    fontSize: 20,
  },
  doctorspecialist: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  infoContainer: {
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 16,
    marginVertical: 3,
  },
  infoValue: {
    fontSize: 14,
    marginTop: 5,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  ratecontainer: {
    margin: 10,
    padding: 10,
    borderRadius: 13,
    marginBottom: 50,
  },
  button: {
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 3,
  },
  selectedStar: {
    color: '#FFD700', // Gold color for selected stars
  },
});
