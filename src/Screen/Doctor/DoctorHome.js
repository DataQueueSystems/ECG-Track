import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {Iconify} from 'react-native-iconify';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {useAuthContext} from '../../context/GlobaContext';
import Icon from 'react-native-vector-icons/Ionicons'; // Use Ionicons
import Appointment from '../../Component/Appointment';

const {width} = Dimensions.get('window');
const cardWidth = width / 2 - 24; // For a two-column grid with padding

export default function Home() {
  const {handleLogout, userDetail} = useAuthContext();

  let theme = useTheme();
  let navigation = useNavigation();
  const isFocused = useIsFocused();
  const backPressedOnce = useRef(false);
 

  const handleNavigate = () => {
    navigation.navigate('EditProfile', {fromuser:true});
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isFocused) {
          if (!backPressedOnce.current) {
            backPressedOnce.current = true;
            showToast("Tap again if you're ready to exit.");
            setTimeout(() => {
              backPressedOnce.current = false;
            }, 2000); // Reset backPressedOnce after 2 seconds
            return true;
          } else {
            BackHandler.exitApp();
            return true;
          }
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, []);

  const renderCard = ({item}) => (
    <View
      style={[
        styles.card,
        {width: cardWidth, backgroundColor: theme.colors.transpgrey},
      ]}>
      <Icon
        name={item.icon}
        size={40}
        color={theme.colors.onBackground}
        style={styles.cardIcon}
      />
      <CustomText style={[styles.cardTitle, {fontFamily: fonts.Black}]}>
        {item.title}
      </CustomText>
      <CustomText style={[styles.cardDescription, {fontFamily: fonts.Regular}]}>
        {item.description}
      </CustomText>
      <CustomText style={[styles.cardSolution, {fontFamily: fonts.SemiBold}]}>
        Solution: {item.solution}
      </CustomText>
    </View>
  );

  let TextColor = {color: 'rgb(22, 21, 21)'};

  const cards = [
    {
      id: '1',
      title: 'Fever',
      icon: 'thermometer-outline',
      description: 'Common viral fever with remedies to stay hydrated.',
      solution: 'Drink fluids and rest.',
    },
    {
      id: '2',
      title: 'Headache',
      icon: 'headset-outline',
      description: 'Tension headaches or migraines with common triggers.',
      solution: 'Avoid stress and take prescribed medication.',
    },
    {
      id: '3',
      title: 'Diabetes',
      icon: 'water-outline',
      description: 'Monitor blood sugar and maintain a balanced diet.',
      solution: 'Regular exercise and prescribed insulin.',
    },
    {
      id: '4',
      title: 'Heart Disease',
      icon: 'heart-outline',
      description: 'Early symptoms include chest pain or breathlessness.',
      solution: 'Maintain a low-fat diet and regular check-ups.',
    },
    {
      id: '5',
      title: 'Flu',
      icon: 'bug-outline',
      description: 'Seasonal flu with symptoms like cough and cold.',
      solution: 'Get enough rest and avoid cold environments.',
    },
    {
      id: '6',
      title: 'Asthma',
      icon: 'cloud-outline',
      description: 'Difficulty in breathing caused by inflamed airways.',
      solution: 'Use prescribed inhalers and avoid allergens.',
    },
  ];

  const users = [
    {
      id: '1',
      name: 'John Doe',
      age: 30,
      email: 'john.doe@gmail.com',
      contact: '+1 123 456 789',
      address: '123 Main Street, New York, NY',
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      email: 'jane.smith@gmail.com',
      contact: '+1 987 654 321',
      address: '456 Elm Street, Los Angeles, CA',
    },
    {
      id: '3',
      name: 'Michael Brown',
      age: 35,
      email: 'michael.brown@gmail.com',
      contact: '+1 555 123 456',
      address: '789 Maple Avenue, Chicago, IL',
    },
    {
      id: '4',
      name: 'Emily White',
      age: 25,
      email: 'emily.white@gmail.com',
      contact: '+1 234 567 890',
      address: '101 Oak Street, Houston, TX',
    },
    {
      id: '5',
      name: 'Robert Johnson',
      age: 40,
      email: 'robert.johnson@gmail.com',
      contact: '+1 321 654 987',
      address: '202 Pine Avenue, San Francisco, CA',
    },
    {
      id: '6',
      name: 'Sophia Davis',
      age: 22,
      email: 'sophia.davis@gmail.com',
      contact: '+1 876 543 210',
      address: '303 Cedar Street, Seattle, WA',
    },
    {
      id: '7',
      name: 'William Garcia',
      age: 32,
      email: 'william.garcia@gmail.com',
      contact: '+1 654 321 987',
      address: '404 Birch Road, Boston, MA',
    },
    {
      id: '8',
      name: 'Olivia Martinez',
      age: 27,
      email: 'olivia.martinez@gmail.com',
      contact: '+1 789 123 456',
      address: '505 Spruce Lane, Miami, FL',
    },
    {
      id: '9',
      name: 'James Wilson',
      age: 29,
      email: 'james.wilson@gmail.com',
      contact: '+1 543 210 987',
      address: '606 Redwood Boulevard, Atlanta, GA',
    },
  ];

  return (
    <>
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <View style={styles.mainHeader}>
          <CustomText
            numberOfLines={1}
            style={{fontFamily: fonts.Bold, fontSize: 22}}>
            Welcome back ,
          </CustomText>

          <View style={{flexDirection: 'row', gap: 4}}>
            <Iconify
              icon="mynaui:edit"
              size={28}
              color={theme.colors.onBackground}
              onPress={handleNavigate}
            />
            <Iconify
              icon="majesticons:logout-half-circle-line"
              size={28}
              color={theme.colors.onBackground}
              onPress={handleLogout}
            />
          </View>
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={cards}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          numColumns={2}
          ListHeaderComponent={
            <>
              <View style={[styles.maindoctorCard]}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                  <View style={styles.profileImage}>
                    <Iconify icon="fa-solid:user" size={35} color={'black'} />
                  </View>

                  <View style={styles.NameContent}>
                    <CustomText
                      style={[
                        {
                          fontFamily: fonts.Bold,
                          fontSize: 16,
                        },
                        TextColor,
                      ]}>
                      Dr.{userDetail?.name}
                    </CustomText>
                    <View style={styles.specialist}>
                      <Iconify
                        icon="material-symbols-light:special-character"
                        size={22}
                        color={'black'}
                      />
                      <CustomText
                        style={[
                          {
                            fontFamily: fonts.SemiBold,
                            fontSize: 14,
                          },
                          TextColor,
                        ]}>
                        {userDetail?.specialist}
                      </CustomText>
                    </View>
                  </View>
                </View>

                {/* Additional Details */}
                <View style={{marginTop: 10, marginHorizontal: 10}}>
                  {/* Contact Number */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                    <Iconify icon="mdi:phone" size={20} color={'black'} />
                    <CustomText
                      style={[
                        {fontFamily: fonts.Regular, fontSize: 14},
                        TextColor,
                      ]}>
                      {userDetail?.contact}
                    </CustomText>
                  </View>

                  {/* Email */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                    <Iconify icon="mdi:email" size={20} color={'black'} />
                    <CustomText
                      style={[
                        {fontFamily: fonts.Regular, fontSize: 14},
                        TextColor,
                      ]}>
                      {userDetail?.email}
                    </CustomText>
                  </View>

                  {/* Available Time */}
                  {userDetail?.availableTime && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <Iconify
                        icon="mdi:clock-time-four-outline"
                        size={20}
                        color={'black'}
                      />
                      <CustomText
                        style={[
                          {fontFamily: fonts.Regular, fontSize: 14},
                          TextColor,
                        ]}>
                        {userDetail?.availableTime}
                      </CustomText>
                    </View>
                  )}

                  {/* Address */}
                  {userDetail?.address && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <Iconify
                        icon="mdi:map-marker"
                        size={20}
                        color={'black'}
                      />
                      <CustomText
                        numberOfLines={3}
                        style={[
                          {fontFamily: fonts.Regular, fontSize: 14},
                          TextColor,
                        ]}>
                        {userDetail?.address}
                      </CustomText>
                    </View>
                  )}
                </View>
              </View>

              <Appointment data={users} />
            </>
          }
          contentContainerStyle={styles.container}
          columnWrapperStyle={{justifyContent: 'space-between'}}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingTop: 10,
    // backgroundColor:'green'
  },
  mainHeader: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 100,
  },
  profileImage: {
    padding: 10,
    borderRadius: 100,
    height: 55,
    width: 55,
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: 'grey',
  },
  maindoctorCard: {
    padding: 20,
    borderRadius: 17,
    marginTop: 10,
    backgroundColor: '#fff',
    elevation: 10,
    margin: 10,
  },
  specialist: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  container: {
    padding: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardIcon: {
    marginBottom: 12,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSolution: {
    fontSize: 14,
    textAlign: 'center',
  },
});
