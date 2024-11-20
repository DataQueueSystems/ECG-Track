import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import Header from '../../Component/Header';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {Iconify} from 'react-native-iconify';
import {useNavigation} from '@react-navigation/native';
import {Appbar, useTheme} from 'react-native-paper';
import DoctorSheet from '../../Component/Doctor/DoctorSheet';

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

const DoctorList = () => {
  const renderDoctorItem = ({item, iconsize, iconColor, handlePress}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => handlePress(item)}
          style={[
            styles.doctorCard,
            {backgroundColor: theme.colors.transpgrey},
          ]}
          activeOpacity={0.7}>
          <View
            style={[
              styles.iconView,
              {backgroundColor: theme.colors.background},
            ]}>
            <Iconify icon="fontisto:doctor" size={iconsize} color={iconColor} />
          </View>

          <View style={styles.doctorDetails}>
            <CustomText style={[styles.doctorName, {fontFamily: fonts.Bold}]}>
              {item.name}
            </CustomText>
            <CustomText
              style={[styles.doctorSpecialty, {fontFamily: fonts.SemiBold}]}>
              {item.specialty}
            </CustomText>
            <CustomText
              style={[styles.doctorTime, {fontFamily: fonts.Regular}]}>
              Available: {item.availableTime}
            </CustomText>
            <CustomText
              style={[styles.doctorContact, {fontFamily: fonts.Light}]}>
              Contact: {item.contact}
            </CustomText>
            <CustomText
              style={[styles.doctorContact, {fontFamily: fonts.Light}]}>
              Email: {item.email}
            </CustomText>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  let theme = useTheme();
  let navigation = useNavigation();
  let themeColor = Appearance.getColorScheme();
  let screenName = 'Doctors';
  let iconColor = themeColor == 'dark' ? '#fff' : 'black';
  let iconsize = 40;

  const bottomSheetRef = useRef(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const handlePress = async doctor => {
    bottomSheetRef.current?.expand(); // Use expand instead of open
    await setSelectedDoctor(doctor);
  };

  const renderAction = () => (
    <>
      <Appbar.Action
        onPress={() => navigation.navigate('ControlDoctor',{screenName:"Add Doctor"})}
        animated={false}
        icon={() => (
          <Iconify
            icon="material-symbols:person-add"
            size={33}
            color={theme.colors.green}
          />
        )}
      />
    </>
  );

  return (
    <>
      <Header screenName={screenName} renderAction={renderAction} />

      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* Doctor List */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={doctors}
          renderItem={({item}) =>
            renderDoctorItem({item, iconColor, iconsize, handlePress})
          }
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.header}>
              <CustomText
                style={[styles.headerTitle, {fontFamily: fonts.Bold}]}>
                About Doctors
              </CustomText>
              <CustomText
                style={[styles.headerSubtitle, {fontFamily: fonts.Regular}]}>
                Explore the list of available doctors
              </CustomText>
            </View>
          }
        />
      </View>

      {/* DoctorSheet */}
      <DoctorSheet bottomSheetRef={bottomSheetRef} doctor={selectedDoctor} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    marginVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 10,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 13,
  },
  doctorImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
  },
  doctorTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  doctorContact: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  iconView: {
    padding: 10,
    borderRadius: 100,
    width: 60,
    height: 60,
    alignItems: 'center',
  },
});

export default DoctorList;
