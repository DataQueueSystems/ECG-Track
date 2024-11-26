import React, {useRef, useState} from 'react';
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
import {fonts} from '../../customText/fonts';
import {Iconify} from 'react-native-iconify';
import {Divider, useTheme} from 'react-native-paper';
import CustomText from '../../customText/CustomText';
import {useAuthContext} from '../../context/GlobaContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import ImageModal from '../Modal/ImageModal';

const RecommandedDoctor = () => {
  const {allDoctor} = useAuthContext();
  let theme = useTheme();
  let navigation = useNavigation();

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

  const handleSinglePress = id => {
    navigation.navigate('SingleDoctor', {notDoctor: true, doctorId: id});
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleSinglePress(item.id)}
      style={[styles.card, {backgroundColor: theme.colors.transpgrey}]}>
      <View style={[styles.iconView]}>
        {item?.profile_image?.imageUri ? (
          <TouchableOpacity
            onPress={() => handlePrevImage(item?.profile_image?.imageUri)}>
            <Image
              source={{uri: item?.profile_image?.imageUri}}
              style={[
                styles.profileImage,
                {borderColor: theme.colors.appcolor},
              ]}
            />
          </TouchableOpacity>
        ) : (
          <>
            <View style={[]}>
              <Iconify
                icon="fontisto:doctor"
                size={44}
                color={theme.colors.onBackground}
              />
            </View>
          </>
        )}

        <View
          style={{
            flexDirection: 'column', // Arrange items in a row
            gap: 2, // Add spacing between items (React Native 0.71+)
            right: 4, // Adjust the position of the container (optional)
            justifyContent: 'flex-start', // Align items to the start (left)
            alignItems: 'center', // Align items vertically in the center
          }}>
          {/* Filled Stars */}

          {item?.averageRating && (
            <>
              <View
                style={{
                  flexDirection: 'row', // Arrange items in a row
                  alignItems: 'center', // Align items vertically in the center
                  gap: 2, // Add spacing between items (React Native 0.71+)
                }}>
                {/* Render all 5 stars */}
                {[...Array(5)].map((_, index) => {
                  const rating = item?.averageRating; // Current rating
                  const isFullStar = index + 1 <= Math.floor(rating); // Check if it’s a full star
                  const isHalfStar =
                    index + 1 > Math.floor(rating) && index < Math.ceil(rating); // Check if it’s a half star
                  return (
                    <MaterialIcons
                      key={`star-${index}`}
                      name={
                        isFullStar
                          ? 'star' // Full star icon
                          : isHalfStar
                          ? 'star-half' // Half star icon
                          : 'star-border' // Empty star icon
                      }
                      size={22}
                      color={
                        isFullStar || isHalfStar
                          ? theme.colors.rate
                          : theme.colors.disabled
                      } // Highlight or grey color
                    />
                  );
                })}
              </View>
              <CustomText style={{fontFamily: fonts.Medium, fontSize: 11}}>
                {item?.averageRating?.toFixed(1)} Rating
              </CustomText>
            </>
          )}
        </View>
      </View>

      <View style={{paddingBottom: 10, gap: 4}}>
        <View style={{marginTop: 10, marginHorizontal: 10}}>
          <CustomText style={[{fontFamily: fonts.Bold, fontSize: 15}]}>
            {item?.name}
          </CustomText>
          <CustomText
            style={[styles.specialistText, {fontFamily: fonts.Regular}]}>
            {item?.specialist}
          </CustomText>
          {/* Contact Number */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Iconify
              icon="mdi:phone"
              size={20}
              color={theme.colors.onBackground}
            />
            <CustomText style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
              {item?.contact}
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
              {item?.email}
            </CustomText>
          </View>

          {/* Available Time */}
          {item?.availableTime && (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Iconify
                icon="mdi:clock-time-four-outline"
                size={20}
                color={theme.colors.onBackground}
              />
              <CustomText style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
                {moment(item?.availableTime?.from).format('hh:mm A')} -{' '}
                {moment(item?.availableTime?.to).format('hh:mm A')}
              </CustomText>
            </View>
          )}

          {/* Address */}
          {item?.address && (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Iconify
                icon="mdi:map-marker"
                size={20}
                color={theme.colors.onBackground}
              />

              <CustomText
                numberOfLines={3}
                style={[{fontFamily: fonts.Regular, fontSize: 12}]}>
                {item?.address}
              </CustomText>
            </View>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'column',
          gap: 10,
          padding: 10,
          right: 0,
          position: 'absolute',
          bottom: 0,
          backgroundColor: theme.colors.onlightGrey,
          borderRadius: 10,
        }}>
        <Iconify
          icon="mdi:email-fast"
          size={30}
          color={theme.colors.background}
          onPress={() => handleEmailPress(item?.email)}
        />
        <Iconify
          icon="fluent:call-28-filled"
          size={30}
          color={theme.colors.background}
          onPress={() => handleCallPress(item?.contact)}
        />
      </View>
    </TouchableOpacity>
  );

  let centerStyle =
    allDoctor?.length == 1
      ? {
          justifyContent: 'center', // Center horizontally
          alignItems: 'center', // Center vertically if needed}
        }
      : {};

  return (
    <>
      <View style={styles.mainContainer}>
        <CustomText style={[styles.apText, {fontFamily: fonts.Bold}]}>
          Top Doctor for You
        </CustomText>

        <View style={styles.RecommandedDoctorContainer}>
          {allDoctor?.length == 0 ? (
            <>
              <View
                style={{
                  flex: 1,
                }}>
                <CustomText
                  style={{
                    fontFamily: fonts.Regular,
                    fontSize: 18,
                    left: 10,
                  }}>
                  No Doctor found
                </CustomText>
              </View>
            </>
          ) : (
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              horizontal
              data={allDoctor}
              renderItem={renderItem}
              keyExtractor={item => item?.id}
              contentContainerStyle={[
                {
                  flexGrow: 1, // Ensure the container grows to fill available space
                },
                centerStyle,
              ]}
              style={{
                flexGrow: 0, // Prevent the list from growing beyond its content
              }}
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
    </>
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
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 0.5,
  },
});

export default RecommandedDoctor;
