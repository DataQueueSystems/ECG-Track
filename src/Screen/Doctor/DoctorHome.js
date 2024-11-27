import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import {useTheme} from 'react-native-paper';
import {Iconify} from 'react-native-iconify';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {useAuthContext} from '../../context/GlobaContext';
import Icon from 'react-native-vector-icons/Ionicons'; // Use Ionicons
import Appointment from '../../Component/Appointment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');
const cardWidth = width / 2 - 24; // For a two-column grid with padding

export default function Home() {
  const {handleLogout, userDetail, setUserDetail} = useAuthContext();

  let theme = useTheme();
  let navigation = useNavigation();
  const isFocused = useIsFocused();
  const backPressedOnce = useRef(false);

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
  }, [isFocused]);

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

  const GetUserDetail = async () => {
    const userToken = await AsyncStorage.getItem('token');
    if (!userToken) return;
    try {
      const unsubscribe = firestore()
        .collection('users') // Assuming agents are in the `users` collection
        .doc(userToken)
        .onSnapshot(async userDoc => {
          if (!userDoc.exists) {
            return;
          }
          const userData = {id: userDoc.id, ...userDoc.data()};
          // Set user details if the account is active
          await setUserDetail(userData);
        });

      // Clean up the listener when the component unmounts or userToken changes
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  useEffect(() => {
    if (userDetail && userDetail?.id) {
      GetUserDetail();
    }
  }, []);

  return (
    <>
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <View style={styles.mainHeader}>
          <View>
            <CustomText
              numberOfLines={1}
              style={{fontFamily: fonts.Bold, fontSize: 22}}>
              Welcome to ,
            </CustomText>
            <CustomText
              numberOfLines={1}
              style={{fontFamily: fonts.Black, fontSize: 26, top: -3, left: 5}}>
              ECG-Track
            </CustomText>
          </View>
          <View style={{flexDirection: 'row', gap: 4}}>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SingleDoctor', {
                    doctorId: userDetail?.id,
                  })
                }>
                {userDetail?.profile_image?.imageUri ? (
                  <Image
                    source={{uri: userDetail?.profile_image?.imageUri}}
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
                        size={30}
                        styl={{alignSelf: 'center'}}
                        color={theme.colors.onBackground}
                      />
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.iconView,
                {backgroundColor: theme.colors.background},
              ]}>
              <Iconify
                icon="majesticons:logout-half-circle-line"
                size={28}
                color={theme.colors.onBackground}
                onPress={handleLogout}
              />
            </View>
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
              <View style={{}}>
                <Appointment />
              </View>
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
  profileContainer: {},
  iconView: {
    borderRadius: 100,
    padding: 8,
  },
  profileImage: {
    padding: 10,
    borderRadius: 100,
    height: 40,
    width: 40,
    borderWidth: 0.4,
    borderColor: 'grey',
  },
});
