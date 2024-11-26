import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import {Iconify} from 'react-native-iconify';
import {Divider, useTheme} from 'react-native-paper';
import {useAuthContext} from '../context/GlobaContext';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import ImageModal from './Modal/ImageModal';
import DoctorSheet from './Doctor/DoctorSheet';
import Icon from 'react-native-vector-icons/FontAwesome';

const Appointment = ({data, fromUser}) => {
  let theme = useTheme();
  let navigation = useNavigation();
  const {bookingData,userDetail} = useAuthContext();
  const handleCallPress = contactNumber => {
    const phoneURL = `tel:${contactNumber}`;
    Linking.canOpenURL(phoneURL)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneURL);
        } else {
          Alert.alert('Error', 'Unable to make a call on this device.');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const handleEmailPress = email => {
    const emailURL = `mailto:${email}`;
    Linking.openURL(emailURL);
  };

  const bottomSheetRef = useRef(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedaptDetail, setSelectedAptDetail] = useState(null);
  const handlePress = async detail => {
    bottomSheetRef.current?.expand(); // Use expand instead of open
    let {person} = detail;
    await setSelectedDoctor(person);
    await setSelectedAptDetail(detail);
  };

  const renderItem = ({item}) => {
    let {person} = item;
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => handlePress(item)}
          style={[styles.card, {backgroundColor: theme.colors.transpgrey}]}>
          <View style={styles.iconView}>
            {person?.profile_image?.imageUri ? (
              <TouchableOpacity
                onPress={() =>
                  handlePrevImage(person?.profile_image?.imageUri)
                }>
                <Image
                  source={{uri: person?.profile_image?.imageUri}}
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
                  {/* <Iconify
                icon="fontisto:doctor"
                size={20}
                color={theme.colors.onBackground}
              /> */}
                  {fromUser ? (
                    <Iconify
                      icon="fontisto:doctor"
                      size={40}
                      color={theme.colors.onBackground}
                    />
                  ) : (
                    <Iconify
                      icon="solar:user-outline"
                      size={40}
                      color={theme.colors.onBackground}
                    />
                  )}
                </View>
              </>
            )}
          </View>
          <View style={{paddingBottom: 10, gap: 4}}>
            <View>
              <CustomText style={[{fontFamily: fonts.Bold, fontSize: 16}]}>
                {person?.name}
              </CustomText>

              {userDetail?.role=="user" && person?.averageRating&&(
              <View
                style={{
                  flexDirection: 'row', // Arrange items in a row
                  gap: 4, // Add spacing between items (React Native 0.71+)
                  justifyContent: 'flex-start', // Align items to the start (left)
                  alignItems: 'center', // Align items vertically in the center
                  marginVertical: 2,
                }}>
                {/* Filled Stars */}
                {[...Array(Math.floor(person?.averageRating))]?.map(
                  (_, index) => (
                    <Iconify
                    key={`filled-${index}`}
                    icon="solar:star-bold"
                    size={15}
                    color={theme.colors.rate}
                  />
                  ),
                )}
              </View>
              )}


              {item?.specialty && (
                <CustomText
                  style={[styles.specialtyText, {fontFamily: fonts.Regular}]}>
                  {person.specialty}
                </CustomText>
              )}

              <CustomText style={[{fontFamily: fonts.Regular, fontSize: 13}]}>
                {person?.email}
              </CustomText>
              <CustomText style={[{fontFamily: fonts.Light}]}>
                {person?.contact}
              </CustomText>
            </View>
            <Divider />
            <View style={styles.dateView}>
              <CustomText style={[{fontFamily: fonts.Light, fontSize: 12}]}>
                {moment(item?.time).format('DD MMM Y')}
              </CustomText>
            </View>
          </View>
          <View
            style={{
              backgroundColor: theme.colors.lightGrey,
              padding: 6,
              borderRadius: 19,
              position: 'absolute',
              bottom: 10,
              right: 5,
            }}>
            <CustomText
              style={[
                {fontFamily: fonts.Light, fontSize: 14, marginHorizontal: 5},
              ]}>
              {item?.timeSlot}
            </CustomText>
          </View>

          {/* Email & contact */}
          <View
            style={{
              borderRadius: 19,
              position: 'absolute',
              top: 10,
              right: 5,
              padding: 6,
              gap: 10,
              backgroundColor: theme.colors.lightGrey,
            }}>
            <Iconify
              icon="fluent:call-28-filled"
              size={25}
              color={theme.colors.onBackground}
              onPress={() => handleCallPress(item?.contact)}
            />
            <Iconify
              icon="mdi:email-fast"
              size={25}
              color={theme.colors.onBackground}
              onPress={() => handleEmailPress(item?.email)}
            />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const [visible, setVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [previmage, setPrevimage] = useState(null);
  // Function to handle opening the modal with animation
  const handlePrevImage = imageUri => {
    setVisible(true);
    setPrevimage(imageUri);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <CustomText style={[styles.apText, {fontFamily: fonts.Bold}]}>
          Your Appointments
        </CustomText>

        <View style={styles.appointmentContainer}>
        {bookingData?.length == 0 ? (
            <>
              <View
                style={{
                  flex: 1,
                }}>
                <CustomText
                  style={{
                    fontFamily: fonts.Regular,
                    fontSize: 18,
                    left:10
                  }}>
                  No book found
                </CustomText>
              </View>
            </>
          ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            data={bookingData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          )}
        </View>
      </View>

      <ImageModal
        visible={visible}
        image={previmage}
        opacityAnim={opacityAnim}
        setVisible={setVisible}
      />
      <DoctorSheet
        bottomSheetRef={bottomSheetRef}
        doctor={selectedDoctor}
        fromApt={true}
        selectedaptDetail={selectedaptDetail}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  apText: {
    fontSize: 20,
    marginBottom: 10,
  },
  appointmentContainer: {
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width - 120,
    gap: 10,
  },
  iconView: {
    padding: 4,
    alignSelf: 'center',
  },
  dateView: {
    flexDirection: 'row',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 0.5,
  },
});

export default Appointment;
