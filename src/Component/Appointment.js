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
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import {Iconify} from 'react-native-iconify';
import {Divider, useTheme} from 'react-native-paper';

const Appointment = ({data, fromUser}) => {
  let theme = useTheme();

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

  const renderItem = ({item}) => (
    <View style={[styles.card, {backgroundColor: theme.colors.green}]}>
      <View style={styles.iconView}>
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
      <View style={{paddingBottom: 10, gap: 4}}>
        <View>
          <CustomText style={[{fontFamily: fonts.Bold, fontSize: 16}]}>
            {item?.name}
          </CustomText>

          {item?.specialty && (
            <CustomText
              style={[styles.specialtyText, {fontFamily: fonts.Regular}]}>
              {item.specialty}
            </CustomText>
          )}
          <CustomText style={[{fontFamily: fonts.Regular, fontSize: 13}]}>
            {item?.email}
          </CustomText>
          <CustomText style={[{fontFamily: fonts.Light}]}>
            {item?.contact}
          </CustomText>
        </View>
        <Divider />
        <View style={styles.dateView}>
          <CustomText style={[{fontFamily: fonts.Light, fontSize: 12}]}>
            20 Sep 2024
          </CustomText>
        </View>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.background,
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
          10:00 AM
        </CustomText>
      </View>

      {/* Email & contact */}
      <View
        style={{
          borderRadius: 19,
          position: 'absolute',
          top: 10,
          right: 5,
          padding: 4,
          gap: 10,
        }}>
        <Iconify
          icon="fluent:call-28-filled"
          size={25}
          color={theme.colors.background}
          onPress={() => handleCallPress(item?.contact)}
        />
        <Iconify
          icon="mdi:email-fast"
          size={25}
          color={theme.colors.background}
          onPress={() => handleEmailPress(item?.email)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <CustomText style={[styles.apText, {fontFamily: fonts.Bold}]}>
        Your Appointment
      </CustomText>

      <View style={styles.appointmentContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
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
    width: Dimensions.get('window').width - 100,
    gap: 10,
  },
  iconView: {
    padding: 4,
    alignSelf: 'center',
  },
  dateView: {
    flexDirection: 'row',
  },
});

export default Appointment;
