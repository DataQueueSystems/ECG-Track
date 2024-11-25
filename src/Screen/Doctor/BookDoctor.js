import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Component/Header';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Iconify} from 'react-native-iconify';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {showToast} from '../../../utils/Toast';
import firestore from '@react-native-firebase/firestore';
import {useAuthContext} from '../../context/GlobaContext';

export default function BookDoctor({route}) {
  let {doctorDetail} = route.params;
  const {Checknetinfo, userDetail} = useAuthContext();
  let theme = useTheme();
  let navigation = useNavigation();
  const filledStars = Math.floor(2); // Number of fully filled stars
  const [spinner, setSpinner] = useState(false);
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

  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleTimeChange = (event, selectedTime) => {
    setShowPicker(false); // Always hide the picker
    if (selectedTime) {
      setTime(selectedTime); // Update state with the selected time
    }
  };
  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    // Round the start time up to the next 10-minute interval
    let current = moment(startTime).add(
      10 - (moment(startTime).minute() % 10),
      'minutes',
    );
    const end = moment(endTime);
    while (current <= end) {
      slots.push(current.format('hh:mm A')); // Format the time
      current = current.add(90, 'minutes'); // Increment by 10 minutes
    }

    return slots;
  };

  let fromTime = moment(doctorDetail?.availableTime?.from);
  let toTime = moment(doctorDetail?.availableTime?.to);
  const timeSlots = generateTimeSlots(fromTime, toTime);
  const handleSlotPress = slot => {
    setSelectedSlot(slot);
  };

  const ConfirmBook = async () => {
    setSpinner(true);
    const isConnected = await Checknetinfo();
    if (!isConnected) {
      setSpinner(false);
      return; // Do not proceed if there is no internet connection
    }
    let data = {
      time: time,
      timeSlot: selectedSlot,
      doctorId: doctorDetail?.id,
      createdAt: firestore.FieldValue.serverTimestamp(), // Add timestamp
    };
    if (userDetail?.role == 'user') {
      data.userId = userDetail?.id;
    }
    if (!selectedSlot) {
      showToast('Select the time Slot');
      setSpinner(false);
      return;
    }
    try {
      await firestore().collection('bookings').add(data); // Push to 'bookings' collection
      showToast('Booking confirmed successfully!');
      // Navigate to the confirmation screen or back to previous screen
    navigation.navigate('Parent'); // or navigation.goBack() if going back
      setSpinner(false);
    } catch (error) {
      console.error('Error saving booking:', error);
      showToast('Failed to confirm booking. Please try again.');
    }
  };

  return (
    <>
      <Header screenName={'Book Doctor'} />
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {/* Doctor detail */}
          <View
            style={[
              styles.doctorDetail,
              {backgroundColor: theme.colors.transpgrey},
            ]}>
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <Image
                style={styles.image}
                source={{uri: doctorDetail?.profile_image.imageUri}}
              />
              <View style={styles.doctorContent}>
                <CustomText style={[{fontFamily: fonts.Bold, fontSize: 16}]}>
                  {doctorDetail?.name}
                </CustomText>
                <CustomText style={[{fontFamily: fonts.Regular, fontSize: 14}]}>
                  {doctorDetail?.specialist}
                </CustomText>
                {doctorDetail?.availableTime && (
                  <CustomText
                    style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
                    {moment(doctorDetail?.availableTime?.from).format(
                      'hh:mm A',
                    )}{' '}
                    -{' '}
                    {moment(doctorDetail?.availableTime?.to).format('hh:mm A')}
                  </CustomText>
                )}
                {/* Filled Stars */}
                <View
                  style={{
                    flexDirection: 'row', // Arrange items in a row
                    gap: 6, // Add spacing between items (React Native 0.71+)
                    right: 4, // Adjust the position of the container (optional)
                    top: 4,
                    justifyContent: 'flex-start', // Align items to the start (left)
                    alignItems: 'center', // Align items vertically in the center
                  }}>
                  {[...Array(filledStars)].map((_, index) => (
                    <Icon
                      key={`filled-${index}`}
                      name="star"
                      size={19}
                      color={theme.colors.onBackground}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'column',
                gap: 10,
                padding: 10,
                backgroundColor: theme.colors.transpgrey,
                borderRadius: 10,
              }}>
              <Iconify
                icon="mdi:email-fast"
                size={30}
                color={theme.colors.onBackground}
                onPress={() => handleEmailPress(doctorDetail?.email)}
              />
              <Iconify
                icon="fluent:call-28-filled"
                size={30}
                color={theme.colors.onBackground}
                onPress={() => handleCallPress(doctorDetail?.contact)}
              />
            </View>
          </View>

          {/* Select Date */}
          <View style={styles.selectDate}>
            <CustomText style={[{fontFamily: fonts.Bold, fontSize: 17}]}>
              Select Date
            </CustomText>

            {showPicker && (
              <DateTimePicker
                value={time}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour={true}
                minimumDate={new Date()} // Disable past dates by setting minimum date to today
                onChange={handleTimeChange}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              activeOpacity={0.8}
              style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}>
              <Iconify
                icon="solar:calendar-linear"
                size={26}
                color={theme.colors.onBackground}
              />
              <CustomText
                style={[{fontFamily: fonts.Medium, fontSize: 14, top: 3}]}>
                {moment(time).format('DD MMM YYYY')}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Select Time Slot */}
          <View style={styles.selecttimeSlot}>
            <CustomText style={[{fontFamily: fonts.Bold, fontSize: 17}]}>
              Select Time Slot
            </CustomText>
            <View style={styles.slots}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => handleSlotPress(slot)}
                  style={[
                    styles.singleSlot,
                    {
                      backgroundColor:
                        selectedSlot == slot
                          ? theme.colors.green
                          : theme.colors.transpgrey,
                    },
                  ]}>
                  <CustomText
                    style={[{fontFamily: fonts.Medium, fontSize: 15}]}>
                    {slot}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={spinner ? () => {} : ConfirmBook}
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
                Confirm
              </CustomText>
            ) : (
              <ActivityIndicator size={24} color={theme.colors.background} />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 10,

    // backgroundColor:'green'
  },

  doctorDetail: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  doctorContent: {
    padding: 10,
  },
  selectDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 2,
  },
  selecttimeSlot: {
    marginVertical: 15,
    marginHorizontal: 2,
  },
  slots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    marginHorizontal: 2,
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  singleSlot: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 7,
    width: 90,
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
