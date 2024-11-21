import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {fonts} from '../../customText/fonts';
import {Iconify} from 'react-native-iconify';
import {Divider, useTheme} from 'react-native-paper';
import CustomText from '../../customText/CustomText';

const RecommandedDoctor = () => {
  let theme = useTheme();

  const doctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      availableTime: '9:00 AM - 5:00 PM',
      contact: '+1 234 567 890',
      email: 'n@gmail.com',
    },
    {
      id: '2',
      name: 'Dr. Michael Smith',
      specialty: 'Neurologist',
      email: 'n@gmail.com',
      availableTime: '10:00 AM - 4:00 PM',
      contact: '+1 987 654 321',
    },
    {
      id: '3',
      name: 'Dr. Emma Brown',
      specialty: 'Dermatologist',
      availableTime: '11:00 AM - 3:00 PM',
      contact: '+1 555 123 456',
      email: 'n@gmail.com',
    },
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      availableTime: '9:00 AM - 5:00 PM',
      contact: '+1 234 567 890',
      email: 'n@gmail.com',
    },
    {
      id: '2',
      name: 'Dr. Michael Smith',
      specialty: 'Neurologist',
      availableTime: '10:00 AM - 4:00 PM',
      contact: '+1 987 654 321',
      email: 'n@gmail.com',
    },

    {
      id: '3',
      name: 'Dr. Emma Brown',
      specialty: 'Dermatologist',
      availableTime: '11:00 AM - 3:00 PM',
      contact: '+1 555 123 456',
      email: 'n@gmail.com',
    },
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      availableTime: '9:00 AM - 5:00 PM',
      contact: '+1 234 567 890',
      email: 'n@gmail.com',
    },
    {
      id: '2',
      name: 'Dr. Michael Smith',
      specialty: 'Neurologist',
      availableTime: '10:00 AM - 4:00 PM',
      contact: '+1 987 654 321',
      email: 'n@gmail.com',
    },
    {
      id: '3',
      name: 'Dr. Emma Brown',
      specialty: 'Dermatologist',
      availableTime: '11:00 AM - 3:00 PM',
      contact: '+1 555 123 456',
      email: 'n@gmail.com',
    },
  ];

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
    Linking.canOpenURL(emailURL)
      .then(supported => {
        if (supported) {
          Linking.openURL(emailURL);
        } else {
          Alert.alert('Error', 'Unable to send an email on this device.');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const renderItem = ({item}) => (
    <View style={[styles.card, {backgroundColor: theme.colors.error}]}>
      <View
        style={[styles.iconView, {backgroundColor: theme.colors.transpgrey}]}>
        <Iconify
          icon="fontisto:doctor"
          size={40}
          color={theme.colors.onBackground}
        />

        <View style={{flexDirection: 'row', gap: 12, right: 4}}>
          <Iconify
            icon="fluent:call-28-filled"
            size={30}
            color={theme.colors.onBackground}
            onPress={() => handleCallPress(item?.contact)}
          />
          <Iconify
            icon="mdi:email-fast"
            size={30}
            color={theme.colors.onBackground}
            onPress={() => handleEmailPress(item?.email)}
          />
        </View>
      </View>
      <View style={{paddingBottom: 10, gap: 4}}>
        <View style={{marginTop: 10, marginHorizontal: 10}}>
          <CustomText style={[{fontFamily: fonts.Bold, fontSize: 15}]}>
            {item.name}
          </CustomText>
          <CustomText
            style={[styles.specialtyText, {fontFamily: fonts.Regular}]}>
            {item.specialty}
          </CustomText>
          {/* Contact Number */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Iconify
              icon="mdi:phone"
              size={20}
              color={theme.colors.onBackground}
            />
            <CustomText style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
              +1 234 567 890
            </CustomText>
          </View>

          {/* Email */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Iconify
              icon="mdi:email"
              size={20}
              color={theme.colors.onBackground}
            />
            <CustomText style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
              dr.richard@example.com
            </CustomText>
          </View>

          {/* Available Time */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Iconify
              icon="mdi:clock-time-four-outline"
              size={20}
              color={theme.colors.onBackground}
            />
            <CustomText style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
              9:00 AM - 5:00 PM
            </CustomText>
          </View>

          {/* Address */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Iconify
              icon="mdi:map-marker"
              size={20}
              color={theme.colors.onBackground}
            />
            <CustomText
              numberOfLines={3}
              style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
              123 Medical Avenue,
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <CustomText style={[styles.apText, {fontFamily: fonts.Bold}]}>
        Recommanded Doctors
      </CustomText>

      <View style={styles.RecommandedDoctorContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          data={doctors}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    paddingVertical: 10,
  },
  apText: {
    fontSize: 20,
    marginBottom: 10,
  },
  RecommandedDoctorContainer: {
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width - 100,
    gap: 10,
    paddingTop: 70,
  },
  iconView: {
    padding: 10,
    alignSelf: 'center',
    position: 'absolute',
    top: 10,
    left: 15,
    right: 10,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dateView: {
    flexDirection: 'row',
  },
});

export default RecommandedDoctor;
