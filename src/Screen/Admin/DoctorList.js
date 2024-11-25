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
import {useAuthContext} from '../../context/GlobaContext';
import moment from 'moment';

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
          {item?.profile_image?.imageUri ? (
            <Image
              source={{uri: item?.profile_image?.imageUri}}
              style={[
                styles.profileImage,
                {borderColor: theme.colors.appcolor},
              ]}
            />
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

          <View style={styles.doctorDetails}>
            <CustomText style={[styles.doctorName, {fontFamily: fonts.Bold}]}>
              {item?.name}
            </CustomText>
            <CustomText
              style={[styles.doctorspecialist, {fontFamily: fonts.SemiBold}]}>
              {item?.specialist}
            </CustomText>
            {item?.availableTime && (
              <CustomText
                style={[styles.doctorTime, {fontFamily: fonts.Regular}]}>
                Available:   {moment(item?.availableTime?.from).format('hh:mm A')}{' '}
                - {moment(item?.availableTime?.to).format('hh:mm A')}
              </CustomText>
            )}
            <CustomText
              style={[styles.doctorContact, {fontFamily: fonts.Light}]}>
              Contact: {item?.contact}
            </CustomText>
            <CustomText
              style={[styles.doctorContact, {fontFamily: fonts.Light}]}>
              Email: {item?.email}
            </CustomText>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const {allDoctor} = useAuthContext();
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
        onPress={() =>
          navigation.navigate('ControlDoctor', {screenName: 'Add Doctor'})
        }
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
        {allDoctor?.length == 0 ? (
          <>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <CustomText
                style={{
                  fontFamily: fonts.Regular,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                No Doctor found
              </CustomText>
            </View>
          </>
        ) : (
          <>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={allDoctor}
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
                    style={[
                      styles.headerSubtitle,
                      {fontFamily: fonts.Regular},
                    ]}>
                    Explore the list of available doctors
                  </CustomText>
                </View>
              }
            />
          </>
        )}
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
    gap: 16,
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
  doctorspecialist: {
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
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginRight: 16,
    borderWidth: 1,
  },
});

export default DoctorList;
