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

const {width} = Dimensions.get('window');
const cardWidth = width / 2 - 24; // For a two-column grid with padding

const renderCard = ({item}) => (
  <LinearGradient
    colors={['#cde5f5', '#78B3CE']}
    style={[styles.card, {width: cardWidth}]}>
    <Icon name={item.icon} size={40} color="#000" style={styles.cardIcon} />
    <CustomText style={[styles.cardTitle, {fontFamily: fonts.Black}]}>
      {item.title}
    </CustomText>
    <CustomText style={[styles.cardDescription, {fontFamily: fonts.Regular}]}>
      {item.description}
    </CustomText>
    <CustomText style={[styles.cardSolution, {fontFamily: fonts.SemiBold}]}>
      Solution: {item.solution}
    </CustomText>
  </LinearGradient>
);

export default function Home() {
  const {handleLogout} = useAuthContext();
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
  }, []);

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

  return (
    <>
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.appLight},
        ]}>
        <LinearGradient style={{flex: 1}} colors={['#cde5f5', '#78B3CE']}>
          <View style={styles.mainHeader}>
            <CustomText
              style={{fontFamily: fonts.Bold, fontSize: 22, color: 'black'}}>
              Welcome, Dr. Murshid
            </CustomText>

            <View style={{flexDirection: 'row', gap: 4}}>
              <Iconify
                icon="mynaui:edit"
                size={32}
                color={'black'}
                onPress={handleLogout}
              />
              <Iconify
                icon="majesticons:logout-half-circle-line"
                size={32}
                color={'black'}
                onPress={handleLogout}
              />
            </View>
          </View>

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
                  Doctor Richard
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
                    Psychiatrist
                  </CustomText>
                </View>
              </View>
            </View>

            {/* Additional Details */}
            <View style={{marginTop: 10, marginHorizontal: 10}}>
              {/* Contact Number */}
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Iconify icon="mdi:phone" size={20} color={'black'} />
                <CustomText
                  style={[
                    {fontFamily: fonts.Regular, fontSize: 14},
                    TextColor,
                  ]}>
                  +1 234 567 890
                </CustomText>
              </View>

              {/* Email */}
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Iconify icon="mdi:email" size={20} color={'black'} />
                <CustomText
                  style={[
                    {fontFamily: fonts.Regular, fontSize: 14},
                    TextColor,
                  ]}>
                  dr.richard@example.com
                </CustomText>
              </View>

              {/* Available Time */}
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
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
                  9:00 AM - 5:00 PM
                </CustomText>
              </View>

              {/* Address */}
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Iconify icon="mdi:map-marker" size={20} color={'black'} />
                <CustomText
                  numberOfLines={3}
                  style={[
                    {fontFamily: fonts.Regular, fontSize: 14},
                    TextColor,
                  ]}>
                  123 Medical Avenue,
                </CustomText>
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
            contentContainerStyle={styles.container}
            columnWrapperStyle={{justifyContent: 'space-between'}}
          />
        </LinearGradient>
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
    borderRadius: 30,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardIcon: {
    marginBottom: 12,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#ddds',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSolution: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'center',
  },
});
